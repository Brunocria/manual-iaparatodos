-- =============================================================================
-- Painel de Clientes — estrutura do banco no Supabase
--
-- Como usar: Supabase > SQL Editor > New query > cole este arquivo > Run.
-- O script pode ser executado mais de uma vez sem quebrar nada.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- 1. Administradores
--
-- Lista de quem pode usar o painel. Estar logado não basta: o usuário também
-- precisa estar nesta tabela. Assim, mesmo que alguém consiga criar uma conta
-- no Supabase Auth (por exemplo, se o cadastro público for ligado por engano),
-- essa pessoa não enxerga nem altera nenhum cliente.
-- -----------------------------------------------------------------------------
create table if not exists public.administradores (
  user_id   uuid primary key references auth.users (id) on delete cascade,
  email     text,   -- apenas para exibição ("cadastrado por")
  criado_em timestamptz not null default now()
);

alter table public.administradores enable row level security;

-- (As políticas desta tabela ficam abaixo, depois da função is_admin().)

-- Função usada pelas políticas: "o usuário logado é administrador?".
-- SECURITY DEFINER permite consultar a tabela sem depender das políticas dela.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.administradores a where a.user_id = auth.uid()
  );
$$;

revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- Cada usuário vê a própria linha (o app usa isso para confirmar o acesso após
-- o login) e administradores veem a lista toda (para mostrar quem cadastrou
-- cada cliente). Ninguém insere/edita/exclui pelo app: a lista é mantida
-- apenas pelo SQL Editor do Supabase.
drop policy if exists "leitura de administradores" on public.administradores;
create policy "leitura de administradores"
  on public.administradores for select
  to authenticated
  using (user_id = (select auth.uid()) or (select public.is_admin()));


-- -----------------------------------------------------------------------------
-- 2. Clientes
-- -----------------------------------------------------------------------------
create table if not exists public.clientes (
  id            uuid primary key default gen_random_uuid(),
  nome          text not null check (length(btrim(nome)) > 0),
  idade         integer check (idade between 0 and 120),
  profissao     text,
  nivel_ia      text not null check (nivel_ia in ('Iniciante', 'Intermediário', 'Avançado')),
  telefone      text,
  email         text check (email is null or email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  observacoes   text,
  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  -- Preenchido automaticamente com o id do administrador logado.
  criado_por    uuid default auth.uid() references auth.users (id) on delete set null
);

create index if not exists clientes_criado_em_idx on public.clientes (criado_em desc);
create index if not exists clientes_nivel_ia_idx  on public.clientes (nivel_ia);


-- -----------------------------------------------------------------------------
-- 3. Datas e autoria automáticas
--
-- - Na criação: criado_por = usuário logado (não dá para forjar pelo app).
-- - Na edição: atualizado_em = agora; criado_em e criado_por não mudam.
-- -----------------------------------------------------------------------------
create or replace function public.clientes_before_write()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    new.criado_em     := now();
    new.atualizado_em := now();
    new.criado_por    := auth.uid();
  else
    new.criado_em     := old.criado_em;
    new.criado_por    := old.criado_por;
    new.atualizado_em := now();
  end if;
  return new;
end;
$$;

drop trigger if exists clientes_before_write on public.clientes;
create trigger clientes_before_write
  before insert or update on public.clientes
  for each row execute function public.clientes_before_write();


-- -----------------------------------------------------------------------------
-- 4. Row Level Security (RLS)
--
-- Com RLS ligado, o banco recusa tudo que não for explicitamente permitido.
-- Visitantes anônimos (role "anon") não têm nenhuma política: não leem nada.
-- Usuários autenticados só passam se forem administradores.
-- -----------------------------------------------------------------------------
alter table public.clientes enable row level security;

drop policy if exists "admins leem clientes"    on public.clientes;
drop policy if exists "admins criam clientes"   on public.clientes;
drop policy if exists "admins editam clientes"  on public.clientes;
drop policy if exists "admins excluem clientes" on public.clientes;

create policy "admins leem clientes"
  on public.clientes for select
  to authenticated
  using ((select public.is_admin()));

create policy "admins criam clientes"
  on public.clientes for insert
  to authenticated
  with check ((select public.is_admin()));

create policy "admins editam clientes"
  on public.clientes for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "admins excluem clientes"
  on public.clientes for delete
  to authenticated
  using ((select public.is_admin()));

-- Permissões de tabela: nada para anônimos; CRUD para autenticados (filtrado
-- pelas políticas acima).
revoke all on public.clientes        from anon;
revoke all on public.administradores from anon;
grant select, insert, update, delete on public.clientes to authenticated;
grant select on public.administradores to authenticated;


-- =============================================================================
-- 5. Cadastrar administradores
--
-- Primeiro crie o usuário em Authentication > Users > Add user (com e-mail e
-- senha, marcando "Auto Confirm User"). Depois rode a linha abaixo trocando o
-- e-mail. Repita para cada sócio.
-- =============================================================================
-- insert into public.administradores (user_id, email)
-- select id, email from auth.users where email = 'socio@exemplo.com'
-- on conflict (user_id) do nothing;

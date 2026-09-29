# Painel de Clientes

Painel interno para os sócios cadastrarem e acompanharem clientes. Foi construído
sobre o template [Mosaic Lite](https://github.com/cruip/tailwind-dashboard-template)
(React + Vite + Tailwind CSS) e usa o [Supabase](https://supabase.com) como banco
de dados e login.

- Login com e-mail e senha, só para administradores cadastrados no Supabase.
- Cadastro, listagem, busca por nome, filtro por nível de IA, visualização,
  edição e exclusão com confirmação.
- Modo claro/escuro e layout responsivo (celular, tablet e computador).

> Este painel é um projeto separado dentro do repositório. Todos os comandos
> abaixo são executados **dentro da pasta `painel-clientes/`**.

---

## Sumário

1. [Pré-requisitos](#1-pré-requisitos)
2. [Criar o banco no Supabase](#2-criar-o-banco-no-supabase)
3. [Criar os administradores](#3-criar-os-administradores)
4. [Instalar e configurar o .env](#4-instalar-e-configurar-o-env)
5. [Rodar localmente](#5-rodar-localmente)
6. [Publicar na Vercel](#6-publicar-na-vercel)
7. [Como a segurança funciona](#7-como-a-segurança-funciona)
8. [Estrutura do código](#8-estrutura-do-código)
9. [Dúvidas frequentes](#9-dúvidas-frequentes)

---

## 1. Pré-requisitos

- [Node.js](https://nodejs.org) 18 ou superior (recomendado: versão LTS).
  Confira com `node -v`.
- Uma conta gratuita no [Supabase](https://supabase.com).
- Para publicar: uma conta na [Vercel](https://vercel.com) conectada ao GitHub.

## 2. Criar o banco no Supabase

1. No Supabase, crie um projeto (**New project**). Pode ser um projeto novo,
   só para o painel (recomendado), ou um que já existe.
2. Abra **SQL Editor → New query**.
3. Copie todo o conteúdo de [`supabase/schema.sql`](supabase/schema.sql),
   cole no editor e clique em **Run**.

   O script cria:
   - a tabela `clientes`, com todos os campos, validações e datas automáticas;
   - a tabela `administradores` (lista de quem pode usar o painel);
   - as regras de segurança (Row Level Security).

   O script pode ser executado de novo sem problemas.

4. **Desative o cadastro público** (importante):
   **Authentication → Sign In / Providers** → desligue
   **"Allow new users to sign up"** → **Save**.
   Assim, ninguém consegue criar uma conta por conta própria.

## 3. Criar os administradores

Repita para cada sócio:

1. Em **Authentication → Users**, clique em **Add user → Create new user**.
2. Informe o e-mail e uma senha, marque **Auto Confirm User** e confirme.
3. No **SQL Editor**, rode o comando abaixo trocando o e-mail. Ele autoriza esse
   usuário a usar o painel:

   ```sql
   insert into public.administradores (user_id, email)
   select id, email from auth.users where email = 'socio@exemplo.com'
   on conflict (user_id) do nothing;
   ```

Para **remover o acesso** de alguém:

```sql
delete from public.administradores
where email = 'socio@exemplo.com';
```

Se quiser, apague também o usuário em **Authentication → Users**.

Para **trocar a senha** de um sócio: em **Authentication → Users**, abra o
menu **⋯** do usuário e use a opção de recuperação/redefinição de senha.

## 4. Instalar e configurar o .env

```bash
cd painel-clientes
npm install
cp .env.example .env
```

Abra o arquivo `.env` e preencha:

| Variável                 | Onde encontrar no Supabase                                                                  |
| ------------------------ | ------------------------------------------------------------------------------------------- |
| `VITE_SUPABASE_URL`      | **Project Settings → Data API → Project URL** (ex.: `https://abcd1234.supabase.co`)        |
| `VITE_SUPABASE_ANON_KEY` | **Project Settings → API Keys** → a chave **publishable** (`sb_publishable_...`) ou a **anon public** |

> ⚠️ **Nunca** use a chave `service_role` / `secret`. Ela ignora todas as regras
> de segurança e não pode ir para o navegador.
>
> O arquivo `.env` está no `.gitignore` e **não** é enviado ao GitHub. Só o
> `.env.example` (sem valores) fica no repositório.

A chave publishable/anon é pública por natureza: ela aparece no navegador de
quem acessa o site. Quem protege os dados são as regras de segurança do banco
(seção 7). Sem login de administrador, essa chave não lê nem grava nada.

## 5. Rodar localmente

```bash
npm run dev
```

Acesse o endereço mostrado no terminal (normalmente http://localhost:5173) e
entre com o e-mail e a senha de um administrador.

Outros comandos:

```bash
npm run build     # gera a versão de produção na pasta dist/
npm run preview   # testa localmente a versão gerada pelo build
```

## 6. Publicar na Vercel

1. Envie o código para o GitHub (o painel já está neste repositório).
2. Na Vercel, clique em **Add New… → Project** e importe o repositório.
3. Em **Root Directory**, clique em **Edit** e escolha **`painel-clientes`**.
   Esse passo é essencial, porque o repositório também contém o site.
4. **Framework Preset**: *Vite* (detectado automaticamente). Build command
   `npm run build` e output directory `dist` já são o padrão.
5. Em **Environment Variables**, cadastre as mesmas duas variáveis do `.env`:
   `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.
6. Clique em **Deploy**.

Observações:

- O arquivo `vercel.json` já faz com que endereços como `/clientes/123`
  funcionem ao recarregar a página.
- Se mudar uma variável de ambiente depois, faça um novo deploy
  (**Deployments → ⋯ → Redeploy**), porque as variáveis entram no build.
- (Opcional) No Supabase, em **Authentication → URL Configuration**, coloque o
  endereço da Vercel em **Site URL**. Isso só importa para links enviados por
  e-mail, como o de redefinir senha.

## 7. Como a segurança funciona

- **No banco (a proteção real):** a tabela `clientes` tem Row Level Security.
  - Visitantes sem login não têm nenhum acesso.
  - Usuários logados só leem, criam, editam ou excluem se estiverem na tabela
    `administradores`. Mesmo que alguém consiga criar uma conta, não vê nada.
  - `criado_por`, `criado_em` e `atualizado_em` são preenchidos pelo próprio
    banco e não podem ser forjados pelo navegador.
  - Nome, nível de IA, idade (0 a 120) e formato de e-mail também são
    validados no banco.
- **No painel:** qualquer endereço acessado sem login redireciona para
  `/login`. Se quem entrar não for administrador, a sessão é encerrada na hora
  com o aviso "Este usuário não tem acesso ao painel".
- **Credenciais:** nenhuma senha ou chave fica no código. Tudo vem de
  variáveis de ambiente.

## 8. Estrutura do código

```
painel-clientes/
├── supabase/schema.sql          # Tabelas, gatilhos e políticas de segurança
├── .env.example                 # Modelo das variáveis de ambiente
├── vercel.json                  # Rotas do app na Vercel
└── src/
    ├── App.jsx                  # Rotas (públicas e protegidas)
    ├── main.jsx                 # Ponto de entrada
    ├── lib/
    │   ├── supabase.js          # Conexão com o Supabase (lê o .env)
    │   └── clientes.js          # Consultas, validação e formatação de clientes
    ├── auth/
    │   ├── AuthContext.jsx      # Sessão, login/logout e checagem de administrador
    │   └── RotaProtegida.jsx    # Redireciona para /login quando não autorizado
    ├── pages/
    │   ├── Login.jsx
    │   ├── ClientesLista.jsx    # Tabela, busca, filtro e exclusão
    │   ├── ClienteForm.jsx      # Cadastro e edição
    │   ├── ClienteDetalhes.jsx  # Visualização
    │   ├── NaoEncontrada.jsx
    │   └── ConfiguracaoPendente.jsx  # Aparece se o .env não foi preenchido
    ├── partials/                # Layout do Mosaic: Sidebar, Header, Layout
    ├── components/              # Tema, menu do usuário, modal, alertas etc.
    ├── utils/                   # Tema claro/escuro e transições (do Mosaic)
    └── css/                     # Estilos do Mosaic (Tailwind CSS v4)
```

Para **adicionar um nível de IA** ou mudar um campo, altere em dois lugares: a
restrição `check` em `supabase/schema.sql` (e no banco, com `alter table`) e a
constante `NIVEIS_IA` em `src/lib/clientes.js`.

## 9. Dúvidas frequentes

**Aparece "Configuração pendente".**
O `.env` não existe ou está incompleto. Na Vercel, faltam as variáveis de
ambiente. Depois de corrigir, reinicie o `npm run dev` ou faça um novo deploy.

**"E-mail ou senha incorretos", mas tenho certeza da senha.**
Confira em **Authentication → Users** se o usuário existe e está confirmado.

**"Este usuário não tem acesso ao painel".**
O usuário existe, mas não está na tabela `administradores`. Rode o `insert` da
seção 3.

**"Você não tem permissão para esta ação".**
O script `schema.sql` não foi executado por completo ou o usuário foi removido
de `administradores`.

**A lista mostra no máximo 500 clientes?**
Sim. Aparecem os 500 cadastros mais recentes. A busca por nome e o filtro por
nível de IA consultam o banco inteiro.

---

## Créditos

Layout baseado no [Mosaic Lite](https://github.com/cruip/tailwind-dashboard-template),
da [Cruip](https://cruip.com), distribuído sob a licença
[GPL-3.0](https://www.gnu.org/licenses/gpl-3.0.html).

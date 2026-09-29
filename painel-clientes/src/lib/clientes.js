import { supabase } from './supabase';

// -----------------------------------------------------------------------------
// Constantes e utilitários do módulo Clientes
// -----------------------------------------------------------------------------

// Os mesmos valores aceitos pela restrição "check" da tabela no banco.
export const NIVEIS_IA = ['Iniciante', 'Intermediário', 'Avançado'];

// Mesmo padrão usado no banco (supabase/schema.sql).
const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/i;

export const CLIENTE_VAZIO = {
  nome: '',
  idade: '',
  profissao: '',
  nivel_ia: '',
  telefone: '',
  email: '',
  observacoes: '',
};

const LIMITE_LISTAGEM = 500;

/**
 * Valida os dados do formulário.
 * Retorna um objeto { campo: 'mensagem' } — vazio quando está tudo certo.
 */
export function validarCliente(valores) {
  const erros = {};
  const nome = valores.nome.trim();
  const idade = String(valores.idade).trim();
  const email = valores.email.trim();

  if (!nome) {
    erros.nome = 'Informe o nome do cliente.';
  } else if (nome.length > 150) {
    erros.nome = 'O nome pode ter no máximo 150 caracteres.';
  }

  if (idade) {
    if (!/^\d+$/.test(idade)) {
      erros.idade = 'A idade deve ser um número inteiro (ex.: 35).';
    } else if (Number(idade) > 120) {
      erros.idade = 'Informe uma idade entre 0 e 120 anos.';
    }
  }

  if (!NIVEIS_IA.includes(valores.nivel_ia)) {
    erros.nivel_ia = 'Selecione o nível de IA do cliente.';
  }

  if (email && !EMAIL_REGEX.test(email)) {
    erros.email = 'Informe um e-mail válido (ex.: nome@empresa.com).';
  }

  return erros;
}

/** Converte os valores do formulário no formato da tabela (vazio -> null). */
function paraBanco(valores) {
  const textoOuNulo = (v) => (v.trim() === '' ? null : v.trim());
  const idade = String(valores.idade).trim();
  return {
    nome: valores.nome.trim(),
    idade: idade === '' ? null : Number(idade),
    profissao: textoOuNulo(valores.profissao),
    nivel_ia: valores.nivel_ia,
    telefone: textoOuNulo(valores.telefone),
    email: textoOuNulo(valores.email)?.toLowerCase() ?? null,
    observacoes: textoOuNulo(valores.observacoes),
  };
}

/** Converte um registro do banco para os valores do formulário. */
export function paraFormulario(cliente) {
  return {
    nome: cliente.nome ?? '',
    idade: cliente.idade ?? '',
    profissao: cliente.profissao ?? '',
    nivel_ia: cliente.nivel_ia ?? '',
    telefone: cliente.telefone ?? '',
    email: cliente.email ?? '',
    observacoes: cliente.observacoes ?? '',
  };
}

export function formatarData(iso, comHora = false) {
  if (!iso) return '—';
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    ...(comHora ? { timeStyle: 'short' } : {}),
  }).format(new Date(iso));
}

function naoEncontrado() {
  const erro = new Error('Cliente não encontrado.');
  erro.naoEncontrado = true;
  return erro;
}

// Evita que % e _ digitados na busca virem curingas do ILIKE.
function escaparBusca(texto) {
  return texto.replace(/[\\%_]/g, (c) => `\\${c}`);
}

/** Traduz erros do Supabase/PostgREST para mensagens em português. */
export function mensagemDeErro(error) {
  if (!error) return '';
  if (error.naoEncontrado) {
    return 'Cliente não encontrado. Ele pode ter sido excluído por outro administrador.';
  }
  if (error.code === '42501' || error.code === 'PGRST301') {
    return 'Você não tem permissão para esta ação. Verifique se seu usuário é administrador.';
  }
  if (error.code === '23514') {
    return 'Algum campo tem um valor inválido. Revise o formulário.';
  }
  if (error.message?.includes('Failed to fetch')) {
    return 'Não foi possível conectar ao servidor. Verifique sua internet.';
  }
  return 'Ocorreu um erro inesperado. Tente novamente em instantes.';
}

// -----------------------------------------------------------------------------
// Acesso ao banco (todas as chamadas passam pelo RLS do Supabase)
// -----------------------------------------------------------------------------

/** Lista clientes, com busca por nome e filtro por nível de IA. */
export async function listarClientes({ busca = '', nivel = '' } = {}) {
  let query = supabase
    .from('clientes')
    .select('id, nome, idade, profissao, nivel_ia, criado_em')
    .order('criado_em', { ascending: false })
    .limit(LIMITE_LISTAGEM);

  const termo = busca.trim();
  if (termo) query = query.ilike('nome', `%${escaparBusca(termo)}%`);
  if (nivel) query = query.eq('nivel_ia', nivel);

  const { data, error } = await query;
  if (error) throw error;
  return { clientes: data, limiteAtingido: data.length === LIMITE_LISTAGEM };
}

/** Busca um cliente pelo id, junto com o e-mail de quem o cadastrou. */
export async function buscarCliente(id) {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error?.code === '22P02') return null; // id com formato inválido na URL
  if (error) throw error;
  if (!data) return null;

  let criadoPorEmail = null;
  if (data.criado_por) {
    const { data: admin } = await supabase
      .from('administradores')
      .select('email')
      .eq('user_id', data.criado_por)
      .maybeSingle();
    criadoPorEmail = admin?.email ?? null;
  }
  return { ...data, criado_por_email: criadoPorEmail };
}

/** Cria um cliente. criado_por/criado_em são preenchidos pelo banco. */
export async function criarCliente(valores) {
  const { data, error } = await supabase
    .from('clientes')
    .insert(paraBanco(valores))
    .select('id')
    .single();
  if (error) throw error;
  return data;
}

/** Atualiza um cliente. atualizado_em é preenchido pelo banco. */
export async function atualizarCliente(id, valores) {
  const { data, error } = await supabase
    .from('clientes')
    .update(paraBanco(valores))
    .eq('id', id)
    .select('id');
  if (error) throw error;
  if (!data.length) throw naoEncontrado();
}

export async function excluirCliente(id) {
  const { data, error } = await supabase
    .from('clientes')
    .delete()
    .eq('id', id)
    .select('id');
  if (error) throw error;
  if (!data.length) throw naoEncontrado();
}

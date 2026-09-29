import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  CLIENTE_VAZIO,
  NIVEIS_IA,
  validarCliente,
  paraFormulario,
  buscarCliente,
  criarCliente,
  atualizarCliente,
  mensagemDeErro,
} from '../lib/clientes';
import Alerta from '../components/Alerta';
import Carregando from '../components/Carregando';

/** Campo com rótulo, marcação de obrigatório e mensagem de erro. */
function Campo({ id, rotulo, obrigatorio, erro, dica, children }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1" htmlFor={id}>
        {rotulo} {obrigatorio && <span className="text-red-500" aria-hidden="true">*</span>}
      </label>
      {children}
      {erro ? (
        <p id={`${id}-erro`} className="text-xs mt-1 text-red-500">
          {erro}
        </p>
      ) : (
        dica && <p className="text-xs mt-1 text-gray-500">{dica}</p>
      )}
    </div>
  );
}

/**
 * Formulário único para cadastro (/clientes/novo) e edição (/clientes/:id/editar).
 */
export default function ClienteForm() {
  const { id } = useParams();
  const editando = Boolean(id);
  const navigate = useNavigate();
  const formRef = useRef(null);

  const [valores, setValores] = useState(CLIENTE_VAZIO);
  const [erros, setErros] = useState({});
  const [erroGeral, setErroGeral] = useState('');
  const [carregando, setCarregando] = useState(editando);
  const [naoEncontrado, setNaoEncontrado] = useState(false);
  const [salvando, setSalvando] = useState(false);

  // Na edição, carrega os dados atuais do cliente.
  useEffect(() => {
    if (!editando) return;
    let cancelado = false;
    buscarCliente(id)
      .then((cliente) => {
        if (cancelado) return;
        if (cliente) setValores(paraFormulario(cliente));
        else setNaoEncontrado(true);
      })
      .catch((e) => !cancelado && setErroGeral(mensagemDeErro(e)))
      .finally(() => !cancelado && setCarregando(false));
    return () => {
      cancelado = true;
    };
  }, [editando, id]);

  function alterar(e) {
    const { name, value } = e.target;
    setValores((v) => ({ ...v, [name]: value }));
    // Limpa o erro do campo assim que o usuário corrige.
    if (erros[name]) setErros((atual) => ({ ...atual, [name]: undefined }));
  }

  async function salvar(e) {
    e.preventDefault();
    const novosErros = validarCliente(valores);
    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) {
      setErroGeral('Corrija os campos destacados antes de salvar.');
      // Leva o foco ao primeiro campo com problema.
      const primeiro = Object.keys(novosErros)[0];
      formRef.current?.querySelector(`[name="${primeiro}"]`)?.focus();
      return;
    }

    setErroGeral('');
    setSalvando(true);
    try {
      if (editando) {
        await atualizarCliente(id, valores);
        navigate(`/clientes/${id}`, { state: { sucesso: 'Alterações salvas.' } });
      } else {
        await criarCliente(valores);
        navigate('/clientes', { state: { sucesso: `Cliente "${valores.nome.trim()}" cadastrado.` } });
      }
    } catch (err) {
      setErroGeral(mensagemDeErro(err));
      setSalvando(false);
    }
  }

  const voltarPara = editando ? `/clientes/${id}` : '/clientes';

  if (carregando) return <Carregando />;

  if (naoEncontrado) {
    return (
      <div className="max-w-2xl">
        <Alerta>Cliente não encontrado. Ele pode ter sido excluído.</Alerta>
        <Link to="/clientes" className="inline-block mt-4 text-sm font-medium text-violet-500 hover:text-violet-600">
          ← Voltar para Clientes
        </Link>
      </div>
    );
  }

  // Propriedades comuns de acessibilidade para os campos.
  const aria = (campo) => ({
    'aria-invalid': Boolean(erros[campo]),
    'aria-describedby': erros[campo] ? `${campo}-erro` : undefined,
  });
  const classe = (campo, base = 'form-input') =>
    `${base} w-full ${erros[campo] ? 'border-red-300! dark:border-red-500/60!' : ''}`;

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <Link to={voltarPara} className="text-sm font-medium text-violet-500 hover:text-violet-600 dark:hover:text-violet-400">
          ← Voltar
        </Link>
        <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold mt-2">
          {editando ? 'Editar cliente' : 'Novo cliente'}
        </h1>
      </div>

      <form ref={formRef} onSubmit={salvar} noValidate className="bg-white dark:bg-gray-800 shadow-xs rounded-xl p-5 sm:p-6">
        {erroGeral && (
          <div className="mb-5">
            <Alerta>{erroGeral}</Alerta>
          </div>
        )}

        <div className="grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <Campo id="nome" rotulo="Nome" obrigatorio erro={erros.nome}>
              <input id="nome" name="nome" className={classe('nome')} value={valores.nome} onChange={alterar} maxLength={150} autoFocus {...aria('nome')} />
            </Campo>
          </div>

          <Campo id="idade" rotulo="Idade" erro={erros.idade}>
            <input
              id="idade"
              name="idade"
              className={classe('idade')}
              type="text"
              inputMode="numeric"
              value={valores.idade}
              onChange={alterar}
              maxLength={3}
              {...aria('idade')}
            />
          </Campo>

          <Campo id="nivel_ia" rotulo="Nível de IA" obrigatorio erro={erros.nivel_ia}>
            <select id="nivel_ia" name="nivel_ia" className={classe('nivel_ia', 'form-select')} value={valores.nivel_ia} onChange={alterar} {...aria('nivel_ia')}>
              <option value="">Selecione…</option>
              {NIVEIS_IA.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </Campo>

          <div className="md:col-span-2">
            <Campo id="profissao" rotulo="Profissão" dica="Com o que o cliente trabalha." erro={erros.profissao}>
              <input id="profissao" name="profissao" className={classe('profissao')} value={valores.profissao} onChange={alterar} maxLength={150} />
            </Campo>
          </div>

          <Campo id="telefone" rotulo="Telefone" erro={erros.telefone}>
            <input
              id="telefone"
              name="telefone"
              className={classe('telefone')}
              type="tel"
              autoComplete="off"
              placeholder="(11) 91234-5678"
              value={valores.telefone}
              onChange={alterar}
              maxLength={30}
            />
          </Campo>

          <Campo id="email" rotulo="E-mail" erro={erros.email}>
            <input
              id="email"
              name="email"
              className={classe('email')}
              type="email"
              autoComplete="off"
              placeholder="nome@empresa.com"
              value={valores.email}
              onChange={alterar}
              maxLength={254}
              {...aria('email')}
            />
          </Campo>

          <div className="md:col-span-2">
            <Campo id="observacoes" rotulo="Observações" erro={erros.observacoes}>
              <textarea
                id="observacoes"
                name="observacoes"
                className={classe('observacoes', 'form-textarea')}
                rows={5}
                value={valores.observacoes}
                onChange={alterar}
              />
            </Campo>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-5">
          <span className="text-red-500">*</span> Campos obrigatórios
        </p>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 mt-6 pt-5 border-t border-gray-200 dark:border-gray-700/60">
          <Link
            to={voltarPara}
            className="btn border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-800 dark:text-gray-300"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white disabled:opacity-60"
            disabled={salvando}
          >
            {salvando ? 'Salvando…' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  );
}

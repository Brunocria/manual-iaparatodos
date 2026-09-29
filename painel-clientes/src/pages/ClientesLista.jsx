import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  NIVEIS_IA,
  listarClientes,
  excluirCliente,
  formatarData,
  mensagemDeErro,
} from '../lib/clientes';
import Alerta from '../components/Alerta';
import Carregando from '../components/Carregando';
import NivelBadge from '../components/NivelBadge';
import ModalConfirmacao from '../components/ModalConfirmacao';

// Espera o usuário parar de digitar antes de buscar no banco.
function useDebounce(valor, atraso = 300) {
  const [atual, setAtual] = useState(valor);
  useEffect(() => {
    const t = setTimeout(() => setAtual(valor), atraso);
    return () => clearTimeout(t);
  }, [valor, atraso]);
  return atual;
}

const classeBotaoIcone =
  'w-8 h-8 inline-flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50';

export default function ClientesLista() {
  const location = useLocation();
  const navigate = useNavigate();

  const [busca, setBusca] = useState('');
  const [nivel, setNivel] = useState('');
  const buscaAtrasada = useDebounce(busca);

  const [clientes, setClientes] = useState([]);
  const [limiteAtingido, setLimiteAtingido] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  // Mensagem de sucesso vinda de outra tela (ex.: "Cliente salvo").
  const [sucesso, setSucesso] = useState(location.state?.sucesso ?? '');
  useEffect(() => {
    if (location.state?.sucesso) navigate(location.pathname, { replace: true, state: null });
  }, [location.state, location.pathname, navigate]);

  // Exclusão
  const [paraExcluir, setParaExcluir] = useState(null);
  const [excluindo, setExcluindo] = useState(false);

  // Numera as buscas para ignorar respostas antigas que cheguem atrasadas.
  const ultimaBusca = useRef(0);

  const carregar = useCallback(async () => {
    const numero = ++ultimaBusca.current;
    setCarregando(true);
    setErro('');
    try {
      const resultado = await listarClientes({ busca: buscaAtrasada, nivel });
      if (numero !== ultimaBusca.current) return;
      setClientes(resultado.clientes);
      setLimiteAtingido(resultado.limiteAtingido);
    } catch (e) {
      if (numero === ultimaBusca.current) setErro(mensagemDeErro(e));
    } finally {
      if (numero === ultimaBusca.current) setCarregando(false);
    }
  }, [buscaAtrasada, nivel]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function confirmarExclusao() {
    setExcluindo(true);
    try {
      await excluirCliente(paraExcluir.id);
      setClientes((lista) => lista.filter((c) => c.id !== paraExcluir.id));
      setSucesso(`Cliente "${paraExcluir.nome}" excluído.`);
      setErro('');
    } catch (e) {
      setErro(mensagemDeErro(e));
    } finally {
      setExcluindo(false);
      setParaExcluir(null);
    }
  }

  const fecharModal = useCallback(() => setParaExcluir(null), []);
  const temFiltro = busca.trim() !== '' || nivel !== '';

  return (
    <>
      {/* Título e ação principal */}
      <div className="sm:flex sm:justify-between sm:items-center mb-8">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">Clientes</h1>
        </div>
        <Link
          to="/clientes/novo"
          className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
        >
          <svg className="fill-current shrink-0" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
          </svg>
          <span className="ml-2">Novo cliente</span>
        </Link>
      </div>

      {/* Busca e filtro */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative sm:w-80">
          <label htmlFor="busca" className="sr-only">
            Buscar por nome
          </label>
          <input
            id="busca"
            className="form-input w-full pl-9"
            type="search"
            placeholder="Buscar por nome…"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 shrink-0 fill-current text-gray-400 dark:text-gray-500 pointer-events-none"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            aria-hidden="true"
          >
            <path d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7ZM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5Z" />
            <path d="m13.314 11.9 2.393 2.393a.999.999 0 1 1-1.414 1.414L11.9 13.314a8.019 8.019 0 0 0 1.414-1.414Z" />
          </svg>
        </div>
        <div className="sm:w-56">
          <label htmlFor="nivel" className="sr-only">
            Filtrar por nível de IA
          </label>
          <select id="nivel" className="form-select w-full" value={nivel} onChange={(e) => setNivel(e.target.value)}>
            <option value="">Todos os níveis de IA</option>
            {NIVEIS_IA.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-3 mb-5">
        <Alerta tipo="sucesso" onFechar={() => setSucesso('')}>
          {sucesso}
        </Alerta>
        <Alerta>{erro}</Alerta>
      </div>

      {/* Tabela */}
      <div className="bg-white dark:bg-gray-800 shadow-xs rounded-xl relative">
        <header className="px-5 py-4">
          <h2 className="font-semibold text-gray-800 dark:text-gray-100">
            {temFiltro ? 'Resultados' : 'Todos os clientes'}{' '}
            <span className="text-gray-400 dark:text-gray-500 font-medium">{carregando ? '' : clientes.length}</span>
          </h2>
        </header>

        {carregando ? (
          <Carregando />
        ) : clientes.length === 0 ? (
          <div className="text-center px-5 pb-12 pt-6">
            <p className="mb-4">
              {temFiltro ? 'Nenhum cliente encontrado com esses filtros.' : 'Nenhum cliente cadastrado ainda.'}
            </p>
            {!temFiltro && !erro && (
              <Link to="/clientes/novo" className="text-sm font-medium text-violet-500 hover:text-violet-600 dark:hover:text-violet-400">
                Cadastrar o primeiro cliente →
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-auto w-full dark:text-gray-300">
              <thead className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20 border-t border-b border-gray-100 dark:border-gray-700/60">
                <tr>
                  <th className="px-5 py-3 whitespace-nowrap text-left">Nome</th>
                  <th className="px-3 py-3 whitespace-nowrap text-left">Idade</th>
                  <th className="px-3 py-3 whitespace-nowrap text-left">Profissão</th>
                  <th className="px-3 py-3 whitespace-nowrap text-left">Nível de IA</th>
                  <th className="px-3 py-3 whitespace-nowrap text-left">Cadastro</th>
                  <th className="px-5 py-3 whitespace-nowrap text-right">
                    <span className="sr-only">Ações</span>
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
                {clientes.map((c) => (
                  <tr key={c.id}>
                    <td className="px-5 py-3 min-w-44">
                      <Link
                        to={`/clientes/${c.id}`}
                        className="font-medium text-gray-800 dark:text-gray-100 hover:text-violet-500 dark:hover:text-violet-400"
                      >
                        {c.nome}
                      </Link>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">{c.idade ?? '—'}</td>
                    <td className="px-3 py-3 min-w-40">{c.profissao || '—'}</td>
                    <td className="px-3 py-3">
                      <NivelBadge nivel={c.nivel_ia} />
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">{formatarData(c.criado_em)}</td>
                    <td className="px-5 py-3 whitespace-nowrap text-right">
                      <div className="inline-flex gap-1">
                        <Link to={`/clientes/${c.id}`} className={classeBotaoIcone} title="Visualizar">
                          <span className="sr-only">Visualizar {c.nome}</span>
                          <svg className="fill-current" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                            <path d="M8 3C4.4 3 1.5 5.4.1 7.6a.8.8 0 0 0 0 .8C1.5 10.6 4.4 13 8 13s6.5-2.4 7.9-4.6a.8.8 0 0 0 0-.8C14.5 5.4 11.6 3 8 3Zm0 8a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm0-4.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z" />
                          </svg>
                        </Link>
                        <Link to={`/clientes/${c.id}/editar`} className={classeBotaoIcone} title="Editar">
                          <span className="sr-only">Editar {c.nome}</span>
                          <svg className="fill-current" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                            <path d="M11.7.3c-.4-.4-1-.4-1.4 0l-10 10c-.2.2-.3.4-.3.7v4c0 .6.4 1 1 1h4c.3 0 .5-.1.7-.3l10-10c.4-.4.4-1 0-1.4l-4-4zM4.6 14H2v-2.6l6-6L10.6 8l-6 6zM12 6.6L9.4 4 11 2.4 13.6 5 12 6.6z" />
                          </svg>
                        </Link>
                        <button
                          type="button"
                          className={`${classeBotaoIcone} hover:text-red-500! dark:hover:text-red-400!`}
                          title="Excluir"
                          onClick={() => setParaExcluir(c)}
                        >
                          <span className="sr-only">Excluir {c.nome}</span>
                          <svg className="fill-current" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                            <path d="M5 7h2v6H5V7zm4 0h2v6H9V7zm3-6v2h4v2h-1v10c0 .6-.4 1-1 1H2c-.6 0-1-.4-1-1V5H0V3h4V1c0-.6.4-1 1-1h6c.6 0 1 .4 1 1zM6 2v1h4V2H6zm7 3H3v9h10V5z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {limiteAtingido && (
        <p className="text-xs mt-3 text-gray-500">
          Mostrando os {clientes.length} cadastros mais recentes. Use a busca para encontrar clientes mais antigos.
        </p>
      )}

      <ModalConfirmacao
        aberto={Boolean(paraExcluir)}
        titulo="Excluir cliente?"
        textoConfirmar="Sim, excluir"
        processando={excluindo}
        onConfirmar={confirmarExclusao}
        onCancelar={fecharModal}
      >
        <p>
          O cadastro de <strong className="text-gray-800 dark:text-gray-100">{paraExcluir?.nome}</strong> será
          removido permanentemente. Esta ação não pode ser desfeita.
        </p>
      </ModalConfirmacao>
    </>
  );
}

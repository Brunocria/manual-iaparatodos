import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { buscarCliente, excluirCliente, formatarData, mensagemDeErro } from '../lib/clientes';
import { useAuth } from '../auth/AuthContext';
import Alerta from '../components/Alerta';
import Carregando from '../components/Carregando';
import NivelBadge from '../components/NivelBadge';
import ModalConfirmacao from '../components/ModalConfirmacao';

function Item({ rotulo, children, largo = false }) {
  return (
    <div className={largo ? 'sm:col-span-2' : ''}>
      <dt className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 mb-1">{rotulo}</dt>
      <dd className="text-sm text-gray-800 dark:text-gray-100 break-words">{children}</dd>
    </div>
  );
}

/** Tela de visualização de um cliente, com atalhos para editar e excluir. */
export default function ClienteDetalhes() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { usuario } = useAuth();

  const [cliente, setCliente] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(location.state?.sucesso ?? '');
  const [confirmando, setConfirmando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);

  // Limpa a mensagem de sucesso do histórico (não reaparece ao recarregar).
  useEffect(() => {
    if (location.state?.sucesso) navigate(location.pathname, { replace: true, state: null });
  }, [location.state, location.pathname, navigate]);

  useEffect(() => {
    let cancelado = false;
    setCarregando(true);
    buscarCliente(id)
      .then((c) => !cancelado && setCliente(c))
      .catch((e) => !cancelado && setErro(mensagemDeErro(e)))
      .finally(() => !cancelado && setCarregando(false));
    return () => {
      cancelado = true;
    };
  }, [id]);

  async function excluir() {
    setExcluindo(true);
    try {
      await excluirCliente(id);
      navigate('/clientes', { state: { sucesso: `Cliente "${cliente.nome}" excluído.` } });
    } catch (e) {
      setErro(mensagemDeErro(e));
      setExcluindo(false);
      setConfirmando(false);
    }
  }

  const fecharModal = useCallback(() => setConfirmando(false), []);

  if (carregando) return <Carregando />;

  if (!cliente) {
    return (
      <div className="max-w-2xl">
        <Alerta>{erro || 'Cliente não encontrado. Ele pode ter sido excluído.'}</Alerta>
        <Link to="/clientes" className="inline-block mt-4 text-sm font-medium text-violet-500 hover:text-violet-600">
          ← Voltar para Clientes
        </Link>
      </div>
    );
  }

  const cadastradoPor =
    cliente.criado_por && cliente.criado_por === usuario?.id
      ? 'Você'
      : cliente.criado_por_email || (cliente.criado_por ? 'Outro administrador' : '—');

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <Link to="/clientes" className="text-sm font-medium text-violet-500 hover:text-violet-600 dark:hover:text-violet-400">
          ← Voltar para Clientes
        </Link>
        <div className="sm:flex sm:justify-between sm:items-end gap-4 mt-2">
          <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold break-words mb-4 sm:mb-0">
            {cliente.nome}
          </h1>
          <div className="flex gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setConfirmando(true)}
              className="btn border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-red-500"
            >
              Excluir
            </button>
            <Link
              to={`/clientes/${id}/editar`}
              className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
            >
              Editar
            </Link>
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-5">
        <Alerta tipo="sucesso" onFechar={() => setSucesso('')}>
          {sucesso}
        </Alerta>
        <Alerta>{erro}</Alerta>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-xs rounded-xl p-5 sm:p-6">
        <dl className="grid gap-5 sm:grid-cols-2">
          <Item rotulo="Nível de IA">
            <NivelBadge nivel={cliente.nivel_ia} />
          </Item>
          <Item rotulo="Idade">{cliente.idade != null ? `${cliente.idade} anos` : '—'}</Item>
          <Item rotulo="Profissão" largo>
            {cliente.profissao || '—'}
          </Item>
          <Item rotulo="Telefone">
            {cliente.telefone ? (
              <a className="hover:text-violet-500" href={`tel:${cliente.telefone.replace(/[^\d+]/g, '')}`}>
                {cliente.telefone}
              </a>
            ) : (
              '—'
            )}
          </Item>
          <Item rotulo="E-mail">
            {cliente.email ? (
              <a className="hover:text-violet-500" href={`mailto:${cliente.email}`}>
                {cliente.email}
              </a>
            ) : (
              '—'
            )}
          </Item>
          <Item rotulo="Observações" largo>
            <span className="whitespace-pre-line">{cliente.observacoes || '—'}</span>
          </Item>
        </dl>

        <dl className="grid gap-5 sm:grid-cols-3 mt-6 pt-5 border-t border-gray-200 dark:border-gray-700/60">
          <Item rotulo="Cadastrado em">{formatarData(cliente.criado_em, true)}</Item>
          <Item rotulo="Atualizado em">{formatarData(cliente.atualizado_em, true)}</Item>
          <Item rotulo="Cadastrado por">{cadastradoPor}</Item>
        </dl>
      </div>

      <ModalConfirmacao
        aberto={confirmando}
        titulo="Excluir cliente?"
        textoConfirmar="Sim, excluir"
        processando={excluindo}
        onConfirmar={excluir}
        onCancelar={fecharModal}
      >
        <p>
          O cadastro de <strong className="text-gray-800 dark:text-gray-100">{cliente.nome}</strong> será removido
          permanentemente. Esta ação não pode ser desfeita.
        </p>
      </ModalConfirmacao>
    </div>
  );
}

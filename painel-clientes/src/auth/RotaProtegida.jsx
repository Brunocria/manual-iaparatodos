import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Carregando from '../components/Carregando';

/**
 * Envolve todas as rotas internas. Sem login (ou sem permissão de
 * administrador), qualquer endereço redireciona para /login — guardando a
 * página pedida para voltar a ela depois de entrar.
 */
export default function RotaProtegida() {
  const { status } = useAuth();
  const location = useLocation();

  if (status === 'carregando') return <Carregando telaCheia />;
  if (status !== 'autorizado') {
    return <Navigate to="/login" replace state={{ de: location.pathname + location.search }} />;
  }
  return <Outlet />;
}

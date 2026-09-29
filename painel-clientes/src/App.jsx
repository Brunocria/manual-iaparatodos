import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import './css/style.css';

import { supabaseConfigurado } from './lib/supabase';
import { AuthProvider } from './auth/AuthContext';
import RotaProtegida from './auth/RotaProtegida';
import Layout from './partials/Layout';
import Login from './pages/Login';
import ClientesLista from './pages/ClientesLista';
import ClienteForm from './pages/ClienteForm';
import ClienteDetalhes from './pages/ClienteDetalhes';
import NaoEncontrada from './pages/NaoEncontrada';
import ConfiguracaoPendente from './pages/ConfiguracaoPendente';

function App() {
  const location = useLocation();

  // Volta ao topo da página a cada troca de rota.
  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto';
    window.scroll({ top: 0 });
    document.querySelector('html').style.scrollBehavior = '';
  }, [location.pathname]);

  // Sem .env configurado não há como falar com o Supabase.
  if (!supabaseConfigurado) return <ConfiguracaoPendente />;

  return (
    <AuthProvider>
      <Routes>
        {/* Única rota pública */}
        <Route path="/login" element={<Login />} />

        {/* Tudo abaixo exige login de administrador */}
        <Route element={<RotaProtegida />}>
          <Route element={<Layout />}>
            <Route index element={<Navigate to="/clientes" replace />} />
            <Route path="clientes" element={<ClientesLista />} />
            <Route path="clientes/novo" element={<ClienteForm />} />
            <Route path="clientes/:id" element={<ClienteDetalhes />} />
            <Route path="clientes/:id/editar" element={<ClienteForm />} />
            <Route path="*" element={<NaoEncontrada />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;

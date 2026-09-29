import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import Alerta from '../components/Alerta';
import Carregando from '../components/Carregando';
import ThemeToggle from '../components/ThemeToggle';

/**
 * Tela de login (e-mail e senha). Não existe opção de cadastro: os
 * administradores são criados diretamente no painel do Supabase.
 */
export default function Login() {
  const { status, entrar, aviso, limparAviso } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  // Já logado? Vai direto para a página pedida (ou para Clientes).
  if (status === 'autorizado') {
    return <Navigate to={location.state?.de || '/clientes'} replace />;
  }

  async function aoEnviar(e) {
    e.preventDefault();
    limparAviso();
    if (!email.trim() || !senha) {
      setErro('Preencha o e-mail e a senha.');
      return;
    }
    setErro('');
    setEnviando(true);
    const mensagem = await entrar(email.trim(), senha);
    setEnviando(false);
    if (mensagem) setErro(mensagem);
  }

  // Após o login, aguarda a confirmação de que o usuário é administrador.
  const verificando = status === 'carregando';

  return (
    <main className="min-h-[100dvh] flex flex-col items-center justify-center px-4 py-8 bg-gray-100 dark:bg-gray-900">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <svg className="fill-violet-500" xmlns="http://www.w3.org/2000/svg" width={40} height={40} viewBox="0 0 32 32" aria-hidden="true">
            <path d="M31.956 14.8C31.372 6.92 25.08.628 17.2.044V5.76a9.04 9.04 0 0 0 9.04 9.04h5.716ZM14.8 26.24v5.716C6.92 31.372.63 25.08.044 17.2H5.76a9.04 9.04 0 0 1 9.04 9.04Zm11.44-9.04h5.716c-.584 7.88-6.876 14.172-14.756 14.756V26.24a9.04 9.04 0 0 1 9.04-9.04ZM.044 14.8C.63 6.92 6.92.628 14.8.044V5.76a9.04 9.04 0 0 1-9.04 9.04H.044Z" />
          </svg>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-xs rounded-xl p-6">
          <h1 className="text-2xl text-gray-800 dark:text-gray-100 font-bold mb-1">Painel de Clientes</h1>
          <p className="text-sm mb-6">Acesso restrito aos administradores.</p>

          {verificando && !enviando ? (
            <Carregando texto="Verificando acesso…" />
          ) : (
            <form onSubmit={aoEnviar} noValidate className="space-y-4">
              <Alerta>{erro || aviso}</Alerta>

              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="email">
                  E-mail
                </label>
                <input
                  id="email"
                  className="form-input w-full"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="senha">
                  Senha
                </label>
                <input
                  id="senha"
                  className="form-input w-full"
                  type="password"
                  autoComplete="current-password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn w-full bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white disabled:opacity-60"
                disabled={enviando}
              >
                {enviando ? 'Entrando…' : 'Entrar'}
              </button>
            </form>
          )}
        </div>

        <p className="text-xs text-center mt-4 text-gray-500">
          Esqueceu a senha? Peça a um sócio para redefini-la no Supabase.
        </p>
      </div>
    </main>
  );
}

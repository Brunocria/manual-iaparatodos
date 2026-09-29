import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Controla a sessão do administrador.
 *
 * status:
 *  - 'carregando'  → ainda verificando sessão / permissão
 *  - 'deslogado'   → sem sessão (rotas protegidas redirecionam para /login)
 *  - 'autorizado'  → logado E presente na tabela "administradores"
 *
 * Quem faz login mas não é administrador é deslogado na hora, com um aviso.
 */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [status, setStatus] = useState('carregando');
  const [aviso, setAviso] = useState('');

  // 1) Acompanha a sessão (login, logout, renovação de token, outras abas).
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (!data.session) setStatus('deslogado');
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_evento, novaSessao) => {
      setSession(novaSessao);
      if (!novaSessao) setStatus('deslogado');
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  // 2) Sempre que o usuário muda, confirma se ele é administrador.
  const userId = session?.user?.id;
  useEffect(() => {
    if (!userId) return;
    let cancelado = false;
    setStatus('carregando');

    supabase
      .from('administradores')
      .select('user_id')
      .eq('user_id', userId)
      .maybeSingle()
      .then(async ({ data, error }) => {
        if (cancelado) return;
        if (data && !error) {
          setStatus('autorizado');
          return;
        }
        setAviso(
          error
            ? 'Não foi possível verificar suas permissões. Tente novamente.'
            : 'Este usuário não tem acesso ao painel. Fale com um administrador.'
        );
        await supabase.auth.signOut();
      });

    return () => {
      cancelado = true;
    };
  }, [userId]);

  const entrar = useCallback(async (email, senha) => {
    setAviso('');
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
    if (!error) return null;
    if (error.message?.includes('Invalid login credentials')) return 'E-mail ou senha incorretos.';
    if (error.message?.includes('Email not confirmed')) return 'Este e-mail ainda não foi confirmado.';
    if (error.status === 429) return 'Muitas tentativas. Aguarde alguns minutos e tente novamente.';
    return 'Não foi possível entrar. Verifique sua conexão e tente novamente.';
  }, []);

  const sair = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const valor = {
    status,
    usuario: status === 'autorizado' ? session?.user ?? null : null,
    aviso,
    limparAviso: () => setAviso(''),
    entrar,
    sair,
  };

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

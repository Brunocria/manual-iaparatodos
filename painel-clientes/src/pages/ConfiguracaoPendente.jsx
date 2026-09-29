/** Mostrada quando o arquivo .env não foi preenchido. */
export default function ConfiguracaoPendente() {
  return (
    <main className="min-h-[100dvh] flex items-center justify-center px-4">
      <div className="max-w-lg bg-white dark:bg-gray-800 shadow-xs rounded-xl p-6">
        <h1 className="text-xl text-gray-800 dark:text-gray-100 font-bold mb-2">Configuração pendente</h1>
        <p className="text-sm mb-3">
          As variáveis <code>VITE_SUPABASE_URL</code> e <code>VITE_SUPABASE_ANON_KEY</code> não foram definidas.
        </p>
        <p className="text-sm">
          Copie o arquivo <code>.env.example</code> para <code>.env</code>, preencha com os dados do seu projeto
          Supabase e reinicie o servidor (<code>npm run dev</code>). Na Vercel, cadastre as mesmas variáveis em
          Settings → Environment Variables e faça um novo deploy.
        </p>
      </div>
    </main>
  );
}

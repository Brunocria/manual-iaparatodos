// Caixa de mensagem simples no estilo Mosaic (erro ou sucesso).
const estilos = {
  erro: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20',
  sucesso: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
};

export default function Alerta({ tipo = 'erro', children, onFechar }) {
  if (!children) return null;
  return (
    <div
      className={`flex items-start justify-between gap-3 text-sm px-3 py-2 rounded-lg border ${estilos[tipo]}`}
      role={tipo === 'erro' ? 'alert' : 'status'}
    >
      <span>{children}</span>
      {onFechar && (
        <button type="button" onClick={onFechar} className="shrink-0 opacity-70 hover:opacity-100" aria-label="Fechar aviso">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M12.72 3.293a1 1 0 00-1.415 0L8.012 6.586 4.72 3.293a1 1 0 00-1.414 1.414L6.598 8l-3.293 3.293a1 1 0 101.414 1.414l3.293-3.293 3.293 3.293a1 1 0 001.414-1.414L9.426 8l3.293-3.293a1 1 0 000-1.414z" />
          </svg>
        </button>
      )}
    </div>
  );
}

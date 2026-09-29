import { useEffect, useRef } from 'react';

/**
 * Janela de confirmação (usada antes de excluir um cliente).
 * Fecha com ESC ou clicando fora; o foco começa em "Cancelar" por segurança.
 */
export default function ModalConfirmacao({
  aberto,
  titulo,
  children,
  textoConfirmar = 'Confirmar',
  processando = false,
  onConfirmar,
  onCancelar,
}) {
  const cancelarRef = useRef(null);

  useEffect(() => {
    if (!aberto) return;
    cancelarRef.current?.focus();
    const aoPressionar = (e) => {
      if (e.key === 'Escape' && !processando) onCancelar();
    };
    document.addEventListener('keydown', aoPressionar);
    return () => document.removeEventListener('keydown', aoPressionar);
  }, [aberto, processando, onCancelar]);

  if (!aberto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
      {/* Fundo escurecido */}
      <div
        className="absolute inset-0 bg-gray-900/40"
        aria-hidden="true"
        onClick={() => !processando && onCancelar()}
      />

      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="modal-titulo"
        className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-md w-full p-5"
      >
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-red-500/10">
            <svg className="shrink-0 fill-current text-red-500" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 12c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm1-3H7V4h2v5z" />
            </svg>
          </div>
          <div className="grow">
            <h2 id="modal-titulo" className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
              {titulo}
            </h2>
            <div className="text-sm mb-6">{children}</div>
            <div className="flex flex-wrap justify-end gap-2">
              <button
                ref={cancelarRef}
                type="button"
                className="btn-sm border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-800 dark:text-gray-300"
                onClick={onCancelar}
                disabled={processando}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn-sm bg-red-500 hover:bg-red-600 text-white disabled:opacity-60"
                onClick={onConfirmar}
                disabled={processando}
              >
                {processando ? 'Excluindo…' : textoConfirmar}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

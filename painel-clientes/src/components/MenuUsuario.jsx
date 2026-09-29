import { useState, useRef, useEffect } from 'react';
import Transition from '../utils/Transition';
import { useAuth } from '../auth/AuthContext';

/** Menu do canto superior direito: mostra o e-mail logado e o botão "Sair". */
export default function MenuUsuario({ align }) {
  const { usuario, sair } = useAuth();
  const [aberto, setAberto] = useState(false);
  const trigger = useRef(null);
  const dropdown = useRef(null);

  const email = usuario?.email ?? '';
  const inicial = email.charAt(0).toUpperCase() || '?';

  // Fecha ao clicar fora
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current) return;
      if (!aberto || dropdown.current.contains(target) || trigger.current.contains(target)) return;
      setAberto(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // Fecha com ESC
  useEffect(() => {
    const keyHandler = ({ key }) => {
      if (aberto && key === 'Escape') setAberto(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  return (
    <div className="relative inline-flex">
      <button
        ref={trigger}
        className="inline-flex justify-center items-center group"
        aria-haspopup="true"
        onClick={() => setAberto(!aberto)}
        aria-expanded={aberto}
      >
        <span className="w-8 h-8 rounded-full bg-violet-500 text-white text-sm font-semibold flex items-center justify-center" aria-hidden="true">
          {inicial}
        </span>
        <div className="flex items-center truncate">
          <span className="truncate max-w-40 ml-2 text-sm font-medium text-gray-600 dark:text-gray-100 group-hover:text-gray-800 dark:group-hover:text-white max-sm:sr-only">
            {email}
          </span>
          <svg className="w-3 h-3 shrink-0 ml-1 fill-current text-gray-400 dark:text-gray-500" viewBox="0 0 12 12" aria-hidden="true">
            <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
          </svg>
        </div>
      </button>

      <Transition
        className={`origin-top-right z-10 absolute top-full min-w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 py-1.5 rounded-lg shadow-lg overflow-hidden mt-1 ${align === 'right' ? 'right-0' : 'left-0'}`}
        show={aberto}
        enter="transition ease-out duration-200 transform"
        enterStart="opacity-0 -translate-y-2"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-out duration-200"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
      >
        <div ref={dropdown} onFocus={() => setAberto(true)} onBlur={() => setAberto(false)}>
          <div className="pt-0.5 pb-2 px-3 mb-1 border-b border-gray-200 dark:border-gray-700/60">
            <div className="font-medium text-gray-800 dark:text-gray-100 truncate">{email}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 italic">Administrador</div>
          </div>
          <ul>
            <li>
              <button
                type="button"
                className="w-full text-left font-medium text-sm text-violet-500 hover:text-violet-600 dark:hover:text-violet-400 flex items-center py-1 px-3"
                onClick={() => {
                  setAberto(false);
                  sair();
                }}
              >
                Sair
              </button>
            </li>
          </ul>
        </div>
      </Transition>
    </div>
  );
}

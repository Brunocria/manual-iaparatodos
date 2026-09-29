import { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

/**
 * Sidebar do template Mosaic, reduzida a dois itens: "Clientes" e "Sair".
 * Mantém o comportamento original: gaveta no celular, recolhível no desktop
 * (preferência salva no navegador) e sempre aberta em telas muito largas.
 */
function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const { sair } = useAuth();
  const trigger = useRef(null);
  const sidebar = useRef(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(storedSidebarExpanded === 'true');

  // Fecha a gaveta (celular) ao clicar fora
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (!sidebarOpen || sidebar.current.contains(target) || trigger.current.contains(target)) return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // Fecha a gaveta com ESC
  useEffect(() => {
    const keyHandler = ({ key }) => {
      if (sidebarOpen && key === 'Escape') setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  // Guarda a preferência "expandida/recolhida" no navegador
  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded);
    document.querySelector('body').classList.toggle('sidebar-expanded', sidebarExpanded);
  }, [sidebarExpanded]);

  const classeItem = 'block w-full pl-4 pr-3 py-2 rounded-lg mb-0.5 last:mb-0 transition';
  const classeTexto = 'text-sm font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200';

  return (
    <div className="min-w-fit">
      {/* Fundo escurecido (apenas celular) */}
      <div
        className={`fixed inset-0 bg-gray-900/30 z-40 lg:hidden lg:z-auto transition-opacity duration-200 ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      ></div>

      <div
        id="sidebar"
        ref={sidebar}
        className={`flex lg:flex! flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-[100dvh] overflow-y-scroll lg:overflow-y-auto no-scrollbar w-64 lg:w-20 lg:sidebar-expanded:!w-64 2xl:w-64! shrink-0 bg-white dark:bg-gray-800 p-4 transition-all duration-200 ease-in-out rounded-r-2xl shadow-xs ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-64'
        }`}
      >
        {/* Cabeçalho da sidebar */}
        <div className="flex justify-between mb-10 pr-3 sm:px-2">
          {/* Fechar (celular) */}
          <button
            ref={trigger}
            className="lg:hidden text-gray-500 hover:text-gray-400"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
          >
            <span className="sr-only">Fechar menu</span>
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z" />
            </svg>
          </button>
          {/* Logo */}
          <NavLink end to="/clientes" className="block" aria-label="Início">
            <svg className="fill-violet-500" xmlns="http://www.w3.org/2000/svg" width={32} height={32} aria-hidden="true">
              <path d="M31.956 14.8C31.372 6.92 25.08.628 17.2.044V5.76a9.04 9.04 0 0 0 9.04 9.04h5.716ZM14.8 26.24v5.716C6.92 31.372.63 25.08.044 17.2H5.76a9.04 9.04 0 0 1 9.04 9.04Zm11.44-9.04h5.716c-.584 7.88-6.876 14.172-14.756 14.756V26.24a9.04 9.04 0 0 1 9.04-9.04ZM.044 14.8C.63 6.92 6.92.628 14.8.044V5.76a9.04 9.04 0 0 1-9.04 9.04H.044Z" />
            </svg>
          </NavLink>
        </div>

        {/* Links */}
        <nav aria-label="Menu principal">
          <h3 className="text-xs uppercase text-gray-400 dark:text-gray-500 font-semibold pl-3">
            <span className="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6" aria-hidden="true">
              •••
            </span>
            <span className="lg:hidden lg:sidebar-expanded:block 2xl:block">Menu</span>
          </h3>
          <ul className="mt-3">
            {/* Clientes */}
            <li>
              <NavLink
                to="/clientes"
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `${classeItem} ${
                    isActive
                      ? 'bg-linear-to-r from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04] text-gray-800 dark:text-gray-100'
                      : 'text-gray-800 dark:text-gray-100 hover:text-gray-900 dark:hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <div className="flex items-center">
                    <svg
                      className={`shrink-0 fill-current ${isActive ? 'text-violet-500' : 'text-gray-400 dark:text-gray-500'}`}
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      aria-hidden="true"
                    >
                      <path d="M8 8a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0-2a2 2 0 1 1 0-4 2 2 0 0 1 0 4Zm-5.143 7.91C3.14 12.845 5.346 12 8 12s4.86.845 5.143 1.91a1 1 0 0 0 1.933-.52C14.494 11.21 11.48 10 8 10s-6.494 1.21-7.076 3.39a1 1 0 0 0 1.933.52Z" />
                    </svg>
                    <span className={classeTexto}>Clientes</span>
                  </div>
                )}
              </NavLink>
            </li>

            {/* Sair */}
            <li>
              <button
                type="button"
                onClick={sair}
                className={`${classeItem} text-left text-gray-800 dark:text-gray-100 hover:text-gray-900 dark:hover:text-white`}
              >
                <div className="flex items-center">
                  <svg
                    className="shrink-0 fill-current text-gray-400 dark:text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    aria-hidden="true"
                  >
                    <path d="M6 1a1 1 0 0 1 0 2H3v10h3a1 1 0 1 1 0 2H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h4Zm4.293 2.293a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414-1.414L12.586 9H6a1 1 0 1 1 0-2h6.586l-2.293-2.293a1 1 0 0 1 0-1.414Z" />
                  </svg>
                  <span className={classeTexto}>Sair</span>
                </div>
              </button>
            </li>
          </ul>
        </nav>

        {/* Expandir / recolher (desktop) */}
        <div className="pt-3 hidden lg:inline-flex 2xl:hidden justify-end mt-auto">
          <div className="w-12 pl-4 pr-3 py-2">
            <button
              className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
              onClick={() => setSidebarExpanded(!sidebarExpanded)}
            >
              <span className="sr-only">Expandir / recolher menu</span>
              <svg
                className="shrink-0 fill-current text-gray-400 dark:text-gray-500 sidebar-expanded:rotate-180"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                aria-hidden="true"
              >
                <path d="M15 16a1 1 0 0 1-1-1V1a1 1 0 1 1 2 0v14a1 1 0 0 1-1 1ZM8.586 7H1a1 1 0 1 0 0 2h7.586l-2.793 2.793a1 1 0 1 0 1.414 1.414l4.5-4.5A.997.997 0 0 0 12 8.01M11.924 7.617a.997.997 0 0 0-.217-.324l-4.5-4.5a1 1 0 0 0-1.414 1.414L8.586 7M12 7.99a.996.996 0 0 0-.076-.373Z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;

export default function Carregando({ telaCheia = false, texto = 'Carregando…' }) {
  return (
    <div
      className={`flex items-center justify-center gap-3 text-sm text-gray-500 dark:text-gray-400 ${telaCheia ? 'h-[100dvh]' : 'py-16'}`}
      role="status"
    >
      <svg className="animate-spin w-5 h-5 fill-current shrink-0" viewBox="0 0 16 16" aria-hidden="true">
        <path d="M8 16a7.928 7.928 0 01-3.428-.77l.857-1.807A6.006 6.006 0 0014 8c0-3.309-2.691-6-6-6a6.006 6.006 0 00-5.422 8.572l-1.806.859A7.929 7.929 0 010 8c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
      </svg>
      <span>{texto}</span>
    </div>
  );
}

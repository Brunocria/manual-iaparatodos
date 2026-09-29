// Etiqueta colorida para o nível de IA do cliente.
const cores = {
  Iniciante: 'bg-sky-500/15 text-sky-700 dark:text-sky-400',
  'Intermediário': 'bg-yellow-500/20 text-yellow-800 dark:text-yellow-400',
  'Avançado': 'bg-green-500/15 text-green-700 dark:text-green-400',
};

export default function NivelBadge({ nivel }) {
  if (!nivel) return <span className="text-gray-400">—</span>;
  return (
    <span className={`inline-flex text-xs font-medium rounded-full px-2.5 py-0.5 whitespace-nowrap ${cores[nivel] ?? 'bg-gray-500/15'}`}>
      {nivel}
    </span>
  );
}

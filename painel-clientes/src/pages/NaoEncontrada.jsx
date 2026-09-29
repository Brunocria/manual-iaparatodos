import { Link } from 'react-router-dom';

export default function NaoEncontrada() {
  return (
    <div className="max-w-2xl mx-auto text-center py-16">
      <h1 className="text-3xl text-gray-800 dark:text-gray-100 font-bold mb-2">Página não encontrada</h1>
      <p className="mb-6">O endereço acessado não existe neste painel.</p>
      <Link to="/clientes" className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white">
        Ir para Clientes
      </Link>
    </div>
  );
}

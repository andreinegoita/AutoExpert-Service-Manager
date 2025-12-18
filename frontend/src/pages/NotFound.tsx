import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-screen bg-dark flex flex-col items-center justify-center text-white p-4 text-center">
      <h1 className="text-9xl font-bold text-blue-600 mb-4">404</h1>
      <h2 className="text-3xl font-bold mb-4">Pagina nu a fost găsită</h2>
      <p className="text-gray-400 mb-8 max-w-md">
        Se pare că ai rătăcit drumul. Această pagină nu există în garajul nostru digital.
      </p>
      <Link 
        to="/" 
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition"
      >
        <Home size={20} /> Înapoi Acasă
      </Link>
    </div>
  );
};
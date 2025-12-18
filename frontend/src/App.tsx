import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { BlurText } from './components/animations/BlurText';
import { Car, ShieldCheck, Wrench } from 'lucide-react'; 
import { AuthProvider } from './context/AuthContext';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1920&auto=format&fit=crop" 
          alt="Luxury Car" 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/80 to-transparent"></div>
      </div>

      <nav className="relative z-10 flex justify-between items-center p-6 container mx-auto">
        <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          AutoExpert
        </div>
        <div className="space-x-4">
          <Link to="/login" className="px-6 py-2 rounded-full border border-gray-600 hover:bg-white/10 transition">
            Autentificare
          </Link>
          <Link to="/register" className="px-6 py-2 rounded-full bg-blue-600 hover:bg-blue-700 transition font-medium">
            Înregistrare
          </Link>
        </div>
      </nav>

      <main className="relative z-10 flex-1 flex flex-col justify-center items-center text-center px-4 mt-10">
        <div className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
          <BlurText text="Management Auto Profesional" delay={0.2} />
        </div>
        
        <p className="text-gray-400 text-xl max-w-2xl mb-10 animate-pulse">
          Platforma completă pentru gestionarea flotei tale. 
          Service, istoric și programări la un click distanță.
        </p>

        <div className="flex gap-4">
          <button className="px-8 py-4 bg-white text-dark rounded-xl font-bold hover:scale-105 transition transform">
            Începe Acum
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 w-full max-w-5xl">
          <FeatureCard 
            icon={<Car className="w-8 h-8 text-blue-400" />}
            title="Garaj Digital"
            desc="Ține evidența tuturor mașinilor tale într-un singur loc."
          />
          <FeatureCard 
            icon={<Wrench className="w-8 h-8 text-purple-400" />}
            title="Service Rapid"
            desc="Programează-te la service direct din aplicație."
          />
          <FeatureCard 
            icon={<ShieldCheck className="w-8 h-8 text-green-400" />}
            title="Istoric Sigur"
            desc="Toate reparațiile și costurile sunt salvate criptat."
          />
        </div>
      </main>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: any) => (
  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition cursor-pointer">
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-400 text-sm">{desc}</p>
  </div>
);

function App() {
  return (
    <AuthProvider> 
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
export default App;
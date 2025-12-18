import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { CarCarousel } from '../components/CarCarousel';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Car, Wrench, DollarSign, Plus, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const Dashboard = () => {
  const { token, user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const statsRes = await axios.get('http://localhost:5000/api/dashboard-stats', config);
      setStats(statsRes.data);

      const carsRes = await axios.get('http://localhost:5000/api/vehicles', config);
      setVehicles(carsRes.data);
      
      setLoading(false);
    } catch (err) {
      console.error("Eroare la încărcare date", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const chartData = [
    { name: 'Ian', cost: 400 },
    { name: 'Feb', cost: 300 },
    { name: 'Mar', cost: stats?.totalSpent || 550 }, // Integrăm date reale aici
    { name: 'Apr', cost: 200 },
  ];

  if (loading) return <div className="text-white text-center mt-20 text-2xl animate-pulse">Se încarcă datele...</div>;

  return (
    <div className="min-h-screen bg-dark text-white p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Salut, {user?.name}!
          </h1>
          <p className="text-gray-400">Iată situația flotei tale.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl flex items-center gap-2 transition">
          <Plus size={20} /> Adaugă Mașină
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        <div className="lg:col-span-2 space-y-8">
          <CarCarousel />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard 
              icon={<Car className="text-blue-400" />} 
              title="Total Mașini" 
              value={stats?.totalCars || 0} 
            />
            <StatCard 
              icon={<DollarSign className="text-green-400" />} 
              title="Cheltuieli" 
              value={`${stats?.totalSpent || 0} RON`} 
            />
            <StatCard 
              icon={<Wrench className="text-purple-400" />} 
              title="Următoarea Revizie" 
              value={stats?.nextAppointment ? new Date(stats.nextAppointment.appointment_date).toLocaleDateString() : 'Niciuna'} 
            />
          </div>
        </div>

        <div className="bg-card/50 border border-white/10 p-6 rounded-3xl backdrop-blur-md">
          <h3 className="text-xl font-bold mb-6">Analiză Costuri</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} 
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="cost" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-card/30 border border-white/10 rounded-3xl p-6 backdrop-blur-md overflow-hidden">
        <h3 className="text-2xl font-bold mb-4">Vehiculele Tale</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-400 border-b border-white/10">
                <th className="py-4 px-4">Brand & Model</th>
                <th className="py-4 px-4">Nr. Înmatriculare</th>
                <th className="py-4 px-4">VIN</th>
                <th className="py-4 px-4">An Fabricație</th>
                <th className="py-4 px-4 text-right">Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((car: any) => (
                <motion.tr 
                  key={car.id} 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-white/5 hover:bg-white/5 transition"
                >
                  <td className="py-4 px-4 font-bold">
                    {car.brand_name} <span className="text-blue-400">{car.model_name}</span>
                  </td>
                  <td className="py-4 px-4 bg-white/5 rounded-lg font-mono text-sm inline-block mt-2">
                    {car.plate_number}
                  </td>
                  <td className="py-4 px-4 text-gray-400 text-sm">{car.vin}</td>
                  <td className="py-4 px-4">{car.manufacture_year}</td>
                  <td className="py-4 px-4 text-right">
                    <button className="text-red-400 hover:text-red-300 transition p-2 hover:bg-red-500/20 rounded-full">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </motion.tr>
              ))}
              {vehicles.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">
                    Nu ai nicio mașină înregistrată. Adaugă una acum!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value }: any) => (
  <div className="bg-card/50 border border-white/10 p-6 rounded-2xl flex items-center gap-4 hover:bg-white/10 transition">
    <div className="p-3 bg-white/5 rounded-xl">{icon}</div>
    <div>
      <p className="text-gray-400 text-sm">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CarCarousel } from '../components/CarCarousel';
import { Modal } from '../components/Modal';
import { AddVehicleForm } from '../components/forms/AddVehicleForm';
import { BookServiceForm } from '../components/forms/BookServiceForm';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Car, Wrench, DollarSign, Plus, Trash2, Calendar, RefreshCcw, LogOut } from 'lucide-react';

export const Dashboard = () => {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState<any>(null);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isAddCarOpen, setIsAddCarOpen] = useState(false);
  const [isBookServiceOpen, setIsBookServiceOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const statsRes = await axios.get('http://localhost:5000/api/dashboard-stats', config);
      const carsRes = await axios.get('http://localhost:5000/api/vehicles', config);
      const appRes = await axios.get('http://localhost:5000/api/appointments', config);

      setStats(statsRes.data);
      setVehicles(carsRes.data);
      setAppointments(appRes.data);
      
    } catch (err) {
      console.error("Eroare la încărcare date", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCar = async (id: number) => {
    if (!window.confirm("Sigur vrei să ștergi această mașină?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/vehicles/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      alert("Nu s-a putut șterge mașina.");
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const chartData = [
    { name: 'Ian', cost: 120 },
    { name: 'Feb', cost: 300 },
    { name: 'Mar', cost: 150 },
    { name: 'Total', cost: stats?.totalSpent || 0 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex flex-col items-center justify-center text-white">
        <RefreshCcw className="animate-spin mb-4 text-blue-500" size={40} />
        <p>Se încarcă garajul tău...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark text-white p-4 md:p-8 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
            Salut, {user?.name}!
          </h1>
          <p className="text-gray-400 mt-1">Panoul de control al flotei tale.</p>
        </div>
        
        <div className="flex gap-3">
          <button onClick={() => setIsBookServiceOpen(true)} className="bg-purple-600/20 hover:bg-purple-600 border border-purple-500/50 text-purple-300 hover:text-white px-4 py-2 rounded-xl flex items-center gap-2 transition font-medium">
            <Calendar size={18} /> Programare
          </button>
          <button onClick={() => setIsAddCarOpen(true)} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition font-medium">
            <Plus size={18} /> Adaugă
          </button>
          <button onClick={handleLogout} className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-3 py-2 rounded-xl border border-red-500/20 transition">
            <LogOut size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 space-y-6">
          <CarCarousel />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard icon={<Car className="text-blue-400" />} title="Mașini" value={stats?.totalCars || 0} />
            <StatCard icon={<DollarSign className="text-green-400" />} title="Cheltuieli" value={`${stats?.totalSpent || 0} RON`} />
            <StatCard icon={<Wrench className="text-pink-400" />} title="Următoarea Revizie" value={stats?.nextAppointment ? new Date(stats.nextAppointment.appointment_date).toLocaleDateString() : 'Niciuna'} />
          </div>
        </div>

        <div className="bg-[#1e293b]/60 border border-white/10 p-6 rounded-3xl backdrop-blur-xl h-full flex flex-col justify-center">
          <h3 className="text-xl font-bold mb-6 text-gray-200">Analiză Costuri</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }} />
                <Bar dataKey="cost" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#1e293b]/40 border border-white/10 rounded-3xl p-6 backdrop-blur-xl mb-8">
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3"><Car className="text-gray-400" /> Flota Ta</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-400 text-sm border-b border-white/10">
                <th className="p-4">Vehicul</th>
                <th className="p-4">Nr. Înmatriculare</th>
                <th className="p-4">VIN</th>
                <th className="p-4">An</th>
                <th className="p-4 text-right">Acțiuni</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              {vehicles.map((car: any) => (
                <tr key={car.id} className="border-b border-white/5 hover:bg-white/5 transition">
                  <td className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center overflow-hidden">
                      {car.image_url ? <img src={`http://localhost:5000${car.image_url}`} className="w-full h-full object-cover" /> : <Car size={20} />}
                    </div>
                    <div><p className="font-bold">{car.brand_name}</p><p className="text-xs text-gray-500">{car.model_name}</p></div>
                  </td>
                  <td className="p-4"><span className="px-3 py-1 bg-white/10 rounded-lg font-mono text-sm">{car.plate_number}</span></td>
                  <td className="p-4 text-sm font-mono text-gray-500">{car.vin}</td>
                  <td className="p-4">{car.manufacture_year}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDeleteCar(car.id)} className="p-2 text-gray-500 hover:text-red-400 transition"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {vehicles.length === 0 && <p className="text-center py-8 text-gray-500">Nu ai mașini. Adaugă una!</p>}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[#1e293b]/40 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3"><Wrench className="text-purple-400" /> Istoric Service</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {appointments.map((app: any) => (
            <div key={app.id} className="bg-white/5 border border-white/10 p-4 rounded-xl hover:bg-white/10 transition">
              <div className="flex justify-between mb-2">
                <span className="font-bold text-white">{app.service_name}</span>
                <span className={`px-2 py-1 rounded text-xs font-bold ${app.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{app.status.toUpperCase()}</span>
              </div>
              <p className="text-gray-400 text-sm">Vehicul: <span className="text-white">{app.brand} - {app.plate_number}</span></p>
              <p className="text-gray-400 text-sm">Data: <span className="text-white">{new Date(app.appointment_date).toLocaleDateString()}</span></p>
              <p className="text-blue-400 font-bold mt-2">{app.total_cost} RON</p>
            </div>
          ))}
          {appointments.length === 0 && <p className="text-gray-500 col-span-full text-center">Nicio programare găsită.</p>}
        </div>
      </motion.div>

      <Modal isOpen={isAddCarOpen} onClose={() => setIsAddCarOpen(false)} title="Adaugă Vehicul">
        <AddVehicleForm onSuccess={() => { setIsAddCarOpen(false); fetchData(); }} />
      </Modal>
      <Modal isOpen={isBookServiceOpen} onClose={() => setIsBookServiceOpen(false)} title="Programare Service">
        <BookServiceForm myVehicles={vehicles} onSuccess={() => { setIsBookServiceOpen(false); fetchData(); }} />
      </Modal>
    </div>
  );
};

const StatCard = ({ icon, title, value }: any) => (
  <div className="bg-[#1e293b]/60 border border-white/10 p-6 rounded-2xl flex items-center gap-4 backdrop-blur-md">
    <div className="p-3 bg-white/5 rounded-xl border border-white/5">{icon}</div>
    <div><p className="text-gray-400 text-xs uppercase font-bold">{title}</p><p className="text-2xl font-bold text-white">{value}</p></div>
  </div>
);
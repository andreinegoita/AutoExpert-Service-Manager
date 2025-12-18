import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, CheckCircle, XCircle, LogOut, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminDashboard = () => {
  const { token, logout, user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    if (user?.role_id !== 1) {
       navigate('/dashboard');
       return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const usersRes = await axios.get('http://localhost:5000/api/admin/users', config);
      const appRes = await axios.get('http://localhost:5000/api/admin/appointments', config);
      setUsers(usersRes.data);
      setAppointments(appRes.data);
    } catch (err) {
      toast.error("Eroare la încărcare date admin.");
    }
  };

  const changeStatus = async (id: number, status: string) => {
    try {
      await axios.patch(`http://localhost:5000/api/admin/appointments/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`Status schimbat în ${status}`);
      fetchData();
    } catch (err) {
      toast.error("Eroare la actualizare status.");
    }
  };

  return (
    <div className="min-h-screen bg-dark text-white p-8 font-sans">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold text-red-500 flex items-center gap-3">
            <ShieldAlert size={40} /> Panou Administrator
          </h1>
          <p className="text-gray-400">Gestionează utilizatorii și programările globale.</p>
        </div>
        <button onClick={() => { logout(); navigate('/login'); }} className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl flex items-center gap-2 transition">
          <LogOut size={18} /> Deconectare
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* TABEL PROGRAMĂRI GLOBALE */}
        <div className="bg-[#1e293b]/40 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2"><Calendar className="text-blue-400" /> Toate Programările</h3>
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {appointments.map((app: any) => (
              <div key={app.id} className="bg-white/5 p-4 rounded-xl border border-white/5 flex justify-between items-center">
                <div>
                  <p className="font-bold text-white">{app.client_name}</p>
                  <p className="text-sm text-gray-400">{app.service_name} - {app.plate_number}</p>
                  <p className="text-xs text-blue-400">{new Date(app.appointment_date).toLocaleDateString()} - {app.total_cost} RON</p>
                </div>
                <div className="flex flex-col gap-2">
                  <span className={`text-xs font-bold px-2 py-1 rounded text-center ${
                      app.status === 'completed' ? 'bg-green-500/20 text-green-500' : 
                      app.status === 'confirmed' ? 'bg-blue-500/20 text-blue-500' : 'bg-yellow-500/20 text-yellow-500'
                  }`}>
                    {app.status.toUpperCase()}
                  </span>
                  {app.status === 'pending' && (
                    <div className="flex gap-1">
                      <button onClick={() => changeStatus(app.id, 'confirmed')} className="p-1 bg-green-600 rounded hover:bg-green-500" title="Confirmă"><CheckCircle size={16} /></button>
                      <button onClick={() => changeStatus(app.id, 'cancelled')} className="p-1 bg-red-600 rounded hover:bg-red-500" title="Anulează"><XCircle size={16} /></button>
                    </div>
                  )}
                   {app.status === 'confirmed' && (
                      <button onClick={() => changeStatus(app.id, 'completed')} className="px-2 py-1 bg-blue-600 rounded text-xs hover:bg-blue-500">Finalizează</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#1e293b]/40 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2"><Users className="text-purple-400" /> Utilizatori Înregistrați</h3>
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-400 border-b border-white/10"><th className="pb-2">Nume</th><th className="pb-2">Email</th><th className="pb-2">Rol</th></tr>
            </thead>
            <tbody>
              {users.map((u: any) => (
                <tr key={u.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-3 font-medium">{u.full_name}</td>
                  <td className="py-3 text-gray-400 text-sm">{u.email}</td>
                  <td className="py-3"><span className={`px-2 py-0.5 rounded text-xs ${u.role_id === 1 ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>{u.role_id === 1 ? 'ADMIN' : 'CLIENT'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
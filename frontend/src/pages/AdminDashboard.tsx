import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Calendar, CheckCircle, XCircle, LogOut, 
  ShieldAlert, TrendingUp, Clock, Search, DollarSign 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export const AdminDashboard = () => {
  const { token, logout, user } = useAuth();
  const navigate = useNavigate();
  
  const [users, setUsers] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

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
    const toastId = toast.loading("Se actualizează...");
    try {
      await axios.patch(`http://localhost:5000/api/admin/appointments/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`Status schimbat în ${status.toUpperCase()}`, { id: toastId });
      fetchData();
    } catch (err) {
      toast.error("Eroare la actualizare status.", { id: toastId });
    }
  };

  const stats = useMemo(() => {
    const totalRevenue = appointments
        .filter(a => a.status === 'completed')
        .reduce((acc, curr) => acc + Number(curr.total_cost), 0);
    
    const pendingCount = appointments.filter(a => a.status === 'pending').length;
    const todayAppointments = appointments.filter(a => 
        new Date(a.appointment_date).toDateString() === new Date().toDateString()
    ).length;

    return { totalRevenue, pendingCount, todayAppointments };
  }, [appointments]);

  const filteredUsers = users.filter(u => 
    u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAppointments = appointments.filter(a => {
      if (filterStatus === 'all') return true;
      return a.status === filterStatus;
  });

  return (
    <div className="min-h-screen bg-dark text-white p-6 md:p-10 font-sans">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-bold text-red-500 flex items-center gap-3">
            <ShieldAlert size={40} className="animate-pulse" /> Admin Panel
          </h1>
          <p className="text-gray-400 mt-1">Bine ai venit, Comandante! Iată situația flotei.</p>
        </div>
        <button onClick={() => { logout(); navigate('/login'); }} className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl flex items-center gap-2 transition border border-white/10">
          <LogOut size={18} /> Deconectare
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard 
            title="Total Încasări" 
            value={`${stats.totalRevenue} RON`} 
            icon={<DollarSign className="text-green-400" size={24}/>} 
            color="border-green-500/20 bg-green-500/5"
        />
        <StatCard 
            title="Utilizatori" 
            value={users.length} 
            icon={<Users className="text-blue-400" size={24}/>} 
            color="border-blue-500/20 bg-blue-500/5"
        />
        <StatCard 
            title="Cereri Așteptare" 
            value={stats.pendingCount} 
            icon={<Clock className="text-yellow-400" size={24}/>} 
            color="border-yellow-500/20 bg-yellow-500/5"
        />
        <StatCard 
            title="Programări Azi" 
            value={stats.todayAppointments} 
            icon={<Calendar className="text-purple-400" size={24}/>} 
            color="border-purple-500/20 bg-purple-500/5"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 bg-[#1e293b]/40 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-2xl font-bold flex items-center gap-2">
                <Calendar className="text-blue-400" /> Management Programări
             </h3>
             <div className="flex bg-black/20 p-1 rounded-lg">
                {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(status => (
                    <button 
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-3 py-1 text-xs rounded-md capitalize transition ${filterStatus === status ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                    >
                        {status === 'all' ? 'Toate' : status}
                    </button>
                ))}
             </div>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {filteredAppointments.length === 0 && <p className="text-gray-500 text-center py-10">Nu există programări cu acest status.</p>}
            
            {filteredAppointments.map((app: any) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={app.id} 
                className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-white/10 transition"
              >
                <div className="flex gap-4 items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center font-bold text-gray-300">
                        {app.client_name.charAt(0)}
                    </div>
                    <div>
                        <p className="font-bold text-white text-lg">{app.client_name}</p>
                        <p className="text-sm text-gray-400 flex items-center gap-2">
                            <span className="bg-white/10 px-2 rounded text-xs">{app.plate_number}</span> 
                            {app.service_name}
                        </p>
                        <p className="text-xs text-blue-400 mt-1 font-mono">
                            {new Date(app.appointment_date).toLocaleDateString()} • {app.total_cost} RON
                        </p>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                  <StatusBadge status={app.status} />
                  
                  <div className="flex gap-2 mt-1">
                    {app.status === 'pending' && (
                        <>
                            <ActionButton onClick={() => changeStatus(app.id, 'confirmed')} icon={<CheckCircle size={14}/>} color="green" text="Confirmă" />
                            <ActionButton onClick={() => changeStatus(app.id, 'cancelled')} icon={<XCircle size={14}/>} color="red" text="Refuză" />
                        </>
                    )}
                    {app.status === 'confirmed' && (
                         <ActionButton onClick={() => changeStatus(app.id, 'completed')} icon={<TrendingUp size={14}/>} color="blue" text="Finalizează" />
                    )}
                    {(app.status === 'cancelled' ) && (
                         <button onClick={() => changeStatus(app.id, 'pending')} className="text-xs text-gray-500 hover:text-white underline">Resetează</button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="bg-[#1e293b]/40 border border-white/10 rounded-3xl p-6 backdrop-blur-xl h-fit">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Users className="text-purple-400" /> Bază de Date Clienți
          </h3>
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 text-gray-500" size={16} />
            <input 
                type="text" 
                placeholder="Caută nume sau email..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div className="overflow-y-auto max-h-[500px] custom-scrollbar">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-500 text-xs border-b border-white/10">
                    <th className="pb-2 pl-2">Client</th>
                    <th className="pb-2 text-right">Rol</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u: any) => (
                  <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="py-3 pl-2">
                        <p className="font-medium text-sm">{u.full_name}</p>
                        <p className="text-xs text-gray-500">{u.email}</p>
                    </td>
                    <td className="py-3 text-right">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${u.role_id === 1 ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                            {u.role_id === 1 ? 'ADMIN' : 'CLIENT'}
                        </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredUsers.length === 0 && <p className="text-center text-gray-500 text-sm py-4">Niciun utilizator găsit.</p>}
          </div>
        </div>

      </div>
    </div>
  );
};


const StatCard = ({ title, value, icon, color }: any) => (
    <div className={`p-4 rounded-2xl border flex items-center gap-4 ${color}`}>
        <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
            {icon}
        </div>
        <div>
            <p className="text-gray-400 text-xs uppercase font-bold tracking-wider">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    </div>
);

const StatusBadge = ({ status }: { status: string }) => {
    const styles: any = {
        pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
        confirmed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
        completed: "bg-green-500/20 text-green-400 border-green-500/30",
        cancelled: "bg-red-500/20 text-red-400 border-red-500/30"
    };
    return (
        <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border ${styles[status] || styles.pending}`}>
            {status}
        </span>
    );
};

const ActionButton = ({ onClick, icon, color, text }: any) => {
    const colors: any = {
        green: "bg-green-600 hover:bg-green-500",
        red: "bg-red-600 hover:bg-red-500",
        blue: "bg-blue-600 hover:bg-blue-500"
    };
    return (
        <button 
            onClick={onClick} 
            className={`${colors[color]} text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-medium transition shadow-lg active:scale-95`}
        >
            {icon} {text}
        </button>
    );
};
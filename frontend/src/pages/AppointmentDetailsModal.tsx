import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, DollarSign, Car, CheckCircle, Clock, XCircle, AlertTriangle } from "lucide-react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast"; 


export const AppointmentDetailsModal = ({ appointment, isOpen, onClose, onUpdate }: any) => {
  const { token } = useAuth();

  if (!isOpen || !appointment) return null;

  const status = appointment.status.toLowerCase();
  
  let StatusIcon = Clock;
  let statusColor = "text-yellow-400 bg-yellow-500/20 border-yellow-500/30";
  
  if (status === 'completed') {
      StatusIcon = CheckCircle;
      statusColor = "text-green-400 bg-green-500/20 border-green-500/30";
  } else if (status === 'cancelled') {
      StatusIcon = XCircle;
      statusColor = "text-red-400 bg-red-500/20 border-red-500/30";
  }


  const handleCancel = async () => {
    if (!window.confirm("Ești sigur că vrei să anulezi această programare?")) return;

    try {
      await axios.patch(
        `http://localhost:5000/api/appointments/${appointment.id}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success("Programare anulată!"); 
      onUpdate(); 
      onClose();  
    } catch (error) {
      console.error(error);
      toast.error("Eroare la anulare.");
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#1e293b] w-full max-w-lg rounded-3xl border border-white/10 overflow-hidden shadow-2xl relative"
        >
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-blue-600/20 to-transparent pointer-events-none" />
          
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition z-10"
          >
            <X size={20} />
          </button>

          <div className="p-8 pt-10">
            <div className="flex flex-col items-center mb-8">
              <div className={`p-4 rounded-2xl mb-4 border ${statusColor}`}>
                <StatusIcon size={32} />
              </div>
              <h2 className="text-2xl font-bold text-white text-center">
                {appointment.service_name}
              </h2>
              <span className={`mt-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${statusColor.replace('text-', 'text-opacity-90 ')}`}>
                {status === 'pending' ? 'În Așteptare' : (status === 'completed' ? 'Finalizat' : 'Anulat')}
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                <div className="flex items-center gap-3 text-gray-400">
                  <Calendar size={20} className="text-blue-400" />
                  <span>Data</span>
                </div>
                <span className="font-bold text-white">
                  {new Date(appointment.appointment_date).toLocaleDateString('ro-RO')}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                <div className="flex items-center gap-3 text-gray-400">
                  <Car size={20} className="text-purple-400" />
                  <span>Vehicul</span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-white">{appointment.brand} {appointment.model}</p>
                  <p className="text-xs text-gray-500">{appointment.plate_number}</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                <div className="flex items-center gap-3 text-gray-400">
                  <DollarSign size={20} className="text-green-400" />
                  <span>Cost</span>
                </div>
                <span className="font-bold text-2xl text-green-400">
                  {appointment.total_cost} RON
                </span>
              </div>
            </div>
            
            {status === 'pending' && (
              <div className="mt-8 pt-6 border-t border-white/10">
                  <button 
                    onClick={handleCancel}
                    className="w-full py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 transition flex items-center justify-center gap-2 font-bold"
                  >
                    <AlertTriangle size={18} /> Anulează Programarea
                  </button>
                  <p className="text-center text-xs text-gray-500 mt-2">
                    Această acțiune este ireversibilă.
                  </p>
              </div>
            )}

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-600 font-mono">
                ID: #{appointment.id}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
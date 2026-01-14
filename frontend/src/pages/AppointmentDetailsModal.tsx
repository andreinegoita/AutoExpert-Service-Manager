import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Wrench, DollarSign, Car, CheckCircle, Clock } from "lucide-react";

export const AppointmentDetailsModal = ({ appointment, isOpen, onClose }: any) => {
  if (!isOpen || !appointment) return null;

  const isCompleted = appointment.status === "completed";
  const StatusIcon = isCompleted ? CheckCircle : Clock;
  const statusColor = isCompleted ? "text-green-400 bg-green-500/20" : "text-yellow-400 bg-yellow-500/20";
  const statusBorder = isCompleted ? "border-green-500/30" : "border-yellow-500/30";

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
              <div className={`p-4 rounded-2xl mb-4 ${statusColor} border ${statusBorder}`}>
                <StatusIcon size={32} />
              </div>
              <h2 className="text-2xl font-bold text-white text-center">
                {appointment.service_name}
              </h2>
              <p className={`mt-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${statusBorder} ${statusColor.replace('bg-', 'bg-opacity-10 ')}`}>
                {appointment.status}
              </p>
            </div>

            <div className="space-y-4">
              
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                <div className="flex items-center gap-3 text-gray-400">
                  <Calendar size={20} className="text-blue-400" />
                  <span>Data Programării</span>
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
                  <span>Cost Total</span>
                </div>
                <span className="font-bold text-2xl text-green-400">
                  {appointment.total_cost} RON
                </span>
              </div>

            </div>

            <div className="mt-8 text-center">
              <p className="text-xs text-gray-600 font-mono">
                ID Programare: #{appointment.id}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';

export const Register = () => {
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      navigate('/login'); 
    } catch (err) {
      alert('Eroare la înregistrare. Poate email-ul există deja?');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/30 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/30 rounded-full blur-[100px]"></div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 w-full max-w-md p-8 bg-card/50 border border-white/10 rounded-2xl backdrop-blur-xl"
      >
        <h2 className="text-3xl font-bold text-center text-white mb-8">Creează Cont</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Nume Complet"
              className="w-full bg-dark/60 border border-gray-700 rounded-lg py-3 pl-10 text-white focus:border-blue-500 outline-none"
              onChange={e => setFormData({...formData, fullName: e.target.value})}
            />
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
            <input 
              type="email" 
              placeholder="Email"
              className="w-full bg-dark/60 border border-gray-700 rounded-lg py-3 pl-10 text-white focus:border-blue-500 outline-none"
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
            <input 
              type="password" 
              placeholder="Parolă"
              className="w-full bg-dark/60 border border-gray-700 rounded-lg py-3 pl-10 text-white focus:border-blue-500 outline-none"
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold flex justify-center items-center gap-2 mt-4">
            Înregistrare <ArrowRight size={18} />
          </button>
        </form>
        
        <p className="mt-4 text-center text-gray-400 text-sm">
          Ai deja cont? <Link to="/login" className="text-blue-400 hover:underline">Loghează-te</Link>
        </p>
      </motion.div>
    </div>
  );
};
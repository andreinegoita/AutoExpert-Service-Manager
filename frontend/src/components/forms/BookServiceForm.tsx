import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export const BookServiceForm = ({ onSuccess, myVehicles }: { onSuccess: () => void, myVehicles: any[] }) => {
  const { token } = useAuth();
  const [services, setServices] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    vehicleId: '',
    serviceId: '',
    date: '',
    notes: ''
  });

  useEffect(() => {
    axios.get('http://localhost:5000/api/services').then(res => setServices(res.data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/appointments', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Programare trimisă cu succes!');
      onSuccess();
    } catch (err) {
      alert('Eroare la programare.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm text-gray-400">Alege Vehiculul</label>
        <select 
          className="w-full bg-dark/50 border border-gray-600 rounded-xl p-3 text-white outline-none focus:border-blue-500"
          onChange={e => setFormData({...formData, vehicleId: e.target.value})}
          required
        >
          <option value="">Selectează...</option>
          {myVehicles.map(v => <option key={v.id} value={v.id}>{v.plate_number} - {v.brand_name} {v.model_name}</option>)}
        </select>
      </div>

      <div>
        <label className="text-sm text-gray-400">Tip Serviciu</label>
        <select 
          className="w-full bg-dark/50 border border-gray-600 rounded-xl p-3 text-white outline-none focus:border-blue-500"
          onChange={e => setFormData({...formData, serviceId: e.target.value})}
          required
        >
          <option value="">Selectează...</option>
          {services.map(s => <option key={s.id} value={s.id}>{s.service_name} ({s.base_price} RON)</option>)}
        </select>
      </div>

      <div>
        <label className="text-sm text-gray-400">Data Dorită</label>
        <input 
          type="datetime-local" 
          className="w-full bg-dark/50 border border-gray-600 rounded-xl p-3 text-white outline-none focus:border-blue-500 [color-scheme:dark]"
          onChange={e => setFormData({...formData, date: e.target.value})}
          required
        />
      </div>

      <div>
        <label className="text-sm text-gray-400">Observații (Opțional)</label>
        <textarea 
          className="w-full bg-dark/50 border border-gray-600 rounded-xl p-3 text-white outline-none focus:border-blue-500"
          placeholder="Ex: Se aude un zgomot la roata stângă..."
          rows={3}
          onChange={e => setFormData({...formData, notes: e.target.value})}
        />
      </div>

      <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition">
        Confirmă Programarea
      </button>
    </form>
  );
};
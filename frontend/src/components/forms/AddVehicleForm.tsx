import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Upload } from 'lucide-react';

export const AddVehicleForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { token } = useAuth();
  const [brands, setBrands] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  
  const [selectedBrand, setSelectedBrand] = useState('');
  const [formData, setFormData] = useState({
    modelId: '',
    vin: '',
    plate: '',
    year: new Date().getFullYear(),
  });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/brands').then(res => setBrands(res.data));
  }, []);

  useEffect(() => {
    if (selectedBrand) {
      axios.get(`http://localhost:5000/api/models/${selectedBrand}`).then(res => setModels(res.data));
    }
  }, [selectedBrand]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData(); 
    data.append('modelId', formData.modelId);
    data.append('vin', formData.vin);
    data.append('plate', formData.plate);
    data.append('year', formData.year.toString());
    if (file) data.append('image', file);

    try {
      await axios.post('http://localhost:5000/api/vehicles', data, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      onSuccess();
    } catch (err) {
      alert('Eroare: Verifică VIN-ul (17 caractere) sau conexiunea.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm text-gray-400">Marcă</label>
        <select 
          className="w-full bg-dark/50 border border-gray-600 rounded-xl p-3 text-white outline-none focus:border-blue-500"
          onChange={(e) => setSelectedBrand(e.target.value)}
          required
        >
          <option value="">Alege Marca</option>
          {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
      </div>

      <div>
        <label className="text-sm text-gray-400">Model</label>
        <select 
          className="w-full bg-dark/50 border border-gray-600 rounded-xl p-3 text-white outline-none focus:border-blue-500 disabled:opacity-50"
          disabled={!selectedBrand}
          onChange={(e) => setFormData({...formData, modelId: e.target.value})}
          required
        >
          <option value="">Alege Modelul</option>
          {models.map(m => <option key={m.id} value={m.id}>{m.model_name}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-400">Nr. Înmatriculare</label>
          <input 
            type="text" className="w-full bg-dark/50 border border-gray-600 rounded-xl p-3 text-white outline-none focus:border-blue-500 uppercase"
            placeholder="B-99-WWW"
            onChange={e => setFormData({...formData, plate: e.target.value})}
            required
          />
        </div>
        <div>
          <label className="text-sm text-gray-400">An Fabricație</label>
          <input 
            type="number" className="w-full bg-dark/50 border border-gray-600 rounded-xl p-3 text-white outline-none focus:border-blue-500"
            defaultValue={2020}
            onChange={e => setFormData({...formData, year: parseInt(e.target.value)})}
            required
          />
        </div>
      </div>

      <div>
        <label className="text-sm text-gray-400">Serie Șasiu (VIN)</label>
        <input 
          type="text" className="w-full bg-dark/50 border border-gray-600 rounded-xl p-3 text-white outline-none focus:border-blue-500 uppercase"
          placeholder="17 Caractere..."
          minLength={17} maxLength={17}
          onChange={e => setFormData({...formData, vin: e.target.value})}
          required
        />
      </div>

      <div className="border-2 border-dashed border-gray-600 rounded-xl p-4 text-center cursor-pointer hover:border-blue-500 transition relative">
        <input 
          type="file" accept="image/*" 
          onChange={e => setFile(e.target.files ? e.target.files[0] : null)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="flex flex-col items-center gap-2 text-gray-400">
          <Upload size={24} />
          <span className="text-sm">{file ? file.name : "Încarcă o poză cu mașina"}</span>
        </div>
      </div>

      <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition">
        Salvează Vehiculul
      </button>
    </form>
  );
};
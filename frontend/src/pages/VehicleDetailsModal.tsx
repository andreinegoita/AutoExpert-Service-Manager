import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Camera, Car, Calendar, Hash, Fuel } from "lucide-react"; 
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export const VehicleDetailsModal = ({ vehicle, isOpen, onClose, onUpdate }: any) => {
  const { token } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    plate_number: "",
    vin: "",
    manufacture_year: "",
  });
  const [newImage, setNewImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=1000&auto=format&fit=crop";

  useEffect(() => {
    if (vehicle) {
      setFormData({
        plate_number: vehicle.plate_number || "",
        vin: vehicle.vin || "",
        manufacture_year: vehicle.manufacture_year || "",
      });
      setPreviewUrl(null);
      setNewImage(null);
      setIsEditing(false); 
    }
  }, [vehicle, isOpen]);

  if (!isOpen || !vehicle) return null;

  const currentImageUrl = previewUrl 
    ? previewUrl 
    : (vehicle.image_url ? `http://localhost:5000${vehicle.image_url}` : DEFAULT_IMAGE);

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setIsEditing(true); 
    }
  };

  const handleSave = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("plate_number", formData.plate_number);
      formDataToSend.append("vin", formData.vin);
      formDataToSend.append("manufacture_year", formData.manufacture_year);
      if (newImage) {
        formDataToSend.append("image", newImage);
      }

      await axios.put(
        `http://localhost:5000/api/vehicles/${vehicle.id}`,
        formDataToSend,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onUpdate();
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert("Eroare la actualizare! Verifică consola.");
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#1e293b] w-full max-w-2xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        >
          <div className="relative h-72 w-full shrink-0 bg-gray-900 group">
            <img
              src={currentImageUrl}
              className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
              alt="Vehicle"
              onError={(e: any) => { e.target.src = DEFAULT_IMAGE; }} // Fallback dacă imaginea de pe server e 404
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-[#1e293b] via-[#1e293b]/40 to-transparent"></div>

            <button 
              onClick={onClose} 
              className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-red-500/80 text-white rounded-full transition backdrop-blur-md z-20"
            >
              <X size={24} />
            </button>

            <div className="absolute bottom-0 left-0 p-8 w-full z-10">
              <div className="flex justify-between items-end">
                <div>
                   <h2 className="text-4xl font-bold text-white drop-shadow-lg mb-1">
                    {vehicle.brand_name} <span className="text-blue-400">{vehicle.model_name}</span>
                  </h2>
                  <p className="text-gray-300 font-mono text-lg bg-black/30 inline-block px-3 py-1 rounded-lg backdrop-blur-sm border border-white/10">
                    {formData.plate_number || "Fără număr"}
                  </p>
                </div>
                
                <label className="cursor-pointer bg-blue-600/90 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 transition shadow-lg backdrop-blur-sm border border-white/10 transform translate-y-2 group-hover:translate-y-0 opacity-90 group-hover:opacity-100">
                    <Camera size={18} />
                    <span className="text-sm font-semibold">Schimbă Foto</span>
                    <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                </label>
              </div>
            </div>
          </div>

          <div className="p-8 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-200 flex items-center gap-2">
                <Car className="text-blue-500" /> Detalii Tehnice
              </h3>
              
              <button
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className={`px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition shadow-lg ${
                  isEditing 
                    ? "bg-green-500 hover:bg-green-400 text-white shadow-green-500/20" 
                    : "bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10"
                }`}
              >
                {isEditing ? <><Save size={18}/> Salvează Modificări</> : "Editează Datele"}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DetailItem 
                icon={<div className="bg-blue-500/20 p-2 rounded-lg text-blue-400"><Car size={20}/></div>}
                label="Număr Înmatriculare" 
                value={formData.plate_number} 
                isEditing={isEditing}
                placeholder="Ex: B 123 ABC"
                onChange={(val: string) => setFormData({...formData, plate_number: val})}
              />
              <DetailItem 
                icon={<div className="bg-purple-500/20 p-2 rounded-lg text-purple-400"><Hash size={20}/></div>}
                label="Serie Șasiu (VIN)" 
                value={formData.vin} 
                isEditing={isEditing}
                placeholder="Ex: WVWZZZ..."
                onChange={(val: string) => setFormData({...formData, vin: val})}
              />
              <DetailItem 
                icon={<div className="bg-orange-500/20 p-2 rounded-lg text-orange-400"><Calendar size={20}/></div>}
                label="An Fabricație" 
                value={formData.manufacture_year} 
                isEditing={isEditing}
                type="number"
                placeholder="Ex: 2020"
                onChange={(val: string) => setFormData({...formData, manufacture_year: val})}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const DetailItem = ({ icon, label, value, isEditing, onChange, type = "text", placeholder }: any) => (
  <div className="bg-[#0f172a]/50 p-4 rounded-2xl border border-white/5 hover:border-white/10 transition group">
    <div className="flex items-center gap-3 mb-3">
      {icon}
      <span className="text-sm font-medium text-gray-400 group-hover:text-gray-300 transition">{label}</span>
    </div>
    
    {isEditing ? (
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition font-mono"
      />
    ) : (
      <p className="text-lg font-bold text-white pl-1 font-mono tracking-wide">
        {value || <span className="text-gray-600 text-sm italic">Nedefinit</span>}
      </p>
    )}
  </div>
);
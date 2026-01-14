import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Camera, Car, Calendar, Hash, FileText, ShieldCheck, Activity } from "lucide-react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export const VehicleDetailsModal = ({ vehicle, isOpen, onClose, onUpdate }: any) => {
  const { token } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    plate_number: "",
    vin: "",
    manufacture_year: "",
    mileage: "",
    itp_expiry: "",
    rca_expiry: "",
    rovinieta_expiry: "",
  });
  const [newImage, setNewImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=1000&auto=format&fit=crop";

  useEffect(() => {
    if (vehicle) {
      const formatDate = (dateString: string) => dateString ? dateString.split('T')[0] : "";
      
      setFormData({
        plate_number: vehicle.plate_number || "",
        vin: vehicle.vin || "",
        manufacture_year: vehicle.manufacture_year || "",
        mileage: vehicle.mileage || "",
        itp_expiry: formatDate(vehicle.itp_expiry),
        rca_expiry: formatDate(vehicle.rca_expiry),
        rovinieta_expiry: formatDate(vehicle.rovinieta_expiry),
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
      Object.keys(formData).forEach(key => {
        // @ts-ignore
        formDataToSend.append(key, formData[key]);
      });
      
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
      alert("Eroare la actualizare!");
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#1e293b] w-full max-w-4xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        >
          <div className="relative h-64 w-full shrink-0 bg-gray-900 group">
            <img
              src={currentImageUrl}
              className="w-full h-full object-cover opacity-90"
              alt="Vehicle"
              onError={(e: any) => { e.target.src = DEFAULT_IMAGE; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1e293b] via-transparent to-transparent"></div>
            <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-red-500/80 text-white rounded-full transition z-20">
              <X size={24} />
            </button>

            <div className="absolute bottom-4 left-6 z-10">
               <h2 className="text-4xl font-bold text-white drop-shadow-lg">{vehicle.brand_name} {vehicle.model_name}</h2>
               <p className="text-xl text-blue-300 font-bold drop-shadow-md flex items-center gap-2">
                 <Activity size={20} /> {formData.mileage || 0} km
               </p>
            </div>

            {isEditing && (
              <label className="absolute bottom-4 right-6 cursor-pointer bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition z-10 shadow-lg">
                <Camera size={18} /> Schimbă Foto
                <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
              </label>
            )}
          </div>

          <div className="p-8 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-200">Fișă Vehicul</h3>
              <button
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className={`px-5 py-2 rounded-xl font-bold flex items-center gap-2 transition ${
                  isEditing ? "bg-green-500 text-white" : "bg-white/10 text-blue-300"
                }`}
              >
                {isEditing ? <><Save size={18}/> Salvează</> : "Editează"}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DetailItem icon={<Car className="text-blue-400"/>} label="Număr Înmatriculare" value={formData.plate_number} isEditing={isEditing} onChange={(val: string) => setFormData({...formData, plate_number: val})} />
              <DetailItem icon={<Hash className="text-purple-400"/>} label="Serie Șasiu (VIN)" value={formData.vin} isEditing={isEditing} onChange={(val: string) => setFormData({...formData, vin: val})} />
              <DetailItem icon={<Calendar className="text-green-400"/>} label="An Fabricație" value={formData.manufacture_year} isEditing={isEditing} type="number" onChange={(val: string) => setFormData({...formData, manufacture_year: val})} />
              
              <DetailItem icon={<Activity className="text-cyan-400"/>} label="Kilometraj (km)" value={formData.mileage} isEditing={isEditing} type="number" onChange={(val: string) => setFormData({...formData, mileage: val})} />
              <DetailItem icon={<FileText className="text-red-400"/>} label="Expirare RCA" value={formData.rca_expiry} isEditing={isEditing} type="date" onChange={(val: string) => setFormData({...formData, rca_expiry: val})} />
              <DetailItem icon={<ShieldCheck className="text-yellow-400"/>} label="Expirare ITP" value={formData.itp_expiry} isEditing={isEditing} type="date" onChange={(val: string) => setFormData({...formData, itp_expiry: val})} />
              <DetailItem icon={<FileText className="text-orange-400"/>} label="Expirare Rovinietă" value={formData.rovinieta_expiry} isEditing={isEditing} type="date" onChange={(val: string) => setFormData({...formData, rovinieta_expiry: val})} />
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const DetailItem = ({ icon, label, value, isEditing, onChange, type = "text" }: any) => (
  <div className="bg-white/5 p-4 rounded-xl border border-white/5 hover:border-white/10 transition">
    <div className="flex items-center gap-2 mb-2 text-gray-400 text-sm font-medium">
      {icon} {label}
    </div>
    {isEditing ? (
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
      />
    ) : (
      <p className="text-lg font-bold text-white">
        {value || <span className="text-gray-600 text-sm">Nesetat</span>}
      </p>
    )}
  </div>
);
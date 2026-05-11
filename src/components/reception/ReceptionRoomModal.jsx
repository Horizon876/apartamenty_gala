import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, Home } from 'lucide-react';

const ReceptionRoomModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  formData, 
  setFormData, 
  editingRoom 
}) => {
  if (!isOpen) return null;

  const handleAddImage = () => {
    setFormData({ ...formData, images: [...formData.images, ''] });
  };

  const handleRemoveImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-brand-anthracite/60 backdrop-blur-sm"
      />
      
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="relative w-full max-w-4xl bg-[#FBFBF9] shadow-[0_50px_100px_rgba(0,0,0,0.4)] border border-brand-anthracite/10 overflow-hidden"
      >
        <div className="flex flex-col md:flex-row h-full max-h-[85vh]">
          {/* Sidebar Info */}
          <div className="md:w-1/3 bg-brand-anthracite p-12 text-white flex flex-col justify-between">
            <div>
              <div className="w-16 h-16 bg-brand-gold flex items-center justify-center mb-10">
                <Home size={32} />
              </div>
              <h3 className="text-4xl font-serif italic mb-4">
                {editingRoom ? 'Edycja' : 'Nowy'} <br/>
                <span className="text-brand-gold">Apartament</span>
              </h3>
              <p className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-40 leading-relaxed">
                Skonfiguruj parametry techniczne i wizualne jednostki mieszkalnej.
              </p>
            </div>
            
            <div className="space-y-6 opacity-60">
               <div className="flex items-center space-x-4">
                 <div className="w-2 h-2 bg-brand-gold" />
                 <span className="text-[9px] uppercase tracking-widest font-bold">Wszystkie pola są wymagane</span>
               </div>
               <div className="flex items-center space-x-4">
                 <div className="w-2 h-2 bg-brand-gold" />
                 <span className="text-[9px] uppercase tracking-widest font-bold">Cena wpływa na wyszukiwarkę</span>
               </div>
            </div>
          </div>

          {/* Form Area */}
          <div className="flex-1 p-12 md:p-16 overflow-y-auto custom-scrollbar">
            <div className="flex justify-end mb-8 sticky top-0 bg-[#FBFBF9] z-10">
              <button onClick={onClose} className="p-4 hover:bg-brand-off-white text-brand-anthracite/20 hover:text-brand-anthracite transition-all">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={onSave} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-brand-anthracite/40 ml-1">Nazwa Apartamentu</label>
                  <input 
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-white border border-brand-anthracite/10 p-5 outline-none focus:border-brand-gold transition-all font-bold text-[11px] uppercase tracking-widest"
                    placeholder="NP. APARTAMENT KRÓLEWSKI"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-brand-anthracite/40 ml-1">Cena (PLN / DOBA)</label>
                  <input 
                    type="number"
                    required
                    value={formData.basePrice}
                    onChange={(e) => setFormData({...formData, basePrice: e.target.value})}
                    className="w-full bg-white border border-brand-anthracite/10 p-5 outline-none focus:border-brand-gold transition-all font-bold text-[11px] uppercase tracking-widest"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-brand-anthracite/40 ml-1">Maks. Liczba Osób</label>
                  <input 
                    type="number"
                    required
                    value={formData.capacity}
                    onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                    className="w-full bg-white border border-brand-anthracite/10 p-5 outline-none focus:border-brand-gold transition-all font-bold text-[11px] uppercase tracking-widest"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-brand-anthracite/40 ml-1">Dostępna Ilość</label>
                  <input 
                    type="number"
                    required
                    value={formData.totalRooms}
                    onChange={(e) => setFormData({...formData, totalRooms: e.target.value})}
                    className="w-full bg-white border border-brand-anthracite/10 p-5 outline-none focus:border-brand-gold transition-all font-bold text-[11px] uppercase tracking-widest"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-brand-anthracite/40 ml-1">Szczegółowy Opis</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-white border border-brand-anthracite/10 p-6 outline-none focus:border-brand-gold transition-all font-semibold text-[11px] min-h-[150px] resize-none"
                  placeholder="Opisz udogodnienia i unikalne cechy apartamentu..."
                />
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-brand-anthracite/40">Galeria Zdjęć (URL)</label>
                  <button 
                    type="button"
                    onClick={handleAddImage}
                    className="text-[9px] uppercase tracking-widest text-brand-gold font-bold hover:underline flex items-center space-x-2"
                  >
                    <Plus size={12} />
                    <span>Dodaj URL</span>
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <input 
                        type="text"
                        value={img}
                        onChange={(e) => handleImageChange(idx, e.target.value)}
                        className="flex-1 bg-white border border-brand-anthracite/10 p-4 outline-none focus:border-brand-gold transition-all font-semibold text-[10px]"
                        placeholder="https://..."
                      />
                      <button 
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="p-4 bg-brand-off-white text-red-400 hover:bg-red-400 hover:text-white transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-10 flex space-x-4 sticky bottom-0 bg-[#FBFBF9] py-6 border-t border-brand-anthracite/5">
                <button 
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-5 border border-brand-anthracite/10 text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-brand-off-white transition-all"
                >
                  Anuluj
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-5 bg-brand-anthracite text-white text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-brand-gold transition-all"
                >
                  {editingRoom ? 'Zapisz Zmiany' : 'Utwórz Apartament'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ReceptionRoomModal;

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Users, Phone, Mail } from 'lucide-react';

const BookingModal = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6"
        >
          {/* Backdrop Blur Overlay */}
          <div className="absolute inset-0 bg-brand-anthracite/60 backdrop-blur-xl" onClick={onClose} />

          {/* Modal Content */}
          <motion.div 
            initial={{ scale: 0.9, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 50, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-brand-off-white w-full h-full md:h-auto md:max-w-4xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
          >
            {/* Artistic Side Panel */}
            <div className="hidden md:flex md:w-1/3 bg-brand-logo-beige p-12 flex-col justify-between text-brand-anthracite">
              <div className="flex flex-col">
                <span className="text-3xl font-serif tracking-[0.2em] uppercase text-brand-burgundy">Gala</span>
                <span className="text-[10px] tracking-[0.4em] uppercase text-brand-burgundy/80">Rezerwacje</span>
              </div>
              <div className="space-y-6">
                <p className="text-sm font-light text-brand-burgundy/60 leading-relaxed italic">
                  "Prawdziwy luksus to czas spędzony w harmonii."
                </p>
                <div className="w-12 h-[1px] bg-brand-burgundy" />
              </div>
            </div>

            {/* Form Panel */}
            <div className="flex-1 p-8 md:p-16 relative">
              <button 
                onClick={onClose}
                className="absolute top-8 right-8 text-brand-anthracite/40 hover:text-brand-gold transition-colors"
              >
                <X size={32} strokeWidth={1} />
              </button>

              <h3 className="text-3xl md:text-4xl font-serif text-brand-anthracite mb-12">
                Rozpocznij swoją <br />
                <span className="italic text-brand-gold">podróż</span>
              </h3>

              <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="relative">
                    <label className="text-[10px] uppercase tracking-widest text-brand-anthracite/40 mb-2 block">Imię i Nazwisko</label>
                    <input type="text" className="w-full bg-transparent border-b border-brand-anthracite/10 py-2 focus:border-brand-gold outline-none transition-colors font-light" />
                  </div>
                  <div className="relative">
                    <label className="text-[10px] uppercase tracking-widest text-brand-anthracite/40 mb-2 block">Telefon</label>
                    <div className="flex items-center space-x-2 border-b border-brand-anthracite/10">
                      <Phone size={14} className="text-brand-anthracite/30" />
                      <input type="tel" className="w-full bg-transparent py-2 focus:border-brand-gold outline-none transition-colors font-light" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="relative">
                    <label className="text-[10px] uppercase tracking-widest text-brand-anthracite/40 mb-2 block">Termin Pobytu</label>
                    <div className="flex items-center space-x-2 border-b border-brand-anthracite/10">
                      <Calendar size={14} className="text-brand-anthracite/30" />
                      <input type="text" placeholder="Przyjazd - Wyjazd" className="w-full bg-transparent py-2 focus:border-brand-gold outline-none transition-colors font-light placeholder:text-brand-anthracite/20" />
                    </div>
                  </div>
                  <div className="relative">
                    <label className="text-[10px] uppercase tracking-widest text-brand-anthracite/40 mb-2 block">Liczba Osób</label>
                    <div className="flex items-center space-x-2 border-b border-brand-anthracite/10">
                      <Users size={14} className="text-brand-anthracite/30" />
                      <input type="number" min="1" className="w-full bg-transparent py-2 focus:border-brand-gold outline-none transition-colors font-light" />
                    </div>
                  </div>
                </div>

                <div className="pt-8">
                  <button className="w-full py-4 bg-brand-burgundy text-brand-logo-beige uppercase tracking-[0.4em] text-xs transition-all duration-500 hover:bg-brand-anthracite">
                    Zapytaj o Dostępność
                  </button>
                  <p className="text-[9px] text-brand-anthracite/30 mt-4 text-center tracking-widest uppercase">
                    Odpowiemy na Twoje zapytanie w ciągu 2 godzin.
                  </p>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BookingModal;

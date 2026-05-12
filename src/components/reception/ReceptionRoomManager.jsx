import React from 'react';
import { Home, Plus, Edit2, Trash2, ArrowRight } from 'lucide-react';

const ReceptionRoomManager = ({ roomTypes, onOpenModal, onDeleteRoom }) => {
  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-brand-anthracite/10 pb-10">
        <div>
          <h2 className="text-2xl md:text-4xl font-serif text-brand-anthracite italic mb-2">Zarządzaj <span className="text-brand-gold">Pokojami</span></h2>
          <p className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] md:tracking-[0.6em] text-brand-anthracite/40 font-bold">Konfiguracja typów apartamentów i cen</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {roomTypes.map(type => (
          <div 
            key={type.id}
            className="bg-white border border-brand-anthracite/10 p-6 md:p-10 group hover:border-brand-gold transition-all flex flex-col h-full"
          >
            <div className="flex justify-between items-start mb-10">
              <div className="p-5 bg-brand-gold/10 text-brand-gold group-hover:bg-brand-gold group-hover:text-white transition-all duration-500">
                <Home size={32} />
              </div>
              <div className="text-right">
                <p className="text-[9px] uppercase tracking-[0.4em] text-brand-anthracite/30 font-bold mb-1">Pokoje</p>
                <p className="text-4xl font-serif italic text-brand-anthracite">{type.totalRooms}</p>
              </div>
            </div>
            
            <h3 className="text-2xl font-serif text-brand-anthracite mb-2 group-hover:text-brand-gold transition-colors">{type.name}</h3>
            <p className="text-[11px] uppercase tracking-[0.3em] text-brand-gold font-bold mb-10 pb-10 border-b border-brand-anthracite/5">Od {type.basePrice} PLN / doba</p>
            
            <div className="space-y-4 mb-10 flex-1">
              <div className="flex justify-between items-center text-[9px] uppercase tracking-[0.3em] font-bold">
                <span className="text-brand-anthracite/30">Maks. osób</span>
                <span className="text-brand-anthracite">{type.capacity}</span>
              </div>
              <div className="flex justify-between items-center text-[9px] uppercase tracking-[0.3em] font-bold">
                <span className="text-brand-anthracite/30">Standard</span>
                <span className="text-brand-gold">Premium</span>
              </div>
            </div>

            <div className="flex space-x-px bg-brand-anthracite/10 pt-px">
              <button 
                onClick={() => onOpenModal(type)}
                className="flex-1 py-5 bg-brand-off-white text-brand-anthracite text-[9px] uppercase tracking-[0.4em] font-bold hover:bg-brand-gold hover:text-white transition-all flex items-center justify-center space-x-3"
              >
                <Edit2 size={12} />
                <span>Edytuj</span>
              </button>
              <button 
                onClick={() => onDeleteRoom(type.id)}
                className="px-6 bg-brand-off-white text-red-400 hover:bg-red-400 hover:text-white transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReceptionRoomManager;

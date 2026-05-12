import React from 'react';
import { 
  Users, 
  Calendar, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  Home,
  Trash2
} from 'lucide-react';

const StatCard = ({ label, value, icon: Icon, trend, color = "gold" }) => (
  <div className="bg-white border border-brand-anthracite/10 p-6 md:p-8 flex flex-col justify-between h-full group hover:border-brand-gold/50 transition-all">
    <div className="flex justify-between items-start mb-6">
      <div className={`p-4 bg-brand-${color}/10 text-brand-${color}`}>
        <Icon size={24} />
      </div>
      {trend && (
        <div className="flex items-center space-x-1 text-green-500 font-bold text-[10px] tracking-widest">
          <TrendingUp size={12} />
          <span>{trend}</span>
        </div>
      )}
    </div>
    <div>
      <p className="text-[9px] uppercase tracking-[0.5em] text-brand-anthracite/30 font-bold mb-2">{label}</p>
      <p className="text-4xl font-serif italic text-brand-anthracite">{value}</p>
    </div>
  </div>
);

const ReceptionDashboard = ({ bookings, roomTypes, onUpdateStatus, onDeleteBooking }) => {
  const today = new Date().toISOString().split('T')[0];
  
  // Filtrujemy przyjazdy/wyjazdy po dacie
  const todayArrivals = bookings.filter(b => b.checkIn.startsWith(today));
  const todayDepartures = bookings.filter(b => b.checkOut.startsWith(today));
  
  // Goście w obiekcie to CI, którzy mają status CHECKED_IN
  const currentGuests = bookings.filter(b => b.status === 'CHECKED_IN');
  
  const totalRooms = roomTypes.reduce((acc, type) => acc + type.totalRooms, 0);
  const occupancyRate = totalRooms > 0 ? Math.round((currentGuests.length / totalRooms) * 100) : 0;

  return (
    <div className="space-y-12">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl md:text-5xl font-serif text-brand-anthracite italic mb-4">Witaj w <span className="text-brand-gold">Gala Reception</span></h2>
          <p className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] md:tracking-[0.6em] text-brand-anthracite/40 font-bold">Przegląd operacyjny na dzień {new Date().toLocaleDateString('pl-PL')}</p>
        </div>
        <div className="flex items-center space-x-4 bg-white border border-brand-anthracite/10 p-4">
          <Clock size={16} className="text-brand-gold" />
          <span className="text-[10px] uppercase tracking-widest font-bold text-brand-anthracite">{new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </header>

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Obłożenie Obiektu" 
          value={`${occupancyRate}%`} 
          icon={Home} 
          trend="+5%" 
        />
        <StatCard 
          label="Goście w Obiekcie" 
          value={currentGuests.length} 
          icon={Users} 
          color="anthracite"
        />
        <StatCard 
          label="Dzisiejsze Przyjazdy" 
          value={todayArrivals.length} 
          icon={ArrowUpRight} 
          color="gold"
        />
        <StatCard 
          label="Dzisiejsze Wyjazdy" 
          value={todayDepartures.length} 
          icon={Calendar} 
          color="burgundy"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Lists Column */}
        <div className="lg:col-span-2 space-y-12">
          {/* Today's Arrivals */}
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-serif italic text-brand-anthracite">Dzisiejsze <span className="text-brand-gold">Zameldowania</span></h3>
              <div className="h-[1px] flex-1 mx-6 bg-brand-anthracite/5" />
              <span className="text-[10px] font-black text-brand-gold">{todayArrivals.length}</span>
            </div>
            
            <div className="space-y-4">
              {todayArrivals.length > 0 ? todayArrivals.map((b) => (
                <div key={b.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 md:p-6 bg-white border border-brand-anthracite/5 group hover:border-brand-gold/30 transition-all gap-4">
                  <div className="flex items-center space-x-6">
                    <div className={`w-12 h-12 flex items-center justify-center font-serif italic text-xl
                      ${b.status === 'CHECKED_IN' ? 'bg-brand-gold text-white' : 'bg-brand-gold/10 text-brand-gold'}
                    `}>
                      {b.lastName[0]}
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-brand-anthracite">{b.lastName} {b.firstName}</p>
                      <p className="text-[9px] text-brand-anthracite/40 font-bold uppercase tracking-tighter">{b.roomType?.name} • {b.guests} OS.</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    {b.status === 'PENDING' ? (
                      <button 
                        onClick={() => onUpdateStatus(b.id, 'CHECKED_IN')}
                        className="px-6 py-2 bg-brand-gold text-white text-[9px] font-black uppercase tracking-widest hover:bg-brand-anthracite transition-all shadow-sm"
                      >
                        Zamelduj
                      </button>
                    ) : (
                      <span className="text-[9px] font-black uppercase tracking-widest text-brand-gold bg-brand-gold/5 px-4 py-2 border border-brand-gold/20">
                        Zameldowany
                      </span>
                    )}
                    <button 
                      onClick={() => onDeleteBooking(b.id)}
                      className="p-2 text-brand-anthracite/20 hover:text-red-500 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )) : (
                <div className="p-10 text-center border border-dashed border-brand-anthracite/10">
                  <CheckCircle2 size={24} className="mx-auto text-brand-gold/20 mb-3" />
                  <p className="text-[9px] font-bold uppercase tracking-widest text-brand-anthracite/30">Brak przyjazdów na dziś</p>
                </div>
              )}
            </div>
          </div>

          {/* Today's Departures */}
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-serif italic text-brand-anthracite">Dzisiejsze <span className="text-brand-gold">Wyjazdy</span></h3>
              <div className="h-[1px] flex-1 mx-6 bg-brand-anthracite/5" />
              <span className="text-[10px] font-black text-brand-gold">{todayDepartures.length}</span>
            </div>
            <div className="space-y-4">
              {todayDepartures.length > 0 ? todayDepartures.map((b) => (
                <div key={b.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 md:p-6 bg-white border border-brand-anthracite/5 group hover:border-brand-gold/30 transition-all gap-4">
                  <div className="flex items-center space-x-6">
                    <div className={`w-12 h-12 flex items-center justify-center font-serif italic text-xl
                      ${b.status === 'CHECKED_OUT' ? 'bg-brand-anthracite text-white' : 'bg-brand-anthracite/5 text-brand-anthracite/40'}
                    `}>
                      {b.lastName[0]}
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-brand-anthracite">{b.lastName} {b.firstName}</p>
                      <p className="text-[9px] text-brand-anthracite/40 font-bold uppercase tracking-tighter">{b.roomType?.name} • {b.guests} OS.</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    {b.status === 'CHECKED_IN' ? (
                      <button 
                        onClick={() => onUpdateStatus(b.id, 'CHECKED_OUT')}
                        className="px-6 py-2 border border-brand-anthracite text-brand-anthracite text-[9px] font-black uppercase tracking-widest hover:bg-brand-anthracite hover:text-white transition-all"
                      >
                        Wymelduj
                      </button>
                    ) : b.status === 'CHECKED_OUT' ? (
                      <span className="text-[9px] font-black uppercase tracking-widest text-brand-anthracite/40 bg-brand-anthracite/5 px-4 py-2 border border-brand-anthracite/10">
                        Wymeldowany
                      </span>
                    ) : (
                      <span className="text-[9px] font-black uppercase tracking-widest text-brand-gold/40 px-4 py-2">
                        Oczekuje
                      </span>
                    )}
                    <button 
                      onClick={() => onDeleteBooking(b.id)}
                      className="p-2 text-brand-anthracite/20 hover:text-red-500 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )) : (
                <div className="p-10 text-center border border-dashed border-brand-anthracite/10">
                  <CheckCircle2 size={24} className="mx-auto text-brand-gold/20 mb-3" />
                  <p className="text-[9px] font-bold uppercase tracking-widest text-brand-anthracite/30">Brak wyjazdów na dziś</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Status Column */}
        <div className="space-y-8">

          <div className="bg-brand-off-white/50 border border-brand-anthracite/5 p-10">
            <p className="text-[10px] uppercase tracking-[0.4em] text-brand-anthracite/30 font-bold mb-4 italic">Notatki Recepcji</p>
            <p className="text-[11px] text-brand-anthracite/60 leading-relaxed uppercase tracking-tighter">
              Brak pilnych komunikatów systemowych. Obiekt funkcjonuje w trybie standardowym.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceptionDashboard;

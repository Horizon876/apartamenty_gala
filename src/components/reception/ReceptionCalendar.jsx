import React from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Home, 
  Loader2, 
  Maximize2 
} from 'lucide-react';

const ReceptionCalendar = ({ 
  currentDate, 
  setCurrentDate, 
  viewType, 
  setViewType, 
  bookings, 
  roomTypes, 
  loading,
  filterRoomTypeId,
  setFilterRoomTypeId
}) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const daysCount = daysInMonth(year, month);
  
  const filteredRoomTypes = filterRoomTypeId === 'all' 
    ? roomTypes 
    : roomTypes.filter(t => t.id === filterRoomTypeId);

  const getBookingsForRoomTypeAndDay = (roomTypeId, day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return bookings.filter(b => {
      if (b.roomTypeId !== roomTypeId) return false;
      const start = new Date(b.checkIn).toISOString().split('T')[0];
      const end = new Date(b.checkOut).toISOString().split('T')[0];
      return dateStr >= start && dateStr < end;
    });
  };

  const getBookingsForDay = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return bookings.filter(b => {
      if (filterRoomTypeId !== 'all' && b.roomTypeId !== filterRoomTypeId) return false;
      const start = new Date(b.checkIn).toISOString().split('T')[0];
      const end = new Date(b.checkOut).toISOString().split('T')[0];
      return dateStr >= start && dateStr < end;
    });
  };

  return (
    <div className="space-y-10">
      {/* Calendar Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-brand-anthracite/10 pb-10">
        <div>
          <h2 className="text-4xl font-serif text-brand-anthracite italic mb-2">Kalendarz <span className="text-brand-gold">Obiektu</span></h2>
          <p className="text-[10px] uppercase tracking-[0.6em] text-brand-anthracite/40 font-bold">Zarządzaj dostępnością i rezerwacjami</p>
        </div>

        <div className="flex items-center space-x-6">
          {/* Room Type Filter */}
          <div className="flex items-center space-x-4 bg-white border border-brand-anthracite/10 px-6 py-3">
            <Home size={14} className="text-brand-gold" />
            <select 
              value={filterRoomTypeId}
              onChange={(e) => setFilterRoomTypeId(e.target.value)}
              className="bg-transparent text-[9px] uppercase tracking-widest font-bold outline-none cursor-pointer text-brand-anthracite min-w-[150px]"
            >
              <option value="all">Wszystkie Apartamenty</option>
              {roomTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center bg-white border border-brand-anthracite/10">
            <button 
              onClick={() => setViewType('timeline')}
              className={`px-6 py-3 text-[9px] uppercase tracking-widest font-bold transition-all ${viewType === 'timeline' ? 'bg-brand-anthracite text-white' : 'text-brand-anthracite/40 hover:bg-brand-off-white'}`}
            >
              Oś Czasu
            </button>
            <div className="w-[1px] h-4 bg-brand-anthracite/10" />
            <button 
              onClick={() => setViewType('grid')}
              className={`px-6 py-3 text-[9px] uppercase tracking-widest font-bold transition-all ${viewType === 'grid' ? 'bg-brand-anthracite text-white' : 'text-brand-anthracite/40 hover:bg-brand-off-white'}`}
            >
              Miesięczny
            </button>
          </div>

          <div className="flex items-center bg-white border border-brand-anthracite/10 p-1">
            <button 
              onClick={() => setCurrentDate(new Date(year, month - 1))}
              disabled={year <= new Date().getFullYear() && month <= new Date().getMonth()}
              className="p-3 hover:bg-brand-off-white text-brand-anthracite/30 hover:text-brand-gold transition-all disabled:opacity-0 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="text-center px-6 min-w-[140px]">
              <span className="text-[10px] uppercase tracking-[0.4em] font-bold block text-brand-anthracite">
                {currentDate.toLocaleString('pl-PL', { month: 'long' })}
              </span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-brand-gold font-bold">{year}</span>
            </div>
            <button 
              onClick={() => setCurrentDate(new Date(year, month + 1))}
              className="p-3 hover:bg-brand-off-white text-brand-anthracite/30 hover:text-brand-gold transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Calendar Area */}
      <div className="bg-white border border-brand-anthracite/10 shadow-sm relative overflow-hidden">
        {loading && (
          <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex items-center justify-center flex-col">
            <Loader2 className="animate-spin text-brand-gold mb-4" size={32} />
            <p className="text-[9px] uppercase tracking-[0.5em] text-brand-anthracite/40 font-bold">Synchronizacja danych...</p>
          </div>
        )}

        <div className="overflow-x-auto custom-scrollbar">
          {viewType === 'timeline' ? (
            <div className="grid grid-cols-[200px_repeat(31,minmax(50px,1fr))] gap-px bg-brand-anthracite/10 min-w-[1600px]">
              {/* Header Row */}
              <div className="sticky left-0 z-30 bg-brand-off-white/80 backdrop-blur-md p-6 flex items-center justify-center border-b border-brand-anthracite/10">
                <span className="text-[9px] uppercase tracking-[0.5em] font-bold text-brand-anthracite/40">Apartament</span>
              </div>
              {Array.from({ length: 31 }, (_, i) => i + 1).map(d => {
                const isValidDay = d <= daysCount;
                const date = new Date(year, month, d);
                const isWeekend = isValidDay && (date.getDay() === 0 || date.getDay() === 6);
                const isToday = isValidDay && new Date().getDate() === d && new Date().getMonth() === month && new Date().getFullYear() === year;
                
                return (
                  <div key={d} className={`p-4 text-center border-b border-brand-anthracite/10 transition-colors 
                    ${!isValidDay ? 'bg-brand-off-white/20' : ''}
                    ${isToday ? 'bg-brand-gold/15' : (isWeekend ? 'bg-brand-off-white/40' : 'bg-white')}
                  `}>
                    <span className={`text-[8px] font-bold block mb-1 uppercase tracking-tighter ${isToday ? 'text-brand-gold' : 'text-brand-anthracite/30'}`}>
                      {isValidDay ? date.toLocaleDateString('pl-PL', { weekday: 'short' }) : ''}
                    </span>
                    <span className={`text-xs font-bold ${isValidDay ? (isToday ? 'text-brand-gold' : 'text-brand-anthracite') : 'text-transparent'}`}>
                      {isValidDay ? d : ''}
                    </span>
                  </div>
                );
              })}

              {/* Rows */}
              {filteredRoomTypes.map((type, typeIdx) => {
                const rows = Array.from({ length: type.totalRooms }, (_, i) => i + 1);
                return rows.map((roomNum, rowIdx) => {
                  const isEvenRow = (typeIdx + rowIdx) % 2 === 0;
                  return (
                    <React.Fragment key={`${type.id}-${roomNum}`}>
                      <div className={`sticky left-0 z-20 p-6 border-r border-brand-anthracite/10 flex flex-col justify-center space-y-1 transition-all cursor-default group shadow-[5px_0_15px_rgba(0,0,0,0.02)]
                        ${isEvenRow ? 'bg-white' : 'bg-brand-off-white/30'}
                      `}>
                        <div className="flex items-center justify-between">
                           <span className="text-[10px] font-bold text-brand-anthracite uppercase tracking-tighter group-hover:text-brand-gold transition-colors">{type.name}</span>
                           <span className="text-[9px] font-serif italic text-brand-gold bg-brand-gold/5 px-2 py-0.5">#{roomNum}</span>
                        </div>
                      </div>
                      {Array.from({ length: 31 }, (_, i) => i + 1).map(d => {
                        const isValidDay = d <= daysCount;
                        const dayBookings = getBookingsForRoomTypeAndDay(type.id, d);
                        const booking = dayBookings[roomNum - 1]; 
                        const isToday = new Date().getDate() === d && new Date().getMonth() === month && new Date().getFullYear() === year;

                        return (
                          <div key={d} className={`relative h-20 border-r border-brand-anthracite/5 group transition-colors hover:bg-brand-gold/5 
                            ${!isValidDay ? 'bg-brand-off-white/10' : (isToday ? 'bg-brand-gold/15' : (isEvenRow ? 'bg-white' : 'bg-brand-off-white/20'))}
                          `}>
                            {booking && isValidDay && (
                              <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={`absolute inset-y-3 left-0 right-0 z-10 transition-all duration-300 flex flex-col justify-center px-3 shadow-sm border-y border-brand-gold/20
                                  ${new Date(booking.checkIn).getDate() === d && new Date(booking.checkIn).getMonth() === month ? 'ml-1 border-l-4 border-brand-gold bg-brand-gold/20' : 'bg-brand-gold/15'} 
                                  ${new Date(booking.checkOut).getDate() === d && new Date(booking.checkOut).getMonth() === month ? 'mr-1 border-r-2 border-brand-gold/40' : ''}
                                  hover:bg-brand-gold/30 cursor-pointer overflow-hidden
                                `}
                              >
                                <span className="text-[9px] font-black text-brand-anthracite uppercase tracking-tighter truncate leading-none mb-1">
                                  {booking.lastName}
                                </span>
                                <span className="text-[7px] font-bold text-brand-gold uppercase tracking-[0.2em] leading-none opacity-60">
                                  {booking.guests} os.
                                </span>
                              </motion.div>
                            )}
                          </div>
                        );
                      })}
                    </React.Fragment>
                  );
                })
              })}
            </div>
          ) : (
            /* Monthly Grid View */
            <div className="p-10">
              <div className="grid grid-cols-7 gap-px bg-brand-anthracite/10 border border-brand-anthracite/10">
                {['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela'].map(day => (
                  <div key={day} className="bg-brand-off-white p-4 text-center">
                    <span className="text-[9px] uppercase tracking-[0.4em] font-bold text-brand-anthracite/40">{day}</span>
                  </div>
                ))}
                {/* Empty slots */}
                {Array.from({ length: (new Date(year, month, 1).getDay() + 6) % 7 }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-32 bg-brand-off-white/10 opacity-30" />
                ))}
                {Array.from({ length: daysCount }, (_, i) => i + 1).map(d => {
                  const dayBookings = getBookingsForDay(d);
                  const isToday = new Date().getDate() === d && new Date().getMonth() === month && new Date().getFullYear() === year;
                  return (
                    <div key={d} className={`h-40 p-4 border-t border-r border-brand-anthracite/10 transition-all hover:bg-brand-off-white/30 group relative flex flex-col
                      ${isToday ? 'bg-brand-gold/5' : 'bg-white'}
                    `}>
                      <span className={`text-sm font-serif italic mb-3 ${isToday ? 'text-brand-gold underline underline-offset-4' : 'text-brand-anthracite/20'}`}>{d}</span>
                      <div className="flex-1 space-y-1 overflow-y-auto no-scrollbar">
                        {dayBookings.map(b => (
                          <div key={b.id} className="text-[9px] p-2 bg-brand-off-white border-l-2 border-brand-gold text-brand-anthracite font-bold truncate uppercase tracking-tighter">
                            {b.lastName}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReceptionCalendar;

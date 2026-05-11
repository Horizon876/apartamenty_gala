import React from 'react';
import { Search, Users as UsersIcon, Trash2 } from 'lucide-react';

const ReceptionGuestList = ({ bookings, searchTerm, setSearchTerm, onUpdateStatus, onDeleteBooking }) => {
  const filteredBookings = bookings.filter(b => 
    `${b.firstName} ${b.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-brand-anthracite/10 pb-10">
        <div>
          <h2 className="text-4xl font-serif text-brand-anthracite italic mb-2">Lista <span className="text-brand-gold">Naszych Gości</span></h2>
          <p className="text-[10px] uppercase tracking-[0.6em] text-brand-anthracite/40 font-bold">Baza danych i historia pobytów</p>
        </div>

        <div className="flex items-center bg-white px-6 py-4 border border-brand-anthracite/10 w-full md:w-96">
           <Search size={16} className="text-brand-gold mr-4" />
           <input 
             type="text" 
             placeholder="SZUKAJ GOŚCIA LUB EMAILA..."
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="bg-transparent border-none outline-none text-[10px] uppercase tracking-widest font-bold w-full placeholder:text-brand-anthracite/20"
           />
        </div>
      </header>

      <div className="bg-white border border-brand-anthracite/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-off-white/50 border-b border-brand-anthracite/10">
                <th className="px-8 py-6 text-[10px] uppercase tracking-[0.4em] font-bold text-brand-anthracite/40">Profil Gościa</th>
                <th className="px-8 py-6 text-[10px] uppercase tracking-[0.4em] font-bold text-brand-anthracite/40">Typ Pokoju</th>
                <th className="px-8 py-6 text-[10px] uppercase tracking-[0.4em] font-bold text-brand-anthracite/40">Szczegóły Pobytu</th>
                <th className="px-8 py-6 text-[10px] uppercase tracking-[0.4em] font-bold text-brand-anthracite/40">Status</th>
                <th className="px-8 py-6 text-[10px] uppercase tracking-[0.4em] font-bold text-brand-anthracite/40 text-right">Zarządzaj</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-anthracite/5">
              {filteredBookings.length > 0 ? filteredBookings.map((booking) => (
                <tr key={booking.id} className="group hover:bg-brand-off-white/30 transition-all">
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-brand-anthracite text-white flex items-center justify-center font-serif italic text-lg">
                        {booking.lastName[0]}
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-brand-anthracite">{booking.lastName} {booking.firstName}</p>
                        <p className="text-[9px] text-brand-anthracite/40 font-bold uppercase tracking-tighter">{booking.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-[10px] font-bold text-brand-anthracite uppercase tracking-tighter">{booking.roomType?.name}</p>
                    <p className="text-[9px] text-brand-gold font-bold uppercase tracking-widest">{booking.guests} OSOBY</p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-[10px] font-bold text-brand-anthracite uppercase tracking-tighter">
                      {new Date(booking.checkIn).toLocaleDateString('pl-PL')}
                    </p>
                    <p className="text-[9px] text-brand-anthracite/30 font-bold uppercase tracking-tighter">
                      Do {new Date(booking.checkOut).toLocaleDateString('pl-PL')}
                    </p>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 border 
                      ${booking.status === 'CHECKED_IN' ? 'text-brand-gold border-brand-gold/30 bg-brand-gold/5' : 
                        booking.status === 'CHECKED_OUT' ? 'text-brand-anthracite/40 border-brand-anthracite/10 bg-brand-anthracite/5' : 
                        'text-blue-500 border-blue-200 bg-blue-50'}
                    `}>
                      {booking.status === 'CHECKED_IN' ? 'W Obiekcie' : 
                       booking.status === 'CHECKED_OUT' ? 'Wymeldowany' : 'Oczekuje'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {booking.status === 'PENDING' && (
                        <button 
                          onClick={() => onUpdateStatus(booking.id, 'CHECKED_IN')}
                          className="px-4 py-2 bg-brand-gold text-white text-[8px] font-black uppercase tracking-widest hover:bg-brand-anthracite transition-all"
                        >
                          Zamelduj
                        </button>
                      )}
                      {booking.status === 'CHECKED_IN' && (
                        <button 
                          onClick={() => onUpdateStatus(booking.id, 'CHECKED_OUT')}
                          className="px-4 py-2 border border-brand-anthracite text-brand-anthracite text-[8px] font-black uppercase tracking-widest hover:bg-brand-anthracite hover:text-white transition-all"
                        >
                          Wymelduj
                        </button>
                      )}
                      <button 
                        onClick={() => onDeleteBooking(booking.id)}
                        className="p-2 text-brand-anthracite/20 hover:text-red-500 hover:bg-red-50 transition-all rounded-none border border-transparent hover:border-red-100"
                        title="Usuń rezerwację"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <p className="text-[10px] uppercase tracking-[0.5em] text-brand-anthracite/30 font-bold">Brak rezerwacji pasujących do wyszukiwania</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReceptionGuestList;

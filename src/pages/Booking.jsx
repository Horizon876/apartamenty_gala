import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalendarIcon, 
  Users, 
  Phone, 
  Mail, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  ArrowRight, 
  Star, 
  Coffee, 
  Wifi, 
  Tv,
  ChevronLeft,
  ChevronRight,
  Info,
  MapPin,
  X
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const API_URL = 'http://localhost:3000';

const ROOM_IMAGES = {
  'Pokój Jednoosobowy': '/images/rooms/single.webp',
  'Pokój Dwuosobowy Standard': '/images/rooms/double_standard.webp',
  'Pokój Trzyosobowy': '/images/rooms/triple.webp',
  'Pokój Czteroosobowy': '/images/rooms/quadruple.webp',
  'Studio Trzyosobowe': '/images/rooms/studio_triple.webp'
};

const AMENITIES = [
  { icon: <Wifi size={14} />, text: 'Free WiFi' },
  { icon: <Coffee size={14} />, text: 'Śniadanie' },
  { icon: <Tv size={14} />, text: 'Smart TV' },
];

// --- CUSTOM PREMIUM CALENDAR COMPONENT ---
const PremiumCalendar = ({ value, onChange, label }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selecting, setSelecting] = useState('checkIn'); // 'checkIn' or 'checkOut'

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const days = useMemo(() => {
    const count = daysInMonth(year, month);
    const firstDay = (firstDayOfMonth(year, month) + 6) % 7; // Adjust for Monday start
    const result = [];
    for (let i = 0; i < firstDay; i++) result.push(null);
    for (let i = 1; i <= count; i++) result.push(new Date(year, month, i));
    return result;
  }, [year, month]);

  const monthNames = [
    "Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
    "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"
  ];

  const formatDate = (date) => {
    if (!date) return '';
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const handleDateClick = (date) => {
    if (!date || date < new Date().setHours(0,0,0,0)) return;
    const dStr = formatDate(date);

    if (selecting === 'checkIn') {
      onChange({ ...value, checkIn: dStr, checkOut: '' });
      setSelecting('checkOut');
    } else {
      if (dStr <= value.checkIn) {
        onChange({ ...value, checkIn: dStr, checkOut: '' });
      } else {
        onChange({ ...value, checkOut: dStr });
        setSelecting('checkIn');
      }
    }
  };

  const isSelected = (date) => {
    if (!date) return false;
    const dStr = formatDate(date);
    return dStr === value.checkIn || dStr === value.checkOut;
  };

  const isInRange = (date) => {
    if (!date || !value.checkIn || !value.checkOut) return false;
    const dStr = formatDate(date);
    return dStr > value.checkIn && dStr < value.checkOut;
  };

  return (
    <div className="bg-white/95 backdrop-blur-xl p-6 md:p-10 rounded-none text-brand-anthracite shadow-[0_40px_100px_-20px_rgba(212,185,150,0.15)] border border-white/50 w-full relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 rounded-none -mr-16 -mt-16" />
      
      <div className="flex justify-between items-center mb-10 relative z-10">
        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-[0.5em] text-brand-gold font-bold">Wybierz daty</p>
          <h4 className="text-xl md:text-2xl font-serif text-brand-anthracite font-medium">{monthNames[month]} {year}</h4>
        </div>
        <div className="flex space-x-3">
          <button onClick={() => setCurrentDate(new Date(year, month - 1))} className="p-2.5 hover:bg-brand-off-white rounded-none transition-all text-brand-anthracite/20 hover:text-brand-gold"><ChevronLeft size={20}/></button>
          <button onClick={() => setCurrentDate(new Date(year, month + 1))} className="p-2.5 hover:bg-brand-off-white rounded-none transition-all text-brand-anthracite/20 hover:text-brand-gold"><ChevronRight size={20}/></button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-brand-anthracite/20 mb-6 font-bold text-center relative z-10">
        {['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'].map(d => <div key={d}>{d}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-2 md:gap-3 relative z-10">
        {days.map((date, i) => {
          const selected = isSelected(date);
          const range = isInRange(date);
          const isPast = date && date < new Date().setHours(0,0,0,0);

          return (
            <div 
              key={i}
              onClick={() => date && !isPast && handleDateClick(date)}
              className={`
                h-10 md:h-14 flex items-center justify-center text-xs md:text-base cursor-pointer transition-all duration-300 relative rounded-none md:rounded-none
                ${!date ? 'opacity-0 pointer-events-none' : ''}
                ${isPast ? 'opacity-10 cursor-not-allowed text-brand-anthracite/40' : 'hover:bg-brand-gold/10'}
                ${selected ? 'bg-[#543D21] text-white font-bold scale-105 z-10 shadow-xl shadow-[#543D21]/20' : ''}
                ${range ? 'bg-brand-gold/20 text-[#543D21] font-bold' : ''}
              `}
            >
              {date?.getDate()}
              {selected && (
                <motion.div 
                  layoutId="active-date-highlight"
                  className="absolute inset-0 bg-[#543D21]/10 blur-xl rounded-none -z-10"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Booking = () => {
  const [searchParamsUrl, setSearchParamsUrl] = useSearchParams();
  const [step, setStep] = useState(searchParamsUrl.get('step') || 'search'); // search, results, checkout, success
  const [roomTypes, setRoomTypes] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  
  const [searchParams, setSearchParams] = useState({
    checkIn: '',
    checkOut: '',
    guests: 2
  });

  const [contactData, setContactData] = useState({
    fullName: '',
    email: '',
    phone: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchRoomTypes();
  }, []);

  useEffect(() => {
    const s = searchParamsUrl.get('step') || 'search';
    
    // Redirect to search if on checkout step but no room is selected
    if (s === 'checkout' && !selectedRoom) {
      updateStep('search');
      return;
    }
    
    setStep(s);
  }, [searchParamsUrl, selectedRoom]);

  const updateStep = (newStep) => {
    setSearchParamsUrl({ step: newStep });
    setStep(newStep);
  };

  const fetchRoomTypes = async () => {
    try {
      const response = await fetch(`${API_URL}/room-types`);
      const data = await response.json();
      setRoomTypes(data);
    } catch (error) {
      console.error('Błąd podczas pobierania typów pokoi:', error);
    }
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (!searchParams.checkIn || !searchParams.checkOut) {
      setError('Proszę zaznaczyć obie daty w kalendarzu');
      return;
    }
    setError('');
    updateStep('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectRoom = (room) => {
    setSelectedRoom(room);
    updateStep('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinalBooking = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const names = contactData.fullName.trim().split(' ');
    const firstName = names[0] || '';
    const lastName = names.slice(1).join(' ') || ' ';

    try {
      const response = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email: contactData.email,
          checkIn: searchParams.checkIn,
          checkOut: searchParams.checkOut,
          guests: searchParams.guests,
          roomTypeId: selectedRoom.id
        }),
      });

      const data = await response.json();

      if (response.ok) {
        updateStep('success');
      } else {
        setError(data.error || 'Wystąpił błąd podczas rezerwacji.');
      }
    } catch (error) {
      setError('Błąd połączenia z serwerem.');
    } finally {
      setLoading(false);
    }
  };

  // --- RENDERING COMPONENTS ---

  const renderSearchPhase = () => (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-brand-off-white">
      {/* Immersive Background */}
      <motion.div 
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        transition={{ duration: 20 }}
        className="absolute inset-0 z-0"
      >
        <img 
          src="/images/strona_glowna.webp" 
          className="w-full h-full object-cover opacity-20" 
          alt="Luxury Ambience" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-off-white via-brand-off-white/80 to-transparent" />
      </motion.div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-7xl px-6 py-32 flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-8 mb-20"
        >
          <div className="flex flex-col items-center space-y-4">
             <span className="text-[10px] md:text-xs uppercase tracking-[1em] text-brand-gold font-bold">Witaj w Świecie Luksusu</span>
             <h1 className="text-4xl md:text-7xl font-serif text-brand-anthracite italic leading-none">Apartamenty <span className="text-brand-gold">Gala</span></h1>
          </div>
        </motion.div>

        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
           {/* Left Side: Calendar */}
           <motion.div 
             initial={{ opacity: 0, x: -30 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.2 }}
             className="lg:col-span-7"
           >
              <PremiumCalendar value={searchParams} onChange={setSearchParams} />
           </motion.div>

           {/* Right Side: Selection Menu */}
           <motion.div
             initial={{ opacity: 0, x: 30 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.4 }}
             className="lg:col-span-5"
           >
              <div className="h-full bg-white/80 backdrop-blur-xl p-8 md:p-12 rounded-none border border-brand-gold/20 shadow-2xl flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 rounded-none -mr-32 -mt-32 blur-3xl" />
                
                <div className="space-y-10 relative z-10">
                  <div className="space-y-2">
                    <p className="text-[10px] uppercase tracking-[0.5em] text-brand-gold font-bold">Twoja Rezerwacja</p>
                    <h4 className="text-3xl font-serif italic text-brand-anthracite">Wybierz detale</h4>
                  </div>

                  {/* Dates Summary */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-6 bg-brand-off-white rounded-none border border-brand-gold/10">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-brand-gold/10 rounded-none flex items-center justify-center text-brand-gold"><CalendarIcon size={18}/></div>
                        <div>
                          <p className="text-[9px] uppercase tracking-widest text-brand-anthracite/40 font-bold">Przyjazd</p>
                          <p className="font-serif text-lg text-brand-anthracite">{searchParams.checkIn || '---'}</p>
                        </div>
                      </div>
                      <ArrowRight size={14} className="text-brand-gold/30" />
                      <div className="text-right">
                        <p className="text-[9px] uppercase tracking-widest text-brand-anthracite/40 font-bold">Wyjazd</p>
                        <p className="font-serif text-lg text-brand-anthracite">{searchParams.checkOut || '---'}</p>
                      </div>
                    </div>

                    {/* Guests Selector */}
                    <div className="relative group">
                      <div className="absolute top-[-10px] left-6 px-3 bg-brand-gold text-brand-anthracite text-[9px] uppercase tracking-[0.2em] font-bold rounded-none z-20 shadow-lg">Goście</div>
                      <select 
                        value={searchParams.guests}
                        onChange={(e) => setSearchParams({...searchParams, guests: parseInt(e.target.value)})}
                        className="w-full bg-brand-off-white border border-brand-gold/10 py-5 px-8 text-brand-anthracite outline-none focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/10 transition-all appearance-none cursor-pointer rounded-none text-lg font-serif"
                      >
                        {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n} className="bg-white">{n} {n === 1 ? 'Osoba' : 'Osoby'}</option>)}
                      </select>
                      <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-brand-gold/50">
                        <Users size={20} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-12 space-y-6 relative z-10">
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center space-x-3 text-red-500 text-[10px] uppercase tracking-widest font-bold bg-red-50 p-4 rounded-none border border-red-100"
                    >
                      <AlertCircle size={14} />
                      <span>{error}</span>
                    </motion.div>
                  )}

                  <button 
                    onClick={handleSearch}
                    className="w-full py-6 bg-brand-gold text-brand-anthracite uppercase tracking-[0.6em] text-xs font-bold hover:bg-brand-anthracite hover:text-white transition-all duration-500 flex items-center justify-center space-x-6 group shadow-xl rounded-none relative overflow-hidden"
                  >
                    <span>Szukaj Pokoi</span>
                    <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-500" />
                  </button>
                </div>
              </div>
           </motion.div>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute bottom-10 left-10 text-[10px] uppercase tracking-[0.5em] text-brand-anthracite/10 hidden md:block vertical-text font-bold">Premium Experience • Since 1987</div>
      <div className="absolute bottom-10 right-10 flex space-x-6 text-brand-anthracite/20 hidden md:flex">
         <Phone size={16} />
         <Mail size={16} />
         <MapPin size={16} />
      </div>
    </div>
  );

  const renderRoomCards = () => (
    <div className="min-h-screen bg-brand-off-white pt-24 pb-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row items-center justify-between bg-white border border-brand-gold/20 p-8 md:px-12 mb-20 gap-8 shadow-xl"
        >
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-[0.4em] text-brand-gold font-bold">Twoja Rezerwacja</span>
              <h2 className="text-2xl font-serif text-brand-anthracite italic">Wybrane Parametry</h2>
            </div>
            
            <div className="h-10 w-[1px] bg-brand-gold/20 hidden lg:block" />

            <div className="flex items-center space-x-12">
              <div className="flex items-center space-x-4">
                <CalendarIcon size={16} className="text-brand-gold" />
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase tracking-widest text-brand-anthracite/30 font-bold">Termin</span>
                  <span className="text-sm font-serif text-brand-anthracite">{searchParams.checkIn} — {searchParams.checkOut}</span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Users size={16} className="text-brand-gold" />
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase tracking-widest text-brand-anthracite/30 font-bold">Goście</span>
                  <span className="text-sm font-serif text-brand-anthracite">{searchParams.guests} {searchParams.guests === 1 ? 'osoba' : 'osoby'}</span>
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={() => updateStep('search')}
            className="px-8 py-3 border border-brand-gold/30 text-[10px] uppercase tracking-[0.4em] text-brand-gold font-bold hover:bg-brand-gold hover:text-white transition-all duration-500 flex items-center space-x-3 group"
          >
            <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span>Zmień Kryteria</span>
          </button>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {roomTypes.map((room, index) => (
            <motion.div 
              key={room.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white border border-brand-gold/10 group flex flex-col h-full shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              <div className="aspect-[16/10] overflow-hidden relative">
                <img 
                  src={(() => {
                    if (room.images) {
                      try {
                        const images = typeof room.images === 'string' ? JSON.parse(room.images) : room.images;
                        if (images && images.length > 0) return images[0];
                      } catch (e) {
                        if (typeof room.images === 'string') return room.images.split(',')[0];
                      }
                    }
                    return ROOM_IMAGES[room.name] || '/images/rooms/single.webp';
                  })()} 
                  alt={room.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
              </div>
              
              <div className="p-8 flex flex-col flex-1 space-y-6">
                <div className="space-y-4">
                  <div className="flex space-x-1">
                    {[1,2,3,4,5].map(s => <Star key={s} size={10} className="text-brand-gold fill-brand-gold" />)}
                  </div>
                  <h3 className="text-3xl font-serif text-brand-anthracite">{room.name}</h3>
                </div>

                <p className="text-brand-anthracite/60 text-sm line-clamp-3 leading-relaxed flex-1">
                  {room.description || 'Luksusowy apartament zaprojektowany z myślą o gościach ceniących ciszę, harmonię i prestiż.'}
                </p>
                
                <div className="flex items-center space-x-6 py-6 border-y border-brand-anthracite/5">
                  {AMENITIES.map((item, i) => (
                    <div key={i} className="flex items-center space-x-2 text-brand-anthracite/40 group/item">
                      <div className="text-brand-gold">{item.icon}</div>
                      <span className="text-[9px] uppercase tracking-widest font-bold">{item.text}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 space-y-6">
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <p className="text-[9px] uppercase tracking-widest text-brand-anthracite/30 font-bold">Cena za dobę</p>
                      <span className="text-4xl font-serif text-brand-burgundy">{room.basePrice} <span className="text-sm">PLN</span></span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleSelectRoom(room)}
                    className="w-full py-5 bg-brand-anthracite text-white uppercase tracking-[0.6em] text-[10px] font-bold hover:bg-brand-gold hover:text-brand-anthracite transition-all duration-500 rounded-none shadow-xl"
                  >
                    Wybieram
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCheckout = () => {
    if (!selectedRoom) return null;

    return (
    <div className="min-h-screen bg-brand-off-white pt-20 pb-24 px-6">
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start"
      >
        {/* Left Column: Summary Card */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-8 sticky top-24">
          <div className="bg-white p-10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] rounded-none border border-brand-anthracite/5 space-y-8 relative overflow-hidden group">

            
            <div className="flex justify-between items-center">
              <h4 className="text-[10px] uppercase tracking-[0.6em] text-brand-gold font-bold">Twoja Rezerwacja</h4>
              <button 
                onClick={() => updateStep('results')}
                className="text-[9px] uppercase tracking-widest text-brand-anthracite/40 hover:text-brand-gold transition-colors font-bold"
              >
                Zmień wybór
              </button>
            </div>
            
            <div className="space-y-8">
              <div className="aspect-video overflow-hidden border border-brand-anthracite/5 group-hover:scale-[1.02] transition-transform duration-1000">
                <img 
                  src={(() => {
                    if (selectedRoom.images) {
                      try {
                        const images = typeof selectedRoom.images === 'string' ? JSON.parse(selectedRoom.images) : selectedRoom.images;
                        if (images && images.length > 0) return images[0];
                      } catch (e) {
                        if (typeof selectedRoom.images === 'string') return selectedRoom.images.split(',')[0];
                      }
                    }
                    return ROOM_IMAGES[selectedRoom.name] || '/images/rooms/single.webp';
                  })()} 
                  className="w-full h-full object-cover" 
                  alt={selectedRoom.name} 
                />
              </div>
              
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.4em] text-brand-anthracite/40 font-bold mb-1">Apartament</p>
                    <p className="font-serif text-2xl text-brand-anthracite">{selectedRoom.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] uppercase tracking-[0.4em] text-brand-anthracite/40 font-bold mb-1">Cena za dobę</p>
                    <p className="font-serif text-xl text-brand-anthracite">{selectedRoom.basePrice} PLN</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-brand-anthracite/5">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.4em] text-brand-anthracite/40 font-bold mb-1">Pobyt</p>
                    <div className="space-y-1">
                      <p className="text-sm font-serif text-brand-anthracite">{searchParams.checkIn}</p>
                      <p className="text-sm font-serif text-brand-anthracite">{searchParams.checkOut}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] uppercase tracking-[0.4em] text-brand-anthracite/40 font-bold mb-1">Goście</p>
                    <p className="text-sm font-serif text-brand-anthracite">{searchParams.guests} {searchParams.guests === 1 ? 'osoba' : 'osoby'}</p>
                  </div>
                </div>
                
                <div className="pt-10 flex flex-col items-end border-t border-brand-anthracite/10">
                  <p className="text-[9px] uppercase tracking-[0.5em] text-brand-anthracite/40 font-bold mb-2">Suma Całkowita</p>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-brand-anthracite font-serif text-5xl md:text-6xl italic leading-none">{selectedRoom.basePrice}</span>
                    <span className="text-brand-gold font-bold text-[10px] tracking-[0.2em] uppercase">PLN</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Checkout Form */}
        <div className="lg:col-span-7 xl:col-span-8 bg-white p-8 md:p-16 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)] rounded-none border border-brand-anthracite/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-16 opacity-[0.02] pointer-events-none">
             <Star size={300} />
          </div>

          <div className="mb-12">
            <span className="text-[10px] uppercase tracking-[1em] text-brand-gold font-bold mb-4 block">Rezerwacja Online</span>
            <h3 className="text-4xl md:text-5xl font-serif text-brand-anthracite italic leading-tight">Dane Osobowe</h3>
            <div className="w-16 h-1 bg-brand-gold mt-6" />
          </div>

          <form onSubmit={handleFinalBooking} className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="md:col-span-2 space-y-4 group">
                <label className="text-[10px] uppercase tracking-[0.4em] text-brand-anthracite/40 font-bold group-focus-within:text-brand-gold transition-colors block">Imię i Nazwisko</label>
                <input 
                  type="text" required 
                  value={contactData.fullName}
                  onChange={(e) => setContactData({...contactData, fullName: e.target.value})}
                  className="w-full border-b border-brand-anthracite/10 py-4 outline-none focus:border-brand-gold transition-all font-serif italic text-2xl md:text-3xl bg-transparent placeholder:text-brand-anthracite/5 text-brand-anthracite" 
                  placeholder="Imię i nazwisko"
                />
              </div>
              
              <div className="space-y-4 group">
                <label className="text-[10px] uppercase tracking-[0.4em] text-brand-anthracite/40 font-bold group-focus-within:text-brand-gold transition-colors block">Adres E-mail</label>
                <input 
                  type="email" required 
                  value={contactData.email}
                  onChange={(e) => setContactData({...contactData, email: e.target.value})}
                  className="w-full border-b border-brand-anthracite/10 py-4 outline-none focus:border-brand-gold transition-all font-sans text-lg md:text-xl bg-transparent placeholder:text-brand-anthracite/5 text-brand-anthracite" 
                  placeholder="twoj@email.pl"
                />
              </div>
              
              <div className="space-y-4 group">
                <label className="text-[10px] uppercase tracking-[0.4em] text-brand-anthracite/40 font-bold group-focus-within:text-brand-gold transition-colors block">Numer Telefonu</label>
                <input 
                  type="tel" required 
                  value={contactData.phone}
                  onChange={(e) => setContactData({...contactData, phone: e.target.value})}
                  className="w-full border-b border-brand-anthracite/10 py-4 outline-none focus:border-brand-gold transition-all font-sans text-lg md:text-xl bg-transparent placeholder:text-brand-anthracite/5 text-brand-anthracite" 
                  placeholder="+48 000 000 000"
                />
              </div>
            </div>
            
            <div className="pt-12 flex flex-col items-center">
              <button 
                disabled={loading}
                className="w-full py-8 bg-brand-burgundy text-white uppercase tracking-[0.8em] text-[12px] font-bold transition-all duration-500 hover:bg-brand-anthracite flex items-center justify-center space-x-8 rounded-none shadow-xl relative overflow-hidden group/submit"
              >
                <div className="absolute inset-0 bg-white/5 translate-x-[-100%] group-hover/submit:translate-x-[100%] transition-transform duration-700" />
                {loading ? <Loader2 className="animate-spin" size={24} /> : (
                  <>
                    <span>Potwierdzam Rezerwację</span>
                    <ArrowRight size={18} className="group-hover/submit:translate-x-2 transition-transform duration-500" />
                  </>
                )}
              </button>

              <button 
                type="button"
                onClick={() => {
                  setSelectedRoom(null);
                  updateStep('search');
                }}
                className="mt-8 text-[9px] uppercase tracking-[0.5em] text-brand-anthracite/30 hover:text-brand-burgundy transition-colors font-bold"
              >
                Anuluj rezerwację
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};


  const renderSuccess = () => (
    <div className="min-h-screen bg-brand-off-white flex items-center justify-center px-6 py-12 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 pointer-events-none">
         <Star size={1000} className="absolute -top-[300px] -left-[300px] rotate-12 text-brand-gold" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="max-w-4xl w-full bg-white p-12 md:p-20 text-center shadow-[0_50px_100px_-25px_rgba(0,0,0,0.1)] rounded-none border border-white/10 relative z-10 overflow-hidden"
      >

        
        <div className="w-24 h-24 bg-brand-gold/10 rounded-none flex items-center justify-center mx-auto mb-12 shadow-[inset_0_5px_15px_rgba(212,185,150,0.1)] ring-1 ring-brand-gold/10">
           <CheckCircle size={48} className="text-brand-gold" />
        </div>
        
        <h3 className="text-5xl md:text-6xl font-serif text-brand-anthracite mb-8 italic leading-tight tracking-tight">Czekamy <br/><span className="text-brand-gold">na Ciebie</span></h3>
        <p className="text-brand-anthracite/50 font-light leading-relaxed mb-16 text-xl max-w-lg mx-auto italic">
          Twoja luksusowa przygoda w <span className="text-brand-gold font-bold">Gala</span> właśnie się zaczęła. 
          Wszystkie szczegóły rezerwacji zostały wysłane na Twój e-mail.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full py-5 bg-brand-gold text-brand-anthracite uppercase tracking-[0.5em] text-[11px] font-bold hover:bg-brand-anthracite hover:text-white transition-all duration-500 rounded-none shadow-lg group"
          >
            Strona Główna
          </button>
          <button 
            onClick={() => updateStep('search')}
            className="w-full py-5 border border-brand-anthracite/10 text-brand-anthracite uppercase tracking-[0.5em] text-[11px] font-bold hover:bg-brand-off-white transition-all duration-500 rounded-none group"
          >
            Nowa Rezerwacja
          </button>
        </div>
      </motion.div>
    </div>
  );


  return (
    <div className="min-h-screen bg-brand-off-white overflow-x-hidden selection:bg-brand-gold selection:text-white">
      <AnimatePresence mode="wait">
        {step === 'search' && <motion.div key="search" exit={{ opacity: 0, y: -100 }} transition={{ duration: 1.2 }}>{renderSearchPhase()}</motion.div>}
        {step === 'results' && <motion.div key="results" initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 1 }}>{renderRoomCards()}</motion.div>}
        {step === 'checkout' && <motion.div key="checkout" initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -100 }} transition={{ duration: 1 }}>{renderCheckout()}</motion.div>}
        {step === 'success' && <motion.div key="success" initial={{ opacity: 0, scale: 1.2 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2 }}>{renderSuccess()}</motion.div>}
      </AnimatePresence>

      {error && step !== 'search' && (
        <motion.div 
          initial={{ opacity: 0, y: 150 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-12 left-6 right-6 md:left-1/2 md:right-auto md:-translate-x-1/2 bg-white text-red-500 px-16 py-12 text-[14px] flex items-center justify-between shadow-[0_60px_120px_rgba(0,0,0,0.2)] border-l-[16px] border-red-500 z-[100] rounded-none max-w-2xl w-full"
        >
          <div className="flex items-center space-x-10">
            <div className="w-20 h-20 bg-red-50 rounded-none flex items-center justify-center text-red-500 shadow-inner ring-8 ring-red-50/50"><AlertCircle size={40} /></div>
            <div className="space-y-2">
               <p className="uppercase tracking-[0.5em] font-bold leading-none text-red-500/30 text-[10px] mb-2">System Alert</p>
               <span className="uppercase tracking-[0.3em] font-bold leading-relaxed text-red-600">{error}</span>
            </div>
          </div>
          <button onClick={() => setError('')} className="ml-12 p-5 hover:bg-red-50 rounded-none transition-all text-red-200 hover:text-red-500 font-bold active:scale-75"><X size={32} /></button>
        </motion.div>
      )}
    </div>
  );
};

export default Booking;

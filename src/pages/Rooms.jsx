import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import { API_URL } from '../config/api';


const Rooms = () => {
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const response = await fetch(`${API_URL}/room-types`);
        if (response.ok) {
          const data = await response.json();
          // Map backend data to match expected structure
          const mappedData = data.map(rt => {
            let image = '/images/rooms/single.webp'; // Default
            if (rt.images) {
              try {
                const images = typeof rt.images === 'string' ? JSON.parse(rt.images) : rt.images;
                if (images && images.length > 0) image = images[0];
              } catch (e) {
                if (typeof rt.images === 'string') image = rt.images.split(',')[0];
              }
            }
            return {
              title: rt.name,
              description: rt.description || 'Komfortowy pokój w Apartamentach Gala.',
              image: image,
              capacity: rt.capacity,
              price: rt.basePrice
            };
          });
          setRoomTypes(mappedData);
        }
      } catch (err) {
        console.error('Błąd pobierania pokoi:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomTypes();
  }, []);

  return (
    <div className="pt-32 pb-24 bg-brand-off-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-24"
        >
          <span className="text-brand-gold uppercase tracking-[0.6em] text-sm mb-4 block">Nasze Wnętrza</span>
          <h1 className="text-5xl md:text-7xl font-serif text-brand-anthracite mb-8">Pokoje i Apartamenty</h1>
          <p className="max-w-2xl mx-auto text-brand-anthracite/60 font-light text-lg">
            Oferujemy 100 miejsc noclegowych w 28 przestronnych i komfortowych pokojach.
            Każdy detal został przemyślany, aby zapewnić Państwu idealne warunki do wypoczynku.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-40">
            <div className="w-12 h-12 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {roomTypes.map((room, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="group relative overflow-hidden bg-white"
              >
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={room.image}
                    alt={room.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                </div>
                <div className="p-10">
                  <h3 className="text-2xl font-serif text-brand-anthracite mb-4 group-hover:text-brand-gold transition-colors">{room.title}</h3>
                  <p className="text-brand-anthracite/70 font-light leading-relaxed mb-6">
                    {room.description}
                  </p>
                  <div className="flex flex-wrap gap-4 pt-6 border-t border-brand-gold/10">
                    <span className="text-[10px] uppercase tracking-widest text-brand-gold bg-brand-gold/5 px-3 py-1">TV SAT</span>
                    <span className="text-[10px] uppercase tracking-widest text-brand-gold bg-brand-gold/5 px-3 py-1">WiFi</span>
                    <span className="text-[10px] uppercase tracking-widest text-brand-gold bg-brand-gold/5 px-3 py-1">Lodówka</span>
                    <span className="text-[10px] uppercase tracking-widest text-brand-gold bg-brand-gold/5 px-3 py-1">Telefon</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}


      </div>
    </div>
  );
};

export default Rooms;

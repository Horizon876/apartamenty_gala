import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Offers = () => {
  const halls = [
    {
      name: "Sala Limex",
      capacity: "do 250 osób",
      description: "Nasza najnowocześniejsza i największa sala, idealna na wielkie wesela i eventy firmowe. Nowoczesny design i doskonała akustyka.",
      image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1000"
    },
    {
      name: "Sala Bankietowo-Konferencyjna",
      capacity: "do 160 osób",
      description: "Klimatyzowana sala o eleganckim wystroju, doskonale sprawdzająca się podczas uroczystości rodzinnych i konferencji.",
      image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=1000"
    },
    {
      name: "Mała Sala Konferencyjna",
      capacity: "do 40 osób",
      description: "Intymna przestrzeń na mniejsze szkolenia, warsztaty lub kameralne spotkania rodzinne.",
      image: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&q=80&w=1000"
    },
    {
      name: "Restauracja",
      capacity: "do 90 osób",
      description: "Miejsce, gdzie serwujemy wyśmienitą kuchnię polską i europejską. Idealna na obiady weselne i komunie.",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1000"
    }
  ];

  const events = [
    "Wesela i przyjęcia weselne",
    "Komunie i chrzciny",
    "Jubileusze i urodziny",
    "Konferencje i szkolenia",
    "Imprezy firmowe i integracyjne",
    "Bankiety i gale"
  ];

  return (
    <div className="pt-32 pb-24 bg-brand-off-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-24"
        >
          <span className="text-brand-gold uppercase tracking-[0.6em] text-sm mb-4 block">Twoje Wydarzenie</span>
          <h1 className="text-5xl md:text-7xl font-serif text-brand-anthracite mb-8">Oferta Imprez i Konferencji</h1>
          <p className="max-w-2xl mx-auto text-brand-anthracite/60 font-light text-lg">
            Organizujemy niezapomniane uroczystości i profesjonalne spotkania biznesowe. 
            Nasz zespół zadba o każdy szczegół Twojego wydarzenia.
          </p>
        </motion.div>

        {/* Halls Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-32">
          {halls.map((hall, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex flex-col gap-8"
            >
              <div className="relative aspect-video overflow-hidden shadow-2xl">
                <img 
                  src={hall.image} 
                  alt={hall.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-6 left-6 bg-brand-anthracite/80 backdrop-blur-sm text-brand-off-white px-6 py-2 text-xs uppercase tracking-widest">
                  {hall.capacity}
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-serif text-brand-anthracite mb-4">{hall.name}</h3>
                <p className="text-brand-anthracite/70 font-light leading-relaxed">
                  {hall.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Featured List */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-brand-logo-beige p-12 md:p-24 relative overflow-hidden"
        >
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-serif text-brand-burgundy mb-8">Co organizujemy?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {events.map((event, index) => (
                  <div key={index} className="flex items-center gap-4 text-brand-anthracite font-medium">
                    <div className="w-2 h-2 bg-brand-burgundy rounded-full" />
                    {event}
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-brand-burgundy italic text-2xl font-serif mb-8">
                "Sprawimy, że Twoja uroczystość będzie dokładnie taka, jak ją sobie wymarzyłeś."
              </p>
              <Link 
                to="/kontakt"
                className="inline-block px-10 py-4 border border-brand-burgundy text-brand-burgundy uppercase tracking-[0.3em] text-xs transition-all duration-500 hover:bg-brand-burgundy hover:text-brand-logo-beige"
              >
                Zapytaj o termin
              </Link>
            </div>
          </div>
          {/* Decorative element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-burgundy/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        </motion.div>
      </div>
    </div>
  );
};

export default Offers;

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Send, Clock } from 'lucide-react';

const Contact = () => {
  const contactInfo = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Adres",
      details: ["Dolna 157, 32-440 Rudnik"],
      link: "https://goo.gl/maps/placeholder"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Telefon",
      details: ["+48 600 610 283",],
      link: "tel:+48600610283"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      details: ["recepcja@apartamentygala.com"],
      link: "mailto:recepcja@apartamentygala.pl"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Recepcja",
      details: ["Poniedziałek - Niedziela", "24h / dobę"],
      link: null
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission logic would go here
    alert("Dziękujemy za wiadomość! Skontaktujemy się z Państwem wkrótce.");
  };

  return (
    <div className="pt-32 pb-24 bg-brand-off-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-24"
        >
          <span className="text-brand-gold uppercase tracking-[0.6em] text-sm mb-4 block">Zapraszamy do kontaktu</span>
          <h1 className="text-5xl md:text-7xl font-serif text-brand-anthracite mb-8">Kontakt</h1>
          <p className="max-w-2xl mx-auto text-brand-anthracite/60 font-light text-lg">
            Jesteśmy do Państwa dyspozycji. Zachęcamy do kontaktu telefonicznego,
            mailowego lub poprzez poniższy formularz.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-24">
          {/* Contact Details */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-serif text-brand-anthracite mb-12">Informacje kontaktowe</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex flex-col space-y-4">
                  <div className="text-brand-gold">{info.icon}</div>
                  <h3 className="text-xl font-serif text-brand-anthracite">{info.title}</h3>
                  <div className="space-y-1">
                    {info.details.map((detail, i) => (
                      <p key={i} className="text-brand-anthracite/70 font-light">{detail}</p>
                    ))}
                  </div>

                </div>
              ))}
            </div>

            <div className="mt-16 p-8 border border-brand-gold/20 bg-white/50 backdrop-blur-sm">
              <h3 className="text-xl font-serif text-brand-anthracite mb-4">Lokalizacja</h3>
              <p className="text-brand-anthracite/70 font-light mb-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white p-10 md:p-16 shadow-xl shadow-brand-anthracite/5"
          >
            <h2 className="text-3xl font-serif text-brand-anthracite mb-12">Napisz do nas</h2>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-brand-anthracite/50 font-medium">Imię i Nazwisko</label>
                  <input
                    type="text"
                    required
                    className="border-b border-brand-gold/30 py-3 focus:border-brand-gold outline-none transition-colors font-light text-brand-anthracite"
                    placeholder="Jan Kowalski"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-brand-anthracite/50 font-medium">Adres Email</label>
                  <input
                    type="email"
                    required
                    className="border-b border-brand-gold/30 py-3 focus:border-brand-gold outline-none transition-colors font-light text-brand-anthracite"
                    placeholder="jan@example.com"
                  />
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-brand-anthracite/50 font-medium">Temat</label>
                <input
                  type="text"
                  required
                  className="border-b border-brand-gold/30 py-3 focus:border-brand-gold outline-none transition-colors font-light text-brand-anthracite"
                  placeholder="Rezerwacja, zapytanie o ofertę..."
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-brand-anthracite/50 font-medium">Wiadomość</label>
                <textarea
                  rows="5"
                  required
                  className="border-b border-brand-gold/30 py-3 focus:border-brand-gold outline-none transition-colors font-light text-brand-anthracite resize-none"
                  placeholder="Jak możemy Państwu pomóc?"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full py-5 bg-brand-anthracite text-brand-off-white flex items-center justify-center space-x-4 uppercase tracking-[0.3em] text-xs transition-all duration-500 hover:bg-brand-gold"
              >
                <span>Wyślij wiadomość</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        </div>

        {/* Map Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="h-[500px] w-full bg-brand-anthracite/5 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-brand-anthracite/10 group-hover:bg-transparent transition-colors duration-700"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-8 bg-white/90 backdrop-blur-md shadow-2xl">
              <MapPin className="w-12 h-12 text-brand-gold mx-auto mb-4" />
              <h3 className="text-2xl font-serif text-brand-anthracite mb-2">Znajdź nas na mapie</h3>
              <p className="text-brand-anthracite/60 font-light mb-6">ul. Mickiewicza 12, Rudnik nad Sanem</p>
              <button className="px-8 py-3 border border-brand-gold text-brand-gold uppercase tracking-widest text-[10px] hover:bg-brand-gold hover:text-white transition-all">
                Otwórz w Mapach Google
              </button>
            </div>
          </div>
          {/* In a real scenario, an iframe or map component would go here */}
          <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-20 grayscale"></div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;

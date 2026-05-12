import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const About = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [
    "/images/dynamiczna_galeria_poznaj/1.webp",
    "/images/dynamiczna_galeria_poznaj/2.webp",
    "/images/dynamiczna_galeria_poznaj/3.webp"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [images.length]);

  const sections = [
    {
      title: "POŁOŻENIE",
      content: "Hotel Gala położony jest w malowniczej okolicy w pobliżu drogi krajowej Kraków- Zakopane, na trasie Kraków- Sucha Beskidzka. Zaletą położenia hotelu jest również bliskość takich miast jak Kalwaria Zebrzydowska, Wadowice, Oświęcim, Wieliczka oraz Kraków."
    },
    {
      title: "POKOJE",
      content: "Do dyspozycji Gości oddajemy 100 miejsc noclegowych w 28 przestronnych, komfortowych pokojach 2, 3 i 4-osobowych z łazienkami oraz luksusowy apartament. Wszystkie pokoje wyposażone są w telefon, TV SAT, łącze internetowe, WiFi, lodówkę. Możemy poszczycić się stylowym wnętrzem, które daje poczucie relaksu jak i możliwość pracy w zaciszu."
    },
    {
      title: "USŁUGI KONFERENCYJNE",
      content: "Hotel został stworzony również z myślą o organizacji wesel, ważnych uroczystości rodzinnych, konferencji, szkoleń oraz różnego rodzaju imprez. Dostępna jest klimatyzowana sala bankietowo-konferencyjna mieszcząca 160 osób, mała sala konferencyjna na 40 osób oraz nowa sala Limex, która może pomieścić nawet do 250 osób."
    },
    {
      title: "RESTAURACJA",
      content: "Na terenie kompleksu znajduje się restauracja, która może ugościć 90 osób. W bogatym menu znajdziecie Państwo potrawy kuchni polskiej jak i europejskiej przygotowane przez naszych kucharzy. Bar hotelu oferuje szeroki wybór trunków alkoholowych, koktajli, soków oraz napoi chłodzących. Szczególnie zachęcamy do korzystania z ogrodu letniego, gdzie w ciszy i spokoju można odpocząć."
    }
  ];

  return (
    <section className="pt-16 md:pt-24 pb-12 md:pb-16 px-6 md:px-12 bg-brand-off-white overflow-hidden" id="about">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Main Text & Sections */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              <span className="text-brand-gold uppercase tracking-[0.4em] text-xs mb-4 block font-medium">O Hotelu</span>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif mb-10 md:mb-12 text-brand-anthracite leading-tight">
                Poznaj komfort <br />
                <span className="italic text-brand-gold">w sercu Małopolski</span>
              </h2>
              
              <div className="space-y-12">
                {sections.map((section, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className="border-l-[1px] border-brand-gold/30 pl-8"
                  >
                    <h3 className="text-brand-gold tracking-[0.2em] text-sm font-semibold mb-4">{section.title}</h3>
                    <p className="text-brand-anthracite leading-relaxed font-normal text-base md:text-lg">
                      {section.content}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Visual Section - Aligned with the start of the first section content */}
          <div className="lg:col-span-5 order-1 lg:order-2 lg:sticky lg:top-48 lg:pt-[190px]">
            <div className="relative">
              <div className="aspect-[4/5] overflow-hidden relative">
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={currentImageIndex}
                    src={images[currentImageIndex]} 
                    alt={`Hotel Gala Interior ${currentImageIndex + 1}`} 
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />
                </AnimatePresence>
              </div>
              <div className="absolute -top-6 -right-6 w-32 h-32 border-[1px] border-brand-gold -z-10 hidden md:block" />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-brand-gold/10 -z-10 hidden md:block" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

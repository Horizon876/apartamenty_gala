import React from 'react';
import { motion } from 'framer-motion';

const Gallery = () => {
  const images = [
    { src: '/images/galeria/115292949.webp', title: 'Komfort', size: 'large' },
    { src: '/images/galeria/126303184.webp', title: 'Design', size: 'small' },
    { src: '/images/galeria/126303188.webp', title: 'Spokój', size: 'small' },
    { src: '/images/galeria/403060119.webp', title: 'Wnętrza', size: 'medium' },
    { src: '/images/galeria/403060141.webp', title: 'Detale', size: 'medium' },
    { src: '/images/galeria/403060273.webp', title: 'Styl', size: 'small' },
    { src: '/images/galeria/403060532.webp', title: 'Odpoczynek', size: 'large' },
    { src: '/images/galeria/403073357.webp', title: 'Relaks', size: 'small' },
    { src: '/images/galeria/403073398.webp', title: 'Harmonia', size: 'medium' },
    { src: '/images/galeria/403073465.webp', title: 'Cisza', size: 'small' },
    { src: '/images/galeria/403073534.webp', title: 'Przestrzeń', size: 'medium' },
    { src: '/images/galeria/403073645.webp', title: 'Elegancja', size: 'small' },
    { src: '/images/galeria/403073791.webp', title: 'Światło', size: 'large' },
    { src: '/images/galeria/403073869.webp', title: 'Atmosfera', size: 'small' },
    { src: '/images/galeria/403073873.webp', title: 'Jakość', size: 'medium' },
    { src: '/images/galeria/1238750.webp', title: 'Natura', size: 'small' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <section id="galeria" className="pt-24 pb-32 bg-brand-off-white">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-5xl md:text-7xl font-serif text-brand-anthracite leading-tight">
              Esencja <span className="italic text-brand-gold">naszego</span> stylu
            </h2>
          </motion.div>
        </div>

        {/* Dynamic Masonry-like Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6"
        >
          {images.map((image, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              className="break-inside-avoid group relative overflow-hidden bg-brand-anthracite/5"
            >
              <img 
                src={image.src} 
                alt={image.title}
                className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-brand-anthracite/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center backdrop-blur-[2px]">
                <span className="text-brand-off-white uppercase tracking-[0.5em] text-sm font-light translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  {image.title}
                </span>
                <div className="w-12 h-[1px] bg-brand-gold mt-4 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center"></div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Gallery;


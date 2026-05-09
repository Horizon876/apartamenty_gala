import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Hero = ({ onOpenBooking }) => {
  return (
    <section id="home" className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Background with zoom effect */}
      <motion.div 
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 20, ease: "linear" }}
        className="absolute inset-0 z-0"
      >
        <img 
          src="/images/strona_glowna.png" 
          alt="Luxury Apartment Interior" 
          className="w-full h-full object-cover brightness-[0.7]"
        />
        <div className="absolute inset-0 bg-brand-anthracite/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-anthracite/80 via-transparent to-brand-anthracite/80" />
      </motion.div>

      <div className="relative z-10 text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5 }}
        >
          <span className="text-brand-gold uppercase tracking-[0.8em] text-xs md:text-sm mb-6 block font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            Luksusowe Apartamenty
          </span>
          <h1 className="text-brand-off-white text-5xl md:text-8xl lg:text-9xl font-serif font-bold mb-12 leading-tight drop-shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
            Luksus w rytmie <br />
            <span className="italic font-medium">natury</span>
          </h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="flex flex-col md:flex-row justify-center items-center gap-6"
          >
            <Link 
              to="/pokoje"
              className="px-10 py-4 bg-brand-off-white text-brand-anthracite uppercase tracking-[0.3em] text-xs transition-all duration-500 hover:bg-brand-gold hover:text-brand-off-white"
            >
              Odkryj Apartamenty
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center"
      >
        <div className="w-[1px] h-20 bg-gradient-to-b from-brand-off-white/80 to-transparent" />
      </motion.div>
    </section>
  );
};

export default Hero;

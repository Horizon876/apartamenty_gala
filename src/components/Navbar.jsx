import { useState, useEffect } from 'react';
import { Menu, X, ChevronRight, Phone, Mail, MapPin, Share2, ExternalLink } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isHeroPage = location.pathname === '/' || (location.pathname === '/rezerwacja' && (!new URLSearchParams(location.search).get('step') || new URLSearchParams(location.search).get('step') === 'search'));

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isMenuOpen]);

  const navLinks = [
    { name: 'Strona główna', path: '/' },
    { name: 'Pokoje', path: '/pokoje' },
    { name: 'Galeria', path: '/#galeria' },
    { name: 'Oferta Imprez', path: '/oferta-imprez' },
    { name: 'Kontakt', path: '/kontakt' }
  ];

  const textColorClass = isHeroPage && !isScrolled ? 'text-brand-off-white' : 'text-brand-anthracite';
  const logoColorClass = isHeroPage && !isScrolled ? 'text-brand-off-white' : 'text-brand-anthracite';

  return (
    <nav className={`fixed w-full transition-all duration-500 ${isMenuOpen ? 'z-[100]' : 'z-50'} ${isScrolled || !isHeroPage ? 'bg-brand-off-white/90 backdrop-blur-md py-4 shadow-sm' : 'bg-gradient-to-b from-brand-anthracite/70 to-transparent py-8'}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        <Link
          to="/"
          className="flex flex-col drop-shadow-sm"
          onClick={(e) => {
            if (location.pathname === '/') {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
        >
          <span className={`text-2xl font-serif tracking-[0.2em] uppercase transition-colors duration-500 ${logoColorClass}`}>Gala</span>
          <span className="text-[10px] tracking-[0.4em] uppercase -mt-1 text-brand-gold">Hotel & Restauracja</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-12">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-[10px] uppercase tracking-[0.3em] font-medium hover:text-brand-gold transition-colors duration-500 drop-shadow-sm ${textColorClass}`}
              onClick={(e) => {
                if (location.pathname === link.path) {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/rezerwacja"
            className={`px-8 py-3 border text-[10px] uppercase tracking-[0.3em] font-medium transition-all duration-500 drop-shadow-sm ${isHeroPage && !isScrolled ? 'border-brand-off-white/30 text-brand-off-white hover:bg-brand-off-white hover:text-brand-anthracite' : 'border-brand-anthracite/20 text-brand-anthracite hover:bg-brand-anthracite hover:text-brand-off-white'}`}
          >
            Zarezerwuj
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden p-2 hover:bg-brand-gold/10 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
        >
          <Menu className={`${textColorClass} w-8 h-8`} />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-brand-anthracite z-[110] lg:hidden flex flex-col shadow-2xl h-[100dvh] w-full"
          >
            {/* Mobile Menu Header */}
            <div className="flex justify-between items-center px-6 py-8 border-b border-white/5">
              <div className="flex flex-col">
                <span className="text-xl font-serif tracking-[0.2em] uppercase text-brand-off-white">Gala</span>
                <span className="text-[8px] tracking-[0.4em] uppercase text-brand-gold">Hotel & Restauracja</span>
              </div>
              <button onClick={() => setIsMenuOpen(false)} className="p-2 text-brand-off-white hover:text-brand-gold transition-colors">
                <X size={32} />
              </button>
            </div>

            {/* Mobile Menu Links */}
            <div className="flex-1 flex flex-col justify-center items-center space-y-8 p-6">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                  className="w-full text-center"
                >
                  <Link
                    to={link.path}
                    onClick={(e) => {
                      setIsMenuOpen(false);
                      if (location.pathname === link.path) {
                        e.preventDefault();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    className={`text-3xl font-serif uppercase tracking-[0.2em] hover:text-brand-gold transition-colors block py-4
                      ${location.pathname === link.path ? 'text-brand-gold' : 'text-brand-off-white'}
                    `}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + navLinks.length * 0.1 }}
                className="w-full pt-8"
              >
                <Link
                  to="/rezerwacja"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full text-center py-5 bg-brand-gold text-brand-off-white uppercase tracking-[0.3em] text-sm font-bold hover:bg-brand-anthracite transition-all border border-brand-gold"
                >
                  Zarezerwuj pobyt
                </Link>
              </motion.div>
            </div>

            {/* Mobile Menu Footer */}
            <div className="p-12 border-t border-white/5 bg-brand-anthracite/50">
              <div className="flex justify-center space-x-6 mb-8 text-brand-off-white/40">
                <a href="#" className="w-12 h-12 rounded-none border border-brand-off-white/10 flex items-center justify-center hover:bg-brand-gold hover:text-brand-anthracite transition-all">
                  <Share2 size={20} />
                </a>
                <a href="#" className="w-12 h-12 rounded-none border border-brand-off-white/10 flex items-center justify-center hover:bg-brand-gold hover:text-brand-anthracite transition-all">
                  <ExternalLink size={20} />
                </a>
              </div>
              <div className="text-center">
                <a 
                  href="tel:+48600610283" 
                  className="text-[10px] text-brand-off-white/30 hover:text-brand-gold transition-colors uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <Phone size={10} /> +48 600 610 283
                </a>
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=Apartamenty+Gala+Dolna+157+32-440+Rudnik" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[8px] text-brand-off-white/20 hover:text-brand-gold transition-colors uppercase tracking-[0.4em] mt-3 block"
                >
                  Dolna 157, 32-440 Rudnik
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

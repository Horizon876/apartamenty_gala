import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

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
    <nav className={`fixed w-full z-50 transition-all duration-500 ${isScrolled || !isHeroPage ? 'bg-brand-off-white/90 backdrop-blur-md py-4 shadow-sm' : 'bg-gradient-to-b from-brand-anthracite/70 to-transparent py-8'}`}>
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
        <div className="hidden md:flex items-center space-x-12">
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
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className={textColorClass} /> : <Menu className={textColorClass} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 bg-brand-anthracite z-40 transition-transform duration-700 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden flex flex-col justify-center items-center space-y-12`}>
        <button className="absolute top-8 right-6" onClick={() => setIsMenuOpen(false)}>
          <X className="text-brand-off-white w-8 h-8" />
        </button>
        {navLinks.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            onClick={(e) => {
              setIsMenuOpen(false);
              if (location.pathname === link.path) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="text-2xl font-serif text-brand-off-white uppercase tracking-[0.2em] hover:text-brand-gold transition-colors"
          >
            {link.name}
          </Link>
        ))}
        <Link
          to="/rezerwacja"
          onClick={() => setIsMenuOpen(false)}
          className="px-10 py-4 bg-brand-gold text-brand-off-white uppercase tracking-[0.3em] text-xs transition-all duration-500"
        >
          Zarezerwuj pobyt
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;

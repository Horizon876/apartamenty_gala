import React from 'react';
import { Globe, Share2, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Brand Section of the Footer
 * Displays the logo, a short description, and social links.
 */
const BrandSection = () => (
  <div className="md:col-span-4 space-y-8">
    <Link
      to="/"
      className="flex flex-col"
      onClick={(e) => {
        if (window.location.pathname === '/') {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }}
    >
      <span className="text-4xl font-serif tracking-[0.2em] uppercase">Gala</span>
      <span className="text-xs tracking-[0.4em] uppercase text-brand-burgundy/80">Hotel & Restauracja</span>
    </Link>
    <p className="text-brand-burgundy/80 font-normal leading-relaxed max-w-xs">
      Przykładowy opis loreum ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
    </p>
    <div className="flex space-x-6 text-brand-burgundy">
      <a href="#" className="hover:opacity-60 transition-opacity" aria-label="Website"><Globe size={20} /></a>
      <a href="#" className="hover:opacity-60 transition-opacity" aria-label="Social Media"><Share2 size={20} /></a>
    </div>
  </div>
);

/**
 * Navigation Links Section of the Footer
 * Provides quick links to main sections and pages.
 */
const QuickLinks = () => (
  <div className="md:col-span-3 space-y-8">
    <h4 className="text-brand-burgundy uppercase tracking-[0.3em] text-[10px] font-semibold">Nawigacja</h4>
    <nav className="flex flex-col space-y-4">
      <Link to="/#home" className="text-sm font-normal hover:opacity-60 transition-opacity">Strona Główna</Link>
      <Link to="/#about" className="text-sm font-normal hover:opacity-60 transition-opacity">O Hotelu</Link>
      <Link to="/pokoje" className="text-sm font-normal hover:opacity-60 transition-opacity">Pokoje</Link>
      <Link to="/#galeria" className="text-sm font-normal hover:opacity-60 transition-opacity">Galeria</Link>
      <Link to="/oferta-imprez" className="text-sm font-normal hover:opacity-60 transition-opacity">Oferta Imprez</Link>
      <Link to="/#opinie" className="text-sm font-normal hover:opacity-60 transition-opacity">Opinie</Link>
      <Link to="/kontakt" className="text-sm font-normal hover:opacity-60 transition-opacity">Kontakt</Link>
      <Link to="/recepcja" className="text-sm font-normal hover:opacity-60 transition-opacity opacity-40 hover:opacity-100">Panel Recepcji</Link>
    </nav>
  </div>
);

/**
 * Contact Information Section of the Footer
 * Displays address, phone number, and email.
 */
const ContactInfo = () => (
  <div className="md:col-span-5 space-y-8">
    <h4 className="text-brand-burgundy uppercase tracking-[0.3em] text-[10px] font-semibold">Kontakt</h4>
    <div className="space-y-6">
      <div className="flex items-start space-x-4">
        <MapPin size={18} className="text-brand-burgundy mt-1 shrink-0" />
        <div className="flex flex-col text-sm font-normal text-brand-burgundy">
          <span>Ul. Dolna 157</span>
          <span>Rudnik, Małopolska</span>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <Phone size={18} className="text-brand-burgundy shrink-0" />
        <span className="text-sm font-normal">+48 600 610 283</span>
      </div>
      <div className="flex items-center space-x-4">
        <Mail size={18} className="text-brand-burgundy shrink-0" />
        <span className="text-sm font-normal">recepcja@apartamentygala.com</span>
      </div>
    </div>
  </div>
);

/**
 * Copyright and Credits Section of the Footer
 */
const FooterCredits = () => (
  <div className="max-w-7xl mx-auto border-t border-brand-burgundy/20 mt-24 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-[0.2em] text-brand-burgundy/50">
    <span>© {new Date().getFullYear()} Hotel Gala. Wszystkie prawa zastrzeżone.</span>
    <a
      href="https://web2sell.pl/"
      target="_blank"
      rel="noopener noreferrer"
      className="mt-4 md:mt-0 hover:text-brand-burgundy transition-colors"
    >
      design by web2sell
    </a>
  </div>
);

/**
 * Main Footer Component
 * Assembles all footer sections into a single responsive grid layout.
 */
const Footer = () => {
  return (
    <footer className="bg-brand-cream text-brand-burgundy py-24 px-6 md:px-12" id="footer">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-16">
        <BrandSection />
        <QuickLinks />
        <ContactInfo />
      </div>
      <FooterCredits />
    </footer>
  );
};

export default Footer;

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import Footer from './components/Footer';
import BookingModal from './components/BookingModal';
import Home from './pages/Home';
import Rooms from './pages/Rooms';
import Offers from './pages/Offers';
import Contact from './pages/Contact';

function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <Router>
      <ScrollToTop />
      <div className="relative min-h-screen">
        <Navbar onOpenBooking={() => setIsBookingOpen(true)} />
        <Routes>
          <Route path="/" element={<Home onOpenBooking={() => setIsBookingOpen(true)} />} />
          <Route path="/pokoje" element={<Rooms />} />
          <Route path="/oferta-imprez" element={<Offers />} />
          <Route path="/kontakt" element={<Contact />} />
        </Routes>
        <Footer />
        <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
      </div>
    </Router>
  );
}

export default App;

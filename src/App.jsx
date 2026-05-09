import React, { useState, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import Footer from './components/Footer';
import BookingModal from './components/BookingModal';

const Home = React.lazy(() => import('./pages/Home'));
const Rooms = React.lazy(() => import('./pages/Rooms'));
const Offers = React.lazy(() => import('./pages/Offers'));
const Contact = React.lazy(() => import('./pages/Contact'));

// Prosty wskaźnik ładowania (fallback)
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-brand-off-white">
    <div className="w-12 h-12 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <Router>
      <ScrollToTop />
      <div className="relative min-h-screen flex flex-col">
        <Navbar onOpenBooking={() => setIsBookingOpen(true)} />
        <main className="flex-grow">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home onOpenBooking={() => setIsBookingOpen(true)} />} />
              <Route path="/pokoje" element={<Rooms />} />
              <Route path="/oferta-imprez" element={<Offers />} />
              <Route path="/kontakt" element={<Contact />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
      </div>
    </Router>
  );
}

export default App;

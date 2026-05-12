import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import Footer from './components/Footer';

const Home = React.lazy(() => import('./pages/Home'));
const Rooms = React.lazy(() => import('./pages/Rooms'));
const Offers = React.lazy(() => import('./pages/Offers'));
const Contact = React.lazy(() => import('./pages/Contact'));
const Booking = React.lazy(() => import('./pages/Booking'));
const Login = React.lazy(() => import('./pages/Login'));
const Reception = React.lazy(() => import('./pages/Reception'));

// Komponent chroniący trasy
const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem('adminUser');
  if (!user) return <Login />;
  return children;
};

// Prosty wskaźnik ładowania (fallback)
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-brand-off-white">
    <div className="w-12 h-12 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const isAdminPage = location.pathname === '/login' || location.pathname === '/recepcja';

  return (
    <div className="relative min-h-screen flex flex-col">
      {!isAdminPage && <Navbar />}
      <main className="flex-grow">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pokoje" element={<Rooms />} />
            <Route path="/oferta-imprez" element={<Offers />} />
            <Route path="/kontakt" element={<Contact />} />
            <Route path="/rezerwacja" element={<Booking />} />
            <Route path="/login" element={<Login />} />
            <Route path="/recepcja" element={<ProtectedRoute><Reception /></ProtectedRoute>} />
          </Routes>
        </Suspense>
      </main>
      {!isAdminPage && <Footer />}
    </div>
  );
}

export default App;

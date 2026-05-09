import React from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Gallery from '../components/Gallery';
import Testimonials from '../components/Testimonials';

const Home = ({ onOpenBooking }) => {
  return (
    <main>
      <Hero onOpenBooking={onOpenBooking} />
      <About />
      <Gallery />
      <Testimonials />
    </main>
  );
};

export default Home;

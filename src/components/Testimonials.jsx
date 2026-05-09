import React from 'react';
import { motion } from 'framer-motion';

const Testimonials = () => {
  const reviews = [
    {
      quote: "To miejsce to czysta poezja spokoju. Design wnętrz sprawia, że czujesz się tu wyjątkowo od pierwszej sekundy.",
      author: "Anna Kowalska",
      date: "Sierpień 2025"
    },
    {
      quote: "Widok z tarasu o zachodzie słońca jest wart każdej ceny. Wybitna dbałość o najmniejsze detale.",
      author: "Marek Nowak",
      date: "Wrzesień 2025"
    }
  ];

  return (
    <section id="opinie" className="py-32 bg-brand-gold/10">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: index * 0.3 }}
              className="flex flex-col"
            >
              <div className="text-brand-gold text-6xl font-serif mb-6 opacity-30">“</div>
              <blockquote className="text-xl md:text-2xl font-serif text-brand-anthracite mb-8 leading-relaxed italic">
                {review.quote}
              </blockquote>
              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-[0.3em] font-medium text-brand-anthracite">{review.author}</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-brand-anthracite/40 mt-1">{review.date}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

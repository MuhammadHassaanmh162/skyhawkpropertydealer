'use client';

import { useState, useEffect } from 'react';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Ahmed Raza',
    role: 'Property Buyer · Lahore',
    initials: 'AR',
    text: 'Sky Hawk helped me find the perfect plot in DHA within my budget. Very professional and transparent throughout the entire process.',
  },
  {
    name: 'Fatima Khan',
    role: 'Property Buyer · Islamabad',
    initials: 'FK',
    text: 'Excellent service. The team responded immediately on WhatsApp and arranged viewings the same day. Highly recommended!',
  },
  {
    name: 'Usman Ali',
    role: 'Property Seller · Karachi',
    initials: 'UA',
    text: 'I sold my commercial property through Sky Hawk. They handled everything professionally and got an excellent price.',
  },
  {
    name: 'Sara Malik',
    role: 'Property Buyer · Rawalpindi',
    initials: 'SM',
    text: 'Found my dream house here. Accurate listings, direct seller contact. A truly hassle-free experience from start to finish.',
  },
];

export function TestimonialsSection() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((i) => (i + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const t = testimonials[active];

  return (
    <section className="section-padding bg-warm-50 border-t border-warm-border">
      <div className="container-max max-w-3xl text-center">
        <span className="eyebrow justify-center">Reviews</span>
        <p className="text-ink-400 text-sm mb-12">Real experiences that define what working with us feels like.</p>

        {/* Quote card */}
        <div className="bg-white border border-warm-border rounded-3xl p-10 sm:p-14 shadow-card-lg relative">
          <Quote size={32} className="text-warm-300 absolute top-8 left-8" />
          <p className="text-ink text-xl sm:text-2xl font-medium leading-relaxed mb-8 italic">
            &ldquo;{t.text}&rdquo;
          </p>
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full bg-ink flex items-center justify-center text-white text-sm font-bold shrink-0">
              {t.initials}
            </div>
            <div className="text-left">
              <p className="font-semibold text-ink text-sm">{t.name}</p>
              <p className="text-ink-400 text-xs">{t.role}</p>
            </div>
          </div>
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`rounded-full transition-all duration-200 ${
                i === active ? 'w-6 h-2 bg-ink' : 'w-2 h-2 bg-ink-200 hover:bg-ink-400'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

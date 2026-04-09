'use client';

import { useRef, useEffect, useState } from 'react';

const stats = [
  { value: 300, suffix: '+', label: 'Properties Listed',  sub: 'Verified & active listings' },
  { value: 200, suffix: '+', label: 'Happy Clients',      sub: 'Successful transactions' },
  { value: 15,  suffix: '+', label: 'Cities Covered',     sub: 'Across Pakistan' },
  { value: 5,   suffix: '+', label: 'Years of Trust',     sub: 'In business since 2019' },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let current = 0;
    const steps = 40;
    const increment = value / steps;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) { setCount(value); clearInterval(timer); }
      else setCount(Math.round(current));
    }, 1200 / steps);
    return () => clearInterval(timer);
  }, [started, value]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export function StatsSection() {
  return (
    <section className="section-padding bg-warm-50 border-t border-warm-border">
      <div className="container-max">
        <div className="text-center mb-14">
          <span className="eyebrow">Track Record</span>
          <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold text-ink tracking-tight">
            Measuring the Quiet Impact
          </h2>
          <p className="text-ink-500 text-sm mt-2 max-w-md mx-auto">
            Our growth has never been about scale alone, but about meaning — every family, every deal.
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-[clamp(2.5rem,5vw,3.5rem)] font-bold text-ink leading-none mb-2 tracking-tight">
                <Counter value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="font-semibold text-ink text-sm">{stat.label}</p>
              <p className="text-ink-400 text-xs mt-1">{stat.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

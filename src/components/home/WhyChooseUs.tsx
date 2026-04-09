import { ShieldCheck, BadgeCheck, Banknote, Search, MapPin } from 'lucide-react';

const steps = [
  { icon: Search,     title: 'Search & Filter',  desc: 'Filter by city, type, and price to find exactly what you need.' },
  { icon: MapPin,     title: 'Visit & Verify',   desc: 'Contact the seller directly and arrange a visit. All listings are verified.' },
  { icon: BadgeCheck, title: 'Close the Deal',   desc: 'Negotiate transparently and close with confidence. No hidden fees.' },
];

const features = [
  { icon: ShieldCheck, title: 'Verified Listings',   text: 'Every property is checked before going live.' },
  { icon: Banknote,    title: 'Transparent Pricing', text: 'Clear prices — no hidden costs, ever.' },
  { icon: BadgeCheck,  title: '24/7 Support',        text: 'Always available on WhatsApp and phone.' },
];

export function WhyChooseUs() {
  return (
    <section className="section-padding bg-white border-t border-warm-border">
      <div className="container-max">

        {/* Heading */}
        <div className="text-center mb-16">
          <span className="eyebrow">How It Works</span>
          <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold text-ink tracking-tight">
            Simple. Transparent. Trusted.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: Steps */}
          <div className="space-y-8">
            {steps.map((s, i) => (
              <div key={s.title} className="flex items-start gap-5">
                <div className="shrink-0 flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-ink flex items-center justify-center">
                    <s.icon size={16} className="text-white" />
                  </div>
                  {i < steps.length - 1 && (
                    <div className="w-px h-10 bg-warm-border mt-2" />
                  )}
                </div>
                <div className="pt-1.5">
                  <p className="text-xs font-semibold text-ink-300 uppercase tracking-widest mb-1">0{i + 1}</p>
                  <h4 className="font-semibold text-ink text-base mb-1">{s.title}</h4>
                  <p className="text-ink-500 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Why Sky Hawk card */}
          <div className="bg-warm-50 border border-warm-border rounded-3xl p-8">
            <h3 className="font-bold text-ink text-xl mb-1">Why Sky Hawk?</h3>
            <p className="text-ink-500 text-sm mb-7">
              500+ Pakistani families have found their dream homes with us.
            </p>
            <div className="space-y-5">
              {features.map((f) => (
                <div key={f.title} className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl bg-white border border-warm-border flex items-center justify-center shrink-0 shadow-card">
                    <f.icon size={15} className="text-ink-700" />
                  </div>
                  <div>
                    <p className="font-semibold text-ink text-sm">{f.title}</p>
                    <p className="text-ink-400 text-xs mt-0.5">{f.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Mini stats */}
            <div className="grid grid-cols-2 gap-3 mt-8">
              <div className="bg-white border border-warm-border rounded-2xl p-4 text-center shadow-card">
                <p className="text-2xl font-bold text-ink">5+</p>
                <p className="text-ink-400 text-xs mt-0.5">Years in Business</p>
              </div>
              <div className="bg-white border border-warm-border rounded-2xl p-4 text-center shadow-card">
                <p className="text-2xl font-bold text-ink">15+</p>
                <p className="text-ink-400 text-xs mt-0.5">Cities Covered</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

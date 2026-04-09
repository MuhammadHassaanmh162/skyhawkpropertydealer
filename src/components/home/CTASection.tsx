import { MessageCircle, Phone, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function CTASection() {
  return (
    <section className="section-padding bg-white border-t border-warm-border">
      <div className="container-max">
        <div className="relative rounded-3xl overflow-hidden bg-ink px-8 sm:px-14 py-14 sm:py-20">
          {/* Subtle texture dots */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
            style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '28px 28px' }}
          />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
            {/* Text */}
            <div className="text-center lg:text-left max-w-xl">
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">
                Get in Touch
              </span>
              <h2 className="text-[clamp(1.75rem,4vw,3rem)] font-bold text-white leading-tight tracking-tight mb-4">
                Smart selection of<br />
                <span className="text-white/70">premium real estate</span>
              </h2>
              <p className="text-white/40 text-base">
                Tell us your budget, city, and property type — our team will find your perfect match.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col items-stretch gap-3 shrink-0 w-full sm:w-64">
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-wa text-white font-semibold text-sm hover:bg-wa-600 transition-colors"
              >
                <MessageCircle size={17} />
                Chat on WhatsApp
              </a>
              <a
                href={`tel:${process.env.NEXT_PUBLIC_CONTACT_PHONE}`}
                className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl border border-white/15 text-white text-sm font-semibold hover:bg-white/8 transition-colors"
              >
                <Phone size={17} />
                Call Us Now
              </a>
              <Link
                href="/properties"
                className="flex items-center justify-center gap-1.5 text-white/30 hover:text-white/60 text-sm transition-colors"
              >
                Browse all listings <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import Link from 'next/link';
import { Phone, Mail, MapPin, MessageCircle, Facebook, Instagram, Youtube } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-ink text-white">
      <div className="container-max px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">

          {/* Brand */}
          <div className="md:col-span-4">
            <Link href="/" className="inline-flex mb-5">
              <Logo variant="light" size="md" />
            </Link>
            <p className="text-white/40 text-sm leading-relaxed mb-6 max-w-xs">
              Pakistan&apos;s trusted property dealer — connecting buyers and sellers with integrity since 2019.
            </p>
            {/* Social */}
            <div className="flex items-center gap-2">
              {[Facebook, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#" target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all">
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div className="md:col-span-3">
            <h4 className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-5">Explore</h4>
            <ul className="space-y-3">
              {[
                { href: '/properties?type=House',       label: 'Houses' },
                { href: '/properties?type=Plot',        label: 'Plots' },
                { href: '/properties?type=Land',        label: 'Land' },
                { href: '/properties?type=Apartment',   label: 'Apartments' },
                { href: '/properties?type=Commercial',  label: 'Commercial' },
                { href: '/properties?status=For+Rent',  label: 'For Rent' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/50 text-sm hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="md:col-span-2">
            <h4 className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-5">Company</h4>
            <ul className="space-y-3">
              {[
                { href: '/',        label: 'Home' },
                { href: '/about',   label: 'About Us' },
                { href: '/contact', label: 'Contact' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/50 text-sm hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-3">
            <h4 className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-5">Contact</h4>
            <ul className="space-y-4">
              <li>
                <a href={`tel:${process.env.NEXT_PUBLIC_CONTACT_PHONE}`}
                  className="flex items-center gap-3 text-white/50 hover:text-white transition-colors text-sm">
                  <Phone size={14} />
                  {process.env.NEXT_PUBLIC_CONTACT_PHONE || '+92 300 123 4567'}
                </a>
              </li>
              <li>
                <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 text-white/50 hover:text-white transition-colors text-sm">
                  <MessageCircle size={14} />
                  WhatsApp Us
                </a>
              </li>
              <li>
                <a href="mailto:skyhawkpropertydealer@gmail.com"
                  className="flex items-center gap-3 text-white/50 hover:text-white transition-colors text-sm">
                  <Mail size={14} />
                  skyhawkpropertydealer@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-white/30 text-sm">
                <MapPin size={14} />
                Pakistan
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/25 text-sm">&copy; {year} Sky Hawk Property Dealer. All rights reserved.</p>
          <p className="text-white/20 text-xs">skyhawkpropertydealer.com</p>
        </div>
      </div>
    </footer>
  );
}

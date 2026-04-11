'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { clsx } from 'clsx';
import { Logo } from '@/components/ui/Logo';

const navLinks = [
  { href: '/',           label: 'Home' },
  { href: '/properties', label: 'Properties' },
  { href: '/about',      label: 'About' },
  { href: '/contact',    label: 'Contact' },
];

export function Navbar() {
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <>
      <header className={clsx(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-200',
        scrolled || mobileOpen
          ? 'bg-white shadow-nav border-b border-warm-border'
          : 'bg-white/90 backdrop-blur-sm'
      )}>
        <div className="container-max flex items-center justify-between h-[68px] px-4 sm:px-6 lg:px-8">

          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Logo variant="dark" size="md" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  'px-4 py-2 rounded-full text-sm transition-colors duration-150',
                  pathname === link.href
                    ? 'text-ink font-semibold'
                    : 'text-ink-500 hover:text-ink font-medium'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-2.5">
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full border border-warm-border text-ink-600 text-sm font-medium hover:border-ink-900 hover:text-ink transition-colors duration-150"
            >
              WhatsApp
            </a>
            <Link href="/properties" className="btn-dark text-sm px-5 py-2.5">
              Browse Properties
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-ink-500 hover:bg-warm transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-30 bg-black/20 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed top-[68px] left-0 right-0 z-30 bg-white border-b border-warm-border shadow-card-lg md:hidden animate-fade-in">
            <div className="px-4 py-4 space-y-0.5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    'block px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                    pathname === link.href
                      ? 'bg-warm text-ink font-semibold'
                      : 'text-ink-600 hover:bg-warm hover:text-ink'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 flex flex-col gap-2 border-t border-warm-border mt-2">
                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center py-3 rounded-xl border border-warm-border text-ink-600 text-sm font-medium"
                >
                  WhatsApp Us
                </a>
                <Link href="/properties" className="block text-center py-3 rounded-xl bg-ink text-white text-sm font-semibold">
                  Browse Properties
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

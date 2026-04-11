'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Building2, PlusCircle, Settings, LogOut, ExternalLink, X } from 'lucide-react';
import { clsx } from 'clsx';
import { signOut } from '@/lib/firebase/auth';
import { Logo } from '@/components/ui/Logo';
import toast from 'react-hot-toast';

const navItems = [
  { href: '/admin',                icon: LayoutDashboard, label: 'Dashboard'    },
  { href: '/admin/properties',     icon: Building2,       label: 'Properties'   },
  { href: '/admin/properties/new', icon: PlusCircle,      label: 'Add Property' },
  { href: '/admin/settings',       icon: Settings,        label: 'Settings'     },
];

interface AdminSidebarProps {
  isOpen:  boolean;
  onClose: () => void;
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router   = useRouter();

  async function handleSignOut() {
    try {
      await signOut();
      router.push('/admin/login');
    } catch {
      toast.error('Sign out failed');
    }
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={clsx(
          'fixed top-0 left-0 h-screen z-50 flex flex-col w-64 bg-white border-r border-warm-border',
          'transition-transform duration-300 ease-in-out',
          // Desktop: static in flex-row layout, not fixed
          'md:relative md:h-auto md:min-h-screen md:translate-x-0 md:flex md:shrink-0',
          // Mobile: slide in from left
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        {/* Logo header */}
        <div className="h-[60px] md:h-[68px] flex items-center justify-between px-5 border-b border-warm-border shrink-0">
          <Link href="/admin" onClick={onClose}>
            <Logo variant="dark" size="sm" />
          </Link>
          {/* Close button — mobile only */}
          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg text-ink-400 hover:bg-warm transition-colors"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Section label */}
        <p className="px-5 pt-5 pb-1 text-[10px] font-semibold text-ink-300 uppercase tracking-widest">
          Navigation
        </p>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-1 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                  active
                    ? 'bg-ink text-white'
                    : 'text-ink-500 hover:bg-warm hover:text-ink'
                )}
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="px-3 py-4 border-t border-warm-border space-y-0.5 shrink-0">
          <Link
            href="/"
            target="_blank"
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-ink-400 hover:bg-warm hover:text-ink transition-colors"
          >
            <ExternalLink size={16} />
            View Live Site
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-ink-400 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}

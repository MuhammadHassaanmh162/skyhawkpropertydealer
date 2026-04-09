'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Building2, PlusCircle, Settings, LogOut, ExternalLink } from 'lucide-react';
import { clsx } from 'clsx';
import { signOut } from '@/lib/firebase/auth';
import toast from 'react-hot-toast';

const navItems = [
  { href: '/admin',                icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/properties',     icon: Building2,       label: 'Properties' },
  { href: '/admin/properties/new', icon: PlusCircle,      label: 'Add Property' },
  { href: '/admin/settings',       icon: Settings,        label: 'Settings' },
];

export function AdminSidebar() {
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
    <aside className="hidden md:flex flex-col w-60 shrink-0 min-h-screen bg-white border-r border-warm-border">
      {/* Logo */}
      <div className="h-[68px] flex items-center gap-2.5 px-5 border-b border-warm-border">
        <div className="relative h-8 w-8">
          <Image src="/logo.png" alt="Sky Hawk" fill sizes="32px" className="object-contain"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        </div>
        <div className="leading-none">
          <p className="font-bold text-ink text-[13px]">Sky Hawk</p>
          <p className="text-ink-400 text-[10px] font-medium tracking-wide">Admin Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
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

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-warm-border space-y-0.5">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-ink-400 hover:bg-warm hover:text-ink transition-colors"
        >
          <ExternalLink size={16} />
          View Site
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
  );
}

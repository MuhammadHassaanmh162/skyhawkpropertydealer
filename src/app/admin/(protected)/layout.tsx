'use client';

import { type ReactNode, useState, Suspense } from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { useAdminGuard } from '@/lib/hooks/useAdminGuard';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { Logo } from '@/components/ui/Logo';
import { PageLoader } from '@/components/ui/PageLoader';
import { TopLoader } from '@/components/ui/TopLoader';
import { ToastProvider } from '@/components/ui/Toast';

export default function AdminProtectedLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAdminGuard();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-warm-50">
        <PageLoader />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-warm-50">
      <Suspense fallback={null}><TopLoader /></Suspense>
      <ToastProvider />

      {/* ── Mobile top bar ── */}
      <header className="md:hidden sticky top-0 z-30 flex items-center justify-between h-[60px] px-4 bg-white border-b border-warm-border shadow-nav">
        <Link href="/admin">
          <Logo variant="dark" size="sm" />
        </Link>
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-xl text-ink-500 hover:bg-warm transition-colors"
          aria-label="Open navigation"
        >
          <Menu size={20} />
        </button>
      </header>

      {/* ── Sidebar (desktop: static, mobile: drawer) ── */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* ── Page content ── */}
      <main className="flex-1 min-w-0 overflow-auto">
        <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

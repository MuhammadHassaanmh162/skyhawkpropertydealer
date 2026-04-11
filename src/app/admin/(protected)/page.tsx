'use client';

import Link from 'next/link';
import { PlusCircle, Building2, ExternalLink } from 'lucide-react';
import { DashboardStats } from '@/components/admin/DashboardStats';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-ink">Dashboard</h1>
          <p className="text-ink-400 text-sm mt-0.5">Welcome back to Sky Hawk Admin</p>
        </div>
        <Link
          href="/admin/properties/new"
          className="btn-dark text-sm px-4 py-2.5 self-start xs:self-auto"
        >
          <PlusCircle size={15} />
          Add Property
        </Link>
      </div>

      <DashboardStats />

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { href: '/admin/properties/new', icon: PlusCircle,  label: 'Add New Listing',    description: 'Upload a new property' },
          { href: '/admin/properties',     icon: Building2,   label: 'Manage Properties',  description: 'Edit or delete listings' },
          { href: '/',                     icon: ExternalLink, label: 'View Live Site',     description: 'See how it looks to users', external: true },
        ].map((action) => (
          <Link
            key={action.href}
            href={action.href}
            target={action.external ? '_blank' : undefined}
            className="bg-white border border-warm-border rounded-2xl p-5 flex items-start gap-4 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="w-10 h-10 rounded-xl bg-warm border border-warm-border flex items-center justify-center shrink-0">
              <action.icon size={17} className="text-ink-600" />
            </div>
            <div>
              <p className="text-ink font-semibold text-sm">{action.label}</p>
              <p className="text-ink-400 text-xs mt-0.5">{action.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

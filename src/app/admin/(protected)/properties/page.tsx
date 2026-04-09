'use client';

import { PropertiesTable } from '@/components/admin/PropertiesTable';

export default function AdminPropertiesPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-ink">Properties</h1>
        <p className="text-ink-400 text-sm mt-0.5">Manage all property listings</p>
      </div>
      <PropertiesTable />
    </div>
  );
}

'use client';

import { PropertyForm } from '@/components/admin/PropertyForm';

export default function AdminNewPropertyPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-ink">Add New Property</h1>
        <p className="text-ink-400 text-sm mt-0.5">Fill in the details to list a new property</p>
      </div>
      <PropertyForm mode="create" />
    </div>
  );
}

'use client';

import { useProperty } from '@/lib/hooks/useProperty';
import { PropertyForm } from '@/components/admin/PropertyForm';
import { Spinner } from '@/components/ui/Spinner';

export default function AdminEditPropertyPage({ params }: { params: { id: string } }) {
  const { property, loading, error } = useProperty(params.id);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="text-center py-20">
        <p className="text-red-400">Property not found or failed to load.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-ink">Edit Property</h1>
        <p className="text-ink-400 text-sm mt-0.5 truncate">{property.title}</p>
      </div>
      <PropertyForm mode="edit" property={property} />
    </div>
  );
}

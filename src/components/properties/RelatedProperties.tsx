import { PropertyCard } from './PropertyCard';
import type { Property } from '@/types/property';

interface RelatedPropertiesProps {
  properties: Property[];
}

export function RelatedProperties({ properties }: RelatedPropertiesProps) {
  if (!properties.length) return null;

  return (
    <section className="mt-16 pt-12 border-t border-gray-100">
      <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-8">Similar Properties</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property, i) => (
          <PropertyCard key={property.id} property={property} index={i} />
        ))}
      </div>
    </section>
  );
}

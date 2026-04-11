import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PropertyGrid } from '@/components/properties/PropertyGrid';
import { PropertyFilters } from '@/components/properties/PropertyFilters';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { getProperties } from '@/lib/firebase/firestore';
import type { PropertyFilters as Filters } from '@/types/filters';
import type { Property, PropertyType, PropertyStatus } from '@/types/property';
import { PropertyGridSkeleton } from '@/components/ui/Skeleton';

// ISR — revalidate every 30 s so new listings appear quickly
// without re-running a full Firestore fetch on every single request.
export const revalidate = 30;

export const metadata: Metadata = {
  title: 'Browse Properties',
  description: 'Browse all available houses, plots, and land for sale or rent across Pakistan.',
};

interface SearchParams {
  city?: string; type?: string; status?: string;
  minPrice?: string; maxPrice?: string; sort?: string; search?: string;
}

async function PropertiesContent({ searchParams }: { searchParams: SearchParams }) {
  const filters: Filters = {
    city:     searchParams.city || undefined,
    type:     (searchParams.type as PropertyType) || undefined,
    status:   (searchParams.status as PropertyStatus) || undefined,
    minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
    maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
    sort:     (searchParams.sort as Filters['sort']) || undefined,
    search:   searchParams.search || undefined,
  };

  let properties: Property[] = [];
  try { properties = await getProperties(filters); } catch {}

  return <PropertyGrid properties={properties} />;
}

export default function PropertiesPage({ searchParams }: { searchParams: SearchParams }) {
  const activeCount = Object.values(searchParams).filter(Boolean).length;

  return (
    <PageWrapper>
      {/* Page header */}
      <div className="pt-20 pb-6 px-4 sm:px-6 lg:px-8 bg-gray-50 border-b border-gray-100">
        <div className="container-max">
          <p className="text-xs font-semibold text-gold-500 uppercase tracking-widest mb-1">
            {activeCount > 0 ? `${activeCount} filter${activeCount > 1 ? 's' : ''} applied` : 'All Listings'}
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
            Browse Properties
          </h1>
        </div>
      </div>

      <div className="py-8 sm:py-10 lg:py-14 px-4 sm:px-6 lg:px-8">
        <div className="container-max">
          {/* Mobile: stacked (filter toggle on top, grid below) */}
          {/* Desktop: sidebar left + grid right */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <Suspense fallback={null}>
              <PropertyFilters />
            </Suspense>
            <div className="flex-1 min-w-0">
              <Suspense fallback={<PropertyGridSkeleton count={9} />}>
                <PropertiesContent searchParams={searchParams} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, BedDouble, Bath, Maximize2 } from 'lucide-react';
import type { Property } from '@/types/property';

const BLUR_PLACEHOLDER =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNlZGU5ZTEiLz48L3N2Zz4=';

const STATUS_STYLES: Record<string, string> = {
  'For Sale': 'bg-ink-50 text-ink-700 border border-ink-100',
  'For Rent': 'bg-warm text-ink-600 border border-warm-border',
  'Sold':     'bg-ink-100 text-ink-400 border border-ink-100',
  'Rented':   'bg-ink-100 text-ink-400 border border-ink-100',
};

interface PropertyCardProps {
  property: Property;
  index?: number;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const coverImage = property.images?.[0]?.url || '/assets/placeholder-property.jpg';

  return (
    <Link
      href={`/properties/${property.id}`}
      className="group block bg-white rounded-2xl overflow-hidden border border-warm-border shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-warm">
        <Image
          src={coverImage}
          alt={property.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
          loading="lazy"
          placeholder="blur"
          blurDataURL={BLUR_PLACEHOLDER}
        />
        {/* Status */}
        <div className="absolute top-3 left-3">
          <span className={`pill text-xs font-medium bg-white/95 backdrop-blur-sm ${STATUS_STYLES[property.status] || ''}`}>
            {property.status}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-semibold text-ink text-[15px] leading-snug mb-1.5 line-clamp-1 group-hover:text-ink-700 transition-colors">
          {property.title}
        </h3>

        <div className="flex items-center gap-1.5 text-ink-400 text-sm mb-3">
          <MapPin size={12} className="shrink-0" />
          <span className="truncate text-xs">{property.location.area}, {property.location.city}</span>
        </div>

        {/* Specs */}
        <div className="flex items-center gap-4 text-ink-400 text-xs mb-4">
          <span className="flex items-center gap-1">
            <Maximize2 size={12} />
            {property.area} {property.areaUnit}
          </span>
          {property.bedrooms != null && (
            <span className="flex items-center gap-1">
              <BedDouble size={12} />
              {property.bedrooms} Beds
            </span>
          )}
          {property.bathrooms != null && (
            <span className="flex items-center gap-1">
              <Bath size={12} />
              {property.bathrooms} Baths
            </span>
          )}
        </div>

        <div className="h-px bg-warm-border mb-4" />

        <p className="font-bold text-ink text-base tracking-tight">
          {property.priceLabel}
        </p>
      </div>
    </Link>
  );
}

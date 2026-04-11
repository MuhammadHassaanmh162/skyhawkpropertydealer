'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PropertyCard } from '@/components/properties/PropertyCard';
import type { Property } from '@/types/property';

const TABS = ['All', 'For Sale', 'For Rent'] as const;
type Tab = typeof TABS[number];

interface FeaturedPropertiesProps {
  properties: Property[];
}

export function FeaturedProperties({ properties }: FeaturedPropertiesProps) {
  const [activeTab, setActiveTab] = useState<Tab>('All');

  const filtered = activeTab === 'All'
    ? properties
    : properties.filter((p) => p.status === activeTab);

  return (
    <section className="section-padding bg-white border-t border-warm-border">
      <div className="container-max">

        {/* Heading */}
        <div className="text-center mb-6 sm:mb-10">
          <span className="eyebrow">New Listings</span>
          <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold text-ink tracking-tight">
            Featured Properties
          </h2>
          <p className="text-ink-500 text-sm mt-2">Discover homes that match your lifestyle</p>
        </div>

        {/* Toggle tabs */}
        <div className="flex items-center justify-center gap-1 mb-8">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-150 ${
                activeTab === tab
                  ? 'bg-ink text-white'
                  : 'bg-warm text-ink-500 hover:text-ink'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-ink-400 text-sm">
              {properties.length === 0
                ? 'Properties will appear here once added via the admin panel.'
                : 'No properties in this category yet.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((property, i) => (
              <PropertyCard key={property.id} property={property} index={i} />
            ))}
          </div>
        )}

        {/* View all */}
        <div className="mt-10 flex justify-center">
          <Link
            href="/properties"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink hover:text-ink-500 transition-colors"
          >
            View all properties
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}

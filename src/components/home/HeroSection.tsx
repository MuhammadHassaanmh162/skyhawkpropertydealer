'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, ChevronDown } from 'lucide-react';
import { PAKISTANI_CITIES } from '@/lib/constants/locations';
import { PROPERTY_TYPES, PROPERTY_STATUSES } from '@/lib/constants/propertyTypes';

interface HeroSectionProps {
  heroImageUrl?: string | null;
}

export function HeroSection({ heroImageUrl }: HeroSectionProps) {
  const [city,   setCity]   = useState('');
  const [type,   setType]   = useState('');
  const [status, setStatus] = useState('');
  const router = useRouter();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city)   params.set('city', city);
    if (type)   params.set('type', type);
    if (status) params.set('status', status);
    router.push(`/properties?${params.toString()}`);
  }

  return (
    <section className="bg-white pt-[68px]">
      {/* Top row: headline left, description right */}
      <div className="container-max px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-8 sm:pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 items-end">
          <h1 className="text-[clamp(2rem,6vw,4rem)] font-bold text-ink leading-[1.1] tracking-tight">
            Properties Crafted<br />for People Who Want<br />the Best
          </h1>
          <div className="lg:max-w-xs lg:ml-auto">
            <p className="text-ink-500 text-sm sm:text-base leading-relaxed">
              Sky Hawk curates verified properties across Pakistan — connecting you directly with sellers, no hidden fees.
            </p>
          </div>
        </div>
      </div>

      {/* Full-width hero image */}
      <div className="container-max px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8">
        <div className="relative w-full h-[240px] sm:h-[380px] lg:h-[520px] rounded-2xl sm:rounded-3xl overflow-hidden bg-warm">
          <Image
            src={heroImageUrl || '/assets/North-Town-Residency.jpg'}
            alt="Premium property in Pakistan"
            fill
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover"
            priority
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* Property label — bottom left */}
          <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 text-white">
            <p className="font-semibold text-xs sm:text-sm">Premium Listings</p>
            <p className="text-white/60 text-[11px] sm:text-xs mt-0.5">Verified properties across Pakistan</p>
          </div>

          {/* Stat cards — hidden on very small screens, visible sm+ */}
          <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 hidden xs:flex sm:flex gap-2 sm:gap-3">
            <div className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl px-3 sm:px-5 py-2 sm:py-3 text-center shadow-card-lg">
              <p className="text-base sm:text-xl font-bold text-ink">200+</p>
              <p className="text-ink-400 text-[10px] sm:text-xs mt-0.5">Listings</p>
            </div>
            <div className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl px-3 sm:px-5 py-2 sm:py-3 text-center shadow-card-lg">
              <p className="text-base sm:text-xl font-bold text-ink">500+</p>
              <p className="text-ink-400 text-[10px] sm:text-xs mt-0.5">Clients</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search bar */}
      <div className="container-max px-4 sm:px-6 lg:px-8 pb-10 sm:pb-14">
        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row gap-2 bg-white border border-warm-border rounded-2xl shadow-card p-2 max-w-3xl"
        >
          {/* City */}
          <div className="relative flex-1">
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full pl-4 pr-8 py-3 text-sm text-ink bg-warm-50 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-ink-900/10 appearance-none cursor-pointer"
            >
              <option value="">All Cities</option>
              {PAKISTANI_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none" />
          </div>

          {/* Type */}
          <div className="relative flex-1">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-3 text-sm text-ink bg-warm-50 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-ink-900/10 appearance-none cursor-pointer"
            >
              <option value="">Property Type</option>
              {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none" />
          </div>

          {/* Status */}
          <div className="relative sm:w-40">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-3 text-sm text-ink bg-warm-50 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-ink-900/10 appearance-none cursor-pointer"
            >
              <option value="">Sale / Rent</option>
              {PROPERTY_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none" />
          </div>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-ink text-white text-sm font-semibold hover:bg-ink-700 transition-colors whitespace-nowrap"
          >
            <Search size={15} />
            Find Properties
          </button>
        </form>

        {/* Popular searches */}
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <span className="text-ink-300 text-xs">Popular:</span>
          {['DHA Lahore', 'Bahria Town', 'Islamabad F-10', 'Karachi'].map((q) => (
            <button
              key={q}
              onClick={() => router.push(`/properties?search=${encodeURIComponent(q)}`)}
              className="px-3 py-1 rounded-full border border-warm-border text-ink-500 text-xs hover:border-ink-900 hover:text-ink transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

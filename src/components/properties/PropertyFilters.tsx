'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { PAKISTANI_CITIES } from '@/lib/constants/locations';
import { PROPERTY_TYPES, PROPERTY_STATUSES } from '@/lib/constants/propertyTypes';

const selectClass = 'w-full bg-white border border-warm-border rounded-xl px-4 py-2.5 text-ink text-sm focus:outline-none focus:ring-2 focus:ring-ink-900/10 focus:border-ink-900 transition-colors';
const labelClass = 'text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block';

export function PropertyFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [mobileOpen, setMobileOpen] = useState(false);

  const [city,     setCity]     = useState(searchParams.get('city')     || '');
  const [type,     setType]     = useState(searchParams.get('type')     || '');
  const [status,   setStatus]   = useState(searchParams.get('status')   || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sort,     setSort]     = useState(searchParams.get('sort')     || '');
  const [search,   setSearch]   = useState(searchParams.get('search')   || '');

  const hasFilters = city || type || status || minPrice || maxPrice || sort || search;

  function applyFilters() {
    const params = new URLSearchParams();
    if (city)     params.set('city', city);
    if (type)     params.set('type', type);
    if (status)   params.set('status', status);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (sort)     params.set('sort', sort);
    if (search)   params.set('search', search);
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
    setMobileOpen(false);
  }

  function clearAll() {
    setCity(''); setType(''); setStatus('');
    setMinPrice(''); setMaxPrice(''); setSort(''); setSearch('');
    startTransition(() => router.push(pathname));
  }

  const FilterContent = (
    <div className="space-y-5">
      <div>
        <label className={labelClass}>Search</label>
        <div className="relative">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Title, area, city..."
            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
            className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-gray-700 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-ink-900/10 focus:border-ink-900"
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>City</label>
        <select value={city} onChange={(e) => setCity(e.target.value)} className={selectClass}>
          <option value="">All Cities</option>
          {PAKISTANI_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div>
        <label className={labelClass}>Type</label>
        <select value={type} onChange={(e) => setType(e.target.value)} className={selectClass}>
          <option value="">All Types</option>
          {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div>
        <label className={labelClass}>Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className={selectClass}>
          <option value="">For Sale / Rent</option>
          {PROPERTY_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div>
        <label className={labelClass}>Price Range (PKR)</label>
        <div className="flex gap-2">
          <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="Min" className="w-1/2 bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-gray-700 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400/30" />
          <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Max" className="w-1/2 bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-gray-700 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400/30" />
        </div>
      </div>

      <div>
        <label className={labelClass}>Sort By</label>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className={selectClass}>
          <option value="">Newest First</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="date_asc">Oldest First</option>
        </select>
      </div>

      <button onClick={applyFilters} disabled={isPending} className="w-full py-3 rounded-xl bg-gray-900 text-white font-bold text-sm hover:bg-gray-700 transition-colors">
        {isPending ? 'Applying…' : 'Apply Filters'}
      </button>
      {hasFilters && (
        <button onClick={clearAll} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-300 text-sm transition-colors">
          <X size={13} /> Clear All
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 text-sm font-medium shadow-card"
        >
          <SlidersHorizontal size={15} />
          Filters
          {hasFilters && <span className="w-2 h-2 rounded-full bg-ink ml-1" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-white border border-gray-100 rounded-2xl shadow-card p-5 mb-6">
          {FilterContent}
        </div>
      )}

      <aside className="hidden lg:block w-60 shrink-0">
        <div className="bg-white border border-gray-100 rounded-2xl shadow-card p-5 sticky top-24">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-gray-900 text-sm">Filters</h3>
            {hasFilters && (
              <span className="px-2 py-0.5 rounded-full bg-warm text-ink-600 text-xs font-semibold">Active</span>
            )}
          </div>
          {FilterContent}
        </div>
      </aside>
    </>
  );
}

'use client';

import { useMemo } from 'react';
import { Building2, TrendingUp, Tag, Eye } from 'lucide-react';
import { useProperties } from '@/lib/hooks/useProperties';

export function DashboardStats() {
  const { properties, loading } = useProperties();

  const stats = useMemo(() => {
    const forSale   = properties.filter((p) => p.status === 'For Sale').length;
    const forRent   = properties.filter((p) => p.status === 'For Rent').length;
    const totalViews = properties.reduce((sum, p) => sum + (p.views || 0), 0);
    return [
      { icon: Building2,  label: 'Total Listings', value: properties.length },
      { icon: Tag,        label: 'For Sale',        value: forSale },
      { icon: TrendingUp, label: 'For Rent',        value: forRent },
      { icon: Eye,        label: 'Total Views',     value: totalViews },
    ];
  }, [properties]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white border border-warm-border rounded-2xl p-5 h-24 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white border border-warm-border rounded-2xl p-5 shadow-card">
          <div className="w-9 h-9 rounded-xl bg-warm border border-warm-border flex items-center justify-center mb-3">
            <stat.icon size={16} className="text-ink-600" />
          </div>
          <div className="text-2xl font-bold text-ink">{stat.value.toLocaleString()}</div>
          <div className="text-ink-400 text-sm mt-0.5">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}

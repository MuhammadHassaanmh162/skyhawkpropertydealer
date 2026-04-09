'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Pencil, Trash2, Plus, Search } from 'lucide-react';
import { format } from 'date-fns';
import { StatusBadge } from '@/components/ui/Badge';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { deleteProperty } from '@/lib/firebase/firestore';
import { deletePropertyImages } from '@/lib/firebase/storage';
import { useProperties } from '@/lib/hooks/useProperties';
import toast from 'react-hot-toast';
import { Spinner } from '@/components/ui/Spinner';

export function PropertiesTable() {
  const { properties, loading } = useProperties();
  const [search, setSearch]     = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string; storagePaths: string[] } | null>(null);

  const filtered = properties.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.location.city.toLowerCase().includes(search.toLowerCase())
  );

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(deleteTarget.id);
    try {
      await deletePropertyImages(deleteTarget.storagePaths);
      await deleteProperty(deleteTarget.id);
      toast.success('Property deleted');
    } catch {
      toast.error('Failed to delete property');
    } finally {
      setDeleting(null);
      setDeleteTarget(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search properties..."
            className="w-full bg-white border border-warm-border rounded-xl pl-9 pr-4 py-2.5 text-ink placeholder-ink-300 text-sm focus:outline-none focus:ring-2 focus:ring-ink-900/10 focus:border-ink-900 transition-all"
          />
        </div>
        <Link
          href="/admin/properties/new"
          className="btn-dark text-sm px-5 py-2.5 whitespace-nowrap"
        >
          <Plus size={15} />
          Add Property
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white border border-warm-border rounded-2xl overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-warm-border bg-warm-50">
                <th className="text-left px-4 py-3 text-ink-400 font-medium text-xs uppercase tracking-wide">Property</th>
                <th className="text-left px-4 py-3 text-ink-400 font-medium text-xs uppercase tracking-wide hidden sm:table-cell">Type</th>
                <th className="text-left px-4 py-3 text-ink-400 font-medium text-xs uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-ink-400 font-medium text-xs uppercase tracking-wide hidden md:table-cell">Price</th>
                <th className="text-left px-4 py-3 text-ink-400 font-medium text-xs uppercase tracking-wide hidden lg:table-cell">Added</th>
                <th className="text-right px-4 py-3 text-ink-400 font-medium text-xs uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-ink-300">No properties found</td>
                </tr>
              ) : (
                filtered.map((property) => (
                  <tr key={property.id} className="border-b border-warm-border last:border-0 hover:bg-warm-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-9 rounded-lg overflow-hidden bg-warm shrink-0">
                          {property.images?.[0]?.url ? (
                            <Image src={property.images[0].url} alt={property.title} fill sizes="48px" className="object-cover" />
                          ) : (
                            <div className="w-full h-full bg-warm-200" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-ink font-medium text-sm truncate max-w-[180px]">{property.title}</p>
                          <p className="text-ink-400 text-xs">{property.location.city}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-ink-500 hidden sm:table-cell text-sm">{property.type}</td>
                    <td className="px-4 py-3"><StatusBadge status={property.status} /></td>
                    <td className="px-4 py-3 text-ink font-medium text-sm hidden md:table-cell">{property.priceLabel}</td>
                    <td className="px-4 py-3 text-ink-400 text-sm hidden lg:table-cell">{format(property.createdAt, 'dd MMM yyyy')}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/properties/${property.id}/edit`}
                          className="p-1.5 rounded-lg text-ink-400 hover:text-ink hover:bg-warm transition-all"
                        >
                          <Pencil size={14} />
                        </Link>
                        <button
                          onClick={() => setDeleteTarget({
                            id: property.id,
                            title: property.title,
                            storagePaths: property.images?.map((img) => img.storagePath) || [],
                          })}
                          className="p-1.5 rounded-lg text-ink-400 hover:text-red-500 hover:bg-red-50 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDeleteModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={deleteTarget?.title || ''}
        isLoading={!!deleting}
      />
    </>
  );
}

import { clsx } from 'clsx';
import type { PropertyStatus, PropertyType } from '@/types/property';

const STATUS_STYLES: Record<PropertyStatus, string> = {
  'For Sale': 'bg-blue-50 text-blue-700 border-blue-100',
  'For Rent': 'bg-green-50 text-green-700 border-green-100',
  'Sold':     'bg-gray-100 text-gray-500 border-gray-200',
  'Rented':   'bg-purple-50 text-purple-700 border-purple-100',
};

interface BadgeProps {
  status: PropertyStatus;
  className?: string;
}

export function StatusBadge({ status, className }: BadgeProps) {
  return (
    <span className={clsx('inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border', STATUS_STYLES[status], className)}>
      {status}
    </span>
  );
}

interface TypeBadgeProps {
  type: PropertyType;
  className?: string;
}

export function TypeBadge({ type, className }: TypeBadgeProps) {
  return (
    <span className={clsx('inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-warm text-ink-600 border border-warm-border', className)}>
      {type}
    </span>
  );
}

import type { PropertyType, PropertyStatus, AreaUnit } from '@/types/property';

export const PROPERTY_TYPES: PropertyType[] = [
  'House',
  'Plot',
  'Land',
  'Apartment',
  'Commercial',
];

export const PROPERTY_STATUSES: PropertyStatus[] = [
  'For Sale',
  'For Rent',
  'Sold',
  'Rented',
];

export const AREA_UNITS: AreaUnit[] = ['Marla', 'Kanal', 'Sqft'];

export const STATUS_COLORS: Record<PropertyStatus, string> = {
  'For Sale': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'For Rent': 'bg-green-600/20 text-green-300 border-green-500/30',
  'Sold': 'bg-gray-500/20 text-gray-300 border-gray-500/30',
  'Rented': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
};

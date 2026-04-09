import type { PropertyType, PropertyStatus } from './property';

export interface PropertyFilters {
  city?: string;
  type?: PropertyType;
  status?: PropertyStatus;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'price_asc' | 'price_desc' | 'date_desc' | 'date_asc';
  search?: string;
}

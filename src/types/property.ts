export interface PropertyImage {
  url: string;
  storagePath: string;
  order: number;
}

export interface PropertyLocation {
  city: string;
  area: string;
  address: string;
  mapEmbedUrl: string | null;
}

export interface SellerContact {
  name: string;
  phone: string;
  whatsapp: string;
  email: string | null;
}

export type PropertyType = 'House' | 'Plot' | 'Land' | 'Apartment' | 'Commercial';
export type PropertyStatus = 'For Sale' | 'For Rent' | 'Sold' | 'Rented';
export type AreaUnit = 'Marla' | 'Kanal' | 'Sqft';

export interface Property {
  id: string;
  slug: string;
  title: string;
  description: string;
  type: PropertyType;
  status: PropertyStatus;
  price: number;
  priceLabel: string;
  area: number;
  areaUnit: AreaUnit;
  bedrooms: number | null;
  bathrooms: number | null;
  location: PropertyLocation;
  images: PropertyImage[];
  videoUrl: string | null;
  seller: SellerContact;
  featured: boolean;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

export type PropertyFormData = Omit<Property, 'id' | 'slug' | 'views' | 'createdAt' | 'updatedAt' | 'priceLabel'>;

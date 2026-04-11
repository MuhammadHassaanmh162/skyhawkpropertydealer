export interface AdminUser {
  uid: string;
  email: string;
  displayName: string;
  role: 'superadmin' | 'editor';
  createdAt: Date;
}

export interface SiteSettings {
  contactPhone: string;
  contactWhatsApp: string;
  contactEmail: string;
  officeAddress: string;
  facebookUrl: string | null;
  instagramUrl: string | null;
  youtubeUrl: string | null;
  heroHeadline: string;
  heroSubheadline: string;
  heroImageUrl: string | null;
  updatedAt: Date;
}

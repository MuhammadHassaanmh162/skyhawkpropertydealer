import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  increment,
  onSnapshot,
  type QueryConstraint,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from './config';
import type { Property, PropertyFormData } from '@/types/property';
import type { SiteSettings } from '@/types/admin';
import type { PropertyFilters } from '@/types/filters';
import { generateSlug } from '@/lib/utils/generateSlug';
import { formatPrice } from '@/lib/utils/formatPrice';

function docToProperty(id: string, data: Record<string, unknown>): Property {
  return {
    id,
    slug: data.slug as string,
    title: data.title as string,
    description: data.description as string,
    type: data.type as Property['type'],
    status: data.status as Property['status'],
    price: data.price as number,
    priceLabel: data.priceLabel as string,
    area: data.area as number,
    areaUnit: data.areaUnit as Property['areaUnit'],
    bedrooms: (data.bedrooms as number | null) ?? null,
    bathrooms: (data.bathrooms as number | null) ?? null,
    location: data.location as Property['location'],
    images: (data.images as Property['images']) ?? [],
    videoUrl: (data.videoUrl as string | null) ?? null,
    seller: data.seller as Property['seller'],
    featured: (data.featured as boolean) ?? false,
    views: (data.views as number) ?? 0,
    createdAt: (data.createdAt as { toDate: () => Date })?.toDate?.() ?? new Date(),
    updatedAt: (data.updatedAt as { toDate: () => Date })?.toDate?.() ?? new Date(),
  };
}

export async function getProperties(filters?: PropertyFilters): Promise<Property[]> {
  const constraints: QueryConstraint[] = [];

  if (filters?.type) constraints.push(where('type', '==', filters.type));
  if (filters?.status) constraints.push(where('status', '==', filters.status));
  if (filters?.city) constraints.push(where('location.city', '==', filters.city));

  const sortField = filters?.sort === 'price_asc' || filters?.sort === 'price_desc' ? 'price' : 'createdAt';
  const sortDir = filters?.sort === 'price_asc' || filters?.sort === 'date_asc' ? 'asc' : 'desc';
  constraints.push(orderBy(sortField, sortDir));

  const q = query(collection(db, 'properties'), ...constraints);
  const snap = await getDocs(q);

  let properties = snap.docs.map((d) => docToProperty(d.id, d.data()));

  if (filters?.search) {
    const term = filters.search.toLowerCase();
    properties = properties.filter(
      (p) =>
        p.title.toLowerCase().includes(term) ||
        p.location.city.toLowerCase().includes(term) ||
        p.location.area.toLowerCase().includes(term)
    );
  }

  if (filters?.minPrice) properties = properties.filter((p) => p.price >= filters.minPrice!);
  if (filters?.maxPrice) properties = properties.filter((p) => p.price <= filters.maxPrice!);

  return properties;
}

export async function getFeaturedProperties(count = 6): Promise<Property[]> {
  // Fetch the latest properties and filter client-side — avoids requiring
  // a Firestore composite index on (featured, createdAt) which may not exist.
  const q = query(
    collection(db, 'properties'),
    orderBy('createdAt', 'desc'),
    limit(count * 4) // over-fetch so we have enough after filtering
  );
  const snap = await getDocs(q);
  const all = snap.docs.map((d) => docToProperty(d.id, d.data()));
  const featured = all.filter((p) => p.featured);
  // Fall back to latest properties when none are marked featured yet
  return (featured.length > 0 ? featured : all).slice(0, count);
}

export async function getProperty(id: string): Promise<Property | null> {
  const docRef = doc(db, 'properties', id);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;
  return docToProperty(snap.id, snap.data());
}

export async function getRelatedProperties(currentId: string, city: string, type: string, count = 3): Promise<Property[]> {
  const q = query(
    collection(db, 'properties'),
    where('location.city', '==', city),
    orderBy('createdAt', 'desc'),
    limit(count + 1)
  );
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => docToProperty(d.id, d.data()))
    .filter((p) => p.id !== currentId)
    .slice(0, count);
}

export async function addProperty(data: PropertyFormData): Promise<string> {
  const slug = generateSlug(data.title);
  const priceLabel = formatPrice(data.price);
  const docRef = await addDoc(collection(db, 'properties'), {
    ...data,
    slug,
    priceLabel,
    views: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateProperty(id: string, data: Partial<PropertyFormData>): Promise<void> {
  const docRef = doc(db, 'properties', id);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateData: Record<string, any> = { ...data, updatedAt: serverTimestamp() };
  if (data.title) updateData.slug = generateSlug(data.title);
  if (data.price) updateData.priceLabel = formatPrice(data.price);
  await updateDoc(docRef, updateData);
}

export async function deleteProperty(id: string): Promise<void> {
  await deleteDoc(doc(db, 'properties', id));
}

export async function incrementViews(id: string): Promise<void> {
  const docRef = doc(db, 'properties', id);
  await updateDoc(docRef, { views: increment(1) });
}

export function subscribeToProperties(callback: (properties: Property[]) => void): Unsubscribe {
  const q = query(collection(db, 'properties'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => docToProperty(d.id, d.data())));
  });
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const snap = await getDoc(doc(db, 'siteSettings', 'main'));
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    ...data,
    updatedAt: data.updatedAt?.toDate?.() ?? new Date(),
  } as SiteSettings;
}

export async function updateSiteSettings(data: Partial<SiteSettings>): Promise<void> {
  await updateDoc(doc(db, 'siteSettings', 'main'), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function isAdminUser(uid: string): Promise<boolean> {
  const snap = await getDoc(doc(db, 'adminUsers', uid));
  return snap.exists();
}

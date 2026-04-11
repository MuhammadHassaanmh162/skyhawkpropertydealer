import type { PropertyImage } from '@/types/property';

/**
 * Upload a single image to Cloudinary via the server-side API route.
 * Mirrors the old Firebase uploadPropertyImage signature.
 */
export async function uploadPropertyImage(
  propertyId: string,
  file: File,
  index: number,
  onProgress?: (progress: number) => void,
): Promise<PropertyImage> {
  onProgress?.(10);

  const form = new FormData();
  form.append('file',   file);
  form.append('folder', `skyhawk/properties/${propertyId}`);

  onProgress?.(35);

  const res = await fetch('/api/cloudinary/upload', {
    method: 'POST',
    body:   form,
  });

  onProgress?.(90);

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || 'Cloudinary upload failed');
  }

  const data = await res.json() as { url: string; publicId: string };

  onProgress?.(100);

  return {
    url:      data.url,
    publicId: data.publicId,
    order:    index,
  };
}

/**
 * Upload a single video to Cloudinary via the server-side API route.
 * Returns the secure URL for storing in the property's videoUrl field.
 */
export async function uploadPropertyVideo(
  propertyId: string,
  file: File,
  onProgress?: (progress: number) => void,
): Promise<string> {
  onProgress?.(10);

  const form = new FormData();
  form.append('file',         file);
  form.append('folder',       `skyhawk/properties/${propertyId}/video`);
  form.append('resourceType', 'video');

  onProgress?.(30);

  const res = await fetch('/api/cloudinary/upload', {
    method: 'POST',
    body:   form,
  });

  onProgress?.(90);

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || 'Video upload failed');
  }

  const data = await res.json() as { url: string; publicId: string };
  onProgress?.(100);
  return data.url;
}

/**
 * Delete an array of images from Cloudinary (by their publicId).
 * Silently skips legacy Firebase images that have no publicId.
 */
export async function deletePropertyImages(images: PropertyImage[]): Promise<void> {
  const publicIds = images.map((img) => img.publicId).filter(Boolean) as string[];
  if (!publicIds.length) return;

  await fetch('/api/cloudinary/delete', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ publicIds }),
  });
}

import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  type UploadTaskSnapshot,
} from 'firebase/storage';
import { storage } from './config';
import type { PropertyImage } from '@/types/property';

export interface UploadProgress {
  progress: number;
  downloadURL?: string;
  storagePath?: string;
}

export async function uploadPropertyImage(
  propertyId: string,
  file: File,
  index: number,
  onProgress?: (progress: number) => void
): Promise<PropertyImage> {
  const timestamp = Date.now();
  const storagePath = `properties/${propertyId}/${timestamp}_${index}.webp`;
  const storageRef = ref(storage, storagePath);

  return new Promise((resolve, reject) => {
    const uploadTask = uploadBytesResumable(storageRef, file, {
      contentType: 'image/webp',
      customMetadata: { cacheControl: 'public,max-age=31536000' },
    });

    uploadTask.on(
      'state_changed',
      (snapshot: UploadTaskSnapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress?.(Math.round(progress));
      },
      (error) => reject(error),
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        resolve({ url, storagePath, order: index });
      }
    );
  });
}

export async function deleteStorageFile(storagePath: string): Promise<void> {
  try {
    const storageRef = ref(storage, storagePath);
    await deleteObject(storageRef);
  } catch {
    // File may not exist, ignore
  }
}

export async function deletePropertyImages(storagePaths: string[]): Promise<void> {
  await Promise.all(storagePaths.map(deleteStorageFile));
}

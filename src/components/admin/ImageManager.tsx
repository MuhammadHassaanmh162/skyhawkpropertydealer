'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { Upload, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { compressImage } from '@/lib/utils/imageCompression';
import { uploadPropertyImage, deleteStorageFile } from '@/lib/firebase/storage';
import type { PropertyImage } from '@/types/property';

interface ImageManagerProps {
  propertyId: string;
  images: PropertyImage[];
  onChange: (images: PropertyImage[]) => void;
}

interface UploadingFile {
  name: string;
  progress: number;
}

export function ImageManager({ propertyId, images, onChange }: ImageManagerProps) {
  const [uploading, setUploading] = useState<UploadingFile[]>([]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (images.length + acceptedFiles.length > 10) {
      toast.error('Maximum 10 images per property');
      return;
    }
    setUploading(acceptedFiles.map((f) => ({ name: f.name, progress: 0 })));
    const uploaded: PropertyImage[] = [];
    for (let i = 0; i < acceptedFiles.length; i++) {
      try {
        const compressed = await compressImage(acceptedFiles[i]);
        const result = await uploadPropertyImage(
          propertyId, compressed, images.length + i,
          (progress) => {
            setUploading((prev) => prev.map((f, idx) => (idx === i ? { ...f, progress } : f)));
          }
        );
        uploaded.push(result);
      } catch {
        toast.error(`Failed to upload ${acceptedFiles[i].name}`);
      }
    }
    onChange([...images, ...uploaded]);
    setUploading([]);
  }, [images, onChange, propertyId]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.heic'] },
    maxFiles: 10,
  });

  async function removeImage(index: number) {
    const img = images[index];
    try { await deleteStorageFile(img.storagePath); } catch { /* already deleted */ }
    onChange(images.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-4">
      {/* Existing images */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {images.map((img, i) => (
            <div key={img.storagePath} className="relative aspect-square rounded-xl overflow-hidden group bg-warm border border-warm-border">
              <Image src={img.url} alt={`Image ${i + 1}`} fill sizes="120px" className="object-cover" />
              {i === 0 && (
                <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-xs bg-ink text-white font-medium">
                  Cover
                </div>
              )}
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-white/90 border border-warm-border flex items-center justify-center text-ink-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-500"
              >
                <X size={11} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload zone */}
      {images.length < 10 && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
            isDragActive
              ? 'border-ink-900 bg-warm'
              : 'border-warm-border hover:border-ink-300 hover:bg-warm-50'
          }`}
        >
          <input {...getInputProps()} />
          <Upload size={22} className="mx-auto mb-3 text-ink-300" />
          <p className="text-ink-500 text-sm">
            {isDragActive ? 'Drop images here…' : 'Drag & drop or click to select images'}
          </p>
          <p className="text-ink-300 text-xs mt-1">JPG, PNG, WebP — Auto-compressed — Max 10 images</p>
        </div>
      )}

      {/* Upload progress */}
      {uploading.length > 0 && (
        <div className="space-y-2">
          {uploading.map((f) => (
            <div key={f.name} className="bg-white border border-warm-border rounded-xl p-3">
              <div className="flex items-center gap-3 mb-2">
                <Loader2 size={13} className="animate-spin text-ink-500" />
                <span className="text-ink-500 text-xs truncate flex-1">{f.name}</span>
                <span className="text-ink text-xs font-medium">{f.progress}%</span>
              </div>
              <div className="h-1 bg-warm-200 rounded-full overflow-hidden">
                <div className="h-full bg-ink transition-all duration-300 rounded-full" style={{ width: `${f.progress}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

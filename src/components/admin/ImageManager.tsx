'use client';

import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { Upload, X, Loader2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadPropertyImage, deletePropertyImages } from '@/lib/cloudinary';
import { ImagePreviewModal } from '@/components/ui/ImagePreviewModal';
import type { PropertyImage } from '@/types/property';

interface ImageManagerProps {
  propertyId: string;
  images:     PropertyImage[];
  onChange:   (images: PropertyImage[]) => void;
}

interface UploadingFile {
  name:     string;
  progress: number;
  preview:  string; // local object URL for instant preview
}

export function ImageManager({ propertyId, images, onChange }: ImageManagerProps) {
  const [uploading,   setUploading]   = useState<UploadingFile[]>([]);
  const [previewSrc,  setPreviewSrc]  = useState<string | null>(null);

  // Revoke object URLs on unmount to avoid memory leaks
  useEffect(() => {
    return () => {
      uploading.forEach((f) => URL.revokeObjectURL(f.preview));
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (images.length + acceptedFiles.length > 10) {
      toast.error('Maximum 10 images per property');
      return;
    }

    const previews = acceptedFiles.map((f) => ({
      name:     f.name,
      progress: 0,
      preview:  URL.createObjectURL(f),
    }));
    setUploading(previews);

    const uploaded: PropertyImage[] = [];

    for (let i = 0; i < acceptedFiles.length; i++) {
      try {
        const result = await uploadPropertyImage(
          propertyId,
          acceptedFiles[i],
          images.length + i,
          (progress) => {
            setUploading((prev) =>
              prev.map((f, idx) => (idx === i ? { ...f, progress } : f))
            );
          }
        );
        uploaded.push(result);
      } catch {
        toast.error(`Failed to upload ${acceptedFiles[i].name}`);
      }
    }

    // Revoke all preview object URLs now that upload is done
    previews.forEach((f) => URL.revokeObjectURL(f.preview));
    onChange([...images, ...uploaded]);
    setUploading([]);
  }, [images, onChange, propertyId]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept:   { 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.heic'] },
    maxFiles: 10,
  });

  async function removeImage(index: number) {
    const img = images[index];
    // Delete from Cloudinary (fire-and-forget — UI updates immediately)
    deletePropertyImages([img]).catch(() => null);
    onChange(images.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-4">
      <ImagePreviewModal src={previewSrc} onClose={() => setPreviewSrc(null)} />
      {/* Existing images */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {images.map((img, i) => (
            <div
              key={img.publicId ?? img.storagePath ?? img.url}
              className="relative aspect-square rounded-xl overflow-hidden group bg-warm border border-warm-border"
            >
              <Image
                src={img.url}
                alt={`Image ${i + 1}`}
                fill
                sizes="120px"
                className="object-cover"
              />
              {i === 0 && (
                <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-xs bg-ink text-white font-medium">
                  Cover
                </div>
              )}
              {/* Preview button — always visible on touch, hover-reveal on desktop */}
              <button
                type="button"
                onClick={() => setPreviewSrc(img.url)}
                className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors"
                aria-label="Preview image"
              >
                <Eye size={18} className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow" />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-white/90 border border-warm-border flex items-center justify-center text-ink-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-500 z-10"
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
          <p className="text-ink-300 text-xs mt-1">
            JPG, PNG, WebP · Auto-optimised by Cloudinary · Max 10 images
          </p>
        </div>
      )}

      {/* Per-file upload progress with instant preview */}
      {uploading.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {uploading.map((f) => (
            <div
              key={f.name}
              className="relative aspect-square rounded-xl overflow-hidden bg-warm border border-warm-border"
            >
              {/* Local preview thumbnail */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={f.preview}
                alt={f.name}
                className="w-full h-full object-cover"
              />
              {/* Dark overlay with progress */}
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-1.5 px-2">
                <Loader2 size={16} className="animate-spin text-white" />
                <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white transition-all duration-300 rounded-full"
                    style={{ width: `${f.progress}%` }}
                  />
                </div>
                <span className="text-white text-[10px] font-medium">{f.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

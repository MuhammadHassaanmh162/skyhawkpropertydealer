'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { Upload, Loader2, X, Plus, Eye } from 'lucide-react';
import { getSiteSettings, updateSiteSettings } from '@/lib/firebase/firestore';
import { uploadPropertyImage } from '@/lib/cloudinary';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { ImagePreviewModal } from '@/components/ui/ImagePreviewModal';

const schema = z.object({
  contactPhone:    z.string(),
  contactWhatsApp: z.string(),
  contactEmail:    z.string().email().optional().or(z.literal('')),
  officeAddress:   z.string().optional().default(''),
  facebookUrl:     z.string().url().optional().nullable().or(z.literal('')),
  instagramUrl:    z.string().url().optional().nullable().or(z.literal('')),
  youtubeUrl:      z.string().url().optional().nullable().or(z.literal('')),
  heroHeadline:    z.string().optional().default(''),
  heroSubheadline: z.string().optional().default(''),
});

type FormValues = z.infer<typeof schema>;

interface HeroUpload {
  id:       string;
  preview:  string; // blob URL for instant preview
  progress: number;
}

const MAX_HERO_IMAGES = 8;

export default function AdminSettingsPage() {
  const [loading,      setLoading]      = useState(true);
  const [saving,       setSaving]       = useState(false);
  const [heroImages,   setHeroImages]   = useState<string[]>([]);
  const [heroUploads,  setHeroUploads]  = useState<HeroUpload[]>([]);
  const [previewSrc,   setPreviewSrc]   = useState<string | null>(null);
  const heroInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    getSiteSettings()
      .then((settings) => {
        if (settings) {
          reset(settings as FormValues);
          setHeroImages(settings.heroImages ?? []);
        }
      })
      .catch(() => toast.error('Failed to load settings'))
      .finally(() => setLoading(false));
  }, [reset]);

  async function handleHeroFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const remaining = MAX_HERO_IMAGES - heroImages.length - heroUploads.length;
    if (remaining <= 0) {
      toast.error(`Maximum ${MAX_HERO_IMAGES} hero images`);
      if (heroInputRef.current) heroInputRef.current.value = '';
      return;
    }
    const batch = files.slice(0, remaining);

    // Create upload tracking entries with blob previews
    const entries: HeroUpload[] = batch.map((f) => ({
      id:       `${Date.now()}_${f.name}`,
      preview:  URL.createObjectURL(f),
      progress: 0,
    }));
    setHeroUploads((prev) => [...prev, ...entries]);

    const uploaded: string[] = [];

    for (let i = 0; i < batch.length; i++) {
      const entry = entries[i];
      try {
        const result = await uploadPropertyImage(
          'site-settings',
          batch[i],
          heroImages.length + i,
          (progress) => {
            setHeroUploads((prev) =>
              prev.map((u) => (u.id === entry.id ? { ...u, progress } : u))
            );
          }
        );
        uploaded.push(result.url);
      } catch {
        toast.error(`Failed to upload ${batch[i].name}`);
      } finally {
        URL.revokeObjectURL(entry.preview);
        setHeroUploads((prev) => prev.filter((u) => u.id !== entry.id));
      }
    }

    if (uploaded.length > 0) {
      // Use functional update to merge with the most current state
      setHeroImages((prev) => {
        const next = [...prev, ...uploaded];
        // Persist immediately — fire and forget error handling via toast
        updateSiteSettings({ heroImages: next }).catch(() =>
          toast.error('Failed to save hero images')
        );
        return next;
      });
      toast.success(uploaded.length === 1 ? 'Image added' : `${uploaded.length} images added`);
    }

    if (heroInputRef.current) heroInputRef.current.value = '';
  }

  async function removeHeroImage(index: number) {
    const next = heroImages.filter((_, i) => i !== index);
    setHeroImages(next);
    try {
      await updateSiteSettings({ heroImages: next });
      toast.success('Image removed');
    } catch {
      toast.error('Failed to remove image');
    }
  }

  async function onSubmit(data: FormValues) {
    setSaving(true);
    try {
      await updateSiteSettings({ ...data });
      toast.success('Settings saved!');
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  }

  const canAddMore = heroImages.length + heroUploads.length < MAX_HERO_IMAGES;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-ink">Site Settings</h1>
        <p className="text-ink-400 text-sm mt-0.5">Update contact details and site configuration</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* ── Hero Images (Slider) ── */}
        <section className="bg-white border border-warm-border rounded-2xl shadow-card p-6 space-y-4">
          <div>
            <h2 className="font-semibold text-ink text-base">Hero Slider Images</h2>
            <p className="text-ink-400 text-xs mt-0.5">
              Upload up to {MAX_HERO_IMAGES} images — they rotate as a slider on the home page. First image is shown first.
            </p>
          </div>

          {/* Image grid */}
          {(heroImages.length > 0 || heroUploads.length > 0) && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">

              {/* Saved images */}
              {heroImages.map((url, i) => (
                <div key={url} className="relative group">
                  {/* Delete badge — outside overflow-hidden */}
                  <button
                    type="button"
                    onClick={() => removeHeroImage(i)}
                    className={[
                      'absolute -top-2 -right-2 z-30',
                      'w-6 h-6 rounded-full shadow-md',
                      'flex items-center justify-center',
                      'bg-white border border-red-300 text-red-500',
                      'hover:bg-red-500 hover:text-white hover:border-red-500',
                      'transition-colors',
                    ].join(' ')}
                    title="Remove image"
                  >
                    <X size={12} />
                  </button>

                  {/* Cover label on first image */}
                  {i === 0 && (
                    <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[10px] bg-ink text-white font-medium z-10 pointer-events-none">
                      First
                    </div>
                  )}

                  {/* Image box */}
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-warm border border-warm-border">
                    <Image
                      src={url}
                      alt={`Hero image ${i + 1}`}
                      fill
                      sizes="160px"
                      className="object-cover"
                    />
                    {/* Hover: preview */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => setPreviewSrc(url)}
                        className="w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-ink shadow transition-colors"
                        title="Preview"
                      >
                        <Eye size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* In-progress uploads */}
              {heroUploads.map((u) => (
                <div
                  key={u.id}
                  className="relative aspect-square rounded-xl overflow-hidden bg-warm border border-warm-border"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={u.preview} alt="Uploading…" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center gap-1.5 px-2">
                    <Loader2 size={16} className="animate-spin text-white" />
                    <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white transition-all duration-300 rounded-full"
                        style={{ width: `${u.progress}%` }}
                      />
                    </div>
                    <span className="text-white text-[10px] font-medium">{u.progress}%</span>
                  </div>
                </div>
              ))}

              {/* Add more button */}
              {canAddMore && (
                <button
                  type="button"
                  onClick={() => heroInputRef.current?.click()}
                  className="aspect-square rounded-xl border-2 border-dashed border-warm-border hover:border-ink-300 hover:bg-warm-50 transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus size={20} className="text-ink-300" />
                  <span className="text-ink-300 text-[11px]">Add</span>
                </button>
              )}
            </div>
          )}

          {/* Empty state dropzone */}
          {heroImages.length === 0 && heroUploads.length === 0 && (
            <button
              type="button"
              onClick={() => heroInputRef.current?.click()}
              className="w-full aspect-[16/7] rounded-xl border-2 border-dashed border-warm-border hover:border-ink-300 hover:bg-warm-50 transition-all flex flex-col items-center justify-center gap-3 cursor-pointer"
            >
              <Upload size={24} className="text-ink-300" />
              <div className="text-center">
                <p className="text-ink-500 text-sm font-medium">Click to upload hero images</p>
                <p className="text-ink-300 text-xs mt-0.5">JPG, PNG, WebP · Up to {MAX_HERO_IMAGES} images · Recommended 1400 × 600 px</p>
              </div>
            </button>
          )}

          <input
            ref={heroInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleHeroFilesChange}
          />
        </section>

        {/* ── Hero Text ── */}
        <section className="bg-white border border-warm-border rounded-2xl shadow-card p-6 space-y-4">
          <h2 className="font-semibold text-ink text-base mb-2">Hero Section Text</h2>
          <Input label="Hero Headline"     {...register('heroHeadline')}    placeholder="Find Your Dream Property in Pakistan" />
          <Input label="Hero Sub-headline" {...register('heroSubheadline')} placeholder="Trusted property dealer..." />
        </section>

        {/* ── Contact Details ── */}
        <section className="bg-white border border-warm-border rounded-2xl shadow-card p-6 space-y-4">
          <h2 className="font-semibold text-ink text-base mb-2">Contact Details</h2>
          <Input label="Phone Number"    {...register('contactPhone')}    placeholder="+923001234567" />
          <Input label="WhatsApp Number" {...register('contactWhatsApp')} placeholder="923001234567 (no + sign)" />
          <Input label="Email Address"   {...register('contactEmail')}    placeholder="skyhawkpropertydealer@gmail.com" />
          <Input label="Office Address"  {...register('officeAddress')}   placeholder="Pakistan" />
        </section>

        {/* ── Social Media ── */}
        <section className="bg-white border border-warm-border rounded-2xl shadow-card p-6 space-y-4">
          <h2 className="font-semibold text-ink text-base mb-2">Social Media</h2>
          <Input label="Facebook URL"  {...register('facebookUrl')}  placeholder="https://facebook.com/..." />
          <Input label="Instagram URL" {...register('instagramUrl')} placeholder="https://instagram.com/..." />
          <Input label="YouTube URL"   {...register('youtubeUrl')}   placeholder="https://youtube.com/..." />
        </section>

        <div className="flex justify-end">
          <Button type="submit" isLoading={saving} size="lg">Save Settings</Button>
        </div>
      </form>

      <ImagePreviewModal src={previewSrc} alt="Hero image" onClose={() => setPreviewSrc(null)} />
    </div>
  );
}

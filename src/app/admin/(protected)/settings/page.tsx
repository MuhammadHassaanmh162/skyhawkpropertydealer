'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { Upload, Loader2, Eye, X } from 'lucide-react';
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

export default function AdminSettingsPage() {
  const [loading,        setLoading]        = useState(true);
  const [saving,         setSaving]          = useState(false);
  const [heroImageUrl,   setHeroImageUrl]    = useState<string | null>(null);
  const [heroUploading,  setHeroUploading]   = useState(false);
  const [heroProgress,   setHeroProgress]    = useState(0);
  const [previewSrc,     setPreviewSrc]      = useState<string | null>(null);
  const heroInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    getSiteSettings()
      .then((settings) => {
        if (settings) {
          reset(settings as FormValues);
          setHeroImageUrl(settings.heroImageUrl ?? null);
        }
      })
      .catch(() => toast.error('Failed to load settings'))
      .finally(() => setLoading(false));
  }, [reset]);

  async function handleHeroImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setHeroUploading(true);
    setHeroProgress(0);
    try {
      const result = await uploadPropertyImage('site-settings', file, 0, setHeroProgress);
      setHeroImageUrl(result.url);
      // Persist immediately so HeroSection picks it up on next page load
      await updateSiteSettings({ heroImageUrl: result.url });
      toast.success('Hero image updated');
    } catch {
      toast.error('Failed to upload image');
    } finally {
      setHeroUploading(false);
      if (heroInputRef.current) heroInputRef.current.value = '';
    }
  }

  async function removeHeroImage() {
    setHeroImageUrl(null);
    await updateSiteSettings({ heroImageUrl: null });
    toast.success('Hero image removed');
  }

  async function onSubmit(data: FormValues) {
    setSaving(true);
    try {
      await updateSiteSettings({ ...data, heroImageUrl });
      toast.success('Settings saved!');
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  }

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

        {/* ── Hero Image ── */}
        <section className="bg-white border border-warm-border rounded-2xl shadow-card p-6 space-y-4">
          <div>
            <h2 className="font-semibold text-ink text-base">Hero Section Image</h2>
            <p className="text-ink-400 text-xs mt-0.5">
              The full-width banner image shown on the home page ("Premium Property in Pakistan").
            </p>
          </div>

          {heroImageUrl ? (
            <div className="relative w-full aspect-[16/7] rounded-xl overflow-hidden bg-warm border border-warm-border group">
              <Image
                src={heroImageUrl}
                alt="Hero image preview"
                fill
                sizes="(max-width: 768px) 100vw, 672px"
                className="object-cover"
              />
              {/* Hover controls */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => setPreviewSrc(heroImageUrl)}
                  className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-ink hover:bg-white transition-colors shadow"
                  title="Preview"
                >
                  <Eye size={17} />
                </button>
                <button
                  type="button"
                  onClick={() => heroInputRef.current?.click()}
                  className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-ink hover:bg-white transition-colors shadow"
                  title="Replace image"
                >
                  <Upload size={17} />
                </button>
                <button
                  type="button"
                  onClick={removeHeroImage}
                  className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors shadow"
                  title="Remove image"
                >
                  <X size={17} />
                </button>
              </div>
            </div>
          ) : heroUploading ? (
            <div className="w-full aspect-[16/7] rounded-xl bg-warm border border-warm-border flex flex-col items-center justify-center gap-3">
              <Loader2 size={22} className="animate-spin text-ink-400" />
              <div className="w-40 h-1.5 bg-warm-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-ink rounded-full transition-all duration-300"
                  style={{ width: `${heroProgress}%` }}
                />
              </div>
              <span className="text-ink-400 text-xs">{heroProgress}%</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => heroInputRef.current?.click()}
              className="w-full aspect-[16/7] rounded-xl border-2 border-dashed border-warm-border hover:border-ink-300 hover:bg-warm-50 transition-all flex flex-col items-center justify-center gap-3 cursor-pointer"
            >
              <Upload size={24} className="text-ink-300" />
              <div className="text-center">
                <p className="text-ink-500 text-sm font-medium">Click to upload hero image</p>
                <p className="text-ink-300 text-xs mt-0.5">JPG, PNG, WebP · Recommended 1400 × 600 px</p>
              </div>
            </button>
          )}

          <input
            ref={heroInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleHeroImageChange}
          />
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

        {/* ── Hero Text ── */}
        <section className="bg-white border border-warm-border rounded-2xl shadow-card p-6 space-y-4">
          <h2 className="font-semibold text-ink text-base mb-2">Hero Section Text</h2>
          <Input label="Hero Headline"     {...register('heroHeadline')}    placeholder="Find Your Dream Property in Pakistan" />
          <Input label="Hero Sub-headline" {...register('heroSubheadline')} placeholder="Trusted property dealer..." />
        </section>

        <div className="flex justify-end">
          <Button type="submit" isLoading={saving} size="lg">Save Settings</Button>
        </div>
      </form>

      {/* Full-screen preview modal */}
      <ImagePreviewModal src={previewSrc} alt="Hero image" onClose={() => setPreviewSrc(null)} />
    </div>
  );
}

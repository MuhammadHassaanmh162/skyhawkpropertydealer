'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { getSiteSettings, updateSiteSettings } from '@/lib/firebase/firestore';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';

const schema = z.object({
  contactPhone: z.string(),
  contactWhatsApp: z.string(),
  contactEmail: z.string().email().optional().or(z.literal('')),
  officeAddress: z.string().optional().default(''),
  facebookUrl: z.string().url().optional().nullable().or(z.literal('')),
  instagramUrl: z.string().url().optional().nullable().or(z.literal('')),
  youtubeUrl: z.string().url().optional().nullable().or(z.literal('')),
  heroHeadline: z.string().optional().default(''),
  heroSubheadline: z.string().optional().default(''),
});

type FormValues = z.infer<typeof schema>;

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    getSiteSettings()
      .then((settings) => {
        if (settings) reset(settings as FormValues);
      })
      .catch(() => toast.error('Failed to load settings'))
      .finally(() => setLoading(false));
  }, [reset]);

  async function onSubmit(data: FormValues) {
    setSaving(true);
    try {
      await updateSiteSettings(data);
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
        <section className="bg-white border border-warm-border rounded-2xl shadow-card p-6 space-y-4">
          <h2 className="font-semibold text-ink text-base mb-2">Contact Details</h2>
          <Input label="Phone Number" {...register('contactPhone')} placeholder="+923001234567" />
          <Input label="WhatsApp Number" {...register('contactWhatsApp')} placeholder="923001234567 (no + sign)" />
          <Input label="Email Address" {...register('contactEmail')} placeholder="skyhawkpropertydealer@gmail.com" />
          <Input label="Office Address" {...register('officeAddress')} placeholder="Pakistan" />
        </section>

        <section className="bg-white border border-warm-border rounded-2xl shadow-card p-6 space-y-4">
          <h2 className="font-semibold text-ink text-base mb-2">Social Media</h2>
          <Input label="Facebook URL" {...register('facebookUrl')} placeholder="https://facebook.com/..." />
          <Input label="Instagram URL" {...register('instagramUrl')} placeholder="https://instagram.com/..." />
          <Input label="YouTube URL" {...register('youtubeUrl')} placeholder="https://youtube.com/..." />
        </section>

        <section className="bg-white border border-warm-border rounded-2xl shadow-card p-6 space-y-4">
          <h2 className="font-semibold text-ink text-base mb-2">Hero Section</h2>
          <Input label="Hero Headline" {...register('heroHeadline')} placeholder="Find Your Dream Property in Pakistan" />
          <Input label="Hero Sub-headline" {...register('heroSubheadline')} placeholder="Trusted property dealer..." />
        </section>

        <div className="flex justify-end">
          <Button type="submit" isLoading={saving} size="lg">Save Settings</Button>
        </div>
      </form>
    </div>
  );
}

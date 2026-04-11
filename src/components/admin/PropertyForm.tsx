'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Upload, X, Loader2, Video, Youtube } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { ImageManager } from './ImageManager';
import { addProperty, updateProperty } from '@/lib/firebase/firestore';
import { uploadPropertyVideo } from '@/lib/cloudinary';
import { PROPERTY_TYPES, PROPERTY_STATUSES, AREA_UNITS } from '@/lib/constants/propertyTypes';
import { PAKISTANI_CITIES } from '@/lib/constants/locations';
import type { Property } from '@/types/property';
import type { PropertyImage } from '@/types/property';

const schema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  type: z.enum(['House', 'Plot', 'Land', 'Apartment', 'Commercial']),
  status: z.enum(['For Sale', 'For Rent', 'Sold', 'Rented']),
  price: z.coerce.number().min(1, 'Price is required'),
  area: z.coerce.number().min(1, 'Area is required'),
  areaUnit: z.enum(['Marla', 'Kanal', 'Sqft']),
  bedrooms: z.coerce.number().nullable().optional(),
  bathrooms: z.coerce.number().nullable().optional(),
  location: z.object({
    city: z.string().min(1, 'City is required'),
    area: z.string().min(1, 'Area/Sector is required'),
    address: z.string().optional().default(''),
    mapEmbedUrl: z.string().optional().nullable().default(null),
  }),
  videoUrl: z.string().url('Must be a valid URL').optional().nullable().or(z.literal('')),
  seller: z.object({
    name: z.string().min(2, 'Seller name required'),
    phone: z.string().min(10, 'Valid phone required'),
    whatsapp: z.string().min(10, 'Valid WhatsApp number required'),
    email: z.string().email().optional().nullable().or(z.literal('')),
  }),
  featured: z.boolean().default(false),
});

type FormValues = z.infer<typeof schema>;

interface PropertyFormProps {
  mode: 'create' | 'edit';
  property?: Property;
}

export function PropertyForm({ mode, property }: PropertyFormProps) {
  const router = useRouter();
  const tempId = property?.id || `temp_${Date.now()}`;
  const [images, setImages] = useState<PropertyImage[]>(property?.images || []);
  const [submitting, setSubmitting] = useState(false);

  // Video upload state
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [videoMode, setVideoMode] = useState<'url' | 'upload'>(
    property?.videoUrl?.includes('res.cloudinary.com') ? 'upload' : 'url'
  );
  const [videoUploading, setVideoUploading] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string>(
    property?.videoUrl?.includes('res.cloudinary.com') ? (property.videoUrl ?? '') : ''
  );

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: property
      ? {
          title: property.title,
          description: property.description,
          type: property.type,
          status: property.status,
          price: property.price,
          area: property.area,
          areaUnit: property.areaUnit,
          bedrooms: property.bedrooms ?? undefined,
          bathrooms: property.bathrooms ?? undefined,
          location: property.location,
          videoUrl: property.videoUrl ?? '',
          seller: property.seller,
          featured: property.featured,
        }
      : {
          type: 'House',
          status: 'For Sale',
          areaUnit: 'Marla',
          featured: false,
          location: { city: '', area: '', address: '', mapEmbedUrl: null },
          seller: { name: '', phone: '', whatsapp: '', email: '' },
        },
  });

  async function handleVideoFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 100 * 1024 * 1024) {
      toast.error('Video must be under 100 MB');
      return;
    }
    setVideoUploading(true);
    setVideoProgress(0);
    try {
      const url = await uploadPropertyVideo(tempId, file, setVideoProgress);
      setUploadedVideoUrl(url);
      // Sync with react-hook-form's videoUrl field
      setValue('videoUrl', url);
      toast.success('Video uploaded');
    } catch {
      toast.error('Video upload failed');
    } finally {
      setVideoUploading(false);
    }
  }

  async function onSubmit(data: FormValues) {
    setSubmitting(true);
    try {
      const payload = {
        ...data,
        images,
        videoUrl: data.videoUrl || null,
        bedrooms: data.bedrooms ?? null,
        bathrooms: data.bathrooms ?? null,
        location: {
          ...data.location,
          mapEmbedUrl: data.location.mapEmbedUrl ?? null,
        },
        seller: {
          ...data.seller,
          email: data.seller.email || null,
        },
      };

      if (mode === 'create') {
        await addProperty(payload as Parameters<typeof addProperty>[0]);
        toast.success('Property added successfully!');
      } else {
        await updateProperty(property!.id, payload as Parameters<typeof updateProperty>[1]);
        toast.success('Property updated successfully!');
      }

      router.push('/admin/properties');
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  const toOptions = (arr: readonly string[]) => arr.map((v) => ({ value: v, label: v }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Basic Info */}
      <section className="bg-white border border-warm-border rounded-2xl shadow-card p-6">
        <h2 className="font-semibold text-ink text-base mb-5">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Input label="Property Title" error={errors.title?.message} {...register('title')} placeholder="e.g. 5 Marla House in DHA Phase 5 Lahore" />
          </div>
          <Select label="Property Type" options={toOptions(PROPERTY_TYPES)} error={errors.type?.message} {...register('type')} />
          <Select label="Status" options={toOptions(PROPERTY_STATUSES)} error={errors.status?.message} {...register('status')} />
          <Input label="Price (PKR)" type="number" error={errors.price?.message} {...register('price')} placeholder="e.g. 12000000" />
          <div className="flex gap-3">
            <div className="flex-1">
              <Input label="Area Size" type="number" error={errors.area?.message} {...register('area')} placeholder="e.g. 5" />
            </div>
            <div className="w-28">
              <Select label="Unit" options={toOptions(AREA_UNITS)} error={errors.areaUnit?.message} {...register('areaUnit')} />
            </div>
          </div>
          <Input label="Bedrooms (optional)" type="number" error={errors.bedrooms?.message} {...register('bedrooms')} placeholder="e.g. 3" />
          <Input label="Bathrooms (optional)" type="number" error={errors.bathrooms?.message} {...register('bathrooms')} placeholder="e.g. 2" />
        </div>
      </section>

      {/* Location */}
      <section className="bg-white border border-warm-border rounded-2xl shadow-card p-6">
        <h2 className="font-semibold text-ink text-base mb-5">Location</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select label="City" options={PAKISTANI_CITIES.map((c) => ({ value: c, label: c }))} error={errors.location?.city?.message} {...register('location.city')} placeholder="Select city" />
          <Input label="Area / Sector / Phase" error={errors.location?.area?.message} {...register('location.area')} placeholder="e.g. DHA Phase 5" />
          <div className="md:col-span-2">
            <Input label="Full Address (optional)" {...register('location.address')} placeholder="e.g. Street 15, Block A, DHA Phase 5" />
          </div>
          <div className="md:col-span-2">
            <Input label="Google Maps Embed URL (optional)" {...register('location.mapEmbedUrl')} placeholder="https://www.google.com/maps/embed?pb=..." helperText="Get this from Google Maps > Share > Embed a map > copy the src URL" />
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="bg-white border border-warm-border rounded-2xl shadow-card p-6">
        <h2 className="font-semibold text-ink text-base mb-5">Description</h2>
        <Textarea label="Property Description" rows={6} error={errors.description?.message} {...register('description')} placeholder="Describe the property in detail — features, surroundings, nearby landmarks, etc." />
      </section>

      {/* Media */}
      <section className="bg-white border border-warm-border rounded-2xl shadow-card p-6">
        <h2 className="font-semibold text-ink text-base mb-5">Images</h2>
        <ImageManager propertyId={tempId} images={images} onChange={setImages} />

        {/* Video — optional */}
        <div className="mt-6 pt-5 border-t border-warm-border">
          <h3 className="font-semibold text-ink text-sm mb-4">Video Tour (optional)</h3>

          {/* Toggle */}
          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={() => setVideoMode('url')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${videoMode === 'url' ? 'bg-ink text-white' : 'bg-warm text-ink-500 hover:text-ink'}`}
            >
              <Youtube size={14} /> YouTube URL
            </button>
            <button
              type="button"
              onClick={() => setVideoMode('upload')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${videoMode === 'upload' ? 'bg-ink text-white' : 'bg-warm text-ink-500 hover:text-ink'}`}
            >
              <Video size={14} /> Upload Video
            </button>
          </div>

          {videoMode === 'url' ? (
            <Input
              label="YouTube Video URL"
              {...register('videoUrl')}
              placeholder="https://www.youtube.com/watch?v=..."
              helperText="Paste a YouTube link to embed a property tour video"
            />
          ) : (
            <div>
              {uploadedVideoUrl ? (
                <div className="flex items-center gap-3 bg-warm rounded-xl px-4 py-3 border border-warm-border">
                  <Video size={16} className="text-ink-500 shrink-0" />
                  <span className="text-ink text-sm truncate flex-1">Video uploaded</span>
                  <button
                    type="button"
                    onClick={() => {
                      setUploadedVideoUrl('');
                      setValue('videoUrl', '');
                      if (videoInputRef.current) videoInputRef.current.value = '';
                    }}
                    className="text-ink-400 hover:text-red-500 transition-colors"
                  >
                    <X size={15} />
                  </button>
                </div>
              ) : videoUploading ? (
                <div className="bg-warm rounded-xl px-4 py-3 border border-warm-border">
                  <div className="flex items-center gap-3 mb-2">
                    <Loader2 size={14} className="animate-spin text-ink-500" />
                    <span className="text-ink-500 text-sm">Uploading video…</span>
                    <span className="text-ink text-xs font-medium ml-auto">{videoProgress}%</span>
                  </div>
                  <div className="h-1.5 bg-warm-200 rounded-full overflow-hidden">
                    <div className="h-full bg-ink transition-all duration-300 rounded-full" style={{ width: `${videoProgress}%` }} />
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => videoInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-warm-border rounded-2xl p-6 text-center hover:border-ink-300 hover:bg-warm-50 transition-all cursor-pointer"
                >
                  <Upload size={20} className="mx-auto mb-2 text-ink-300" />
                  <p className="text-ink-500 text-sm">Click to select a video file</p>
                  <p className="text-ink-300 text-xs mt-1">MP4, MOV, AVI · Max 100 MB</p>
                </button>
              )}
              <input
                ref={videoInputRef}
                type="file"
                accept="video/mp4,video/quicktime,video/avi,video/*"
                className="hidden"
                onChange={handleVideoFileChange}
              />
            </div>
          )}
        </div>
      </section>

      {/* Seller */}
      <section className="bg-white border border-warm-border rounded-2xl shadow-card p-6">
        <h2 className="font-semibold text-ink text-base mb-5">Seller Contact</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Seller Name" error={errors.seller?.name?.message} {...register('seller.name')} placeholder="e.g. Ahmed Khan" />
          <Input label="Phone Number" error={errors.seller?.phone?.message} {...register('seller.phone')} placeholder="+923001234567" />
          <Input label="WhatsApp Number" error={errors.seller?.whatsapp?.message} {...register('seller.whatsapp')} placeholder="+923001234567" helperText="Include country code without +" />
          <Input label="Email (optional)" {...register('seller.email')} placeholder="seller@example.com" />
        </div>
      </section>

      {/* Settings */}
      <section className="bg-white border border-warm-border rounded-2xl shadow-card p-6">
        <h2 className="font-semibold text-ink text-base mb-5">Settings</h2>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            {...register('featured')}
            className="w-4 h-4 rounded border-warm-border bg-white text-ink focus:ring-ink/20"
          />
          <div>
            <span className="text-ink text-sm font-medium">Featured Listing</span>
            <p className="text-ink-400 text-xs">Show this property on the homepage featured section</p>
          </div>
        </label>
      </section>

      {/* Submit */}
      <div className="flex items-center justify-end gap-4 pt-2">
        <Button type="button" variant="ghost" onClick={() => router.back()} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" isLoading={submitting} size="lg">
          {mode === 'create' ? 'Add Property' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}

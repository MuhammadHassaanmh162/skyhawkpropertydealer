import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MapPin, Maximize2, BedDouble, Bath, Calendar, Eye } from 'lucide-react';
import { PropertyImageGallery } from '@/components/properties/PropertyImageGallery';
import { VideoEmbed } from '@/components/properties/VideoEmbed';
import { SellerContactCard } from '@/components/properties/SellerContactCard';
import { PropertyBreadcrumb } from '@/components/properties/PropertyBreadcrumb';
import { RelatedProperties } from '@/components/properties/RelatedProperties';
import { StatusBadge, TypeBadge } from '@/components/ui/Badge';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { getProperty, getRelatedProperties, getFeaturedProperties } from '@/lib/firebase/firestore';
import type { Property } from '@/types/property';
import { format } from 'date-fns';

export const revalidate = 30;

export async function generateStaticParams() {
  try {
    const properties = await getFeaturedProperties(20);
    return properties.map((p) => ({ id: p.id }));
  } catch { return []; }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const property = await getProperty(params.id);
    if (!property) return { title: 'Property Not Found' };
    return {
      title: property.title,
      description: property.description.slice(0, 155),
      openGraph: { images: property.images?.[0]?.url ? [{ url: property.images[0].url }] : [] },
    };
  } catch { return { title: 'Property' }; }
}

export default async function PropertyDetailPage({ params }: { params: { id: string } }) {
  let property: Property | null = null;
  try { property = await getProperty(params.id); } catch { notFound(); }
  if (!property) notFound();

  let related: Property[] = [];
  try { related = await getRelatedProperties(property.id, property.location.city, property.type); } catch {}

  return (
    <PageWrapper>
      <div className="pt-20 sm:pt-24 pb-12 sm:pb-16 lg:pb-20 px-4 sm:px-6 lg:px-8 bg-white min-h-screen">
        <div className="container-max">
          <PropertyBreadcrumb city={property.location.city} title={property.title} />

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main content */}
            <div className="flex-1 min-w-0">
              <PropertyImageGallery images={property.images} title={property.title} />

              {/* Badges + title */}
              <div className="mt-6 mb-5">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <StatusBadge status={property.status} />
                  <TypeBadge type={property.type} />
                  {property.featured && (
                    <span className="px-3 py-1 rounded-full bg-gold-400/10 text-gold-600 text-xs font-semibold border border-gold-400/20">
                      Featured
                    </span>
                  )}
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
                  {property.title}
                </h1>
                <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                  <MapPin size={14} className="text-gold-400 shrink-0" />
                  {property.location.address || `${property.location.area}, ${property.location.city}`}
                </div>
              </div>

              {/* Price + meta */}
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-gray-400 text-xs mb-0.5">Asking Price</p>
                  <p className="text-3xl font-extrabold text-gold-500 tracking-tight">{property.priceLabel}</p>
                </div>
                <div className="flex gap-5 text-sm text-gray-400">
                  <span className="flex items-center gap-1.5"><Eye size={14} /> {property.views} views</span>
                  <span className="flex items-center gap-1.5"><Calendar size={14} /> {format(property.createdAt, 'dd MMM yyyy')}</span>
                </div>
              </div>

              {/* Property details */}
              <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-6">
                <h2 className="font-bold text-gray-900 text-lg mb-4">Property Details</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                  {[
                    { icon: Maximize2, label: 'Area', value: `${property.area} ${property.areaUnit}` },
                    property.bedrooms != null ? { icon: BedDouble, label: 'Bedrooms', value: String(property.bedrooms) } : null,
                    property.bathrooms != null ? { icon: Bath, label: 'Bathrooms', value: String(property.bathrooms) } : null,
                    { icon: MapPin, label: 'City', value: property.location.city },
                  ].filter(Boolean).map((item) => item && (
                    <div key={item.label} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gold-400/8 border border-gold-400/15 flex items-center justify-center shrink-0">
                        <item.icon size={16} className="text-gold-500" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">{item.label}</p>
                        <p className="font-bold text-gray-900 text-sm">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-6">
                <h2 className="font-bold text-gray-900 text-lg mb-4">Description</h2>
                <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                  {property.description}
                </div>
              </div>

              <VideoEmbed videoUrl={property.videoUrl} />

              {property.location.mapEmbedUrl && (
                <div className="mt-8">
                  <h3 className="font-bold text-gray-900 text-xl mb-4">Location</h3>
                  <div className="aspect-video rounded-2xl overflow-hidden border border-gray-100">
                    <iframe src={property.location.mapEmbedUrl} title="Property Location" loading="lazy" allowFullScreen className="w-full h-full border-0" />
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:w-80 shrink-0">
              <SellerContactCard seller={property.seller} />
            </div>
          </div>

          <RelatedProperties properties={related} />
        </div>
      </div>
    </PageWrapper>
  );
}

import type { Metadata } from 'next';
import { HeroSection } from '@/components/home/HeroSection';
import { StatsSection } from '@/components/home/StatsSection';
import { FeaturedProperties } from '@/components/home/FeaturedProperties';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { CTASection } from '@/components/home/CTASection';
import { getFeaturedProperties, getSiteSettings } from '@/lib/firebase/firestore';
import type { Property } from '@/types/property';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Sky Hawk Property Dealer | Pakistan Real Estate',
  description: 'Browse verified houses, plots, and land for sale or rent across Pakistan. Trusted property dealer with transparent pricing.',
};

export default async function HomePage() {
  let featuredProperties: Property[] = [];
  let heroImageUrl: string | null = null;
  try {
    const [properties, settings] = await Promise.all([
      getFeaturedProperties(6),
      getSiteSettings(),
    ]);
    featuredProperties = properties;
    heroImageUrl = settings?.heroImageUrl ?? null;
  } catch {
    // Firebase not configured yet; show empty state
  }

  return (
    <>
      <HeroSection heroImageUrl={heroImageUrl} />
      <StatsSection />
      <FeaturedProperties properties={featuredProperties} />
      <WhyChooseUs />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}

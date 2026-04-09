import type { Metadata } from 'next';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { CTASection } from '@/components/home/CTASection';
import { Shield, Target, Eye, Award } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Sky Hawk Property Dealer — Pakistan\'s trusted real estate company.',
};

export default function AboutPage() {
  return (
    <PageWrapper>
      {/* Header */}
      <div className="pt-24 pb-14 px-4 sm:px-6 lg:px-8 bg-gray-50 border-b border-gray-100">
        <div className="container-max text-center max-w-3xl mx-auto">
          <span className="eyebrow justify-center">About Us</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-ink tracking-tight mb-4">
            Your Trusted Property Partner
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed">
            Sky Hawk Property Dealer has been connecting buyers and sellers across Pakistan for over 5 years with full transparency and integrity.
          </p>
        </div>
      </div>

      {/* Story */}
      <section className="section-padding bg-white">
        <div className="container-max max-w-4xl mx-auto">
          <div className="bg-white border border-gray-100 rounded-3xl p-8 sm:p-12 shadow-card">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-5">Our Story</h2>
            <div className="space-y-4 text-gray-500 leading-relaxed">
              <p>Sky Hawk Property Dealer was founded with a simple mission: to make property buying and selling in Pakistan transparent, efficient, and trustworthy. We noticed that many Pakistanis struggled to find reliable property information and honest dealers — so we set out to change that.</p>
              <p>Over the years, we have helped hundreds of families find their perfect home, investors discover high-return plots, and commercial buyers secure ideal locations across major Pakistani cities.</p>
              <p>Our platform combines modern technology with personal service. Every listing is verified, every price is transparent, and every client receives direct access to sellers — no middlemen, no hidden fees.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding pt-0 bg-white">
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Target, label: 'Our Mission', text: 'To provide every Pakistani with access to verified, transparent property listings — connecting them directly with trusted sellers and making property transactions simple and fair.' },
              { icon: Eye, label: 'Our Vision', text: 'To become Pakistan\'s most trusted property platform, known for integrity, innovation, and delivering real value to both buyers and sellers nationwide.' },
            ].map((item) => (
              <div key={item.label} className="bg-gray-50 border border-gray-100 rounded-3xl p-8">
                <div className="w-12 h-12 rounded-2xl bg-gray-900 flex items-center justify-center mb-5">
                  <item.icon size={20} className="text-gold-400" />
                </div>
                <h3 className="text-2xl font-extrabold text-gray-900 mb-3">{item.label}</h3>
                <p className="text-gray-500 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding pt-0 bg-white">
        <div className="container-max max-w-4xl mx-auto">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-10">Our Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { icon: Shield, title: 'Integrity', text: 'Honesty in every deal. We never compromise on transparency.' },
              { icon: Award, title: 'Excellence', text: 'We strive for excellence in every listing and every interaction.' },
              { icon: Target, title: 'Results', text: 'We measure success by your satisfaction — right property, right price.' },
            ].map((v) => (
              <div key={v.title} className="bg-white border border-gray-100 rounded-2xl p-6 text-center shadow-card">
                <div className="w-12 h-12 rounded-2xl bg-gray-900 flex items-center justify-center mx-auto mb-4">
                  <v.icon size={20} className="text-gold-400" />
                </div>
                <h4 className="font-extrabold text-gray-900 text-lg mb-2">{v.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </PageWrapper>
  );
}

import type { Metadata } from 'next';
import { Phone, MessageCircle, Mail, MapPin, Clock } from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Sky Hawk Property Dealer. Call, WhatsApp, or email us for all property inquiries.',
};

export default function ContactPage() {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923001234567';
  const phone    = process.env.NEXT_PUBLIC_CONTACT_PHONE  || '+923001234567';

  return (
    <PageWrapper>
      {/* Header */}
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50 border-b border-gray-100">
        <div className="container-max text-center max-w-2xl mx-auto">
          <span className="eyebrow justify-center">Get In Touch</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-ink tracking-tight mb-4">Contact Us</h1>
          <p className="text-gray-500">
            Have a property question? We&apos;re available on WhatsApp and phone. Reach out anytime.
          </p>
        </div>
      </div>

      <div className="section-padding bg-white">
        <div className="container-max max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Contact info */}
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Reach Us Directly</h2>
              <div className="space-y-4">
                {[
                  { icon: MessageCircle, label: 'WhatsApp', value: 'Chat with us on WhatsApp', href: `https://wa.me/${whatsapp}`, iconColor: 'text-[#25D366]', bg: 'bg-[#25D366]/8 border-[#25D366]/15', external: true },
                  { icon: Phone, label: 'Phone', value: phone, href: `tel:${phone}`, iconColor: 'text-gold-500', bg: 'bg-gold-400/8 border-gold-400/20', external: false },
                  { icon: Mail, label: 'Email', value: 'skyhawkpropertydealer@gmail.com', href: 'mailto:skyhawkpropertydealer@gmail.com', iconColor: 'text-blue-500', bg: 'bg-blue-50 border-blue-100', external: false },
                  { icon: MapPin, label: 'Location', value: 'Pakistan', href: null, iconColor: 'text-red-500', bg: 'bg-red-50 border-red-100', external: false },
                  { icon: Clock, label: 'Hours', value: 'Mon–Sat, 9am – 9pm PKT', href: null, iconColor: 'text-purple-500', bg: 'bg-purple-50 border-purple-100', external: false },
                ].map((item) => {
                  const inner = (
                    <div className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-2xl shadow-card hover:shadow-card-hover transition-all">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${item.bg}`}>
                        <item.icon size={18} className={item.iconColor} />
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs mb-0.5">{item.label}</p>
                        <p className={`font-semibold text-sm ${item.href ? item.iconColor : 'text-gray-900'}`}>{item.value}</p>
                      </div>
                    </div>
                  );
                  if (!item.href) return <div key={item.label}>{inner}</div>;
                  return (
                    <a key={item.label} href={item.href} target={item.external ? '_blank' : undefined} rel={item.external ? 'noopener noreferrer' : undefined}>
                      {inner}
                    </a>
                  );
                })}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-5">
              <div className="bg-gray-900 rounded-3xl p-8">
                <h3 className="font-extrabold text-white text-xl mb-2">Fastest Response</h3>
                <p className="text-white/50 text-sm mb-6 leading-relaxed">
                  For the fastest response, message us on WhatsApp. We typically reply within minutes during business hours.
                </p>
                <a
                  href={`https://wa.me/${whatsapp}?text=Hi, I found your listing on Sky Hawk Property Dealer and would like to inquire.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-[#25D366] text-white font-bold hover:bg-[#20BD5C] transition-all text-base"
                >
                  <MessageCircle size={20} />
                  Message on WhatsApp
                </a>
              </div>

              <div className="bg-gray-50 border border-gray-100 rounded-3xl p-8">
                <h3 className="font-extrabold text-gray-900 text-xl mb-2">Looking for a Property?</h3>
                <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                  Tell us your budget, preferred city, and property type — we&apos;ll find the best options for you.
                </p>
                <a
                  href="/properties"
                  className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-gold-gradient text-white font-bold hover:shadow-gold transition-all text-base"
                >
                  Browse Properties
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

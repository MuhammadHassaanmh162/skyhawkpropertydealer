import { Phone, Mail, MessageCircle, User } from 'lucide-react';
import type { SellerContact } from '@/types/property';

interface SellerContactCardProps {
  seller: SellerContact;
}

export function SellerContactCard({ seller }: SellerContactCardProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-card p-6 lg:sticky lg:top-24">
      <h3 className="font-bold text-gray-900 text-lg mb-5">Contact Seller</h3>

      <div className="flex items-center gap-3 pb-5 mb-5 border-b border-gray-100">
        <div className="w-12 h-12 rounded-full bg-gold-400/10 border border-gold-400/20 flex items-center justify-center">
          <User size={20} className="text-gold-500" />
        </div>
        <div>
          <p className="font-bold text-gray-900">{seller.name}</p>
          <p className="text-gray-400 text-sm">Property Agent</p>
        </div>
      </div>

      <div className="space-y-3">
        <a
          href={`tel:${seller.phone}`}
          className="flex items-center justify-center gap-3 w-full py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 hover:border-gray-900 hover:bg-gray-900 hover:text-white transition-all font-semibold text-sm"
        >
          <Phone size={15} />
          {seller.phone}
        </a>

        <a
          href={`https://wa.me/${seller.whatsapp.replace(/[^0-9]/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 w-full py-3 rounded-xl bg-[#25D366] text-white font-bold text-sm hover:bg-[#20BD5C] transition-all"
        >
          <MessageCircle size={15} />
          WhatsApp
        </a>

        {seller.email && (
          <a
            href={`mailto:${seller.email}`}
            className="flex items-center justify-center gap-3 w-full py-3 rounded-xl border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300 transition-all text-sm font-medium"
          >
            <Mail size={15} />
            {seller.email}
          </a>
        )}
      </div>

      <p className="mt-5 text-center text-gray-400 text-xs">
        Mention Sky Hawk Property Dealer when calling
      </p>
    </div>
  );
}

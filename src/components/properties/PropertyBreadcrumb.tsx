import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface PropertyBreadcrumbProps {
  city: string;
  title: string;
}

export function PropertyBreadcrumb({ city, title }: PropertyBreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-6 flex-wrap">
      <Link href="/" className="hover:text-ink transition-colors">Home</Link>
      <ChevronRight size={13} className="text-gray-300" />
      <Link href="/properties" className="hover:text-ink transition-colors">Properties</Link>
      <ChevronRight size={13} className="text-gray-300" />
      <Link href={`/properties?city=${city}`} className="hover:text-ink transition-colors">{city}</Link>
      <ChevronRight size={13} className="text-gray-300" />
      <span className="text-gray-600 line-clamp-1 max-w-xs">{title}</span>
    </nav>
  );
}

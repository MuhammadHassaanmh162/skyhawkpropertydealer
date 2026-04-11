import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Sky Hawk Property Dealer | Pakistan Real Estate',
    template: '%s | Sky Hawk Property Dealer',
  },
  icons: {
    icon: '/assets/faviicon.png', // or .png
    shortcut: '/assets/faviicon.png',
    apple: '/assets/faviicon.png', // optional
  },
  description:
    'Browse houses, plots, and land for sale or rent in Pakistan. Sky Hawk Property Dealer — trusted real estate services across Pakistan.',
  keywords: ['property dealer Pakistan', 'houses for sale Pakistan', 'plots for sale', 'real estate Lahore', 'real estate Islamabad'],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_PK',
    siteName: 'Sky Hawk Property Dealer',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}

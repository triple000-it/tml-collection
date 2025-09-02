import type { Metadata } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const montserrat = Montserrat({ 
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'TML Collections - Tomorrowland DJ Card Collection',
  description: 'Collect digital cards of your favorite Tomorrowland DJs. Discover, collect, and trade premium DJ cards from the world\'s greatest electronic music festival.',
  keywords: ['Tomorrowland', 'DJ Cards', 'Electronic Music', 'Festival', 'Collection', 'Trading Cards'],
  authors: [{ name: 'TML Collections Team' }],
  creator: 'TML Collections',
  publisher: 'TML Collections',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://tml-collections.com'),
  openGraph: {
    title: 'TML Collections - Tomorrowland DJ Card Collection',
    description: 'Collect digital cards of your favorite Tomorrowland DJs',
    url: 'https://tml-collections.com',
    siteName: 'TML Collections',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'TML Collections - Tomorrowland DJ Cards',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TML Collections - Tomorrowland DJ Card Collection',
    description: 'Collect digital cards of your favorite Tomorrowland DJs',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#000000" />
        <meta name="copyright" content="©2025 TML Collections" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body className="font-inter bg-black text-white antialiased overflow-x-hidden">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
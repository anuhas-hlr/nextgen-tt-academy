import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'NextGen Table Tennis Academy | Colombo, Sri Lanka',
    template: '%s | NextGen TT Academy',
  },
  description:
    "Sri Lanka's premier table tennis training facility. Train with National No. 1 coach Chanul Dulsen. Personal coaching, group sessions & table reservations available.",
  keywords: ['table tennis', 'Sri Lanka', 'coaching', 'academy', 'Colombo', 'Chanul Dulsen'],
  openGraph: {
    type: 'website',
    locale: 'en_LK',
    url: 'https://nextgentt.lk',
    siteName: 'NextGen Table Tennis Academy',
    title: 'NextGen Table Tennis Academy | Colombo, Sri Lanka',
    description: "Train with Sri Lanka's National No. 1 — Chanul Dulsen.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`scroll-smooth ${inter.variable}`}>
      <body className="font-sans antialiased bg-[#F5F7FB] text-[#101B35]">
        {children}
      </body>
    </html>
  );
}

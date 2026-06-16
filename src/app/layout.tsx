import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { company } from '@/lib/company';

export const metadata: Metadata = {
  metadataBase: new URL(company.siteUrl),
  title: { default: company.name, template: `%s — ${company.shortName}` },
  description: 'Институциональный сайт центра профессионального развития: программы для руководителей, организаций и государственных структур, официальные документы, заявки и сопровождение.',
  applicationName: company.name,
  authors: [{ name: company.name }],
  icons: { icon: '/favicon.svg' },
  openGraph: { images: ['/og-image.svg'] }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#ffffff'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <meta charSet="utf-8" />
      </head>
      <body>{children}</body>
    </html>
  );
}

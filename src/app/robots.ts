import type { MetadataRoute } from 'next';
import { company } from '@/lib/company';

export const dynamic = 'force-static';
export const revalidate = false;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/']
    },
    sitemap: new URL('/sitemap.xml', company.siteUrl).toString()
  };
}

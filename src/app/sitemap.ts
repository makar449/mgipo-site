import type { MetadataRoute } from 'next';
import { company } from '@/lib/company';
import { getPublishedServices } from '@/lib/admin-cms';

export const dynamic = 'force-static';
export const revalidate = false;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = [
    '/',
    '/about',
    '/services',
    '/prices',
    '/corporate',
    '/contacts',
    '/documents',
    '/cases',
    '/reviews',
    '/faq',
    '/favorites',
    '/compare',
    '/legal/privacy',
    '/legal/terms',
    '/legal/consent',
    '/legal/requisites'
  ];

  const staticRoutes = routes.map((path) => ({
    url: new URL(path, company.siteUrl).toString(),
    lastModified: new Date('2026-01-01'),
    changeFrequency: 'weekly' as const,
    priority: path === '/' ? 1 : 0.72
  }));

  const services = await getPublishedServices();
  const serviceRoutes = services.map((service) => ({
    url: new URL(`/services/${service.slug}`, company.siteUrl).toString(),
    lastModified: new Date('2026-01-01'),
    changeFrequency: 'weekly' as const,
    priority: 0.86
  }));

  return [...staticRoutes, ...serviceRoutes];
}

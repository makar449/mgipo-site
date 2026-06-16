import { SiteShell } from '@/components/site-shell';
import { CompareClient } from '@/components/compare-client';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { createMetadata } from '@/lib/metadata';

export const metadata = createMetadata({ title: 'Сравнение программ', description: 'Сравнение программ обучения по цене, длительности, формату и документу.', path: '/compare' });

export default function ComparePage() {
  return <SiteShell><section className="container-px mx-auto max-w-7xl py-16 sm:py-20"><Breadcrumbs items={[{ label: 'Сравнение' }]} /><div className="mt-8"><CompareClient /></div></section></SiteShell>;
}

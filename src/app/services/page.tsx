import { SiteShell } from '@/components/site-shell';
import { CatalogClient } from '@/components/catalog-client';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { createMetadata } from '@/lib/metadata';
import { getPublishedServices } from '@/lib/admin-cms';


export const metadata = createMetadata({
  title: 'Каталог программ профессиональной переподготовки МГИПО',
  description: 'Реальный каталог программ ДПП МГИПО: 40 ключевых программ, стоимость от 10 000 рублей, диплом о профессиональной переподготовке.',
  path: '/services',
  keywords: ['МГИПО каталог программ', 'профессиональная переподготовка', 'ДПП', 'диплом', 'от 10 000 рублей']
});

export default async function ServicesPage() {
  const services = await getPublishedServices();
  return (
    <SiteShell>
      <section className="container-px mx-auto max-w-7xl py-12 sm:py-16">
        <Breadcrumbs items={[{ label: 'Программы' }]} />
        <CatalogClient services={services} />
      </section>
    </SiteShell>
  );
}

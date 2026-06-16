import { ArrowRight } from 'lucide-react';
import { SiteShell } from '@/components/site-shell';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SectionHeading } from '@/components/ui/section-heading';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { getPublishedServices } from '@/lib/admin-cms';
import { formatPrice } from '@/lib/format';
import { createMetadata } from '@/lib/metadata';

export const metadata = createMetadata({ title: 'Цены на обучение', description: 'Стоимость программ повышения квалификации, профессиональной переподготовки и обязательного обучения.', path: '/prices' });


export default async function PricesPage() {
  const services = await getPublishedServices();
  const sorted = [...services].sort((left, right) => left.minPrice - right.minPrice);
  return (
    <SiteShell>
      <section className="container-px mx-auto max-w-7xl py-16 sm:py-20">
        <Breadcrumbs items={[{ label: 'Цены' }]} />
        <SectionHeading className="mt-8" eyebrow="Цены" title="Стоимость программ в понятной структуре" description="На странице собраны базовые цены. Точная стоимость может зависеть от формата, количества часов и количества слушателей." />
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {sorted.map((service) => (
            <Card key={service.id} className="flex min-h-full flex-col">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">{service.category}</p>
              <h2 className="mt-3 text-2xl font-black text-slate-950">{service.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{service.shortDescription}</p>
              <div className="mt-6 grid gap-2 text-sm text-slate-600">
                <p><span className="font-bold text-slate-950">Длительность:</span> {service.duration}</p>
                <p><span className="font-bold text-slate-950">Документ:</span> {service.documentType}</p>
              </div>
              <div className="mt-auto pt-6">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-600">Стоимость</p>
                <p className="mt-1 text-3xl font-black text-slate-950">от {formatPrice(service.minPrice)}</p>
                <Button href={`/services/${service.slug}`} variant="secondary" className="mt-5">Подробнее <ArrowRight className="h-4 w-4" /></Button>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}

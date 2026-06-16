import { ArrowRight } from 'lucide-react';
import { SiteShell } from '@/components/site-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LeadForm } from '@/components/lead-form';
import { SectionHeading } from '@/components/ui/section-heading';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { corporateFeatures } from '@/lib/brand-content';
import { createMetadata } from '@/lib/metadata';
import { getPublishedServices } from '@/lib/admin-cms';

export const metadata = createMetadata({ title: 'Обучение для организаций', description: 'Подбор программ повышения квалификации и обязательного обучения для сотрудников организаций.', path: '/corporate' });


export default async function CorporatePage() {
  const services = await getPublishedServices();
  return (
    <SiteShell>
      <section className="container-px mx-auto grid max-w-7xl gap-8 py-16 sm:py-20 lg:grid-cols-[1fr_420px] lg:items-start">
        <div>
          <Breadcrumbs items={[{ label: 'Организациям' }]} />
          <SectionHeading className="mt-8" eyebrow="Для организаций" title="Обучение для сотрудников, руководителей и подразделений" description="Можно согласовать несколько программ, состав группы, стоимость, сроки, формат обучения и комплект документов для внутреннего учета организации." />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {corporateFeatures.map((item) => { const Icon = item.icon; return <Card key={item.title}><Icon className="h-8 w-8 text-blue-700" /><h2 className="mt-5 text-xl font-black text-slate-950">{item.title}</h2><p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p></Card>; })}
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Button href="/services">Смотреть программы <ArrowRight className="h-4 w-4" /></Button><Button href="/prices" variant="secondary">Посмотреть цены</Button></div>
        </div>
        <LeadForm source="corporate" services={services} />
      </section>
    </SiteShell>
  );
}

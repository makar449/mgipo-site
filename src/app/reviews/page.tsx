import { Quote } from 'lucide-react';
import { SiteShell } from '@/components/site-shell';
import { Card } from '@/components/ui/card';
import { SectionHeading } from '@/components/ui/section-heading';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { testimonials } from '@/lib/brand-content';
import { createMetadata } from '@/lib/metadata';

export const metadata = createMetadata({ title: 'Отзывы', description: 'Отзывы клиентов об образовательных программах и подборе обучения.', path: '/reviews' });

export default function ReviewsPage() {
  return (
    <SiteShell>
      <section className="container-px mx-auto max-w-7xl py-16 sm:py-20">
        <Breadcrumbs items={[{ label: 'Отзывы' }]} />
        <SectionHeading className="mt-8" eyebrow="Отзывы" title="Что ценят руководители и организации" description="Клиенты ценят деловой формат, понятные условия, официальные документы и аккуратную обработку запроса." />
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {testimonials.map((item) => <Card key={item.name}><Quote className="h-8 w-8 text-blue-700" /><p className="mt-6 text-lg leading-8 text-slate-600">“{item.text}”</p><div className="mt-6 border-t border-slate-200 pt-5"><p className="font-black text-slate-950">{item.name}</p><p className="mt-1 text-sm text-slate-600">{item.role}</p></div></Card>)}
        </div>
      </section>
    </SiteShell>
  );
}

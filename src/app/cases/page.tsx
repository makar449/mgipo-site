import { ArrowRight, Building2 } from 'lucide-react';
import { SiteShell } from '@/components/site-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SectionHeading } from '@/components/ui/section-heading';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { cases } from '@/lib/brand-content';
import { createMetadata } from '@/lib/metadata';

export const metadata = createMetadata({ title: 'Кейсы обучения', description: 'Примеры подбора программ обучения для организаций и специалистов.', path: '/cases' });

export default function CasesPage() {
  return (
    <SiteShell>
      <section className="container-px mx-auto max-w-7xl py-16 sm:py-20">
        <Breadcrumbs items={[{ label: 'Кейсы' }]} />
        <SectionHeading className="mt-8" eyebrow="Кейсы" title="Кейсы профессионального развития для организаций" description="Примеры показывают, как программы, условия, заявки и документы объединяются в управляемый процесс обучения." />
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {cases.map((item) => <Card key={item.company} className="min-h-full"><Building2 className="h-8 w-8 text-blue-700" /><p className="mt-5 text-sm font-bold uppercase tracking-[0.2em] text-blue-700">{item.company}</p><h2 className="mt-3 text-2xl font-black text-slate-950">{item.title}</h2><p className="mt-4 leading-7 text-slate-600">{item.result}</p><div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50/10 p-4 text-2xl font-black text-blue-700">{item.metric}</div></Card>)}
        </div>
        <div className="mt-8"><Button href="/corporate">Подобрать обучение для организации <ArrowRight className="h-4 w-4" /></Button></div>
      </section>
    </SiteShell>
  );
}

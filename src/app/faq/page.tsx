import { SiteShell } from '@/components/site-shell';
import { Card } from '@/components/ui/card';
import { SectionHeading } from '@/components/ui/section-heading';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { commonFaq } from '@/lib/brand-content';
import { createMetadata } from '@/lib/metadata';

export const metadata = createMetadata({ title: 'Вопросы и ответы', description: 'Ответы на частые вопросы о выборе программы, стоимости, формате обучения и документах.', path: '/faq' });

export default function FaqPage() {
  return (
    <SiteShell>
      <section className="container-px mx-auto max-w-5xl py-16 sm:py-20">
        <Breadcrumbs items={[{ label: 'Вопросы и ответы' }]} />
        <SectionHeading className="mt-8" eyebrow="FAQ" title="Частые вопросы о программах и заявках" description="Коротко о том, как выбрать программу, узнать стоимость и оформить обучение." />
        <div className="mt-8 grid gap-4">
          {commonFaq.map((item) => <Card key={item.question}><h2 className="text-xl font-black text-slate-950">{item.question}</h2><p className="mt-3 leading-8 text-slate-600">{item.answer}</p></Card>)}
        </div>
      </section>
    </SiteShell>
  );
}

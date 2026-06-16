import { ArrowLeft, BadgeCheck, CheckCircle2, Clock3, CreditCard, Download, FileBadge2, GraduationCap, MonitorPlay, Users } from 'lucide-react';
import { notFound } from 'next/navigation';
import { SiteShell } from '@/components/site-shell';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SectionHeading } from '@/components/ui/section-heading';
import { LeadForm } from '@/components/lead-form';
import { ServiceCard } from '@/components/service-card';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { formatPrice } from '@/lib/format';
import { createMetadata } from '@/lib/metadata';
import { getPublishedServiceBySlug, getPublishedServices } from '@/lib/admin-cms';


export async function generateStaticParams() {
  const services = await getPublishedServices();
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await getPublishedServiceBySlug(slug);
  if (service === undefined) return createMetadata({ title: 'Программа не найдена', description: 'Программа обучения не найдена.', path: '/services' });
  return createMetadata({ title: service.title, description: service.shortDescription, path: `/services/${service.slug}`, keywords: [service.title, service.category, ...service.keywords] });
}


export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await getPublishedServiceBySlug(slug);
  if (service === undefined) notFound();
  const services = await getPublishedServices();
  const related = services.filter((item) => item.id !== service.id && item.category === service.category).slice(0, 3);
  const fallbackRelated = services.filter((item) => item.id !== service.id).slice(0, 3);
  const relatedServices = related.length === 0 ? fallbackRelated : related;

  return (
    <SiteShell>
      <section className="border-b border-slate-200 bg-white">
        <div className="container-px mx-auto grid max-w-7xl gap-7 py-9 sm:py-12 lg:grid-cols-[minmax(0,1fr)_minmax(320px,400px)] lg:items-start lg:py-14">
          <div>
            <Breadcrumbs items={[{ href: '/services', label: 'Программы' }, { label: service.title }]} />
            <Button href="/services" variant="ghost" className="mt-8"><ArrowLeft className="h-4 w-4" /> Вернуться в каталог</Button>
            <p className="institutional-kicker mt-8">{service.category}</p>
            <h1 className="luxury-text mt-5 text-balance text-4xl font-bold sm:text-5xl lg:text-6xl">{service.headline}</h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">{service.fullDescription}</p>
            <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Card><Clock3 className="h-7 w-7 text-blue-800" /><p className="mt-3 text-sm text-slate-600">Длительность</p><p className="mt-1 font-black text-slate-950">{service.duration}</p></Card>
              <Card><MonitorPlay className="h-7 w-7 text-blue-800" /><p className="mt-3 text-sm text-slate-600">Формат</p><p className="mt-1 font-black text-slate-950">{service.formats.join(' / ')}</p></Card>
              <Card><FileBadge2 className="h-7 w-7 text-blue-800" /><p className="mt-3 text-sm text-slate-600">Документ</p><p className="mt-1 font-black text-slate-950">{service.documentType}</p></Card>
              <Card><CreditCard className="h-7 w-7 text-blue-800" /><p className="mt-3 text-sm text-slate-600">Стоимость</p><p className="mt-1 font-black text-slate-950">от {formatPrice(service.minPrice)}</p></Card>
            </div>
          </div>
          <div className="min-w-0 lg:sticky lg:top-28">
            <LeadForm serviceId={service.id} source={`service:${service.slug}`} compact services={services} />
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="container-px mx-auto max-w-7xl">
          <SectionHeading eyebrow="Стоимость" title="Варианты обучения" description="Можно выбрать формат, количество часов и условия оплаты под задачу организации или слушателя." />
          <div className="mt-8 overflow-x-auto rounded-[1.35rem] border border-slate-200 bg-white shadow-executive">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <thead className="bg-blue-50 text-slate-950"><tr><th className="p-4">Вариант</th><th className="p-4">Часы</th><th className="p-4">Формат</th><th className="p-4">Цена</th><th className="p-4">Условия</th></tr></thead>
              <tbody>{service.variants.map((variant) => <tr key={variant.id} className="border-t border-slate-200"><td className="p-4 font-black text-slate-950">{variant.title}</td><td className="p-4 text-slate-600">{variant.hours}</td><td className="p-4 text-slate-600">{variant.format}</td><td className="p-4 font-black text-blue-800">{formatPrice(variant.price)}</td><td className="p-4 text-slate-600">{variant.paymentLabel}</td></tr>)}</tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section-y border-y border-slate-200 bg-slate-50">
        <div className="container-px mx-auto grid max-w-7xl gap-5 md:grid-cols-2 xl:grid-cols-3">
          <Card><Users className="h-9 w-9 text-blue-800" /><h2 className="mt-5 font-serif text-3xl font-bold text-slate-950">Кому подходит</h2><div className="mt-5 grid gap-3">{service.suitableFor.map((item) => <p key={item} className="flex gap-3 text-slate-600"><CheckCircle2 className="h-5 w-5 shrink-0 text-blue-700" />{item}</p>)}</div></Card>
          <Card><GraduationCap className="h-9 w-9 text-blue-800" /><h2 className="mt-5 font-serif text-3xl font-bold text-slate-950">Программа курса</h2><div className="mt-5 grid gap-3">{service.programModules.map((item) => <p key={item} className="flex gap-3 text-slate-600"><CheckCircle2 className="h-5 w-5 shrink-0 text-blue-700" />{item}</p>)}</div></Card>
          <Card><BadgeCheck className="h-9 w-9 text-blue-800" /><h2 className="mt-5 font-serif text-3xl font-bold text-slate-950">Что входит</h2><div className="mt-5 grid gap-3">{service.includes.map((item) => <p key={item} className="flex gap-3 text-slate-600"><CheckCircle2 className="h-5 w-5 shrink-0 text-blue-700" />{item}</p>)}</div></Card>
        </div>
      </section>

      <section className="section-y">
        <div className="container-px mx-auto max-w-7xl">
          <SectionHeading eyebrow="Документ" title="Итог после завершения обучения" description={service.documentDescription} />
          <div className="mt-8 grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
            <Card className="bg-blue-50">
              <FileBadge2 className="h-10 w-10 text-blue-800" />
              <h3 className="mt-5 font-serif text-3xl font-bold text-slate-950">{service.documentType}</h3>
              <p className="mt-4 leading-8 text-slate-600">Документ оформляется по выбранной программе и может быть использован для подтверждения обучения перед работодателем или внутренней службой организации.</p>
              <Button href={service.sourceDocumentHref} variant="secondary" className="mt-6" target="_blank" rel="noreferrer">
                <Download className="h-4 w-4" /> {service.sourceDocumentLabel}
              </Button>
            </Card>
            <LeadForm serviceId={service.id} source={`service-document:${service.slug}`} compact services={services} />
          </div>
        </div>
      </section>

      <section className="section-y border-y border-slate-200 bg-white">
        <div className="container-px mx-auto max-w-7xl">
          <SectionHeading eyebrow="FAQ" title="Частые вопросы по программе" description="Короткие ответы помогают быстрее понять формат, итоговый документ и порядок записи." />
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{service.faq.map((item) => <Card key={item.question}><h3 className="text-lg font-black text-slate-950">{item.question}</h3><p className="mt-3 text-sm leading-7 text-slate-600">{item.answer}</p></Card>)}</div>
        </div>
      </section>

      <section className="section-y bg-slate-50">
        <div className="container-px mx-auto max-w-7xl">
          <SectionHeading eyebrow="Похожие программы" title="Можно сравнить с другими направлениями" />
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{relatedServices.map((item) => <ServiceCard key={item.id} service={item} />)}</div>
        </div>
      </section>
    </SiteShell>
  );
}

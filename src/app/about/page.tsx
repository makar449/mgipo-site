import { Award, BadgeCheck, Building2, FileBadge2, HeartHandshake, ShieldCheck } from 'lucide-react';
import { SiteShell } from '@/components/site-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SectionHeading } from '@/components/ui/section-heading';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { createMetadata } from '@/lib/metadata';
import { getPublishedCmsContent } from '@/lib/admin-cms';

export const metadata = createMetadata({ title: 'О компании', description: 'Об учебном центре, направлениях обучения, документах, подходе и преимуществах для специалистов и организаций.', path: '/about' });

const values = [
  { icon: ShieldCheck, title: 'Доверие', description: 'Открытая информация о документах, реквизитах и условиях обучения.' },
  { icon: FileBadge2, title: 'Понятный итог', description: 'На страницах программ указано, какой документ получает слушатель.' },
  { icon: HeartHandshake, title: 'Подбор', description: 'Помогаем выбрать программу по профессии, должности, задаче и формату.' },
  { icon: Award, title: 'Качество', description: 'Процессы подбора, заявки и сопровождения выстроены в единую управляемую систему.' }
] as const;


export default async function AboutPage() {
  const cms = await getPublishedCmsContent();
  const company = cms.identity;
  return (
    <SiteShell>
      <section className="container-px mx-auto max-w-7xl py-16 sm:py-20">
        <Breadcrumbs items={[{ label: 'О компании' }]} />
        <p className="mt-8 text-sm font-bold uppercase tracking-[0.26em] text-blue-700">О компании</p>
        <h1 className="luxury-text mt-5 max-w-5xl text-balance text-5xl font-black tracking-tight sm:text-6xl">{company.fullName}</h1>
        <p className="mt-6 max-w-3xl text-lg leading-9 text-slate-600">Мы сопровождаем руководителей, специалистов и организации в выборе программ профессионального развития: программа, стоимость, формат, сроки и итоговые документы представлены в единой деловой структуре.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Button href="/services">Выбрать программу</Button><Button href="/documents" variant="secondary">Документы компании</Button></div>
      </section>
      <section className="section-y bg-slate-50">
        <div className="container-px mx-auto max-w-7xl">
          <SectionHeading eyebrow="Подход" title="Институциональный подход к профессиональному развитию" />
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">{values.map((item) => { const Icon = item.icon; return <Card key={item.title}><Icon className="h-8 w-8 text-blue-700" /><h2 className="mt-5 text-xl font-black text-slate-950">{item.title}</h2><p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p></Card>; })}</div>
        </div>
      </section>
      <section className="section-y">
        <div className="container-px mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
          <Card><Building2 className="h-10 w-10 text-blue-700" /><h2 className="mt-5 text-3xl font-black text-slate-950">Где проходит обучение</h2><p className="mt-4 leading-8 text-slate-600">Офис: {company.address}. Программы доступны в очном, онлайн, дистанционном и смешанном формате. Для слушателей из других регионов можно подобрать дистанционный формат.</p></Card>
          <Card><BadgeCheck className="h-10 w-10 text-blue-700" /><h2 className="mt-5 text-3xl font-black text-slate-950">Почему можно доверять</h2><p className="mt-4 leading-8 text-slate-600">{company.license}. На сайте есть отдельные разделы с документами, реквизитами, политикой конфиденциальности, согласием на обработку данных и условиями оказания услуг.</p></Card>
        </div>
      </section>
    </SiteShell>
  );
}

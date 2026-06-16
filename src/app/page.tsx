import { ArrowRight, BadgeCheck, BookOpenCheck, Building2, FileBadge2, GraduationCap, Globe2, Landmark, PlayCircle, ShieldCheck, Star, Users } from 'lucide-react';
import { SiteShell } from '@/components/site-shell';
import { Hero3DScene } from '@/components/hero-3d-scene';
import { SearchSuggest } from '@/components/search-suggest';
import { ServiceCard } from '@/components/service-card';
import { LeadForm } from '@/components/lead-form';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SectionHeading } from '@/components/ui/section-heading';
import { ClientReveal } from '@/components/client-reveal';

import { createMetadata } from '@/lib/metadata';
import { homeBenefits, processSteps, trustSignals } from '@/lib/brand-content';
import { getPublishedCmsContent, getPublishedServices } from '@/lib/admin-cms';

export const metadata = createMetadata({
  title: 'МГИПО — программы профессиональной переподготовки',
  description: 'Каталог программ профессиональной переподготовки МГИПО: отраслевые направления, диплом, обучение от 256 до 1024 часов, стоимость от 10 000 рублей.',
  path: '/',
  keywords: ['МГИПО', 'профессиональная переподготовка', 'ДПП', 'диплом профессиональной переподготовки', 'присвоение квалификации']
});


export default async function HomePage() {
  const isStaticPublicMode = process.env.GITHUB_PAGES === 'true' || process.env.NEXT_PUBLIC_STATIC_EXPORT === 'true';
  const cms = await getPublishedCmsContent();
  const services = await getPublishedServices();
  const siteContent = cms.home;
  const popularServices = [...services].sort((left, right) => right.popularity - left.popularity).slice(0, 4);
  return (
    <SiteShell cms={cms}>
      <section className="reference-home-hero relative overflow-hidden border-b border-blue-100 bg-white py-8 sm:py-10 lg:py-12">
        <div className="absolute inset-0 arch-grid opacity-35" aria-hidden="true" />
        <div className="container-px relative mx-auto max-w-[1560px]">
          <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-start xl:gap-10">
            <ClientReveal>
              <div className="min-w-0 pt-4 lg:pt-12">
                <p data-demo-text="hero-eyebrow" className="inline-flex rounded-[0.85rem] border border-blue-200 bg-white/90 px-4 py-2 text-sm font-bold text-blue-800 shadow-executive">МГИПО — традиции, качество, результат</p>
                <h1 className="home-hero-title executive-serif mt-9 max-w-[12ch] text-[3.1rem] font-bold leading-[0.98] text-slate-950 sm:text-[4.15rem] lg:text-[4.45rem] 2xl:text-[4.65rem]">
                  <span data-demo-text="hero-line-1" className="block">Профессиональное</span>
                  <span data-demo-text="hero-line-2" className="block">развитие</span>
                  <span data-demo-text="hero-line-3" className="block">управления</span>
                </h1>
                <p data-demo-text="hero-description" className="mt-7 max-w-[38rem] text-[1.13rem] font-medium leading-8 text-slate-600">Дополнительное профессиональное образование для руководителей, специалистов и команд, которые создают эффективность и развивают будущее.</p>
                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
                  <Button href="/services" size="lg"><Landmark className="h-5 w-5" /> <span data-demo-text="primary-button">Выбрать программу</span></Button>
                  <Button href="/about" variant="secondary" size="lg"><PlayCircle className="h-5 w-5" /> <span data-demo-text="secondary-button">Смотреть видео о институте</span></Button>
                </div>
                <div className="mt-9 grid gap-4 border-t border-slate-200 pt-7 sm:grid-cols-3">
                  <div className="home-trust-mini"><ShieldCheck className="h-6 w-6 text-blue-700" /><h2>Лицензия и аккредитация</h2><p>Государственная лицензия на образовательную деятельность</p></div>
                  <div className="home-trust-mini"><BadgeCheck className="h-6 w-6 text-blue-700" /><h2>Надёжность и качество</h2><p>Десятки лет опыта и тысячи успешных выпускников</p></div>
                  <div className="home-trust-mini"><Star className="h-6 w-6 text-blue-700" /><h2>Практическая польза</h2><p>Программы, созданные вместе с профессиональным сообществом</p></div>
                </div>
              </div>
            </ClientReveal>
            <ClientReveal><Hero3DScene /></ClientReveal>
          </div>
          <div className="hero-stats-grid mt-5 grid gap-3 home-hero-stats mt-8 gap-4 rounded-[1.5rem] border border-blue-100 bg-white/94 p-4 shadow-executive sm:grid-cols-2 lg:grid-cols-5 lg:p-5">
            {[
              { icon: GraduationCap, value: '20+ лет', label: 'опыта в сфере образования' },
              { icon: Users, value: '10 000+', label: 'выпускников по всей России' },
              { icon: BookOpenCheck, value: '40', label: 'ключевых программ' },
              { icon: Landmark, value: '40', label: 'направлений' },
              { icon: BadgeCheck, value: '4.9 из 5', label: 'средняя оценка качества программ' }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.value} className="flex items-center gap-4 border-slate-200 px-3 py-3 lg:border-r lg:last:border-r-0">
                  <Icon className="h-10 w-10 shrink-0 text-blue-700" />
                  <div>
                    <p className="text-2xl font-black text-slate-950">{item.value}</p>
                    <p className="mt-1 text-sm font-semibold leading-5 text-slate-600">{item.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="container-px mx-auto max-w-7xl py-5 sm:py-6">
        {isStaticPublicMode ? (
          <div className="executive-panel luxury-border flex flex-col gap-4 rounded-[1.25rem] p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="institutional-kicker text-[10px]">Быстрый переход</p>
              <h2 className="mt-2 font-serif text-2xl font-bold text-slate-950">Каталог программ открыт для просмотра</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Для быстрой публичной версии поиск работает через каталог. Откройте раздел программ и выберите направление обучения.</p>
            </div>
            <Button href="/services" variant="secondary" className="shrink-0">Перейти в каталог <ArrowRight className="h-4 w-4" /></Button>
          </div>
        ) : (
          <ClientReveal><SearchSuggest services={services} /></ClientReveal>
        )}
      </section>

      <section className="py-7 sm:py-8 lg:py-10">
        <div className="container-px mx-auto max-w-7xl">
          <ClientReveal>
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <SectionHeading eyebrow="Ключевые программы" title="40 ключевых программ профессиональной переподготовки" description="Каталог сформирован по исходным материалам МГИПО: 40 ключевых программ, часы, стоимость и диплом по итогам обучения." />
              <Button href="/services" variant="secondary" className="shrink-0">Все программы <ArrowRight className="h-4 w-4" /></Button>
            </div>
          </ClientReveal>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {popularServices.map((service, index) => <ClientReveal key={service.id} delay={index * 0.05}><ServiceCard service={service} compact /></ClientReveal>)}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 py-7 sm:py-8 lg:py-10">
        <div className="container-px mx-auto max-w-7xl">
          <ClientReveal><SectionHeading eyebrow="Порядок работы" title="От управленческого запроса до итоговых документов" align="center" /></ClientReveal>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {processSteps.map((step, index) => <ClientReveal key={step.title} delay={index * 0.05}><Card className="min-h-full"><div className="flex h-11 w-11 items-center justify-center rounded-[0.9rem] bg-blue-50 text-lg font-black text-blue-800">{index + 1}</div><h3 className="mt-5 text-lg font-black text-slate-950">{step.title}</h3><p className="mt-3 text-[1.03rem] leading-7 text-slate-600">{step.description}</p></Card></ClientReveal>)}
          </div>
        </div>
      </section>

      <section className="py-7 sm:py-8 lg:py-10">
        <div className="container-px mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <ClientReveal><SectionHeading eyebrow="Перечни МГИПО" title="Широкий каталог программ для профессионального перехода и роста" description="В каталоге представлены управленческие, инженерные, правовые, финансовые, гуманитарные, технические и отраслевые направления профессиональной переподготовки." /></ClientReveal>
            <div className="grid gap-4 sm:grid-cols-2">
              {homeBenefits.map((item, index) => { const Icon = item.icon; return <ClientReveal key={item.title} delay={index * 0.05}><Card className="min-h-full"><Icon className="h-8 w-8 text-blue-800" /><h3 className="mt-5 text-xl font-black text-slate-950">{item.title}</h3><p className="mt-3 text-[1.03rem] leading-7 text-slate-600">{item.description}</p></Card></ClientReveal>; })}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white py-7 sm:py-8 lg:py-10">
        <div className="container-px mx-auto max-w-7xl">
          <ClientReveal><SectionHeading eyebrow="Доверие" title="Документы, реквизиты и условия вынесены в открытые разделы" description="Для управленческого решения важны прозрачность, официальность и аккуратная обработка запроса." /></ClientReveal>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {trustSignals.map((item, index) => { const Icon = item.icon; return <ClientReveal key={item.title} delay={index * 0.05}><Card className="min-h-full"><Icon className="h-8 w-8 text-blue-800" /><h3 className="mt-5 text-xl font-black text-slate-950">{item.title}</h3><p className="mt-3 text-[1.03rem] leading-7 text-slate-600">{item.description}</p></Card></ClientReveal>; })}
          </div>
        </div>
      </section>

      <section className="py-7 sm:py-8 lg:py-10">
        <div className="container-px mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <ClientReveal>
            <div className="executive-panel-soft luxury-border rounded-[1.45rem] p-5 sm:p-7">
              <Building2 className="h-10 w-10 text-blue-800" />
              <h2 className="executive-serif mt-5 text-3xl font-bold leading-tight text-slate-950 sm:text-4xl">{siteContent.organizationTitle}</h2>
              <p className="mt-4 text-[1.05rem] leading-8 text-slate-600">{siteContent.organizationDescription}</p>
              <div className="mt-6 grid gap-3 text-[1.03rem] leading-7 text-slate-600">
                <span className="flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-blue-800" /> Подбор по должности, отрасли и управленческой задаче</span>
                <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-blue-800" /> Индивидуальные и корпоративные заявки</span>
                <span className="flex items-center gap-2"><FileBadge2 className="h-4 w-4 text-blue-800" /> Официальные документы и закрывающий комплект</span>
                <span className="flex items-center gap-2"><Globe2 className="h-4 w-4 text-blue-800" /> Формат для руководителей и международных команд</span>
              </div>
              <Button href="/corporate" variant="secondary" className="mt-5"><FileBadge2 className="h-4 w-4" /> Раздел для организаций</Button>
            </div>
          </ClientReveal>
          {isStaticPublicMode ? (
            <div className="executive-panel luxury-border rounded-[1.6rem] p-6 sm:p-7">
              <p className="institutional-kicker text-[10px]">Конфиденциальный запрос</p>
              <h2 className="mt-3 font-serif text-3xl font-bold text-slate-950">Получить консультацию</h2>
              <p className="mt-4 text-[1.05rem] leading-8 text-slate-600">Публичная GitHub Pages-версия показывает сайт быстро и без серверной админки. Для реальной отправки заявок подключается серверная версия с базой данных.</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1rem] border border-blue-100 bg-blue-50/60 p-4"><h3 className="font-black text-slate-950">Контакты</h3><p className="mt-2 text-sm text-slate-600">+7 (495) 120-00-01<br />info@mgipo.ru</p></div>
                <div className="rounded-[1rem] border border-blue-100 bg-blue-50/60 p-4"><h3 className="font-black text-slate-950">Подбор программы</h3><p className="mt-2 text-sm text-slate-600">Откройте каталог и выберите направление обучения.</p></div>
              </div>
              <Button href="/contacts" className="mt-6">Открыть контакты <ArrowRight className="h-4 w-4" /></Button>
            </div>
          ) : (
            <ClientReveal delay={0.1}><LeadForm source="home" services={services} /></ClientReveal>
          )}
        </div>
      </section>
    </SiteShell>
  );
}

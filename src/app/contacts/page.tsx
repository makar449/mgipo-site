import { BookOpenCheck, Clock3, FileBadge2, GraduationCap, Landmark, LockKeyhole, Mail, MapPin, Phone, ShieldCheck, Users } from 'lucide-react';
import { SiteShell } from '@/components/site-shell';
import { LeadForm } from '@/components/lead-form';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { createMetadata } from '@/lib/metadata';
import { getPublishedCmsContent, getPublishedServices } from '@/lib/admin-cms';

export const metadata = createMetadata({ title: 'Контакты', description: 'Контакты образовательного центра, форма заявки, телефон, email и адрес.', path: '/contacts' });


const contactBenefits = [
  { icon: ShieldCheck, title: 'Полная конфиденциальность', text: 'Данные используются только для обработки вашего запроса и не передаются третьим лицам.' },
  { icon: FileBadge2, title: 'Официальные документы', text: 'Предоставляем договор, оферту и закрывающие документы в соответствии с требованиями закона.' },
  { icon: Users, title: 'Персональный менеджер', text: 'За вашим запросом закрепляется специалист, который сопровождает вас на всех этапах сотрудничества.' },
  { icon: Clock3, title: 'Быстрый ответ', text: 'Мы стремимся ответить на ваш запрос в кратчайшие сроки в рабочее время.' }
] as const;

const stats = [
  { icon: GraduationCap, value: '20+ лет', label: 'опыта в сфере образования' },
  { icon: Users, value: '10 000+', label: 'выпускников по всей России' },
  { icon: BookOpenCheck, value: '40', label: 'ключевых программ' },
  { icon: Landmark, value: '40', label: 'направлений' },
  { icon: ShieldCheck, value: '4.9 из 5', label: 'средняя оценка качества программ' }
] as const;

export default async function ContactsPage() {
  const services = await getPublishedServices();
  const cms = await getPublishedCmsContent();
  const company = cms.identity;
  return (
    <SiteShell cms={cms}>
      <section className="consult-reference-section relative overflow-hidden py-8 sm:py-10 lg:py-12">
        <div className="absolute inset-0 arch-grid opacity-35" aria-hidden="true" />
        <div className="container-px relative mx-auto max-w-[1620px]">
          <Breadcrumbs items={[{ label: 'Контакты' }]} />
          <div className="consult-reference-shell luxury-border mt-7 rounded-[2rem] border border-blue-100 bg-white/76 p-3 shadow-institutional sm:p-5 lg:p-7">
            <div className="grid gap-7 lg:grid-cols-[minmax(420px,0.82fr)_minmax(0,1.18fr)] xl:grid-cols-[560px_minmax(0,1fr)] xl:gap-10">
              <LeadForm source="contacts" services={services} compact />
              <div className="relative min-h-[620px] overflow-hidden rounded-[1.75rem] border border-blue-100 bg-gradient-to-br from-white/78 via-blue-50/50 to-white/92 p-6 shadow-executive sm:p-8 lg:p-10">
                <div className="absolute inset-0 consult-architecture" aria-hidden="true" />
                <div className="absolute -right-14 -top-14 h-[28rem] w-[28rem] rounded-full border border-blue-200/80" aria-hidden="true" />
                <div className="absolute right-6 top-12 h-[20rem] w-[20rem] rounded-full border border-blue-100/80" aria-hidden="true" />
                <div className="relative z-10 max-w-2xl">
                  <h1 className="executive-serif text-[2.4rem] font-bold leading-[0.98] text-slate-950 sm:text-[3rem]">Ваш запрос<br />в надёжных руках</h1>
                  <p className="mt-5 max-w-[42rem] text-[1.08rem] font-medium leading-8 text-slate-600">Мы ценим доверие и гарантируем профессиональный, конфиденциальный подход к каждому обращению.</p>
                </div>
                <div className="relative z-10 mt-8 grid gap-5 md:grid-cols-2">
                  {contactBenefits.map((item) => {
                    const Icon = item.icon;
                    return (
                      <article key={item.title} className="rounded-[1.35rem] border border-blue-100 bg-white/92 p-6 shadow-executive backdrop-blur-xl">
                        <span className="flex h-14 w-14 items-center justify-center rounded-[1rem] border border-blue-100 bg-blue-50 text-blue-700"><Icon className="h-7 w-7" /></span>
                        <h2 className="executive-serif mt-6 text-[1.55rem] font-bold leading-tight text-slate-950">{item.title}</h2>
                        <p className="mt-3 text-base font-medium leading-7 text-slate-600">{item.text}</p>
                      </article>
                    );
                  })}
                </div>
                <div className="relative z-10 mt-7 grid gap-4 rounded-[1.35rem] border border-blue-100 bg-white/88 p-5 shadow-executive sm:grid-cols-3">
                  <a href={`tel:${company.phone.replace(/[^+0-9]/g, '')}`} className="flex items-center gap-3 rounded-[1rem] px-2 py-2 text-slate-700 transition hover:bg-blue-50 hover:text-blue-800"><Phone className="h-5 w-5 text-blue-700" /> {company.phone}</a>
                  <a href={`mailto:${company.email}`} className="flex items-center gap-3 rounded-[1rem] px-2 py-2 text-slate-700 transition hover:bg-blue-50 hover:text-blue-800"><Mail className="h-5 w-5 text-blue-700" /> {company.email}</a>
                  <span className="flex items-center gap-3 rounded-[1rem] px-2 py-2 text-slate-700"><MapPin className="h-5 w-5 text-blue-700" /> {company.address}</span>
                </div>
              </div>
            </div>
            <div className="mt-5 grid gap-4 rounded-[1.45rem] border border-blue-100 bg-white/90 p-4 shadow-executive sm:grid-cols-2 lg:grid-cols-5">
              {stats.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.value} className="flex items-center gap-4 border-slate-200 p-2 lg:border-r lg:last:border-r-0">
                    <Icon className="h-9 w-9 shrink-0 text-blue-700" />
                    <div>
                      <p className="text-2xl font-black text-slate-950">{item.value}</p>
                      <p className="mt-1 text-sm font-semibold leading-5 text-slate-600">{item.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="mx-auto mt-5 flex max-w-4xl items-start justify-center gap-3 text-center text-sm font-semibold leading-6 text-slate-600"><LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" /> Наша цель — помочь вам сделать правильный выбор и получить качественное образование, которое откроет новые возможности для профессионального роста.</p>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

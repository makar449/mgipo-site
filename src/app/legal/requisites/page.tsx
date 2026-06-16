import { SiteShell } from '@/components/site-shell';
import { Card } from '@/components/ui/card';
import { SectionHeading } from '@/components/ui/section-heading';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { createMetadata } from '@/lib/metadata';
import { company } from '@/lib/company';

export const metadata = createMetadata({ title: 'Реквизиты', description: 'Реквизиты образовательного центра.', path: '/legal/requisites' });

export default function RequisitesPage() {
  const rows = [
    ['Полное наименование', company.requisites.legalName],
    ['ИНН', company.requisites.inn],
    ['КПП', company.requisites.kpp],
    ['ОГРН', company.requisites.ogrn],
    ['Банк', company.requisites.bank],
    ['БИК', company.requisites.bik],
    ['Расчётный счёт', company.requisites.account],
    ['Корреспондентский счёт', company.requisites.correspondentAccount],
    ['Адрес', company.address],
    ['Email', company.email]
  ] as const;
  return (
    <SiteShell>
      <section className="container-px mx-auto max-w-4xl py-16 sm:py-20">
        <Breadcrumbs items={[{ href: '/documents', label: 'Документы' }, { label: 'Реквизиты' }]} />
        <SectionHeading className="mt-8" eyebrow="Реквизиты" title="Юридическая информация" description="Данные компании для договоров, оплаты и официального взаимодействия." />
        <Card className="mt-8 overflow-hidden p-0">
          <div className="divide-y divide-slate-200">
            {rows.map(([label, value]) => <div key={label} className="grid gap-2 p-5 sm:grid-cols-[220px_1fr]"><p className="text-sm font-bold uppercase tracking-[0.16em] text-slate-600">{label}</p><p className="font-semibold text-slate-600">{value}</p></div>)}
          </div>
        </Card>
      </section>
    </SiteShell>
  );
}

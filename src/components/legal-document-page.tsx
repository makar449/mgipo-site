import { Download, FileCheck2, FileText, Headphones, Landmark, LockKeyhole, ShieldCheck } from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Button } from '@/components/ui/button';
import { SiteShell } from '@/components/site-shell';
import { company } from '@/lib/company';

export type LegalDocumentPageProps = {
  title: string;
  currentLabel: string;
  description?: string;
  paragraphs: ReadonlyArray<string>;
  variant?: 'privacy' | 'consent' | 'terms' | 'requisites';
};

const summaryByVariant = {
  privacy: ['Какие данные обрабатываются', 'Цели обработки', 'Доступ сотрудников', 'Удаление и уточнение данных'],
  consent: ['Подтверждение согласия', 'Цели обратной связи', 'Порядок отзыва', 'Защита от передачи третьим лицам'],
  terms: ['Общие условия', 'Условия обучения и оплаты', 'Ответственность сторон', 'Оформление документов', 'Заключительные положения'],
  requisites: ['Юридическое лицо', 'Банковские данные', 'Контакты', 'Адрес и реквизиты']
} as const;

const bottomAssurances = [
  { icon: ShieldCheck, title: 'Соответствие закону', text: 'Работаем по нормам законодательства РФ' },
  { icon: LockKeyhole, title: 'Защита данных', text: 'Гарантируем конфиденциальность информации' },
  { icon: FileCheck2, title: 'Прозрачные условия', text: 'Чёткий порядок взаимодействия' },
  { icon: Headphones, title: 'Поддержка', text: 'Ответим на вопросы на каждом этапе' }
] as const;

export function LegalDocumentPage({ title, currentLabel, description = 'Раздел помогает пользователю заранее понять условия обработки данных и взаимодействия с образовательным центром.', paragraphs, variant = 'terms' }: LegalDocumentPageProps) {
  const summary = summaryByVariant[variant];
  return (
    <SiteShell>
      <section className="legal-reference-page relative overflow-hidden py-12 sm:py-14 lg:py-16">
        <div className="absolute inset-0 arch-grid opacity-35" aria-hidden="true" />
        <div className="container-px relative mx-auto max-w-[1500px]">
          <Breadcrumbs items={[{ href: '/documents', label: 'Документы' }, { label: currentLabel }]} />
          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_390px]">
            <div className="min-w-0">
              <p className="institutional-kicker">Правовая информация</p>
              <h1 className="executive-serif mt-4 max-w-[760px] text-[2.65rem] font-bold leading-[0.95] text-slate-950 sm:text-[4.1rem] lg:text-[4.55rem]">{title}</h1>
              <p className="mt-5 max-w-[760px] text-[1.12rem] leading-8 text-slate-600">{description}</p>

              <article className="legal-reference-card luxury-border mt-7 rounded-[1.65rem] border border-blue-100 bg-white/96 p-5 shadow-institutional sm:p-7 lg:p-8">
                <div className="grid gap-6 lg:grid-cols-[230px_1fr] lg:items-center">
                  <div className="legal-shield-visual hidden lg:flex" aria-hidden="true">
                    <div className="legal-shield-orbit">
                      <ShieldCheck className="h-28 w-28 text-blue-700" strokeWidth={1.45} />
                    </div>
                  </div>
                  <div className="min-w-0 divide-y divide-slate-200/80">
                    {paragraphs.map((paragraph) => (
                      <div key={paragraph} className="grid gap-4 py-4 first:pt-0 last:pb-0 sm:grid-cols-[14px_1fr]">
                        <span className="mt-3 hidden h-2.5 w-2.5 rounded-full bg-blue-600 shadow-cobalt sm:block" aria-hidden="true" />
                        <p className="text-[1.05rem] font-medium leading-8 text-slate-600">{paragraph}</p>
                      </div>
                    ))}
                    <div className="grid gap-4 py-4 sm:grid-cols-[14px_1fr]">
                      <span className="mt-3 hidden h-2.5 w-2.5 rounded-full bg-blue-600 shadow-cobalt sm:block" aria-hidden="true" />
                      <p className="text-[1.05rem] font-medium leading-8 text-slate-600"><strong className="font-black text-slate-800">Организация:</strong> {company.requisites.legalName}. Контакт для вопросов: {company.email}.</p>
                    </div>
                  </div>
                </div>
              </article>

              <div className="mt-6 grid gap-3 rounded-[1.35rem] border border-blue-100 bg-white/86 p-4 shadow-executive sm:grid-cols-2 lg:grid-cols-4">
                {bottomAssurances.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="flex gap-3 border-slate-200 py-2 lg:border-r lg:last:border-r-0">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[0.9rem] border border-blue-100 bg-blue-50 text-blue-700"><Icon className="h-5 w-5" /></span>
                      <div>
                        <p className="text-sm font-black text-slate-950">{item.title}</p>
                        <p className="mt-1 text-xs font-semibold leading-5 text-slate-600">{item.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <aside className="grid content-start gap-5 lg:pt-20">
              <div className="rounded-[1.35rem] border border-blue-100 bg-white/88 p-5 shadow-executive">
                <div className="flex items-center gap-4">
                  <span className="legal-orbit-badge flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-blue-100 bg-blue-50 text-blue-700"><ShieldCheck className="h-8 w-8" /></span>
                  <div>
                    <h2 className="text-lg font-black text-blue-800">Надёжно и прозрачно</h2>
                    <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">Мы соблюдаем требования законодательства РФ и защищаем ваши данные.</p>
                  </div>
                </div>
              </div>
              <div className="rounded-[1.45rem] border border-slate-200 bg-white p-6 shadow-executive">
                <h2 className="executive-serif text-2xl font-bold text-slate-950">Краткое содержание</h2>
                <div className="mt-5 divide-y divide-slate-200">
                  {summary.map((item, index) => (
                    <div key={item} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[0.8rem] bg-blue-50 text-blue-700">{index % 2 === 0 ? <Landmark className="h-4 w-4" /> : <FileText className="h-4 w-4" />}</span>
                      <span className="text-base font-semibold text-slate-600">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-[1.45rem] border border-blue-100 bg-blue-50/70 p-6 shadow-executive">
                <div className="flex items-center gap-4">
                  <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.15rem] bg-white text-blue-700 shadow-executive"><FileCheck2 className="h-9 w-9" /></span>
                  <div>
                    <h2 className="text-lg font-black text-blue-800">Всегда под рукой</h2>
                    <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">Скачайте актуальную версию документа в формате PDF.</p>
                  </div>
                </div>
                <Button href="/documents" variant="secondary" size="sm" className="mt-5"><Download className="h-4 w-4" /> Скачать PDF</Button>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

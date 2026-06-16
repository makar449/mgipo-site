import { ArrowRight, Download, FileBadge2, ShieldCheck } from 'lucide-react';
import { SiteShell } from '@/components/site-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SectionHeading } from '@/components/ui/section-heading';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { createMetadata } from '@/lib/metadata';
import { getPublishedCmsContent } from '@/lib/admin-cms';
import { publicProfessionalRetrainingCatalog } from '@/features/services/program-catalog';

export const metadata = createMetadata({ title: 'Лицензии и документы', description: 'Документы образовательного центра: лицензия, образцы документов, реквизиты и правовая информация.', path: '/documents' });


export default async function DocumentsPage() {
  const cms = await getPublishedCmsContent();
  const docs = [
    { title: 'Лицензия на образовательную деятельность', description: cms.identity.license },
    ...cms.documents.filter((document) => document.visible).map((document) => ({ title: document.title, description: document.description, href: document.href }))
  ];
  return (
    <SiteShell>
      <section className="container-px mx-auto max-w-7xl py-16 sm:py-20">
        <Breadcrumbs items={[{ label: 'Документы' }]} />
        <SectionHeading className="mt-8" eyebrow="Документы" title="Открытая информация о компании и документах" description="Раздел помогает заранее понять, какие документы связаны с обучением, заявками и юридическими условиями." />
        <div className="mt-8 grid gap-5 md:grid-cols-2">{docs.map((doc) => <Card key={doc.title}><FileBadge2 className="h-8 w-8 text-blue-700" /><h2 className="mt-5 text-2xl font-black text-slate-950">{doc.title}</h2><p className="mt-3 leading-7 text-slate-600">{doc.description}</p><Button href={'href' in doc ? doc.href : '/contacts#lead-form'} variant="secondary" className="mt-6">{'href' in doc ? 'Открыть' : 'Запросить консультацию'} <ArrowRight className="h-4 w-4" /></Button></Card>)}</div>
      </section>

      <section className="section-y bg-white">
        <div className="container-px mx-auto max-w-7xl">
          <SectionHeading eyebrow="Перечни ДПП" title="Оригинальные перечни программ профессиональной переподготовки" description="PDF-файлы из загруженной папки доступны по 40 ключевым программам. Они помогают сверить реальные программы, часы и стартовую стоимость." />
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {publicProfessionalRetrainingCatalog.map((entry) => (
              <Card key={entry.slug} className="min-h-full">
                <FileBadge2 className="h-8 w-8 text-blue-700" />
                <h2 className="mt-5 text-xl font-black text-slate-950">{entry.category}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">Ключевая программа: {entry.programs[0]}. Формат: профессиональная переподготовка с присвоением квалификации.</p>
                <Button href={entry.sourceDocumentHref} variant="secondary" size="sm" className="mt-5" target="_blank" rel="noreferrer"><Download className="h-4 w-4" /> Скачать PDF</Button>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="section-y bg-slate-50">
        <div className="container-px mx-auto max-w-7xl">
          <SectionHeading eyebrow="Правовые разделы" title="Юридическая информация для заявок и сотрудничества" />
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">{cms.documents.filter((doc) => doc.visible).map((doc) => <Card key={doc.href}><ShieldCheck className="h-8 w-8 text-blue-700" /><h2 className="mt-5 text-xl font-black text-slate-950">{doc.title}</h2><p className="mt-3 text-sm leading-7 text-slate-600">{doc.description}</p><Button href={doc.href} variant="secondary" size="sm" className="mt-5">Открыть</Button></Card>)}</div>
        </div>
      </section>
    </SiteShell>
  );
}

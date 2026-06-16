'use client';

import { BadgeCheck, Home, LayoutList, ListChecks, SearchCheck, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdminCard, AdminShell, SectionTitle, StatusPill, leadTone, useAdmin } from '../shared';

export function AdminDashboardPage() {
  return (
    <AdminShell active="dashboard" title="Дашборд" description="Сводка по сайту, заявкам, готовности разделов и быстрым действиям. Раздел грузит только дашборд, а не всю админку одним куском.">
      <DashboardContent />
    </AdminShell>
  );
}

function DashboardContent() {
  const { data, content } = useAdmin();
  const activeLeads = data.leads.filter((lead) => lead.status !== 'Закрыта').length;
  const publishedServices = data.services.filter((service) => service.status === 'published').length;
  const publishedPages = data.pages.filter((page) => page.status === 'published').length;
  const seoReady = data.seo.filter((item) => item.robots === 'index, follow').length;
  return (
    <>
      <SectionTitle eyebrow="Сводка" title="Панель управления без тяжёлой общей загрузки" description="Быстрые карточки, заявки, SEO и состояние сайта вынесены в отдельный маршрут дашборда." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AdminCard className="bg-blue-50/70"><p className="text-3xl font-black text-blue-900">{publishedServices}</p><p className="mt-2 text-sm font-bold text-slate-600">опубликованных программ</p></AdminCard>
        <AdminCard className="bg-emerald-50/70"><p className="text-3xl font-black text-emerald-800">{activeLeads}</p><p className="mt-2 text-sm font-bold text-slate-600">активных заявок</p></AdminCard>
        <AdminCard className="bg-slate-50"><p className="text-3xl font-black text-slate-950">{publishedPages}</p><p className="mt-2 text-sm font-bold text-slate-600">страниц опубликовано</p></AdminCard>
        <AdminCard className="bg-blue-50/70"><p className="text-3xl font-black text-blue-900">{seoReady}/{data.seo.length}</p><p className="mt-2 text-sm font-bold text-slate-600">SEO-настроек готово</p></AdminCard>
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <AdminCard>
          <h2 className="text-2xl font-black text-slate-950">Быстрые действия</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Button href="/admin/home/" variant="secondary"><Home className="h-4 w-4" /> Главная</Button>
            <Button href="/admin/services/" variant="secondary"><LayoutList className="h-4 w-4" /> Программы</Button>
            <Button href="/admin/leads/" variant="secondary"><Users className="h-4 w-4" /> Заявки</Button>
            <Button href="/admin/seo/" variant="secondary"><SearchCheck className="h-4 w-4" /> SEO</Button>
          </div>
          <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-800">Текущий оффер главной</p>
            <h3 className="mt-3 font-serif text-3xl font-bold text-slate-950">{content.heroLine1} {content.heroLine2} {content.heroLine3}</h3>
            <p className="mt-3 text-sm font-semibold leading-7 text-slate-600">{content.heroDescription}</p>
          </div>
        </AdminCard>
        <AdminCard>
          <h2 className="text-2xl font-black text-slate-950">Готовность к показу</h2>
          <div className="mt-5 grid gap-3">
            {['Публичная часть опубликована', 'Админ-разделы имеют отдельные URL', 'Переходы прогреваются заранее', 'Следующий этап — Supabase-синхронизация'].map((item) => <div key={item} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"><BadgeCheck className="h-5 w-5 text-emerald-700" /><span className="text-sm font-bold text-slate-700">{item}</span></div>)}
          </div>
        </AdminCard>
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <AdminCard><h2 className="text-2xl font-black text-slate-950">Последние заявки</h2><div className="mt-4 grid gap-3">{data.leads.slice(0, 3).map((lead) => <div key={lead.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4"><div className="flex flex-wrap items-center justify-between gap-2"><p className="font-black text-slate-950">{lead.name}</p><StatusPill tone={leadTone(lead.status)}>{lead.status}</StatusPill></div><p className="mt-2 text-sm font-semibold text-slate-600">{lead.program} · {lead.phone}</p></div>)}</div></AdminCard>
        <AdminCard><h2 className="text-2xl font-black text-slate-950">Журнал</h2><div className="mt-4 grid gap-3">{data.audit.slice(0, 4).map((event) => <div key={event.id} className="flex gap-3 rounded-2xl border border-slate-100 bg-white p-4"><ListChecks className="mt-1 h-5 w-5 text-blue-700" /><div><p className="font-black text-slate-950">{event.title}</p><p className="mt-1 text-xs font-semibold text-slate-500">{event.section} · {event.date}</p></div></div>)}</div></AdminCard>
      </div>
    </>
  );
}

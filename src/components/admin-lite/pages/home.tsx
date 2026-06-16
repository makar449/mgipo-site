'use client';

import { Button } from '@/components/ui/button';
import { AdminCard, AdminShell, Field, SectionTitle, fieldClassName, textareaClassName, useAdmin } from '../shared';

export function AdminHomePage() {
  return (
    <AdminShell active="home" title="Главная страница" description="Редактирование первого экрана, кнопок и контактной информации без подгрузки остальных разделов админки.">
      <HomeContent />
    </AdminShell>
  );
}

function HomeContent() {
  const { content, updateContent } = useAdmin();
  return (
    <>
      <SectionTitle eyebrow="Главная" title="Первый экран сайта" description="Изменения сохраняются в демо-режиме и применяются на публичной части этого устройства." action={<Button href="/" variant="secondary">Открыть главную</Button>} />
      <div className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
        <AdminCard className="grid gap-5">
          <Field label="Верхний бейдж"><input className={fieldClassName()} value={content.heroEyebrow} onChange={(event) => updateContent('heroEyebrow', event.target.value)} /></Field>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Заголовок 1"><input className={fieldClassName()} value={content.heroLine1} onChange={(event) => updateContent('heroLine1', event.target.value)} /></Field>
            <Field label="Заголовок 2"><input className={fieldClassName()} value={content.heroLine2} onChange={(event) => updateContent('heroLine2', event.target.value)} /></Field>
            <Field label="Заголовок 3"><input className={fieldClassName()} value={content.heroLine3} onChange={(event) => updateContent('heroLine3', event.target.value)} /></Field>
          </div>
          <Field label="Описание"><textarea className={textareaClassName('min-h-36')} value={content.heroDescription} onChange={(event) => updateContent('heroDescription', event.target.value)} /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Основная кнопка"><input className={fieldClassName()} value={content.primaryButton} onChange={(event) => updateContent('primaryButton', event.target.value)} /></Field>
            <Field label="Вторая кнопка"><input className={fieldClassName()} value={content.secondaryButton} onChange={(event) => updateContent('secondaryButton', event.target.value)} /></Field>
          </div>
        </AdminCard>
        <AdminCard className="bg-blue-50/70">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-800">Live preview</p>
          <h2 className="mt-3 font-serif text-4xl font-bold leading-tight text-slate-950">{content.heroLine1}<br />{content.heroLine2}<br />{content.heroLine3}</h2>
          <p className="mt-4 text-sm font-semibold leading-7 text-slate-600">{content.heroDescription}</p>
          <div className="mt-5 flex flex-wrap gap-2"><span className="rounded-full bg-blue-700 px-4 py-2 text-sm font-black text-white">{content.primaryButton}</span><span className="rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-black text-blue-900">{content.secondaryButton}</span></div>
        </AdminCard>
      </div>
    </>
  );
}

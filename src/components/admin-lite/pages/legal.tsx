'use client';

import { AdminCard, AdminShell, Field, SectionTitle, StatusPill, createChangeHandler, fieldClassName, statusTone, textareaClassName, useAdmin, type DemoLegal } from '../shared';

export function AdminLegalPage() { return <AdminShell active="legal" title="Правовые страницы" description="Политика, согласие, оферта и реквизиты на отдельном лёгком маршруте."><LegalContent /></AdminShell>; }
function LegalContent() {
  const { data, updateData } = useAdmin();
  function updateLegal<K extends keyof DemoLegal>(id: DemoLegal['id'], key: K, value: DemoLegal[K]) { updateData((c) => ({ ...c, legal: createChangeHandler(c.legal, id, key, value) }), 'Изменена правовая страница', 'Правовые'); }
  return <><SectionTitle eyebrow="Правовая информация" title="Редактор юридических страниц" /><div className="grid gap-4">{data.legal.map((page) => <AdminCard key={page.id} className="grid gap-4"><div className="flex flex-wrap items-center justify-between gap-3"><StatusPill tone={statusTone(page.status)}>{page.status}</StatusPill><span className="text-sm font-bold text-slate-500">Обновлено: {page.updatedAt}</span></div><Field label="Заголовок"><input className={fieldClassName()} value={page.title} onChange={(event) => updateLegal(page.id, 'title', event.target.value)} /></Field><Field label="Описание"><input className={fieldClassName()} value={page.description} onChange={(event) => updateLegal(page.id, 'description', event.target.value)} /></Field><Field label="Текст"><textarea className={textareaClassName('min-h-32')} value={page.body} onChange={(event) => updateLegal(page.id, 'body', event.target.value)} /></Field></AdminCard>)}</div></>;
}

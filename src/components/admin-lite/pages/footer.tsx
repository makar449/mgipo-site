'use client';

import { AdminCard, AdminShell, Field, SectionTitle, fieldClassName, textareaClassName, useAdmin } from '../shared';

export function AdminFooterPage() { return <AdminShell active="footer" title="Футер" description="Контент нижнего блока сайта без подгрузки таблиц заявок и программ."><FooterContent /></AdminShell>; }
function FooterContent() {
  const { content, updateContent } = useAdmin();
  return <><SectionTitle eyebrow="Футер" title="Нижний блок сайта" /><div className="grid gap-5 lg:grid-cols-[1fr_0.85fr]"><AdminCard className="grid gap-5"><Field label="Описание"><textarea className={textareaClassName('min-h-36')} value={content.footerDescription} onChange={(event) => updateContent('footerDescription', event.target.value)} /></Field><Field label="Режим работы"><input className={fieldClassName()} value={content.workHours} onChange={(event) => updateContent('workHours', event.target.value)} /></Field></AdminCard><AdminCard className="bg-blue-50/70"><h2 className="font-serif text-3xl font-bold text-slate-950">МГИПО</h2><p className="mt-4 text-sm font-semibold leading-7 text-slate-600">{content.footerDescription}</p><p className="mt-5 rounded-2xl border border-blue-100 bg-white p-4 text-sm font-black text-blue-900">{content.workHours}</p></AdminCard></div></>;
}

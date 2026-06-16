'use client';

import { AdminCard, AdminShell, Field, SectionTitle, fieldClassName, useAdmin } from '../shared';

export function AdminContactsPage() { return <AdminShell active="contacts" title="Контакты" description="Телефон, email, адрес и часы работы на отдельном маршруте."><ContactsContent /></AdminShell>; }
function ContactsContent() {
  const { content, updateContent } = useAdmin();
  return <><SectionTitle eyebrow="Контакты" title="Контактная информация" /><div className="grid gap-5 lg:grid-cols-2"><AdminCard className="grid gap-5"><Field label="Телефон"><input className={fieldClassName()} value={content.phone} onChange={(event) => updateContent('phone', event.target.value)} /></Field><Field label="Email"><input className={fieldClassName()} value={content.email} onChange={(event) => updateContent('email', event.target.value)} /></Field><Field label="Адрес"><input className={fieldClassName()} value={content.address} onChange={(event) => updateContent('address', event.target.value)} /></Field><Field label="Часы работы"><input className={fieldClassName()} value={content.workHours} onChange={(event) => updateContent('workHours', event.target.value)} /></Field></AdminCard><AdminCard className="bg-blue-50/70"><p className="text-sm font-black uppercase tracking-[0.18em] text-blue-800">Preview</p><h2 className="mt-3 font-serif text-3xl font-bold text-slate-950">Контакты института</h2><p className="mt-4 text-lg font-black text-slate-950">{content.phone}</p><p className="mt-2 text-base font-bold text-blue-900">{content.email}</p><p className="mt-2 text-sm font-semibold text-slate-600">{content.address}</p><p className="mt-2 text-sm font-semibold text-slate-600">{content.workHours}</p></AdminCard></div></>;
}

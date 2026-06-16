'use client';

import { ListChecks } from 'lucide-react';
import { AdminCard, AdminShell, SectionTitle, useAdmin } from '../shared';

export function AdminAuditPage() { return <AdminShell active="audit" title="Журнал действий" description="История изменений демо-админки."><AuditContent /></AdminShell>; }
function AuditContent() { const { data } = useAdmin(); return <><SectionTitle eyebrow="Аудит" title="История изменений" /><div className="grid gap-3">{data.audit.map((event) => <AdminCard key={event.id}><div className="flex gap-3"><ListChecks className="mt-1 h-5 w-5 text-blue-700" /><div><p className="font-black text-slate-950">{event.title}</p><p className="mt-1 text-sm font-semibold text-slate-500">{event.section} · {event.actor} · {event.date}</p></div></div></AdminCard>)}</div></>; }

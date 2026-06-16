'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdminCard, AdminShell, Field, SectionTitle, StatusPill, createChangeHandler, fieldClassName, makeId, statusTone, useAdmin, type DemoDocument } from '../shared';

export function AdminDocumentsPage() { return <AdminShell active="documents" title="Документы" description="Редактор документов и ссылок без загрузки остальных разделов."><DocumentsContent /></AdminShell>; }
function DocumentsContent() {
  const { data, updateData } = useAdmin();
  function addDocument() { updateData((c) => ({ ...c, documents: [{ id: makeId('doc'), title: 'Новый документ', type: 'PDF', href: '/documents/file.pdf', status: 'draft', updatedAt: 'сейчас' }, ...c.documents] }), 'Добавлен документ', 'Документы'); }
  function updateDocument<K extends keyof DemoDocument>(id: string, key: K, value: DemoDocument[K]) { updateData((c) => ({ ...c, documents: createChangeHandler(c.documents, id, key, value) }), 'Изменён документ', 'Документы'); }
  return <><SectionTitle eyebrow="Документы" title="Файлы, лицензии и правовые ссылки" action={<Button type="button" onClick={addDocument}><Plus className="h-4 w-4" /> Добавить</Button>} /><div className="grid gap-4">{data.documents.map((doc) => <AdminCard key={doc.id}><div className="grid gap-4 md:grid-cols-[1fr_0.55fr_1fr_0.4fr]"><Field label="Название"><input className={fieldClassName()} value={doc.title} onChange={(event) => updateDocument(doc.id, 'title', event.target.value)} /></Field><Field label="Тип"><input className={fieldClassName()} value={doc.type} onChange={(event) => updateDocument(doc.id, 'type', event.target.value)} /></Field><Field label="Ссылка"><input className={fieldClassName()} value={doc.href} onChange={(event) => updateDocument(doc.id, 'href', event.target.value)} /></Field><div className="grid gap-2"><span className="text-xs font-black uppercase tracking-[0.16em] text-slate-600">Статус</span><StatusPill tone={statusTone(doc.status)}>{doc.status}</StatusPill></div></div></AdminCard>)}</div></>;
}

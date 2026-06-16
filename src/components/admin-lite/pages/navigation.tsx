'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdminCard, AdminShell, Field, SectionTitle, StatusPill, createChangeHandler, fieldClassName, makeId, statusTone, useAdmin, type DemoMenuItem } from '../shared';

export function AdminNavigationPage() { return <AdminShell active="navigation" title="Навигация" description="Настройка меню сайта отдельной страницей."><NavigationContent /></AdminShell>; }
function NavigationContent() {
  const { data, updateData } = useAdmin();
  function addItem() { updateData((c) => ({ ...c, navigation: [...c.navigation, { id: makeId('nav'), label: 'Новый пункт', href: '/new/', group: 'Главное меню', order: c.navigation.length + 1, status: 'draft' }] }), 'Добавлен пункт меню', 'Навигация'); }
  function updateItem<K extends keyof DemoMenuItem>(id: string, key: K, value: DemoMenuItem[K]) { updateData((c) => ({ ...c, navigation: createChangeHandler(c.navigation, id, key, value) }), 'Изменён пункт меню', 'Навигация'); }
  return <><SectionTitle eyebrow="Меню" title="Пункты навигации" action={<Button type="button" onClick={addItem}><Plus className="h-4 w-4" /> Добавить</Button>} /><div className="grid gap-4">{[...data.navigation].sort((a,b)=>a.order-b.order).map((item) => <AdminCard key={item.id}><div className="grid gap-4 md:grid-cols-[1fr_1fr_0.45fr_0.45fr]"><Field label="Название"><input className={fieldClassName()} value={item.label} onChange={(event) => updateItem(item.id, 'label', event.target.value)} /></Field><Field label="Ссылка"><input className={fieldClassName()} value={item.href} onChange={(event) => updateItem(item.id, 'href', event.target.value)} /></Field><Field label="Порядок"><input className={fieldClassName()} type="number" value={item.order} onChange={(event) => updateItem(item.id, 'order', Number(event.target.value))} /></Field><div className="grid gap-2"><span className="text-xs font-black uppercase tracking-[0.16em] text-slate-600">Статус</span><StatusPill tone={statusTone(item.status)}>{item.status}</StatusPill></div></div></AdminCard>)}</div></>;
}

'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdminCard, AdminShell, Field, SectionTitle, StatusPill, createChangeHandler, fieldClassName, makeId, statusTone, textareaClassName, useAdmin, type DemoCategory } from '../shared';

export function AdminCategoriesPage() {
  return <AdminShell active="categories" title="Категории" description="Отдельная страница управления направлениями программ."><CategoriesContent /></AdminShell>;
}
function CategoriesContent() {
  const { data, updateData } = useAdmin();
  function addCategory() { updateData((c) => ({ ...c, categories: [{ id: makeId('cat'), title: 'Новая категория', slug: 'novaya-kategoriya', count: 0, status: 'draft', description: 'Описание категории.' }, ...c.categories] }), 'Добавлена категория', 'Категории'); }
  function updateCategory<K extends keyof DemoCategory>(id: string, key: K, value: DemoCategory[K]) { updateData((c) => ({ ...c, categories: createChangeHandler(c.categories, id, key, value) }), 'Изменена категория', 'Категории'); }
  return <><SectionTitle eyebrow="Категории" title="Направления обучения" action={<Button type="button" onClick={addCategory}><Plus className="h-4 w-4" /> Добавить</Button>} /><div className="grid gap-4 md:grid-cols-2">{data.categories.map((category) => <AdminCard key={category.id} className="grid gap-4"><div className="flex items-center justify-between gap-3"><StatusPill tone={statusTone(category.status)}>{category.status}</StatusPill><span className="text-sm font-black text-blue-800">{category.count} программ</span></div><Field label="Название"><input className={fieldClassName()} value={category.title} onChange={(event) => updateCategory(category.id, 'title', event.target.value)} /></Field><Field label="Slug"><input className={fieldClassName()} value={category.slug} onChange={(event) => updateCategory(category.id, 'slug', event.target.value)} /></Field><Field label="Описание"><textarea className={textareaClassName('min-h-28')} value={category.description} onChange={(event) => updateCategory(category.id, 'description', event.target.value)} /></Field></AdminCard>)}</div></>;
}

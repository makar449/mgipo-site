'use client';

import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdminCard, AdminShell, Field, SectionTitle, StatusPill, createChangeHandler, fieldClassName, makeId, statusTone, useAdmin, type DemoService } from '../shared';

export function AdminServicesPage() {
  return <AdminShell active="services" title="Программы" description="Управление программами каталога. Этот маршрут загружает только редактор программ."><ServicesContent /></AdminShell>;
}

function ServicesContent() {
  const { data, updateData } = useAdmin();
  function addService() {
    updateData((current) => ({ ...current, services: [{ id: makeId('srv'), title: 'Новая программа', slug: 'novaya-programma', category: 'Новая категория', format: 'Онлайн', duration: '256 часов', price: 'от 10 000 ₽', document: 'Диплом', status: 'draft', popular: false, updatedAt: 'сейчас' }, ...current.services] }), 'Добавлена программа', 'Программы');
  }
  function updateService<K extends keyof DemoService>(id: string, key: K, value: DemoService[K]) {
    updateData((current) => ({ ...current, services: createChangeHandler(current.services, id, key, value) }), 'Изменена программа', 'Программы');
  }
  function removeService(id: string) {
    updateData((current) => ({ ...current, services: current.services.filter((item) => item.id !== id) }), 'Удалена программа', 'Программы');
  }
  return <>
    <SectionTitle eyebrow="Каталог" title="Программы обучения" description="Карточки можно редактировать, менять статус, цену, длительность и категорию." action={<Button type="button" onClick={addService}><Plus className="h-4 w-4" /> Добавить</Button>} />
    <div className="grid gap-4">{data.services.map((service) => <AdminCard key={service.id}>
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between"><div className="grid flex-1 gap-4 md:grid-cols-2 xl:grid-cols-3"><Field label="Название"><input className={fieldClassName()} value={service.title} onChange={(event) => updateService(service.id, 'title', event.target.value)} /></Field><Field label="Slug"><input className={fieldClassName()} value={service.slug} onChange={(event) => updateService(service.id, 'slug', event.target.value)} /></Field><Field label="Категория"><input className={fieldClassName()} value={service.category} onChange={(event) => updateService(service.id, 'category', event.target.value)} /></Field><Field label="Формат"><input className={fieldClassName()} value={service.format} onChange={(event) => updateService(service.id, 'format', event.target.value)} /></Field><Field label="Длительность"><input className={fieldClassName()} value={service.duration} onChange={(event) => updateService(service.id, 'duration', event.target.value)} /></Field><Field label="Цена"><input className={fieldClassName()} value={service.price} onChange={(event) => updateService(service.id, 'price', event.target.value)} /></Field></div><div className="flex flex-wrap gap-2 xl:w-52"><StatusPill tone={statusTone(service.status)}>{service.status}</StatusPill><select className={fieldClassName()} value={service.status} onChange={(event) => updateService(service.id, 'status', event.target.value as DemoService['status'])}><option value="published">Опубликовано</option><option value="draft">Черновик</option><option value="hidden">Скрыто</option></select><Button type="button" variant="secondary" onClick={() => removeService(service.id)}><Trash2 className="h-4 w-4" /> Удалить</Button></div></div>
    </AdminCard>)}</div>
  </>;
}

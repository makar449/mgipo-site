'use client';

import { services } from '@/features/services/data';
import { ServiceCard } from '@/components/service-card';
import { Button } from '@/components/ui/button';
import { useProgramStorage } from '@/components/use-program-storage';

export function FavoritesClient() {
  const { favoriteIds, clearFavorites } = useProgramStorage();
  const favoriteServices = services.filter((service) => favoriteIds.includes(service.id));
  if (favoriteServices.length === 0) {
    return (
      <div className="glass luxury-border rounded-[2rem] p-8 text-center">
        <h1 className="text-4xl font-black text-slate-950">Избранное пока пустое</h1>
        <p className="mx-auto mt-4 max-w-xl text-slate-600">Добавляйте программы в избранное из каталога — они появятся здесь.</p>
        <Button href="/services" className="mt-7">Перейти в каталог</Button>
      </div>
    );
  }
  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-sm font-bold uppercase tracking-[0.22em] text-blue-700">Избранное</p><h1 className="mt-2 text-4xl font-black text-slate-950">Сохранённые программы</h1></div>
        <Button type="button" variant="secondary" onClick={clearFavorites}>Очистить избранное</Button>
      </div>
      <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">{favoriteServices.map((service) => <ServiceCard key={service.id} service={service} />)}</div>
    </div>
  );
}

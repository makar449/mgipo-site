'use client';

import Link from 'next/link';
import { ArrowRight, BadgeCheck, Clock3, FileBadge2, Landmark, MonitorPlay, Scale } from 'lucide-react';
import type { Service } from '@/features/services/types';
import { formatPrice } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import { normalizeInternalHref } from '@/lib/routes';
import { useProgramStorage } from '@/components/use-program-storage';

const accentMap: Record<Service['accent'], string> = {
  cyan: 'border-blue-100 bg-blue-50 text-blue-800',
  blue: 'border-blue-100 bg-blue-50 text-blue-900',
  green: 'border-emerald-100 bg-emerald-50 text-emerald-800',
  orange: 'border-orange-100 bg-orange-50 text-orange-800',
  violet: 'border-indigo-100 bg-indigo-50 text-indigo-800',
  gold: 'border-blue-100 bg-blue-50 text-blue-800'
};

type ServiceCardProps = {
  service: Service;
  compact?: boolean;
};

export function ServiceCard({ service, compact = false }: ServiceCardProps) {
  const { favoriteIds, compareIds, toggleFavorite, toggleCompare } = useProgramStorage();
  const favorite = favoriteIds.includes(service.id);
  const compared = compareIds.includes(service.id);

  return (
    <article className="group executive-panel blue-rule relative flex min-h-full min-w-0 flex-col overflow-hidden rounded-[1.35rem] p-4 transition duration-300 hover:shadow-institutional sm:p-5">
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className={cn('rounded-xl border p-3', accentMap[service.accent])}>
          <Landmark className="h-6 w-6" />
        </div>
        <div className="flex shrink-0 flex-col gap-2 min-[420px]:flex-row">
          <button type="button" onClick={() => toggleFavorite(service.id)} className={cn('focus-ring rounded-xl border px-2.5 py-2 text-[11px] font-black leading-none transition sm:px-3 sm:text-xs', favorite ? 'border-blue-200 bg-blue-50 text-blue-800' : 'border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-blue-800')}>
            {favorite ? 'В избранном' : 'Избранное'}
          </button>
          <button type="button" aria-label={compared ? 'Убрать из сравнения' : 'Добавить в сравнение'} onClick={() => toggleCompare(service.id)} className={cn('focus-ring rounded-xl border px-2.5 py-2 text-[11px] font-black leading-none transition sm:px-3 sm:text-xs', compared ? 'border-blue-300 bg-blue-50 text-blue-800' : 'border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-blue-800')}>
            <Scale className="inline h-3.5 w-3.5" /> <span className="sr-only sm:not-sr-only sm:ml-1">{compared ? 'В сравнении' : 'Сравнить'}</span>
          </button>
        </div>
      </div>
      <Link href={normalizeInternalHref(`/services/${service.slug}`)} className="focus-ring mt-4 block min-w-0 rounded-xl">
        <p className="text-[11px] font-black uppercase tracking-[0.14em] text-blue-800">{service.category}</p>
        <h3 className="service-card-title mt-2 line-clamp-3 font-serif text-xl font-bold leading-tight text-slate-950 transition group-hover:text-blue-800 sm:text-2xl">{service.title}</h3>
        <p className={cn('mt-3 text-sm leading-6 text-slate-600 service-title-safe', compact ? 'line-clamp-3' : 'line-clamp-4')}>{service.shortDescription}</p>
      </Link>
      <div className="mt-4 grid gap-2 text-sm text-slate-600">
        <span className="flex min-w-0 items-start gap-2"><Clock3 className="h-4 w-4 text-blue-700" />{service.duration}</span>
        <span className="flex min-w-0 items-start gap-2"><MonitorPlay className="h-4 w-4 text-blue-700" />{service.formats.join(' / ')}</span>
        <span className="flex min-w-0 items-start gap-2"><FileBadge2 className="h-4 w-4 text-blue-700" />{service.documentType}</span>
      </div>
      <div className="mt-auto pt-5">
        <div className="rounded-[1rem] border border-blue-100 bg-blue-50 p-3 sm:p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.14em] text-blue-800">Стоимость</p>
          <p className="mt-1 text-xl font-black text-slate-950 sm:text-2xl">от {formatPrice(service.minPrice)}</p>
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <Button href={normalizeInternalHref(`/services/${service.slug}`)} className="flex-1">Подробнее <ArrowRight className="h-4 w-4" /></Button>
          <Button href={`/contacts#lead-form`} variant="secondary" className="flex-1"><BadgeCheck className="h-4 w-4" /> Заявка</Button>
        </div>
      </div>
    </article>
  );
}

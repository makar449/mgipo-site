'use client';

import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { RotateCcw, Search, SlidersHorizontal } from 'lucide-react';
import { applyServiceFilters, type ServiceFilters, type SortMode } from '@/features/services/filter';
import { categories, documentTypes, trainingFormats, type DocumentType, type Service, type ServiceCategory, type TrainingFormat } from '@/features/services/types';
import { searchServices } from '@/features/search/search';
import { ServiceCard } from '@/components/service-card';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/format';

const PAGE_SIZE = 24;

function getPriceBounds(source: ReadonlyArray<Service>): { min: number; max: number } {
  return {
    min: Math.min(...source.map((service) => service.minPrice)),
    max: Math.max(...source.map((service) => service.maxPrice))
  };
}

function createInitialFilters(source: ReadonlyArray<Service>): ServiceFilters {
  const priceBounds = getPriceBounds(source);
  return {
    query: '',
    category: 'all',
    format: 'all',
    documentType: 'all',
    minPrice: priceBounds.min,
    maxPrice: priceBounds.max,
    onlyPopular: false,
    onlyNew: false,
    sort: 'popular'
  };
}

const sortOptions: ReadonlyArray<{ value: SortMode; label: string }> = [
  { value: 'popular', label: 'Сначала популярные' },
  { value: 'price_asc', label: 'Цена по возрастанию' },
  { value: 'price_desc', label: 'Цена по убыванию' },
  { value: 'duration_asc', label: 'Короткие программы' },
  { value: 'new_first', label: 'Сначала новые' }
];

export function CatalogClient({ services }: { services: ReadonlyArray<Service> }) {
  const priceBounds = useMemo(() => getPriceBounds(services), [services]);
  const initialFilters = useMemo(() => createInitialFilters(services), [services]);
  const [filters, setFilters] = useState<ServiceFilters>(initialFilters);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const deferredQuery = useDeferredValue(filters.query);

  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const filteredServices = useMemo(() => {
    const searchFilters: ServiceFilters = { ...filters, query: deferredQuery };
    const base = applyServiceFilters(services, searchFilters);
    return deferredQuery.trim().length === 0 ? base : searchServices(base, deferredQuery, 160).map((item) => item.service);
  }, [filters, deferredQuery, services]);

  const displayedServices = useMemo(() => filteredServices.slice(0, visibleCount), [filteredServices, visibleCount]);
  const hasMore = visibleCount < filteredServices.length;

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [deferredQuery, filters.category, filters.format, filters.documentType, filters.minPrice, filters.maxPrice, filters.onlyPopular, filters.onlyNew, filters.sort]);

  const update = <Key extends keyof ServiceFilters>(key: Key, value: ServiceFilters[Key]) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const filterPanel = (
    <aside className="executive-panel h-fit min-w-0 rounded-[1.35rem] p-4 sm:p-5 lg:sticky lg:top-24">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="institutional-kicker text-[10px]">Фильтр</p>
          <h2 className="mt-2 font-serif text-2xl font-bold text-slate-950">Подбор программы</h2>
        </div>
        <SlidersHorizontal className="h-5 w-5 text-blue-700" />
      </div>
      <div className="mt-5 grid gap-5">
        <div className="grid gap-2">
          <label htmlFor="catalog-search" className="text-xs font-black uppercase tracking-[0.18em] text-slate-600">Поиск по смыслу</label>
          <div className="flex min-h-12 items-center gap-2 rounded-[0.9rem] border border-slate-200 bg-white px-3">
            <Search className="h-4 w-4 text-blue-700" />
            <input id="catalog-search" value={filters.query} onChange={(event) => update('query', event.target.value)} className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-slate-950 outline-none placeholder:text-slate-500" placeholder="руководитель, медик, новая профессия" />
          </div>
        </div>
        <Select label="Категория" value={filters.category} onChange={(value) => update('category', value as ServiceCategory | 'all')} options={[{ value: 'all', label: 'Все категории' }, ...categories.map((item) => ({ value: item, label: item }))]} />
        <Select label="Формат" value={filters.format} onChange={(value) => update('format', value as TrainingFormat | 'all')} options={[{ value: 'all', label: 'Любой формат' }, ...trainingFormats.map((item) => ({ value: item, label: item }))]} />
        <Select label="Документ" value={filters.documentType} onChange={(value) => update('documentType', value as DocumentType | 'all')} options={[{ value: 'all', label: 'Любой документ' }, ...documentTypes.map((item) => ({ value: item, label: item }))]} />
        <div className="grid gap-3">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-600">Стоимость</p>
          <div className="grid grid-cols-2 gap-3">
            <NumberField label="от" value={filters.minPrice} min={priceBounds.min} max={filters.maxPrice} onChange={(value) => update('minPrice', value)} />
            <NumberField label="до" value={filters.maxPrice} min={filters.minPrice} max={priceBounds.max} onChange={(value) => update('maxPrice', value)} />
          </div>
          <p className="text-xs text-slate-600">Диапазон: {formatPrice(filters.minPrice)} — {formatPrice(filters.maxPrice)}</p>
        </div>
        <label className="flex items-center gap-3 rounded-[1rem] border border-slate-200 bg-slate-50 p-3 text-sm font-bold text-slate-600">
          <input type="checkbox" checked={filters.onlyPopular} onChange={(event) => update('onlyPopular', event.target.checked)} className="h-4 w-4 accent-blue-700" />
          Только популярные
        </label>
        <label className="flex items-center gap-3 rounded-[1rem] border border-slate-200 bg-slate-50 p-3 text-sm font-bold text-slate-600">
          <input type="checkbox" checked={filters.onlyNew} onChange={(event) => update('onlyNew', event.target.checked)} className="h-4 w-4 accent-blue-700" />
          Новые программы
        </label>
        <Button type="button" variant="secondary" onClick={() => setFilters(initialFilters)} className="w-full">
          <RotateCcw className="h-4 w-4" /> Сбросить фильтры
        </Button>
      </div>
    </aside>
  );

  return (
    <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(250px,286px)_minmax(0,1fr)] xl:gap-6">
      <div className="lg:hidden">
        <Button type="button" variant="secondary" onClick={() => setFiltersOpen((value) => !value)} className="w-full">
          <SlidersHorizontal className="h-4 w-4" /> {filtersOpen ? 'Скрыть фильтры' : 'Показать фильтры'}
        </Button>
      </div>
      <div className={filtersOpen ? 'block' : 'hidden lg:block'}>{filterPanel}</div>
      <section className="min-w-0">
        <div className="mb-5 flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="institutional-kicker">Каталог</p>
            <h1 className="executive-serif mt-3 text-3xl font-bold leading-tight text-slate-950 sm:text-5xl">Программы обучения</h1>
            <p className="mt-3 text-sm text-slate-600">Найдено программ: {filteredServices.length}. Показано: {displayedServices.length}.</p>
          </div>
          <Select label="Сортировка" value={filters.sort} onChange={(value) => update('sort', value as SortMode)} options={sortOptions} compact />
        </div>
        {filteredServices.length > 0 ? (
          <>
            <div className="grid min-w-0 gap-4 xl:grid-cols-2">
              {displayedServices.map((service) => <ServiceCard key={service.id} service={service} />)}
            </div>
            {hasMore ? (
              <div className="mt-6 flex justify-center">
                <Button type="button" variant="secondary" onClick={() => setVisibleCount((current) => Math.min(current + PAGE_SIZE, filteredServices.length))}>
                  Показать ещё {Math.min(PAGE_SIZE, filteredServices.length - visibleCount)}
                </Button>
              </div>
            ) : null}
          </>
        ) : (
          <div className="executive-panel rounded-[1.55rem] p-8 text-center">
            <h2 className="font-serif text-3xl font-bold text-slate-950">Ничего не найдено</h2>
            <p className="mx-auto mt-3 max-w-lg text-slate-600">Измените фильтры или оставьте заявку — эксперт подберёт программу вручную.</p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Button type="button" variant="secondary" onClick={() => setFilters(initialFilters)}>Сбросить</Button>
              <Button href="/contacts#lead-form">Оставить заявку</Button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function Select({ label, value, onChange, options, compact = false }: { label: string; value: string; onChange: (value: string) => void; options: ReadonlyArray<{ value: string; label: string }>; compact?: boolean }) {
  return (
    <label className={compact ? 'grid min-w-0 gap-2 sm:min-w-[220px]' : 'grid gap-2'}>
      <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-600">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="focus-ring min-h-12 w-full min-w-0 rounded-[0.9rem] border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-950 outline-none">
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>
  );
}

function NumberField({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (value: number) => void }) {
  return (
    <label className="grid gap-1">
      <span className="text-xs text-slate-600">{label}</span>
      <input type="number" min={min} max={max} value={value} onChange={(event) => onChange(Number(event.target.value))} className="focus-ring min-h-11 w-full min-w-0 rounded-[0.9rem] border border-slate-200 bg-white px-3 text-sm font-bold text-slate-950 outline-none" />
    </label>
  );
}

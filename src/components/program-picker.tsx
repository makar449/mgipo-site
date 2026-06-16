'use client';

import { Search, Check, ChevronDown, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Service } from '@/features/services/types';
import { cn } from '@/lib/cn';

type ProgramPickerProps = {
  value: string;
  onChange: (value: string) => void;
  services: ReadonlyArray<Service>;
  error?: string;
  placeholder?: string;
};

function scoreProgram(query: string, service: Service): number {
  const normalizedQuery = query.trim().toLowerCase();
  if (normalizedQuery.length === 0) return service.popularity;

  const title = service.title.toLowerCase();
  const category = service.category.toLowerCase();
  const keywords = service.keywords.join(' ').toLowerCase();
  const synonyms = service.synonyms.join(' ').toLowerCase();

  let score = 0;
  if (title === normalizedQuery) score += 120;
  if (title.startsWith(normalizedQuery)) score += 90;
  if (title.includes(normalizedQuery)) score += 70;
  if (category.includes(normalizedQuery)) score += 40;
  if (keywords.includes(normalizedQuery)) score += 28;
  if (synonyms.includes(normalizedQuery)) score += 24;

  const queryTokens = normalizedQuery.split(/\s+/).filter(Boolean);
  for (const token of queryTokens) {
    if (title.includes(token)) score += 18;
    if (category.includes(token)) score += 12;
    if (keywords.includes(token)) score += 8;
    if (synonyms.includes(token)) score += 8;
  }

  return score + service.popularity / 10;
}

export function ProgramPicker({ value, onChange, services, error, placeholder = 'Найдите программу или выберите из списка' }: ProgramPickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const rootRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const selectedProgram = useMemo(() => services.find((service) => service.id === value), [services, value]);

  const filteredPrograms = useMemo(() => {
    const items = services
      .map((service) => ({ service, score: scoreProgram(query, service) }))
      .filter((item) => query.trim().length === 0 || item.score > 0)
      .sort((left, right) => right.score - left.score || right.service.popularity - left.service.popularity)
      .slice(0, query.trim().length === 0 ? 60 : 80)
      .map((item) => item.service);

    return items;
  }, [query, services]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
      if (!(event.target instanceof Node)) return;
      if (rootRef.current !== null && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  useEffect(() => {
    if (open) {
      const timeout = window.setTimeout(() => {
        inputRef.current?.focus();
      }, 20);
      return () => window.clearTimeout(timeout);
    }
    return undefined;
  }, [open]);

  function handleSelect(programId: string): void {
    onChange(programId);
    setOpen(false);
    setQuery('');
  }

  function handleClear(): void {
    onChange('');
    setQuery('');
    setOpen(false);
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={cn(
          'focus-ring flex min-h-[3.35rem] w-full min-w-0 items-center justify-between gap-3 rounded-[1rem] border bg-white px-4 py-3 text-left shadow-sm transition',
          error ? 'border-red-300 ring-1 ring-red-100' : 'border-slate-200 hover:border-blue-300'
        )}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span className="min-w-0 flex-1">
          {selectedProgram ? (
            <span className="block min-w-0">
              <span className="block truncate text-base font-black leading-6 text-slate-950">{selectedProgram.title}</span>
              <span className="mt-0.5 block truncate text-sm font-semibold leading-5 text-slate-500">{selectedProgram.category} · от 10 000 ₽</span>
            </span>
          ) : (
            <span className="block text-base font-semibold text-slate-500">{placeholder}</span>
          )}
        </span>
        <span className="flex shrink-0 items-center gap-2">
          {selectedProgram ? (
            <span
              role="button"
              tabIndex={0}
              onClick={(event) => {
                event.stopPropagation();
                handleClear();
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  event.stopPropagation();
                  handleClear();
                }
              }}
              className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Очистить выбранную программу"
            >
              <X className="h-4 w-4" />
            </span>
          ) : null}
          <ChevronDown className={cn('h-4 w-4 shrink-0 text-slate-500 transition', open && 'rotate-180')} />
        </span>
      </button>

      {open ? (
        <div className="program-picker-dropdown absolute left-0 right-0 top-[calc(100%+0.6rem)] z-50 overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white shadow-[0_24px_60px_rgba(7,21,39,0.16)]">
          <div className="border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white p-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-700" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Поиск по названию, категории, профессии или запросу"
                className="focus-ring min-h-11 w-full rounded-[0.95rem] border border-blue-100 bg-white px-10 pr-4 text-sm font-semibold text-slate-950 outline-none placeholder:text-slate-500"
              />
            </div>
            <p className="mt-2 text-sm font-semibold leading-5 text-slate-500">{query.trim().length > 0 ? `Найдено вариантов: ${filteredPrograms.length}` : 'Начните вводить название или выберите программу из списка.'}</p>
          </div>

          <div className="max-h-[22rem] overflow-y-auto p-2">
            {filteredPrograms.length === 0 ? (
              <div className="rounded-[1rem] border border-slate-100 bg-slate-50 px-4 py-5 text-sm text-slate-600">Ничего не найдено. Попробуйте изменить запрос.</div>
            ) : (
              <div className="grid gap-1">
                {filteredPrograms.map((program) => {
                  const selected = program.id === value;
                  return (
                    <button
                      key={program.id}
                      type="button"
                      onClick={() => handleSelect(program.id)}
                      className={cn(
                        'flex w-full items-start gap-3 rounded-[1rem] border px-3 py-3 text-left transition',
                        selected
                          ? 'border-blue-200 bg-blue-50 shadow-sm'
                          : 'border-transparent bg-white hover:border-slate-200 hover:bg-slate-50'
                      )}
                    >
                      <span className={cn('mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border', selected ? 'border-blue-700 bg-blue-700 text-white' : 'border-slate-300 bg-white text-transparent')}>
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-black leading-5 text-slate-950">{program.title}</span>
                        <span className="mt-1 block text-xs font-semibold leading-5 text-slate-500">{program.category} · {program.duration} · от {program.minPrice.toLocaleString('ru-RU')} ₽</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

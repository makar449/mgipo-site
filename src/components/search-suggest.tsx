'use client';

import Link from 'next/link';
import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { Service } from '@/features/services/types';
import { searchServices } from '@/features/search/search';
import { formatPrice } from '@/lib/format';

type SearchSuggestProps = {
  services: ReadonlyArray<Service>;
};

export function SearchSuggest({ services }: SearchSuggestProps) {
  const [query, setQuery] = useState('');
  const results = useMemo(() => searchServices(services, query, 5), [services, query]);

  return (
    <div className="relative z-20 w-full max-w-5xl">
      <label htmlFor="home-search" className="sr-only">Поиск программы</label>
      <div className="executive-panel luxury-border flex min-h-16 items-center gap-3 rounded-[1.25rem] px-5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-800"><Search className="h-5 w-5" /></span>
        <input
          id="home-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Поиск программ по должности, отрасли, документу или смыслу запроса"
          className="min-w-0 flex-1 bg-transparent text-base font-semibold text-slate-950 outline-none placeholder:text-slate-500"
        />
      </div>
      {query.trim().length > 0 ? (
        <div className="absolute inset-x-0 top-full mt-3 overflow-hidden rounded-[1.4rem] border border-slate-200 bg-white p-2 shadow-executive">
          {results.length > 0 ? results.map((result) => (
            <Link key={result.service.id} href={`/services/${result.service.slug}`} className="grid gap-1 rounded-[1.05rem] px-4 py-3 transition hover:bg-blue-50">
              <span className="text-base font-black text-slate-950">{result.service.title}</span>
              <span className="text-sm text-slate-600">{result.service.category} · от {formatPrice(result.service.minPrice)} · {result.service.documentType}</span>
            </Link>
          )) : (
            <div className="rounded-[1.05rem] px-4 py-5 text-sm text-slate-600">Ничего не найдено. Измените запрос или оставьте заявку — эксперт подберёт программу.</div>
          )}
        </div>
      ) : null}
    </div>
  );
}

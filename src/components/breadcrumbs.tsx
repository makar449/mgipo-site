import Link from 'next/link';
import { normalizeInternalHref } from '@/lib/routes';

export type BreadcrumbItem = {
  href?: string;
  label: string;
};

export function Breadcrumbs({ items }: { items: ReadonlyArray<BreadcrumbItem> }) {
  return (
    <nav aria-label="Хлебные крошки" className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
      <Link href="/" className="transition hover:text-blue-700">Главная</Link>
      {items.map((item) => (
        <span key={item.label} className="flex items-center gap-2">
          <span className="text-slate-600">/</span>
          {item.href ? <Link href={normalizeInternalHref(item.href)} className="transition hover:text-blue-700">{item.label}</Link> : <span className="text-slate-600">{item.label}</span>}
        </span>
      ))}
    </nav>
  );
}

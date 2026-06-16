'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Menu, Phone, Search, X } from 'lucide-react';
import { useState } from 'react';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import type { CmsIdentity, CmsNavigationItem } from '@/features/admin-cms/types';
import { cn } from '@/lib/cn';
import { normalizeInternalHref } from '@/lib/routes';

const fallbackNavigation: ReadonlyArray<CmsNavigationItem> = [
  { id: 'about', href: '/about', label: 'Институт', visible: true },
  { id: 'services', href: '/services', label: 'Программы', visible: true },
  { id: 'corporate', href: '/corporate', label: 'Организациям', visible: true },
  { id: 'documents', href: '/documents', label: 'Документы', visible: true },
  { id: 'contacts', href: '/contacts', label: 'Контакты', visible: true }
];

const labelMap = new Map([
  ['Главная', 'Институт'],
  ['О компании', 'Институт'],
  ['Программы', 'Программы'],
  ['Организациям', 'Поступающим'],
  ['Документы', 'Документы'],
  ['Контакты', 'Контакты']
]);

const dropdownGroups = new Map<string, ReadonlyArray<{ href: string; title: string; description: string }>>([
  ['Институт', [
    { href: '/about', title: 'О компании', description: 'Институт, формат работы и подход' },
    { href: '/corporate', title: 'Организациям', description: 'Обучение команд и закрытые запросы' },
    { href: '/reviews', title: 'Отзывы', description: 'Опыт клиентов и слушателей' },
    { href: '/cases', title: 'Кейсы', description: 'Практические задачи и решения' }
  ]],
  ['Программы', [
    { href: '/services', title: 'Каталог программ', description: 'Все направления и карточки обучения' },
    { href: '/prices', title: 'Цены', description: 'Стоимость и диапазоны программ' },
    { href: '/compare', title: 'Сравнение', description: 'Сравнить выбранные программы' },
    { href: '/favorites', title: 'Избранное', description: 'Сохранённые программы' },
    { href: '/faq', title: 'Вопросы и ответы', description: 'Частые вопросы по обучению' }
  ]],
  ['Поступающим', [
    { href: '/services', title: 'Подобрать программу', description: 'Каталог и быстрый выбор направления' },
    { href: '/contacts#lead-form', title: 'Оставить заявку', description: 'Связаться с менеджером' },
    { href: '/documents', title: 'Документы', description: 'Лицензии и официальные материалы' }
  ]],
  ['Документы', [
    { href: '/documents', title: 'Лицензии и документы', description: 'Основные документы института' },
    { href: '/legal/privacy', title: 'Политика конфиденциальности', description: 'Обработка данных пользователей' },
    { href: '/legal/consent', title: 'Согласие на обработку данных', description: 'Текст пользовательского согласия' },
    { href: '/legal/terms', title: 'Оферта', description: 'Условия взаимодействия' },
    { href: '/legal/requisites', title: 'Реквизиты', description: 'Юридическая информация' }
  ]]
]);

type HeaderProps = {
  identity?: CmsIdentity;
  navigation?: ReadonlyArray<CmsNavigationItem>;
};

export function Header({ identity, navigation = fallbackNavigation }: HeaderProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const rawNavigation = navigation.filter((item) => item.visible && item.href !== '/');
  const visibleNavigation = rawNavigation.length > 0 ? rawNavigation : fallbackNavigation;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/96 backdrop-blur-sm">
      <div className="container-px mx-auto flex h-[5.7rem] max-w-[1560px] items-center gap-5">
        <div className="shrink-0">
          {identity === undefined ? <Logo /> : <Logo identity={identity} />}
        </div>

        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-3 xl:flex" aria-label="Основная навигация">
          {visibleNavigation.map((item) => {
            const normalizedItemHref = normalizeInternalHref(item.href);
            const active = pathname === normalizedItemHref || (normalizedItemHref !== '/' && pathname.startsWith(normalizedItemHref));
            const mappedLabel = labelMap.get(item.label) ?? item.label;
            const dropdownItems = dropdownGroups.get(mappedLabel) ?? [];
            const hasDropdown = dropdownItems.length > 0;
            return (
              <div key={item.id} className="group/nav relative">
                <Link
                  href={normalizedItemHref}
                  prefetch={false}
                  className={cn(
                    'focus-ring relative inline-flex items-center gap-1.5 rounded-[0.8rem] px-3 py-2 text-sm font-bold text-slate-800 transition hover:bg-blue-50 hover:text-blue-700',
                    active && 'bg-blue-50 text-blue-700'
                  )}
                >
                  <span>{mappedLabel}</span>
                  {hasDropdown ? <ChevronDown className="h-3.5 w-3.5 transition group-hover/nav:rotate-180" /> : null}
                </Link>
                {hasDropdown ? (
                  <div className="invisible absolute left-1/2 top-full z-50 w-[22rem] -translate-x-1/2 pt-3 opacity-0 transition duration-150 group-hover/nav:visible group-hover/nav:opacity-100 group-focus-within/nav:visible group-focus-within/nav:opacity-100">
                    <div className="rounded-[1.15rem] border border-blue-100 bg-white p-2 shadow-institutional">
                      {dropdownItems.map((dropdownItem) => (
                        <Link key={dropdownItem.href} href={normalizeInternalHref(dropdownItem.href)} prefetch={false} className="block rounded-[0.95rem] px-4 py-3 transition hover:bg-blue-50">
                          <span className="block text-sm font-black text-slate-950">{dropdownItem.title}</span>
                          <span className="mt-1 block text-xs font-semibold leading-5 text-slate-500">{dropdownItem.description}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>

        <div className="hidden shrink-0 items-center gap-4 xl:flex">
          <Link href="/services/" prefetch={false} className="focus-ring flex h-12 w-12 items-center justify-center rounded-[0.9rem] border border-blue-100 bg-white text-blue-700 shadow-executive transition hover:border-blue-300 hover:bg-blue-50" aria-label="Найти программу"><Search className="h-5 w-5" /></Link>
          {identity !== undefined ? <a data-demo-href="phone" href={`tel:${identity.phone.replace(/[^+0-9]/g, '')}`} className="flex items-center gap-2 whitespace-nowrap text-sm font-bold text-slate-800 transition hover:text-blue-700"><Phone className="h-5 w-5 text-blue-700" /> <span data-demo-text="phone">{identity.phone}</span></a> : null}
          <Button href="/contacts#lead-form" size="md" className="whitespace-nowrap px-6">Подобрать программу</Button>
        </div>

        <button type="button" aria-label={open ? 'Закрыть меню' : 'Открыть меню'} onClick={() => setOpen((value) => !value)} className="focus-ring ml-auto inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-950 shadow-executive xl:hidden">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="container-px mx-auto max-w-7xl pb-4 xl:hidden">
          <div className="executive-panel grid gap-2 rounded-[1.25rem] p-3">
            {visibleNavigation.map((item) => {
              const mappedLabel = labelMap.get(item.label) ?? item.label;
              const normalizedItemHref = normalizeInternalHref(item.href);
              const dropdownItems = dropdownGroups.get(mappedLabel) ?? [];
              return (
                <div key={item.id} className="rounded-xl border border-slate-100 bg-white/80 p-2">
                  <Link href={normalizedItemHref} prefetch={false} onClick={() => setOpen(false)} className="focus-ring block rounded-xl px-3 py-2 text-sm font-black uppercase tracking-[0.08em] text-slate-700 hover:bg-blue-50 hover:text-blue-800">
                    {mappedLabel}
                  </Link>
                  {dropdownItems.length > 0 ? (
                    <div className="mt-1 grid gap-1 pl-2">
                      {dropdownItems.map((dropdownItem) => (
                        <Link key={dropdownItem.href} href={normalizeInternalHref(dropdownItem.href)} prefetch={false} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-800">
                          {dropdownItem.title}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}
            <div className="grid gap-2 sm:grid-cols-2">
              <Button href="/services" variant="secondary" onClick={() => setOpen(false)}>Найти программу</Button>
              <Button href="/contacts#lead-form" onClick={() => setOpen(false)}>Подобрать программу</Button>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}

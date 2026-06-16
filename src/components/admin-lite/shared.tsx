'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { ChangeEvent, ReactNode } from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  BarChart3,
  Eye,
  FileText,
  FolderTree,
  Globe2,
  Home,
  LayoutList,
  ListChecks,
  LogOut,
  Mail,
  Navigation,
  RefreshCw,
  Save,
  ScrollText,
  SearchCheck,
  Settings,
  ShieldCheck,
  Tags,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RoutePerformance } from '@/components/route-performance';
import { cn } from '@/lib/cn';
import {
  DEMO_CONTENT_STORAGE_KEY,
  DEMO_SESSION_STORAGE_KEY,
  defaultDemoContent,
  normalizeDemoContent,
  type DemoContent
} from '@/features/demo-admin/demo-content';
import { demoAdminCategories, demoAdminServices } from '@/features/demo-admin/admin-catalog';

export type AdminSectionId =
  | 'dashboard'
  | 'home'
  | 'services'
  | 'categories'
  | 'documents'
  | 'legal'
  | 'navigation'
  | 'footer'
  | 'contacts'
  | 'leads'
  | 'pages'
  | 'seo'
  | 'settings'
  | 'users'
  | 'audit';

export type DemoStatus = 'published' | 'draft' | 'hidden';
export type LeadStatus = 'Новая' | 'В работе' | 'Ждёт ответа' | 'Закрыта';
export type UserRole = 'Владелец' | 'Администратор' | 'Контент-менеджер' | 'Менеджер заявок' | 'Наблюдатель';

export type DemoService = { id: string; title: string; slug: string; category: string; format: string; duration: string; price: string; document: string; status: DemoStatus; popular: boolean; updatedAt: string; };
export type DemoCategory = { id: string; title: string; slug: string; count: number; status: DemoStatus; description: string; };
export type DemoDocument = { id: string; title: string; type: string; href: string; status: DemoStatus; updatedAt: string; };
export type DemoLegal = { id: 'privacy' | 'consent' | 'offer' | 'requisites'; title: string; description: string; body: string; status: DemoStatus; updatedAt: string; };
export type DemoMenuItem = { id: string; label: string; href: string; group: 'Главное меню' | 'Футер' | 'Быстрые ссылки'; order: number; status: DemoStatus; };
export type DemoLead = { id: string; name: string; phone: string; email: string; program: string; status: LeadStatus; priority: 'Обычная' | 'Высокая' | 'Срочная'; manager: string; note: string; createdAt: string; };
export type DemoPageRecord = { id: string; title: string; href: string; status: DemoStatus; seoStatus: 'Готово' | 'Нужно проверить' | 'Черновик'; lastCheck: string; };
export type DemoSeoRecord = { id: string; page: string; title: string; description: string; robots: 'index, follow' | 'noindex, nofollow'; ogTitle: string; };
export type DemoUser = { id: string; name: string; email: string; role: UserRole; status: 'Активен' | 'Приглашён' | 'Отключён'; lastSeen: string; };
export type DemoAuditEvent = { id: string; title: string; section: string; actor: string; date: string; };

export type DemoAdminData = {
  services: DemoService[];
  categories: DemoCategory[];
  documents: DemoDocument[];
  legal: DemoLegal[];
  navigation: DemoMenuItem[];
  leads: DemoLead[];
  pages: DemoPageRecord[];
  seo: DemoSeoRecord[];
  users: DemoUser[];
  audit: DemoAuditEvent[];
  publicationMode: 'Показ заказчику' | 'Подготовка' | 'Готово к Supabase';
  updatedAt: string;
};

type AdminContextValue = {
  content: DemoContent;
  data: DemoAdminData;
  updateContent: <K extends keyof DemoContent>(key: K, value: DemoContent[K]) => void;
  updateData: (updater: (current: DemoAdminData) => DemoAdminData, eventTitle?: string, section?: string) => void;
  saveAll: () => void;
  reset: () => void;
};

const AdminContext = createContext<AdminContextValue | null>(null);
export const DEMO_ADMIN_DATA_STORAGE_KEY = 'mgipo_demo_admin_data_v5';

export const navItems = [
  { id: 'dashboard', href: '/admin/dashboard/', title: 'Дашборд', subtitle: 'статус сайта', icon: BarChart3 },
  { id: 'home', href: '/admin/home/', title: 'Главная', subtitle: 'первый экран', icon: Home },
  { id: 'services', href: '/admin/services/', title: 'Программы', subtitle: 'каталог', icon: LayoutList },
  { id: 'categories', href: '/admin/categories/', title: 'Категории', subtitle: 'направления', icon: Tags },
  { id: 'documents', href: '/admin/documents/', title: 'Документы', subtitle: 'PDF и лицензии', icon: FileText },
  { id: 'legal', href: '/admin/legal/', title: 'Правовые', subtitle: 'оферта и политика', icon: ScrollText },
  { id: 'navigation', href: '/admin/navigation/', title: 'Навигация', subtitle: 'меню', icon: Navigation },
  { id: 'footer', href: '/admin/footer/', title: 'Футер', subtitle: 'нижний блок', icon: FolderTree },
  { id: 'contacts', href: '/admin/contacts/', title: 'Контакты', subtitle: 'телефон и адрес', icon: Mail },
  { id: 'leads', href: '/admin/leads/', title: 'Заявки', subtitle: 'обращения', icon: Users },
  { id: 'pages', href: '/admin/pages/', title: 'Страницы', subtitle: 'карта сайта', icon: Globe2 },
  { id: 'seo', href: '/admin/seo/', title: 'SEO', subtitle: 'мета-данные', icon: SearchCheck },
  { id: 'settings', href: '/admin/settings/', title: 'Настройки', subtitle: 'режимы', icon: Settings },
  { id: 'users', href: '/admin/users/', title: 'Пользователи', subtitle: 'роли', icon: ShieldCheck },
  { id: 'audit', href: '/admin/audit/', title: 'Журнал', subtitle: 'история', icon: ListChecks }
] as const;



export const defaultAdminData: DemoAdminData = {
  services: demoAdminServices,
  categories: demoAdminCategories,
  documents: [
    { id: 'doc-1', title: 'Лицензия на образовательную деятельность', type: 'PDF', href: '/documents/license.pdf', status: 'published', updatedAt: '2026-06-16' },
    { id: 'doc-2', title: 'Образец диплома', type: 'PDF', href: '/documents/diploma-sample.pdf', status: 'published', updatedAt: '2026-06-15' },
    { id: 'doc-3', title: 'Политика конфиденциальности', type: 'Правовая страница', href: '/legal/privacy/', status: 'published', updatedAt: '2026-06-14' }
  ],
  legal: [
    { id: 'privacy', title: 'Политика конфиденциальности', description: 'Условия обработки и защиты персональных данных.', body: 'Сайт обрабатывает данные, которые пользователь указывает в формах: имя, телефон, email, выбранную программу и комментарий.', status: 'published', updatedAt: '2026-06-16' },
    { id: 'consent', title: 'Согласие на обработку персональных данных', description: 'Согласие пользователя на обработку данных.', body: 'Нажимая кнопку отправки заявки, пользователь подтверждает согласие на обработку указанных данных.', status: 'published', updatedAt: '2026-06-16' },
    { id: 'offer', title: 'Договор оферты', description: 'Условия оказания образовательных услуг.', body: 'Договор оферты описывает порядок записи, оплаты, обучения и получения документов.', status: 'published', updatedAt: '2026-06-16' },
    { id: 'requisites', title: 'Реквизиты', description: 'Юридические данные организации.', body: 'Реквизиты юридического лица, контактная информация и порядок официальных обращений.', status: 'draft', updatedAt: '2026-06-16' }
  ],
  navigation: [
    { id: 'nav-1', label: 'Главная', href: '/', group: 'Главное меню', order: 1, status: 'published' },
    { id: 'nav-2', label: 'О компании', href: '/about/', group: 'Главное меню', order: 2, status: 'published' },
    { id: 'nav-3', label: 'Программы', href: '/services/', group: 'Главное меню', order: 3, status: 'published' },
    { id: 'nav-4', label: 'Организациям', href: '/corporate/', group: 'Главное меню', order: 4, status: 'published' }
  ],
  leads: [
    { id: 'lead-1', name: 'Анна Смирнова', phone: '+7 (999) 120-44-10', email: 'anna@example.ru', program: 'Управление персоналом', status: 'Новая', priority: 'Высокая', manager: 'Екатерина', note: 'Просит дистанционный формат', createdAt: 'сегодня, 12:40' },
    { id: 'lead-2', name: 'Игорь Павлов', phone: '+7 (916) 884-02-18', email: 'igor@example.ru', program: 'Государственное управление', status: 'В работе', priority: 'Обычная', manager: 'Максим', note: 'Нужна смета для организации', createdAt: 'вчера, 17:15' }
  ],
  pages: [
    { id: 'page-1', title: 'Главная', href: '/', status: 'published', seoStatus: 'Готово', lastCheck: 'сегодня' },
    { id: 'page-2', title: 'Каталог программ', href: '/services/', status: 'published', seoStatus: 'Готово', lastCheck: 'сегодня' },
    { id: 'page-3', title: 'Документы', href: '/documents/', status: 'published', seoStatus: 'Нужно проверить', lastCheck: '12 июня' }
  ],
  seo: [
    { id: 'seo-1', page: 'Главная', title: 'МГИПО — программы профессионального развития', description: 'Дополнительное профессиональное образование для руководителей и организаций.', robots: 'index, follow', ogTitle: 'МГИПО — профессиональное развитие' },
    { id: 'seo-2', page: 'Каталог программ', title: 'Каталог программ — МГИПО', description: 'Программы повышения квалификации и переподготовки.', robots: 'index, follow', ogTitle: 'Каталог программ МГИПО' }
  ],
  users: [
    { id: 'user-1', name: 'Макар', email: 'admin@mgipo.ru', role: 'Владелец', status: 'Активен', lastSeen: 'сейчас' },
    { id: 'user-2', name: 'Контент-менеджер', email: 'content@mgipo.ru', role: 'Контент-менеджер', status: 'Приглашён', lastSeen: 'приглашение отправлено' }
  ],
  audit: [
    { id: 'audit-1', title: 'Открыта панель управления', section: 'Дашборд', actor: 'admin@mgipo.ru', date: 'сегодня' },
    { id: 'audit-2', title: 'Обновлён текст главной страницы', section: 'Главная', actor: 'admin@mgipo.ru', date: 'сегодня' }
  ],
  publicationMode: 'Показ заказчику',
  updatedAt: ''
};

function getTodayLabel(): string {
  return new Date().toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
}

export function makeId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 7)}`;
}

function normalizeAdminData(value: unknown): DemoAdminData {
  if (value === null || typeof value !== 'object') return defaultAdminData;
  const record = value as Partial<DemoAdminData>;
  return {
    ...defaultAdminData,
    ...record,
    services: Array.isArray(record.services) && record.services.length >= 40 ? record.services : defaultAdminData.services,
    categories: Array.isArray(record.categories) && record.categories.length >= 20 ? record.categories : defaultAdminData.categories,
    documents: Array.isArray(record.documents) ? record.documents : defaultAdminData.documents,
    legal: Array.isArray(record.legal) ? record.legal : defaultAdminData.legal,
    navigation: Array.isArray(record.navigation) ? record.navigation : defaultAdminData.navigation,
    leads: Array.isArray(record.leads) ? record.leads : defaultAdminData.leads,
    pages: Array.isArray(record.pages) ? record.pages : defaultAdminData.pages,
    seo: Array.isArray(record.seo) ? record.seo : defaultAdminData.seo,
    users: Array.isArray(record.users) ? record.users : defaultAdminData.users,
    audit: Array.isArray(record.audit) ? record.audit : defaultAdminData.audit,
    publicationMode: record.publicationMode ?? defaultAdminData.publicationMode,
    updatedAt: record.updatedAt ?? ''
  };
}

function readContent(): DemoContent {
  try {
    const raw = window.localStorage.getItem(DEMO_CONTENT_STORAGE_KEY);
    return raw === null ? defaultDemoContent : normalizeDemoContent(JSON.parse(raw) as Partial<DemoContent>);
  } catch {
    return defaultDemoContent;
  }
}

function readAdminData(): DemoAdminData {
  try {
    const raw = window.localStorage.getItem(DEMO_ADMIN_DATA_STORAGE_KEY);
    return raw === null ? defaultAdminData : normalizeAdminData(JSON.parse(raw));
  } catch {
    return defaultAdminData;
  }
}

export function useAdmin(): AdminContextValue {
  const context = useContext(AdminContext);
  if (context === null) throw new Error('useAdmin must be used inside AdminShell');
  return context;
}

export function AdminShell({ active, title, description, children }: { active: AdminSectionId; title: string; description: string; children: ReactNode }) {
  const router = useRouter();
  const [content, setContent] = useState<DemoContent>(defaultDemoContent);
  const [data, setData] = useState<DemoAdminData>(defaultAdminData);
  const [message, setMessage] = useState('');
  const [hasSession, setHasSession] = useState(true);

  useEffect(() => {
    setContent(readContent());
    setData(readAdminData());
    setHasSession(window.localStorage.getItem(DEMO_SESSION_STORAGE_KEY) !== null);
  }, []);

  useEffect(() => {
    const highPriority = ['/admin/dashboard/', '/admin/home/', '/admin/services/', '/admin/leads/', '/admin/settings/'];
    const timeout = window.setTimeout(() => highPriority.slice(0, 3).forEach((href, index) => window.setTimeout(() => router.prefetch(href), index * 180)), 900);
    return () => window.clearTimeout(timeout);
  }, [router]);

  const context = useMemo<AdminContextValue>(() => ({
    content,
    data,
    updateContent: (key, value) => setContent((current) => ({ ...current, [key]: value, updatedAt: getTodayLabel() })),
    updateData: (updater, eventTitle = 'Изменены данные', section = title) => setData((current) => {
      const next = updater(current);
      return {
        ...next,
        updatedAt: getTodayLabel(),
        audit: [{ id: makeId('audit'), title: eventTitle, section, actor: 'admin@mgipo.ru', date: getTodayLabel() }, ...next.audit].slice(0, 30)
      };
    }),
    saveAll: () => {
      const nextContent = { ...content, updatedAt: getTodayLabel() };
      const nextData = { ...data, updatedAt: getTodayLabel() };
      window.localStorage.setItem(DEMO_CONTENT_STORAGE_KEY, JSON.stringify(nextContent));
      window.localStorage.setItem(DEMO_ADMIN_DATA_STORAGE_KEY, JSON.stringify(nextData));
      window.dispatchEvent(new Event('mgipo-demo-content-updated'));
      setContent(nextContent);
      setData(nextData);
      setMessage('Сохранено. Изменения применены в демо-режиме на этом устройстве.');
      window.setTimeout(() => setMessage(''), 2600);
    },
    reset: () => {
      window.localStorage.removeItem(DEMO_CONTENT_STORAGE_KEY);
      window.localStorage.removeItem(DEMO_ADMIN_DATA_STORAGE_KEY);
      setContent(defaultDemoContent);
      setData(defaultAdminData);
      setMessage('Демо-данные сброшены.');
      window.setTimeout(() => setMessage(''), 2400);
    }
  }), [content, data, title]);

  function logout(): void {
    window.localStorage.removeItem(DEMO_SESSION_STORAGE_KEY);
    router.push('/admin/login/');
  }

  return (
    <AdminContext.Provider value={context}>
      <RoutePerformance scope="admin" />
      <main className="admin-app min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.12),transparent_34rem),linear-gradient(180deg,#f8fbff_0%,#eef4ff_100%)] px-4 py-5 sm:px-6 lg:px-7">
        <div className="mx-auto max-w-[1580px]">
          <header className="rounded-[1.8rem] border border-blue-100 bg-white/95 p-5 shadow-institutional sm:p-7">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-800">Панель управления сайтом</p>
                <h1 className="mt-3 font-serif text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">{title}</h1>
                <p className="mt-4 max-w-4xl text-base leading-8 text-slate-600">{description}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button type="button" onClick={context.saveAll}><Save className="h-4 w-4" /> Сохранить</Button>
                <Button href="/" variant="secondary"><Eye className="h-4 w-4" /> Открыть сайт</Button>
                <Button type="button" variant="secondary" onClick={context.reset}><RefreshCw className="h-4 w-4" /> Сбросить</Button>
                <Button type="button" variant="secondary" onClick={logout}><LogOut className="h-4 w-4" /> Выйти</Button>
              </div>
            </div>
            {!hasSession ? <p className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">Демо-страница открыта напрямую. Для презентации можно войти через /admin/login/, но раздел уже отображается без ожидания авторизации.</p> : null}
            {message ? <p className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-900">{message}</p> : null}
          </header>

          <div className="mt-5 grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
            <aside className="h-max rounded-[1.35rem] border border-slate-200 bg-white/95 p-3 shadow-executive xl:sticky xl:top-5">
              <nav className="grid gap-2" aria-label="Разделы админ-панели">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.id === active;
                  return (
                    <Link key={item.id} href={item.href} prefetch={false} className={cn('rounded-[1.05rem] border px-4 py-3 transition', isActive ? 'border-blue-200 bg-blue-50 text-blue-900 shadow-sm' : 'border-transparent bg-white text-slate-700 hover:border-slate-200 hover:bg-slate-50')}>
                      <span className="flex items-center gap-2 text-sm font-black"><Icon className="h-4 w-4 text-blue-700" />{item.title}</span>
                      <span className="mt-1 block text-xs font-semibold leading-5 text-slate-500">{item.subtitle}</span>
                    </Link>
                  );
                })}
              </nav>
            </aside>

            <section className="admin-section-content min-w-0 rounded-[1.35rem] border border-slate-200 bg-white/95 p-5 shadow-executive sm:p-7">
              {children}
            </section>
          </div>
        </div>
      </main>
    </AdminContext.Provider>
  );
}

export function SectionTitle({ eyebrow, title, description, action }: { eyebrow: string; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-800">{eyebrow}</p>
        <h2 className="mt-2 font-serif text-3xl font-bold leading-tight text-slate-950 sm:text-4xl">{title}</h2>
        {description ? <p className="mt-3 max-w-3xl text-sm font-semibold leading-7 text-slate-600">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function AdminCard({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('rounded-[1.2rem] border border-slate-200 bg-white p-5 shadow-sm', className)}>{children}</div>;
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="grid gap-2"><span className="text-xs font-black uppercase tracking-[0.16em] text-slate-600">{label}</span>{children}</label>;
}

export function fieldClassName(): string {
  return 'min-h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-950 outline-none transition focus:border-blue-400';
}

export function textareaClassName(extra = ''): string {
  return cn('rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold leading-7 text-slate-950 outline-none transition focus:border-blue-400', extra);
}

export function StatusPill({ children, tone = 'blue' }: { children: ReactNode; tone?: 'blue' | 'green' | 'amber' | 'slate' | 'red' }) {
  const toneClass = {
    blue: 'border-blue-200 bg-blue-50 text-blue-800',
    green: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    amber: 'border-amber-200 bg-amber-50 text-amber-800',
    slate: 'border-slate-200 bg-slate-50 text-slate-700',
    red: 'border-red-200 bg-red-50 text-red-800'
  }[tone];
  return <span className={cn('inline-flex rounded-full border px-3 py-1 text-xs font-black', toneClass)}>{children}</span>;
}

export function statusTone(status: DemoStatus): 'green' | 'amber' | 'slate' {
  if (status === 'published') return 'green';
  if (status === 'draft') return 'amber';
  return 'slate';
}

export function leadTone(status: LeadStatus): 'blue' | 'amber' | 'green' | 'slate' {
  if (status === 'Новая') return 'blue';
  if (status === 'В работе' || status === 'Ждёт ответа') return 'amber';
  if (status === 'Закрыта') return 'green';
  return 'slate';
}

export function createChangeHandler<T extends { id: string }, K extends keyof T>(items: T[], id: string, key: K, value: T[K]): T[] {
  return items.map((item) => item.id === id ? { ...item, [key]: value } : item);
}

export function handleInput(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): string {
  return event.target.value;
}

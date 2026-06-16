"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ChangeEvent, ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import {
  BarChart3,
  CheckCircle2,
  Clock3,
  Download,
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
  Plus,
  RefreshCw,
  Save,
  ScrollText,
  Search,
  SearchCheck,
  Settings,
  ShieldCheck,
  Tags,
  Trash2,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { RoutePerformance } from "@/components/route-performance";
import { cn } from "@/lib/cn";
import {
  DEMO_CONTENT_STORAGE_KEY,
  DEMO_SESSION_STORAGE_KEY,
  defaultDemoContent,
  normalizeDemoContent,
  type DemoContent
} from "@/features/demo-admin/demo-content";

type AdminSectionId =
  | "dashboard"
  | "home"
  | "services"
  | "categories"
  | "documents"
  | "legal"
  | "navigation"
  | "footer"
  | "contacts"
  | "leads"
  | "pages"
  | "seo"
  | "settings"
  | "users"
  | "audit";

type DemoStatus = "published" | "draft" | "hidden";
type LeadStatus = "Новая" | "В работе" | "Ждёт ответа" | "Закрыта";
type UserRole = "Владелец" | "Администратор" | "Контент-менеджер" | "Менеджер заявок" | "Наблюдатель";

type AdminNavItem = {
  id: AdminSectionId;
  href: string;
  title: string;
  subtitle: string;
  icon: typeof Home;
};

type DemoService = {
  id: string;
  title: string;
  slug: string;
  category: string;
  format: string;
  duration: string;
  price: string;
  document: string;
  status: DemoStatus;
  popular: boolean;
  updatedAt: string;
};

type DemoCategory = {
  id: string;
  title: string;
  slug: string;
  count: number;
  status: DemoStatus;
  description: string;
};

type DemoDocument = {
  id: string;
  title: string;
  type: string;
  href: string;
  status: DemoStatus;
  updatedAt: string;
};

type DemoLegal = {
  id: "privacy" | "consent" | "offer" | "requisites";
  title: string;
  description: string;
  body: string;
  status: DemoStatus;
  updatedAt: string;
};

type DemoMenuItem = {
  id: string;
  label: string;
  href: string;
  group: "Главное меню" | "Футер" | "Быстрые ссылки";
  order: number;
  status: DemoStatus;
};

type DemoLead = {
  id: string;
  name: string;
  phone: string;
  email: string;
  program: string;
  status: LeadStatus;
  priority: "Обычная" | "Высокая" | "Срочная";
  manager: string;
  note: string;
  createdAt: string;
};

type DemoPageRecord = {
  id: string;
  title: string;
  href: string;
  status: DemoStatus;
  seoStatus: "Готово" | "Нужно проверить" | "Черновик";
  lastCheck: string;
};

type DemoSeoRecord = {
  id: string;
  page: string;
  title: string;
  description: string;
  robots: "index, follow" | "noindex, nofollow";
  ogTitle: string;
};

type DemoUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "Активен" | "Приглашён" | "Отключён";
  lastSeen: string;
};

type DemoAuditEvent = {
  id: string;
  title: string;
  section: string;
  actor: string;
  date: string;
};

type DemoAdminData = {
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
  publicationMode: "Показ заказчику" | "Подготовка" | "Готово к Supabase";
  updatedAt: string;
};

type AdminContextValue = {
  content: DemoContent;
  data: DemoAdminData;
  updateContent: <K extends keyof DemoContent>(key: K, value: DemoContent[K]) => void;
  updateData: (updater: (current: DemoAdminData) => DemoAdminData, eventTitle?: string, section?: string) => void;
  saveAll: () => void;
};

const AdminContext = createContext<AdminContextValue | null>(null);
const DEMO_ADMIN_DATA_STORAGE_KEY = "mgipo_demo_admin_data_v3";

const navItems: ReadonlyArray<AdminNavItem> = [
  { id: "dashboard", href: "/admin/dashboard/", title: "Дашборд", subtitle: "статус сайта", icon: BarChart3 },
  { id: "home", href: "/admin/home/", title: "Главная", subtitle: "первый экран", icon: Home },
  { id: "services", href: "/admin/services/", title: "Программы", subtitle: "каталог", icon: LayoutList },
  { id: "categories", href: "/admin/categories/", title: "Категории", subtitle: "направления", icon: Tags },
  { id: "documents", href: "/admin/documents/", title: "Документы", subtitle: "PDF и лицензии", icon: FileText },
  { id: "legal", href: "/admin/legal/", title: "Правовые", subtitle: "оферта и политика", icon: ScrollText },
  { id: "navigation", href: "/admin/navigation/", title: "Навигация", subtitle: "меню", icon: Navigation },
  { id: "footer", href: "/admin/footer/", title: "Футер", subtitle: "нижний блок", icon: FolderTree },
  { id: "contacts", href: "/admin/contacts/", title: "Контакты", subtitle: "телефон и адрес", icon: Mail },
  { id: "leads", href: "/admin/leads/", title: "Заявки", subtitle: "обращения", icon: Users },
  { id: "pages", href: "/admin/pages/", title: "Страницы", subtitle: "карта сайта", icon: Globe2 },
  { id: "seo", href: "/admin/seo/", title: "SEO", subtitle: "мета-данные", icon: SearchCheck },
  { id: "settings", href: "/admin/settings/", title: "Настройки", subtitle: "режимы", icon: Settings },
  { id: "users", href: "/admin/users/", title: "Пользователи", subtitle: "роли", icon: ShieldCheck },
  { id: "audit", href: "/admin/audit/", title: "Журнал", subtitle: "история", icon: ListChecks }
];

const defaultAdminData: DemoAdminData = {
  services: [
    { id: "srv-1", title: "Управление персоналом", slug: "upravlenie-personalom", category: "Менеджмент", format: "Дистанционно", duration: "256 часов", price: "от 10 000 ₽", document: "Диплом", status: "published", popular: true, updatedAt: "сегодня" },
    { id: "srv-2", title: "Государственное и муниципальное управление", slug: "gosudarstvennoe-upravlenie", category: "Госслужба", format: "Онлайн", duration: "512 часов", price: "от 12 000 ₽", document: "Диплом", status: "published", popular: true, updatedAt: "вчера" },
    { id: "srv-3", title: "Корпоративное обучение руководителей", slug: "korporativnoe-obuchenie", category: "Организациям", format: "Смешанный", duration: "по ТЗ", price: "по запросу", document: "Удостоверение", status: "draft", popular: false, updatedAt: "12 июня" },
    { id: "srv-4", title: "Охрана труда для руководителей", slug: "ohrana-truda-rukovoditeli", category: "Безопасность", format: "Дистанционно", duration: "72 часа", price: "от 8 500 ₽", document: "Удостоверение", status: "published", popular: false, updatedAt: "10 июня" },
    { id: "srv-5", title: "Профессиональная переподготовка в образовании", slug: "perepodgotovka-obrazovanie", category: "Педагогика", format: "Онлайн", duration: "1024 часа", price: "от 15 000 ₽", document: "Диплом", status: "published", popular: true, updatedAt: "8 июня" }
  ],
  categories: [
    { id: "cat-1", title: "Менеджмент", slug: "menedzhment", count: 74, status: "published", description: "Управление командами, процессами и корпоративным развитием." },
    { id: "cat-2", title: "Государственное управление", slug: "gos-upravlenie", count: 38, status: "published", description: "Программы для служащих, организаций и муниципальных структур." },
    { id: "cat-3", title: "Охрана труда", slug: "ohrana-truda", count: 52, status: "published", description: "Обязательное обучение и повышение квалификации специалистов." },
    { id: "cat-4", title: "Педагогика", slug: "pedagogika", count: 61, status: "published", description: "Педагогические программы и профессиональная переподготовка." },
    { id: "cat-5", title: "Медицина", slug: "medicina", count: 43, status: "draft", description: "Медицинские направления и смежные специальности." },
    { id: "cat-6", title: "Безопасность", slug: "bezopasnost", count: 29, status: "published", description: "Промышленная, транспортная и информационная безопасность." }
  ],
  documents: [
    { id: "doc-1", title: "Лицензия на образовательную деятельность", type: "PDF", href: "/documents/license.pdf", status: "published", updatedAt: "2026-06-16" },
    { id: "doc-2", title: "Образец диплома профессиональной переподготовки", type: "PDF", href: "/documents/diploma-sample.pdf", status: "published", updatedAt: "2026-06-15" },
    { id: "doc-3", title: "Политика конфиденциальности", type: "Правовая страница", href: "/legal/privacy/", status: "published", updatedAt: "2026-06-14" },
    { id: "doc-4", title: "Согласие на обработку данных", type: "Правовая страница", href: "/legal/consent/", status: "published", updatedAt: "2026-06-14" },
    { id: "doc-5", title: "Договор оферты", type: "Правовая страница", href: "/legal/terms/", status: "published", updatedAt: "2026-06-13" }
  ],
  legal: [
    { id: "privacy", title: "Политика конфиденциальности", description: "Условия обработки и защиты персональных данных.", body: "Сайт обрабатывает данные, которые пользователь указывает в формах: имя, телефон, email, выбранную программу, способ связи и комментарий. Данные используются для обратной связи, подбора программы, подготовки документов и обработки заявки.", status: "published", updatedAt: "2026-06-16" },
    { id: "consent", title: "Согласие на обработку персональных данных", description: "Согласие пользователя на обработку данных.", body: "Нажимая кнопку отправки заявки, пользователь подтверждает согласие на обработку указанных персональных данных. Пользователь вправе отозвать согласие, направив обращение на электронную почту компании.", status: "published", updatedAt: "2026-06-16" },
    { id: "offer", title: "Договор оферты", description: "Условия оказания образовательных услуг.", body: "Договор оферты описывает порядок записи, оплаты, прохождения обучения и получения документов. Конкретные условия программы уточняются до начала обучения.", status: "published", updatedAt: "2026-06-16" },
    { id: "requisites", title: "Реквизиты", description: "Юридические данные организации.", body: "Реквизиты юридического лица, контактная информация, адрес и порядок направления официальных обращений.", status: "draft", updatedAt: "2026-06-16" }
  ],
  navigation: [
    { id: "nav-1", label: "Главная", href: "/", group: "Главное меню", order: 1, status: "published" },
    { id: "nav-2", label: "О компании", href: "/about/", group: "Главное меню", order: 2, status: "published" },
    { id: "nav-3", label: "Программы", href: "/services/", group: "Главное меню", order: 3, status: "published" },
    { id: "nav-4", label: "Организациям", href: "/corporate/", group: "Главное меню", order: 4, status: "published" },
    { id: "nav-5", label: "Документы", href: "/documents/", group: "Главное меню", order: 5, status: "published" },
    { id: "nav-6", label: "Контакты", href: "/contacts/", group: "Главное меню", order: 6, status: "published" }
  ],
  leads: [
    { id: "lead-1", name: "Анна Смирнова", phone: "+7 (999) 120-44-10", email: "anna@example.ru", program: "Управление персоналом", status: "Новая", priority: "Высокая", manager: "Екатерина", note: "Просит подобрать дистанционный формат", createdAt: "сегодня, 12:40" },
    { id: "lead-2", name: "Игорь Павлов", phone: "+7 (916) 884-02-18", email: "igor@example.ru", program: "Государственное и муниципальное управление", status: "В работе", priority: "Обычная", manager: "Максим", note: "Нужна смета для организации", createdAt: "вчера, 17:15" },
    { id: "lead-3", name: "ООО «Вектор»", phone: "+7 (495) 320-00-10", email: "office@vector.ru", program: "Корпоративное обучение руководителей", status: "Ждёт ответа", priority: "Срочная", manager: "Екатерина", note: "20 слушателей, запросили договор", createdAt: "12 июня, 09:30" }
  ],
  pages: [
    { id: "page-1", title: "Главная", href: "/", status: "published", seoStatus: "Готово", lastCheck: "сегодня" },
    { id: "page-2", title: "Каталог программ", href: "/services/", status: "published", seoStatus: "Готово", lastCheck: "сегодня" },
    { id: "page-3", title: "Цены", href: "/prices/", status: "published", seoStatus: "Готово", lastCheck: "вчера" },
    { id: "page-4", title: "Организациям", href: "/corporate/", status: "published", seoStatus: "Готово", lastCheck: "вчера" },
    { id: "page-5", title: "Документы", href: "/documents/", status: "published", seoStatus: "Нужно проверить", lastCheck: "12 июня" },
    { id: "page-6", title: "Контакты", href: "/contacts/", status: "published", seoStatus: "Готово", lastCheck: "10 июня" }
  ],
  seo: [
    { id: "seo-1", page: "Главная", title: "МГИПО — программы профессионального развития", description: "Дополнительное профессиональное образование для руководителей, специалистов и организаций.", robots: "index, follow", ogTitle: "МГИПО — профессиональное развитие" },
    { id: "seo-2", page: "Каталог программ", title: "Каталог программ — МГИПО", description: "Программы повышения квалификации и профессиональной переподготовки.", robots: "index, follow", ogTitle: "Каталог программ МГИПО" },
    { id: "seo-3", page: "Контакты", title: "Контакты — МГИПО", description: "Свяжитесь с институтом профессионального развития.", robots: "index, follow", ogTitle: "Контакты МГИПО" }
  ],
  users: [
    { id: "user-1", name: "Макар", email: "admin@mgipo.ru", role: "Владелец", status: "Активен", lastSeen: "сейчас" },
    { id: "user-2", name: "Контент-менеджер", email: "content@mgipo.ru", role: "Контент-менеджер", status: "Приглашён", lastSeen: "приглашение отправлено" },
    { id: "user-3", name: "Менеджер заявок", email: "leads@mgipo.ru", role: "Менеджер заявок", status: "Активен", lastSeen: "сегодня" }
  ],
  audit: [
    { id: "audit-1", title: "Открыта панель управления", section: "Дашборд", actor: "admin@mgipo.ru", date: "сегодня" },
    { id: "audit-2", title: "Обновлён текст главной страницы", section: "Главная", actor: "admin@mgipo.ru", date: "сегодня" },
    { id: "audit-3", title: "Проверены правовые страницы", section: "Правовые", actor: "admin@mgipo.ru", date: "вчера" }
  ],
  publicationMode: "Показ заказчику",
  updatedAt: ""
};

const statusLabels: Record<DemoStatus, string> = {
  published: "Опубликовано",
  draft: "Черновик",
  hidden: "Скрыто"
};

function getTodayLabel(): string {
  return new Date().toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
}

function makeId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 7)}`;
}

function normalizeAdminData(value: unknown): DemoAdminData {
  if (value === null || typeof value !== "object") return defaultAdminData;
  const record = value as Partial<DemoAdminData>;
  return {
    ...defaultAdminData,
    ...record,
    services: Array.isArray(record.services) ? record.services : defaultAdminData.services,
    categories: Array.isArray(record.categories) ? record.categories : defaultAdminData.categories,
    documents: Array.isArray(record.documents) ? record.documents : defaultAdminData.documents,
    legal: Array.isArray(record.legal) ? record.legal : defaultAdminData.legal,
    navigation: Array.isArray(record.navigation) ? record.navigation : defaultAdminData.navigation,
    leads: Array.isArray(record.leads) ? record.leads : defaultAdminData.leads,
    pages: Array.isArray(record.pages) ? record.pages : defaultAdminData.pages,
    seo: Array.isArray(record.seo) ? record.seo : defaultAdminData.seo,
    users: Array.isArray(record.users) ? record.users : defaultAdminData.users,
    audit: Array.isArray(record.audit) ? record.audit : defaultAdminData.audit,
    publicationMode: record.publicationMode ?? defaultAdminData.publicationMode,
    updatedAt: record.updatedAt ?? ""
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
    return raw === null ? defaultAdminData : normalizeAdminData(JSON.parse(raw) as Partial<DemoAdminData>);
  } catch {
    return defaultAdminData;
  }
}

function fieldClassName(extra?: string): string {
  return cn("min-h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-950 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100", extra);
}

function textareaClassName(extra?: string): string {
  return cn("min-h-28 w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold leading-7 text-slate-950 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100", extra);
}

function useAdmin(): AdminContextValue {
  const value = useContext(AdminContext);
  if (value === null) throw new Error("Admin page must be rendered inside AdminPageLayout.");
  return value;
}

function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-600">{label}</span>
      {children}
      {hint ? <span className="text-xs font-semibold leading-5 text-slate-500">{hint}</span> : null}
    </label>
  );
}

function StatusPill({ children, tone = "blue" }: { children: ReactNode; tone?: "blue" | "green" | "amber" | "slate" | "red" }) {
  const className = {
    blue: "border-blue-100 bg-blue-50 text-blue-800",
    green: "border-emerald-100 bg-emerald-50 text-emerald-800",
    amber: "border-amber-100 bg-amber-50 text-amber-800",
    slate: "border-slate-200 bg-slate-50 text-slate-700",
    red: "border-rose-100 bg-rose-50 text-rose-800"
  }[tone];
  return <span className={cn("inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-black", className)}>{children}</span>;
}

function statusTone(status: DemoStatus): "green" | "amber" | "slate" {
  if (status === "published") return "green";
  if (status === "draft") return "amber";
  return "slate";
}

function leadTone(status: LeadStatus): "green" | "amber" | "blue" | "slate" {
  if (status === "Новая") return "blue";
  if (status === "В работе") return "amber";
  if (status === "Ждёт ответа") return "slate";
  return "green";
}

function AdminCard({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cn("rounded-[1.35rem] border border-slate-200 bg-white p-5 shadow-executive", className)}>{children}</section>;
}

function AdminTable({ children }: { children: ReactNode }) {
  return <div className="overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white shadow-executive"><div className="overflow-x-auto">{children}</div></div>;
}

function SectionTitle({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 border-b border-slate-100 pb-6 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-800">{eyebrow}</p>
        <h1 className="mt-3 font-serif text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">{title}</h1>
        <p className="mt-4 max-w-3xl text-base font-medium leading-8 text-slate-600">{description}</p>
      </div>
      {action ? <div className="flex shrink-0 flex-wrap gap-3">{action}</div> : null}
    </div>
  );
}

function EmptyNote({ children }: { children: ReactNode }) {
  return <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center text-sm font-bold text-slate-500">{children}</div>;
}

function AdminPageLayout({ active, title, description, children }: { active: AdminSectionId; title: string; description: string; children: ReactNode }) {
  const router = useRouter();
  const [content, setContent] = useState<DemoContent>(defaultDemoContent);
  const [data, setData] = useState<DemoAdminData>(defaultAdminData);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const session = window.localStorage.getItem(DEMO_SESSION_STORAGE_KEY);
    if (session === null) {
      window.localStorage.setItem(DEMO_SESSION_STORAGE_KEY, JSON.stringify({ email: "admin@mgipo.ru", signedAt: new Date().toISOString(), demoAutoSession: true }));
    }
    setContent(readContent());
    setData(readAdminData());
    router.prefetch("/admin/dashboard/");
    router.prefetch("/admin/services/");
    router.prefetch("/admin/leads/");
    router.prefetch("/admin/settings/");
  }, [router]);

  function addAuditEvent(current: DemoAdminData, titleText: string, section = title): DemoAdminData {
    const event: DemoAuditEvent = {
      id: makeId("audit"),
      title: titleText,
      section,
      actor: "admin@mgipo.ru",
      date: getTodayLabel()
    };
    return { ...current, audit: [event, ...current.audit].slice(0, 30), updatedAt: new Date().toISOString() };
  }

  function updateContent<K extends keyof DemoContent>(key: K, value: DemoContent[K]): void {
    setContent((current) => ({ ...current, [key]: value }));
    setMessage("Есть несохранённые изменения. Нажмите «Сохранить», чтобы применить их на сайте.");
  }

  function updateData(updater: (current: DemoAdminData) => DemoAdminData, eventTitle?: string, section?: string): void {
    setData((current) => {
      const updated = updater(current);
      return eventTitle ? addAuditEvent(updated, eventTitle, section) : { ...updated, updatedAt: new Date().toISOString() };
    });
    setMessage("Есть несохранённые изменения. Нажмите «Сохранить», чтобы закрепить результат.");
  }

  function saveAll(): void {
    const now = new Date().toISOString();
    const nextContent = { ...content, updatedAt: now };
    const nextData = addAuditEvent({ ...data, updatedAt: now }, "Сохранены изменения в панели", "Система");
    window.localStorage.setItem(DEMO_CONTENT_STORAGE_KEY, JSON.stringify(nextContent));
    window.localStorage.setItem(DEMO_ADMIN_DATA_STORAGE_KEY, JSON.stringify(nextData));
    window.dispatchEvent(new Event("mgipo-demo-content-updated"));
    setContent(nextContent);
    setData(nextData);
    setMessage("Сохранено. Публичные тексты, контакты и футер обновятся на этом же устройстве сразу.");
  }

  function reset(): void {
    window.localStorage.removeItem(DEMO_CONTENT_STORAGE_KEY);
    window.localStorage.removeItem(DEMO_ADMIN_DATA_STORAGE_KEY);
    window.dispatchEvent(new Event("mgipo-demo-content-updated"));
    setContent(defaultDemoContent);
    setData(defaultAdminData);
    setMessage("Данные панели сброшены к исходному состоянию.");
  }

  function logout(): void {
    window.localStorage.removeItem(DEMO_SESSION_STORAGE_KEY);
    router.push("/admin/login/");
  }

  const context: AdminContextValue = { content, data, updateContent, updateData, saveAll };

  return (
    <AdminContext.Provider value={context}>
      <RoutePerformance scope="admin" />
      <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.12),transparent_34rem),linear-gradient(180deg,#f8fbff_0%,#eef4ff_100%)] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1580px]">
          <header className="rounded-[1.8rem] border border-blue-100 bg-white/95 p-6 shadow-institutional sm:p-8">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-800">Панель управления сайтом</p>
                <h1 className="mt-3 font-serif text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">{title}</h1>
                <p className="mt-4 max-w-4xl text-base leading-8 text-slate-600">{description}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button type="button" onClick={saveAll}><Save className="h-4 w-4" /> Сохранить</Button>
                <Button href="/" variant="secondary"><Eye className="h-4 w-4" /> Открыть сайт</Button>
                <Button type="button" variant="secondary" onClick={reset}><RefreshCw className="h-4 w-4" /> Сбросить</Button>
                <Button type="button" variant="secondary" onClick={logout}><LogOut className="h-4 w-4" /> Выйти</Button>
              </div>
            </div>
            {message ? <p className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-900">{message}</p> : null}
          </header>

          <div className="mt-6 grid gap-5 xl:grid-cols-[340px_minmax(0,1fr)]">
            <aside className="h-max rounded-[1.35rem] border border-slate-200 bg-white/95 p-3 shadow-executive xl:sticky xl:top-6">
              <nav className="grid gap-2" aria-label="Разделы админ-панели">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.id === active;
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      prefetch={false}
                      className={cn("rounded-[1.05rem] border px-4 py-3 transition", isActive ? "border-blue-200 bg-blue-50 text-blue-900 shadow-sm" : "border-transparent bg-white text-slate-700 hover:border-slate-200 hover:bg-slate-50")}
                    >
                      <span className="flex items-center gap-2 text-sm font-black"><Icon className="h-4 w-4 text-blue-700" />{item.title}</span>
                      <span className="mt-1 block text-xs font-semibold leading-5 text-slate-500">{item.subtitle}</span>
                    </Link>
                  );
                })}
              </nav>
            </aside>

            <div className="min-w-0 rounded-[1.35rem] border border-slate-200 bg-white/95 p-5 shadow-executive sm:p-7">
              {children}
            </div>
          </div>
        </div>
      </main>
    </AdminContext.Provider>
  );
}

export function AdminDashboardPage() {
  const content = defaultDemoContent;
  return (
    <AdminPageLayout active="dashboard" title="Дашборд" description="Сводка по сайту, заявкам, готовности разделов и быстрым действиям. Каждый пункт меню открывает собственную страницу.">
      <DashboardContent fallbackContent={content} />
    </AdminPageLayout>
  );
}

function DashboardContent({ fallbackContent }: { fallbackContent: DemoContent }) {
  const { data, content } = useAdmin();
  const activeLeads = data.leads.filter((lead) => lead.status !== "Закрыта").length;
  const publishedServices = data.services.filter((service) => service.status === "published").length;
  const publishedPages = data.pages.filter((page) => page.status === "published").length;
  const seoReady = data.seo.filter((item) => item.robots === "index, follow").length;
  const visibleContent = content.updatedAt ? content : fallbackContent;
  return (
    <>
      <SectionTitle eyebrow="Сводка" title="Управление сайтом без пустых экранов" description="В панели есть реальные страницы, таблицы, формы, статусы, журнал действий и локальное сохранение для презентации заказчику." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AdminCard className="bg-blue-50/70"><p className="text-3xl font-black text-blue-900">{publishedServices}</p><p className="mt-2 text-sm font-bold text-slate-600">опубликованных программ</p></AdminCard>
        <AdminCard className="bg-emerald-50/70"><p className="text-3xl font-black text-emerald-800">{activeLeads}</p><p className="mt-2 text-sm font-bold text-slate-600">активных заявок</p></AdminCard>
        <AdminCard className="bg-slate-50"><p className="text-3xl font-black text-slate-950">{publishedPages}</p><p className="mt-2 text-sm font-bold text-slate-600">страниц опубликовано</p></AdminCard>
        <AdminCard className="bg-blue-50/70"><p className="text-3xl font-black text-blue-900">{seoReady}/{data.seo.length}</p><p className="mt-2 text-sm font-bold text-slate-600">SEO-настроек готово</p></AdminCard>
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <AdminCard>
          <h2 className="text-2xl font-black text-slate-950">Быстрые действия</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Button href="/admin/home/" variant="secondary"><Home className="h-4 w-4" /> Изменить главную</Button>
            <Button href="/admin/services/" variant="secondary"><LayoutList className="h-4 w-4" /> Каталог программ</Button>
            <Button href="/admin/leads/" variant="secondary"><Users className="h-4 w-4" /> Обработать заявки</Button>
            <Button href="/admin/seo/" variant="secondary"><SearchCheck className="h-4 w-4" /> Проверить SEO</Button>
          </div>
          <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-800">Текущий оффер главной</p>
            <h3 className="mt-3 font-serif text-3xl font-bold text-slate-950">{visibleContent.heroLine1} {visibleContent.heroLine2} {visibleContent.heroLine3}</h3>
            <p className="mt-3 text-sm font-semibold leading-7 text-slate-600">{visibleContent.heroDescription}</p>
          </div>
        </AdminCard>
        <AdminCard>
          <h2 className="text-2xl font-black text-slate-950">Готовность к показу</h2>
          <div className="mt-5 grid gap-3">
            {["Публичная часть опубликована", "Админ-разделы имеют отдельные URL", "Заявки и контент сохраняются локально", "Следующий этап — Supabase-синхронизация"].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"><CheckCircle2 className="h-5 w-5 text-emerald-700" /><span className="text-sm font-bold text-slate-700">{item}</span></div>
            ))}
          </div>
        </AdminCard>
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <AdminCard>
          <h2 className="text-2xl font-black text-slate-950">Последние заявки</h2>
          <div className="mt-4 grid gap-3">{data.leads.slice(0, 3).map((lead) => <div key={lead.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4"><div className="flex flex-wrap items-center justify-between gap-2"><p className="font-black text-slate-950">{lead.name}</p><StatusPill tone={leadTone(lead.status)}>{lead.status}</StatusPill></div><p className="mt-2 text-sm font-semibold text-slate-600">{lead.program} · {lead.phone}</p></div>)}</div>
        </AdminCard>
        <AdminCard>
          <h2 className="text-2xl font-black text-slate-950">Журнал</h2>
          <div className="mt-4 grid gap-3">{data.audit.slice(0, 4).map((event) => <div key={event.id} className="flex gap-3 rounded-2xl border border-slate-100 bg-white p-4"><ListChecks className="mt-1 h-5 w-5 text-blue-700" /><div><p className="font-black text-slate-950">{event.title}</p><p className="mt-1 text-xs font-semibold text-slate-500">{event.section} · {event.date}</p></div></div>)}</div>
        </AdminCard>
      </div>
    </>
  );
}

export function AdminHomePage() {
  return (
    <AdminPageLayout active="home" title="Главная страница" description="Редактирование первого экрана, кнопок и текста, который виден на публичной главной странице.">
      <HomeContent />
    </AdminPageLayout>
  );
}

function HomeContent() {
  const { content, updateContent } = useAdmin();
  return (
    <>
      <SectionTitle eyebrow="Главная" title="Первый экран сайта" description="Изменения сохраняются и сразу применяются на публичной главной странице этого же устройства." action={<Button href="/" variant="secondary">Открыть главную</Button>} />
      <div className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
        <AdminCard className="grid gap-5">
          <Field label="Верхний бейдж"><input className={fieldClassName()} value={content.heroEyebrow} onChange={(event) => updateContent("heroEyebrow", event.target.value)} /></Field>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Заголовок 1"><input className={fieldClassName()} value={content.heroLine1} onChange={(event) => updateContent("heroLine1", event.target.value)} /></Field>
            <Field label="Заголовок 2"><input className={fieldClassName()} value={content.heroLine2} onChange={(event) => updateContent("heroLine2", event.target.value)} /></Field>
            <Field label="Заголовок 3"><input className={fieldClassName()} value={content.heroLine3} onChange={(event) => updateContent("heroLine3", event.target.value)} /></Field>
          </div>
          <Field label="Описание"><textarea className={textareaClassName("min-h-36")} value={content.heroDescription} onChange={(event) => updateContent("heroDescription", event.target.value)} /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Основная кнопка"><input className={fieldClassName()} value={content.primaryButton} onChange={(event) => updateContent("primaryButton", event.target.value)} /></Field>
            <Field label="Вторичная кнопка"><input className={fieldClassName()} value={content.secondaryButton} onChange={(event) => updateContent("secondaryButton", event.target.value)} /></Field>
          </div>
        </AdminCard>
        <AdminCard className="bg-blue-50/70">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-800">Живой вид блока</p>
          <h2 className="mt-4 font-serif text-4xl font-bold leading-tight text-slate-950">{content.heroLine1}<br />{content.heroLine2}<br />{content.heroLine3}</h2>
          <p className="mt-4 text-sm font-semibold leading-7 text-slate-600">{content.heroDescription}</p>
          <div className="mt-6 flex flex-wrap gap-3"><span className="rounded-xl bg-blue-700 px-4 py-3 text-sm font-black text-white">{content.primaryButton}</span><span className="rounded-xl border border-blue-200 bg-white px-4 py-3 text-sm font-black text-blue-800">{content.secondaryButton}</span></div>
        </AdminCard>
      </div>
    </>
  );
}

export function AdminServicesPage() {
  return (
    <AdminPageLayout active="services" title="Программы" description="Полноценный раздел каталога: поиск, статусы, добавление, редактирование и удаление программ в демо-режиме.">
      <ServicesContent />
    </AdminPageLayout>
  );
}

function ServicesContent() {
  const { data, updateData } = useAdmin();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | DemoStatus>("all");
  const filtered = data.services.filter((service) => {
    const matchesQuery = `${service.title} ${service.category} ${service.slug}`.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = status === "all" || service.status === status;
    return matchesQuery && matchesStatus;
  });

  function addService(): void {
    updateData((current) => ({
      ...current,
      services: [{ id: makeId("srv"), title: "Новая программа", slug: "novaya-programma", category: "Новая категория", format: "Дистанционно", duration: "256 часов", price: "от 10 000 ₽", document: "Диплом", status: "draft", popular: false, updatedAt: getTodayLabel() }, ...current.services]
    }), "Добавлена новая программа", "Программы");
  }

  function updateService(id: string, patch: Partial<DemoService>): void {
    updateData((current) => ({ ...current, services: current.services.map((service) => service.id === id ? { ...service, ...patch, updatedAt: getTodayLabel() } : service) }), "Обновлена программа", "Программы");
  }

  function removeService(id: string): void {
    updateData((current) => ({ ...current, services: current.services.filter((service) => service.id !== id) }), "Удалена программа", "Программы");
  }

  return (
    <>
      <SectionTitle eyebrow="Каталог" title="Программы обучения" description="Таблица редактируется прямо на странице. Все изменения сохраняются локально и подходят для презентации логики CMS." action={<Button type="button" onClick={addService}><Plus className="h-4 w-4" /> Добавить программу</Button>} />
      <div className="mb-5 grid gap-3 lg:grid-cols-[1fr_220px]">
        <div className="relative"><Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input className={fieldClassName("pl-11")} placeholder="Поиск по названию, категории или URL" value={query} onChange={(event) => setQuery(event.target.value)} /></div>
        <select className={fieldClassName()} value={status} onChange={(event) => setStatus(event.target.value as "all" | DemoStatus)}><option value="all">Все статусы</option><option value="published">Опубликовано</option><option value="draft">Черновик</option><option value="hidden">Скрыто</option></select>
      </div>
      <AdminTable>
        <table className="w-full min-w-[1120px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-[0.16em] text-slate-500"><tr><th className="px-5 py-4">Название</th><th className="px-5 py-4">Категория</th><th className="px-5 py-4">Формат</th><th className="px-5 py-4">Срок</th><th className="px-5 py-4">Цена</th><th className="px-5 py-4">Статус</th><th className="px-5 py-4">Действия</th></tr></thead>
          <tbody className="divide-y divide-slate-100">{filtered.map((service) => <tr key={service.id} className="align-top"><td className="px-5 py-4"><input className={fieldClassName("min-h-10")} value={service.title} onChange={(event) => updateService(service.id, { title: event.target.value })} /><p className="mt-2 text-xs font-semibold text-slate-500">/{service.slug}</p></td><td className="px-5 py-4"><input className={fieldClassName("min-h-10")} value={service.category} onChange={(event) => updateService(service.id, { category: event.target.value })} /></td><td className="px-5 py-4"><input className={fieldClassName("min-h-10")} value={service.format} onChange={(event) => updateService(service.id, { format: event.target.value })} /></td><td className="px-5 py-4"><input className={fieldClassName("min-h-10")} value={service.duration} onChange={(event) => updateService(service.id, { duration: event.target.value })} /></td><td className="px-5 py-4"><input className={fieldClassName("min-h-10")} value={service.price} onChange={(event) => updateService(service.id, { price: event.target.value })} /></td><td className="px-5 py-4"><select className={fieldClassName("min-h-10")} value={service.status} onChange={(event) => updateService(service.id, { status: event.target.value as DemoStatus })}><option value="published">Опубликовано</option><option value="draft">Черновик</option><option value="hidden">Скрыто</option></select><div className="mt-2"><StatusPill tone={statusTone(service.status)}>{statusLabels[service.status]}</StatusPill></div></td><td className="px-5 py-4"><button type="button" onClick={() => removeService(service.id)} className="rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-xs font-black text-rose-800"><Trash2 className="mr-1 inline h-3 w-3" />Удалить</button></td></tr>)}</tbody>
        </table>
      </AdminTable>
      {filtered.length === 0 ? <div className="mt-5"><EmptyNote>Ничего не найдено. Измените поиск или статус.</EmptyNote></div> : null}
    </>
  );
}

export function AdminCategoriesPage() {
  return (
    <AdminPageLayout active="categories" title="Категории" description="Управление направлениями обучения, описаниями, публикацией и количеством программ.">
      <CategoriesContent />
    </AdminPageLayout>
  );
}

function CategoriesContent() {
  const { data, updateData } = useAdmin();
  function addCategory(): void {
    updateData((current) => ({ ...current, categories: [{ id: makeId("cat"), title: "Новая категория", slug: "novaya-kategoriya", count: 0, status: "draft", description: "Описание направления обучения." }, ...current.categories] }), "Добавлена категория", "Категории");
  }
  function updateCategory(id: string, patch: Partial<DemoCategory>): void {
    updateData((current) => ({ ...current, categories: current.categories.map((category) => category.id === id ? { ...category, ...patch } : category) }), "Обновлена категория", "Категории");
  }
  return (
    <>
      <SectionTitle eyebrow="Категории" title="Направления обучения" description="Карточки категорий редактируются отдельно: название, URL, описание, количество программ и статус." action={<Button type="button" onClick={addCategory}><Plus className="h-4 w-4" /> Добавить категорию</Button>} />
      <div className="grid gap-4 lg:grid-cols-2">{data.categories.map((category) => <AdminCard key={category.id}><div className="flex flex-wrap items-start justify-between gap-3"><Tags className="h-7 w-7 text-blue-700" /><StatusPill tone={statusTone(category.status)}>{statusLabels[category.status]}</StatusPill></div><div className="mt-5 grid gap-4 sm:grid-cols-2"><Field label="Название"><input className={fieldClassName()} value={category.title} onChange={(event) => updateCategory(category.id, { title: event.target.value })} /></Field><Field label="Slug"><input className={fieldClassName()} value={category.slug} onChange={(event) => updateCategory(category.id, { slug: event.target.value })} /></Field><Field label="Кол-во программ"><input type="number" className={fieldClassName()} value={category.count} onChange={(event) => updateCategory(category.id, { count: Number(event.target.value) })} /></Field><Field label="Статус"><select className={fieldClassName()} value={category.status} onChange={(event) => updateCategory(category.id, { status: event.target.value as DemoStatus })}><option value="published">Опубликовано</option><option value="draft">Черновик</option><option value="hidden">Скрыто</option></select></Field><div className="sm:col-span-2"><Field label="Описание"><textarea className={textareaClassName()} value={category.description} onChange={(event) => updateCategory(category.id, { description: event.target.value })} /></Field></div></div></AdminCard>)}</div>
    </>
  );
}

export function AdminDocumentsPage() {
  return (
    <AdminPageLayout active="documents" title="Документы" description="Раздел для лицензий, PDF, правовых материалов и файлов программ.">
      <DocumentsContent />
    </AdminPageLayout>
  );
}

function DocumentsContent() {
  const { data, updateData } = useAdmin();
  function addDocument(): void {
    updateData((current) => ({ ...current, documents: [{ id: makeId("doc"), title: "Новый документ", type: "PDF", href: "/documents/new-file.pdf", status: "draft", updatedAt: getTodayLabel() }, ...current.documents] }), "Добавлен документ", "Документы");
  }
  function updateDocument(id: string, patch: Partial<DemoDocument>): void {
    updateData((current) => ({ ...current, documents: current.documents.map((doc) => doc.id === id ? { ...doc, ...patch, updatedAt: getTodayLabel() } : doc) }), "Обновлён документ", "Документы");
  }
  return (
    <>
      <SectionTitle eyebrow="Документы" title="Файлы и материалы" description="Имитация управления документами: название, тип, ссылка и статус публикации." action={<Button type="button" onClick={addDocument}><Download className="h-4 w-4" /> Добавить документ</Button>} />
      <div className="grid gap-4">{data.documents.map((doc) => <AdminCard key={doc.id} className="grid gap-4 lg:grid-cols-[1.2fr_170px_1fr_180px]"><Field label="Название"><input className={fieldClassName()} value={doc.title} onChange={(event) => updateDocument(doc.id, { title: event.target.value })} /></Field><Field label="Тип"><input className={fieldClassName()} value={doc.type} onChange={(event) => updateDocument(doc.id, { type: event.target.value })} /></Field><Field label="Ссылка"><input className={fieldClassName()} value={doc.href} onChange={(event) => updateDocument(doc.id, { href: event.target.value })} /></Field><Field label="Статус"><select className={fieldClassName()} value={doc.status} onChange={(event) => updateDocument(doc.id, { status: event.target.value as DemoStatus })}><option value="published">Опубликовано</option><option value="draft">Черновик</option><option value="hidden">Скрыто</option></select></Field></AdminCard>)}</div>
    </>
  );
}

export function AdminLegalPage() {
  return (
    <AdminPageLayout active="legal" title="Правовые страницы" description="Редактирование политики конфиденциальности, согласия, оферты и реквизитов.">
      <LegalContent />
    </AdminPageLayout>
  );
}

function LegalContent() {
  const { data, updateData } = useAdmin();
  const [selectedId, setSelectedId] = useState<DemoLegal["id"]>("privacy");
  const selected = data.legal.find((item) => item.id === selectedId) ?? data.legal[0];
  function updateLegal(id: DemoLegal["id"], patch: Partial<DemoLegal>): void {
    updateData((current) => ({ ...current, legal: current.legal.map((item) => item.id === id ? { ...item, ...patch, updatedAt: getTodayLabel() } : item) }), "Обновлена правовая страница", "Правовые");
  }
  return (
    <>
      <SectionTitle eyebrow="Правовая информация" title="Юридические тексты" description="Выберите документ слева и редактируйте заголовок, описание, основной текст и статус публикации." />
      <div className="grid gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">
        <AdminCard className="grid gap-2">{data.legal.map((item) => <button key={item.id} type="button" onClick={() => setSelectedId(item.id)} className={cn("rounded-2xl border px-4 py-3 text-left", selectedId === item.id ? "border-blue-200 bg-blue-50" : "border-slate-100 bg-white hover:bg-slate-50")}><span className="block text-sm font-black text-slate-950">{item.title}</span><span className="mt-1 block text-xs font-semibold text-slate-500">{statusLabels[item.status]}</span></button>)}</AdminCard>
        <AdminCard className="grid gap-5"><Field label="Заголовок"><input className={fieldClassName()} value={selected.title} onChange={(event) => updateLegal(selected.id, { title: event.target.value })} /></Field><Field label="Описание"><input className={fieldClassName()} value={selected.description} onChange={(event) => updateLegal(selected.id, { description: event.target.value })} /></Field><Field label="Текст"><textarea className={textareaClassName("min-h-64")} value={selected.body} onChange={(event) => updateLegal(selected.id, { body: event.target.value })} /></Field><Field label="Статус"><select className={fieldClassName()} value={selected.status} onChange={(event) => updateLegal(selected.id, { status: event.target.value as DemoStatus })}><option value="published">Опубликовано</option><option value="draft">Черновик</option><option value="hidden">Скрыто</option></select></Field></AdminCard>
      </div>
    </>
  );
}

export function AdminNavigationPage() {
  return (
    <AdminPageLayout active="navigation" title="Навигация" description="Управление пунктами меню: название, ссылка, группа, порядок и статус.">
      <NavigationContent />
    </AdminPageLayout>
  );
}

function NavigationContent() {
  const { data, updateData } = useAdmin();
  function addItem(): void {
    updateData((current) => ({ ...current, navigation: [...current.navigation, { id: makeId("nav"), label: "Новый пункт", href: "/", group: "Главное меню", order: current.navigation.length + 1, status: "draft" }] }), "Добавлен пункт меню", "Навигация");
  }
  function updateItem(id: string, patch: Partial<DemoMenuItem>): void {
    updateData((current) => ({ ...current, navigation: current.navigation.map((item) => item.id === id ? { ...item, ...patch } : item).sort((a, b) => a.order - b.order) }), "Обновлена навигация", "Навигация");
  }
  return (
    <>
      <SectionTitle eyebrow="Меню" title="Структура навигации" description="Пункты меню редактируются как отдельные записи, с группами и порядком отображения." action={<Button type="button" onClick={addItem}><Plus className="h-4 w-4" /> Добавить пункт</Button>} />
      <AdminTable><table className="w-full min-w-[980px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-[0.16em] text-slate-500"><tr><th className="px-5 py-4">Порядок</th><th className="px-5 py-4">Название</th><th className="px-5 py-4">Ссылка</th><th className="px-5 py-4">Группа</th><th className="px-5 py-4">Статус</th></tr></thead><tbody className="divide-y divide-slate-100">{data.navigation.map((item) => <tr key={item.id}><td className="px-5 py-4"><input type="number" className={fieldClassName("min-h-10 w-24")} value={item.order} onChange={(event) => updateItem(item.id, { order: Number(event.target.value) })} /></td><td className="px-5 py-4"><input className={fieldClassName("min-h-10")} value={item.label} onChange={(event) => updateItem(item.id, { label: event.target.value })} /></td><td className="px-5 py-4"><input className={fieldClassName("min-h-10")} value={item.href} onChange={(event) => updateItem(item.id, { href: event.target.value })} /></td><td className="px-5 py-4"><select className={fieldClassName("min-h-10")} value={item.group} onChange={(event) => updateItem(item.id, { group: event.target.value as DemoMenuItem["group"] })}><option>Главное меню</option><option>Футер</option><option>Быстрые ссылки</option></select></td><td className="px-5 py-4"><select className={fieldClassName("min-h-10")} value={item.status} onChange={(event) => updateItem(item.id, { status: event.target.value as DemoStatus })}><option value="published">Опубликовано</option><option value="draft">Черновик</option><option value="hidden">Скрыто</option></select></td></tr>)}</tbody></table></AdminTable>
    </>
  );
}

export function AdminFooterPage() {
  return (
    <AdminPageLayout active="footer" title="Футер" description="Редактирование нижнего блока сайта: описание, контакты, часы работы и служебная информация.">
      <FooterContent />
    </AdminPageLayout>
  );
}

function FooterContent() {
  const { content, updateContent } = useAdmin();
  return (
    <>
      <SectionTitle eyebrow="Футер" title="Нижний блок сайта" description="Контакты и описание футера применяются на публичной странице после сохранения." />
      <div className="grid gap-5 lg:grid-cols-2"><AdminCard className="grid gap-5"><Field label="Описание"><textarea className={textareaClassName("min-h-40")} value={content.footerDescription} onChange={(event) => updateContent("footerDescription", event.target.value)} /></Field><Field label="Часы работы"><input className={fieldClassName()} value={content.workHours} onChange={(event) => updateContent("workHours", event.target.value)} /></Field></AdminCard><AdminCard className="bg-blue-50/70"><h2 className="text-2xl font-black text-slate-950">Вид в футере</h2><p className="mt-4 text-sm font-semibold leading-7 text-slate-600">{content.footerDescription}</p><div className="mt-5 grid gap-2 text-sm font-bold text-slate-700"><span>{content.phone}</span><span>{content.email}</span><span>{content.address}</span><span>{content.workHours}</span></div></AdminCard></div>
    </>
  );
}

export function AdminContactsPage() {
  return (
    <AdminPageLayout active="contacts" title="Контакты" description="Телефон, email, адрес, часы работы и основные контактные параметры сайта.">
      <ContactsContent />
    </AdminPageLayout>
  );
}

function ContactsContent() {
  const { content, updateContent } = useAdmin();
  return (
    <>
      <SectionTitle eyebrow="Контакты" title="Данные для связи" description="Эти поля обновляют публичные элементы с телефоном, email, адресом и рабочими часами." action={<Button href="/contacts/" variant="secondary">Открыть контакты</Button>} />
      <div className="grid gap-5 lg:grid-cols-2"><AdminCard className="grid gap-5"><Field label="Телефон"><input className={fieldClassName()} value={content.phone} onChange={(event) => updateContent("phone", event.target.value)} /></Field><Field label="Email"><input className={fieldClassName()} value={content.email} onChange={(event) => updateContent("email", event.target.value)} /></Field><Field label="Адрес"><input className={fieldClassName()} value={content.address} onChange={(event) => updateContent("address", event.target.value)} /></Field><Field label="Часы работы"><input className={fieldClassName()} value={content.workHours} onChange={(event) => updateContent("workHours", event.target.value)} /></Field></AdminCard><AdminCard><h2 className="text-2xl font-black text-slate-950">Карточка контактов</h2><div className="mt-5 grid gap-3"><div className="rounded-2xl border border-slate-100 bg-slate-50 p-4"><p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Телефон</p><p className="mt-2 text-lg font-black text-slate-950">{content.phone}</p></div><div className="rounded-2xl border border-slate-100 bg-slate-50 p-4"><p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Email</p><p className="mt-2 text-lg font-black text-slate-950">{content.email}</p></div><div className="rounded-2xl border border-slate-100 bg-slate-50 p-4"><p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Адрес</p><p className="mt-2 text-lg font-black text-slate-950">{content.address}</p></div></div></AdminCard></div>
    </>
  );
}

export function AdminLeadsPage() {
  return (
    <AdminPageLayout active="leads" title="Заявки" description="Раздел обращений: статусы, приоритеты, менеджер, заметки и добавление новой заявки.">
      <LeadsContent />
    </AdminPageLayout>
  );
}

function LeadsContent() {
  const { data, updateData } = useAdmin();
  const [newLead, setNewLead] = useState({ name: "", phone: "", email: "", program: "" });
  function updateLead(id: string, patch: Partial<DemoLead>): void {
    updateData((current) => ({ ...current, leads: current.leads.map((lead) => lead.id === id ? { ...lead, ...patch } : lead) }), "Обновлена заявка", "Заявки");
  }
  function addLead(): void {
    const name = newLead.name.trim() || "Новый клиент";
    updateData((current) => ({ ...current, leads: [{ id: makeId("lead"), name, phone: newLead.phone || "+7 (___) ___-__-__", email: newLead.email || "client@example.ru", program: newLead.program || "Подбор программы", status: "Новая", priority: "Обычная", manager: "Не назначен", note: "Добавлено вручную в панели", createdAt: getTodayLabel() }, ...current.leads] }), "Добавлена заявка", "Заявки");
    setNewLead({ name: "", phone: "", email: "", program: "" });
  }
  return (
    <>
      <SectionTitle eyebrow="Заявки" title="Обработка обращений" description="Меняйте статус, приоритет, ответственного менеджера и заметку по каждому обращению." action={<Button type="button" onClick={addLead}><Plus className="h-4 w-4" /> Добавить заявку</Button>} />
      <AdminCard className="mb-5 grid gap-4 lg:grid-cols-4"><Field label="Имя"><input className={fieldClassName()} value={newLead.name} onChange={(event) => setNewLead((current) => ({ ...current, name: event.target.value }))} /></Field><Field label="Телефон"><input className={fieldClassName()} value={newLead.phone} onChange={(event) => setNewLead((current) => ({ ...current, phone: event.target.value }))} /></Field><Field label="Email"><input className={fieldClassName()} value={newLead.email} onChange={(event) => setNewLead((current) => ({ ...current, email: event.target.value }))} /></Field><Field label="Программа"><input className={fieldClassName()} value={newLead.program} onChange={(event) => setNewLead((current) => ({ ...current, program: event.target.value }))} /></Field></AdminCard>
      <div className="grid gap-4">{data.leads.map((lead) => <AdminCard key={lead.id} className="grid gap-4 xl:grid-cols-[1fr_210px_180px]"><div><div className="flex flex-wrap items-center gap-3"><h2 className="text-xl font-black text-slate-950">{lead.name}</h2><StatusPill tone={leadTone(lead.status)}>{lead.status}</StatusPill><StatusPill tone={lead.priority === "Срочная" ? "red" : lead.priority === "Высокая" ? "amber" : "slate"}>{lead.priority}</StatusPill></div><p className="mt-2 text-sm font-semibold text-slate-600">{lead.program} · {lead.phone} · {lead.email}</p><Field label="Заметка"><textarea className={textareaClassName("mt-2 min-h-20")} value={lead.note} onChange={(event) => updateLead(lead.id, { note: event.target.value })} /></Field></div><Field label="Статус"><select className={fieldClassName()} value={lead.status} onChange={(event) => updateLead(lead.id, { status: event.target.value as LeadStatus })}><option>Новая</option><option>В работе</option><option>Ждёт ответа</option><option>Закрыта</option></select></Field><Field label="Менеджер"><input className={fieldClassName()} value={lead.manager} onChange={(event) => updateLead(lead.id, { manager: event.target.value })} /></Field></AdminCard>)}</div>
    </>
  );
}

export function AdminPagesPage() {
  return (
    <AdminPageLayout active="pages" title="Страницы" description="Карта публичных страниц сайта, статусы публикации и готовность SEO.">
      <PagesContent />
    </AdminPageLayout>
  );
}

function PagesContent() {
  const { data, updateData } = useAdmin();
  function updatePage(id: string, patch: Partial<DemoPageRecord>): void {
    updateData((current) => ({ ...current, pages: current.pages.map((page) => page.id === id ? { ...page, ...patch, lastCheck: getTodayLabel() } : page) }), "Обновлена страница", "Страницы");
  }
  return (
    <>
      <SectionTitle eyebrow="Страницы" title="Карта сайта" description="У каждой страницы есть URL, статус публикации, SEO-готовность и ссылка на публичную страницу." />
      <AdminTable><table className="w-full min-w-[960px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-[0.16em] text-slate-500"><tr><th className="px-5 py-4">Страница</th><th className="px-5 py-4">URL</th><th className="px-5 py-4">Статус</th><th className="px-5 py-4">SEO</th><th className="px-5 py-4">Проверка</th></tr></thead><tbody className="divide-y divide-slate-100">{data.pages.map((page) => <tr key={page.id}><td className="px-5 py-4 font-black text-slate-950"><Link href={page.href} className="text-blue-800 hover:text-blue-950">{page.title}</Link></td><td className="px-5 py-4 font-semibold text-slate-600">{page.href}</td><td className="px-5 py-4"><select className={fieldClassName("min-h-10")} value={page.status} onChange={(event) => updatePage(page.id, { status: event.target.value as DemoStatus })}><option value="published">Опубликовано</option><option value="draft">Черновик</option><option value="hidden">Скрыто</option></select></td><td className="px-5 py-4"><select className={fieldClassName("min-h-10")} value={page.seoStatus} onChange={(event) => updatePage(page.id, { seoStatus: event.target.value as DemoPageRecord["seoStatus"] })}><option>Готово</option><option>Нужно проверить</option><option>Черновик</option></select></td><td className="px-5 py-4 font-semibold text-slate-500">{page.lastCheck}</td></tr>)}</tbody></table></AdminTable>
    </>
  );
}

export function AdminSeoPage() {
  return (
    <AdminPageLayout active="seo" title="SEO" description="Управление title, description, OG-заголовками и индексацией страниц.">
      <SeoContent />
    </AdminPageLayout>
  );
}

function SeoContent() {
  const { data, updateData } = useAdmin();
  function updateSeo(id: string, patch: Partial<DemoSeoRecord>): void {
    updateData((current) => ({ ...current, seo: current.seo.map((item) => item.id === id ? { ...item, ...patch } : item) }), "Обновлены SEO-настройки", "SEO");
  }
  return (
    <>
      <SectionTitle eyebrow="SEO" title="Мета-данные" description="Каждая SEO-запись редактируется как отдельная карточка: title, description, OpenGraph и robots." />
      <div className="grid gap-5">{data.seo.map((item) => <AdminCard key={item.id} className="grid gap-4 lg:grid-cols-2"><Field label="Страница"><input className={fieldClassName()} value={item.page} onChange={(event) => updateSeo(item.id, { page: event.target.value })} /></Field><Field label="Robots"><select className={fieldClassName()} value={item.robots} onChange={(event) => updateSeo(item.id, { robots: event.target.value as DemoSeoRecord["robots"] })}><option>index, follow</option><option>noindex, nofollow</option></select></Field><Field label="Title"><input className={fieldClassName()} value={item.title} onChange={(event) => updateSeo(item.id, { title: event.target.value })} /></Field><Field label="OG Title"><input className={fieldClassName()} value={item.ogTitle} onChange={(event) => updateSeo(item.id, { ogTitle: event.target.value })} /></Field><div className="lg:col-span-2"><Field label="Description"><textarea className={textareaClassName()} value={item.description} onChange={(event) => updateSeo(item.id, { description: event.target.value })} /></Field></div></AdminCard>)}</div>
    </>
  );
}

export function AdminSettingsPage() {
  return (
    <AdminPageLayout active="settings" title="Настройки" description="Глобальные настройки режима публикации, служебного уведомления и технического состояния проекта.">
      <SettingsContent />
    </AdminPageLayout>
  );
}

function SettingsContent() {
  const { content, data, updateContent, updateData } = useAdmin();
  function changeMode(event: ChangeEvent<HTMLSelectElement>): void {
    updateData((current) => ({ ...current, publicationMode: event.target.value as DemoAdminData["publicationMode"] }), "Изменён режим публикации", "Настройки");
  }
  return (
    <>
      <SectionTitle eyebrow="Настройки" title="Параметры сайта" description="Режим публикации, служебное уведомление и техническая готовность к подключению Supabase." />
      <div className="grid gap-5 lg:grid-cols-2"><AdminCard className="grid gap-5"><Field label="Режим публикации"><select className={fieldClassName()} value={data.publicationMode} onChange={changeMode}><option>Показ заказчику</option><option>Подготовка</option><option>Готово к Supabase</option></select></Field><Field label="Заголовок уведомления"><input className={fieldClassName()} value={content.noticeTitle} onChange={(event) => updateContent("noticeTitle", event.target.value)} /></Field><Field label="Текст уведомления"><textarea className={textareaClassName()} value={content.noticeText} onChange={(event) => updateContent("noticeText", event.target.value)} /></Field></AdminCard><AdminCard className="bg-blue-50/70"><Settings className="h-8 w-8 text-blue-700" /><h2 className="mt-4 text-2xl font-black text-slate-950">Состояние</h2><div className="mt-5 grid gap-3">{["GitHub Pages открыт для показа", "Админка работает без сервера", "Изменения сохраняются на устройстве", "Supabase подключается следующим этапом"].map((item) => <div key={item} className="flex items-center gap-3 rounded-2xl border border-blue-100 bg-white px-4 py-3"><CheckCircle2 className="h-5 w-5 text-emerald-700" /><span className="text-sm font-bold text-slate-700">{item}</span></div>)}</div></AdminCard></div>
    </>
  );
}

export function AdminUsersPage() {
  return (
    <AdminPageLayout active="users" title="Пользователи" description="Пользователи, роли и статусы доступа для презентации будущей системы прав.">
      <UsersContent />
    </AdminPageLayout>
  );
}

function UsersContent() {
  const { data, updateData } = useAdmin();
  function addUser(): void {
    updateData((current) => ({ ...current, users: [...current.users, { id: makeId("user"), name: "Новый пользователь", email: "new@mgipo.ru", role: "Наблюдатель", status: "Приглашён", lastSeen: "ещё не входил" }] }), "Добавлен пользователь", "Пользователи");
  }
  function updateUser(id: string, patch: Partial<DemoUser>): void {
    updateData((current) => ({ ...current, users: current.users.map((user) => user.id === id ? { ...user, ...patch } : user) }), "Обновлён пользователь", "Пользователи");
  }
  return (
    <>
      <SectionTitle eyebrow="Доступы" title="Команда и роли" description="Можно показать заказчику раздел прав доступа: владельцы, администраторы, менеджеры и наблюдатели." action={<Button type="button" onClick={addUser}><Plus className="h-4 w-4" /> Добавить пользователя</Button>} />
      <div className="grid gap-4">{data.users.map((user) => <AdminCard key={user.id} className="grid gap-4 lg:grid-cols-[1fr_1fr_220px_180px]"><Field label="Имя"><input className={fieldClassName()} value={user.name} onChange={(event) => updateUser(user.id, { name: event.target.value })} /></Field><Field label="Email"><input className={fieldClassName()} value={user.email} onChange={(event) => updateUser(user.id, { email: event.target.value })} /></Field><Field label="Роль"><select className={fieldClassName()} value={user.role} onChange={(event) => updateUser(user.id, { role: event.target.value as UserRole })}><option>Владелец</option><option>Администратор</option><option>Контент-менеджер</option><option>Менеджер заявок</option><option>Наблюдатель</option></select></Field><Field label="Статус"><select className={fieldClassName()} value={user.status} onChange={(event) => updateUser(user.id, { status: event.target.value as DemoUser["status"] })}><option>Активен</option><option>Приглашён</option><option>Отключён</option></select></Field></AdminCard>)}</div>
    </>
  );
}

export function AdminAuditPage() {
  return (
    <AdminPageLayout active="audit" title="Журнал действий" description="История изменений: что было изменено, в каком разделе, кем и когда.">
      <AuditContent />
    </AdminPageLayout>
  );
}

function AuditContent() {
  const { data, updateData } = useAdmin();
  function clearAudit(): void {
    updateData((current) => ({ ...current, audit: [] }), "Очищен журнал действий", "Журнал");
  }
  return (
    <>
      <SectionTitle eyebrow="Аудит" title="История действий" description="Каждое сохранение и изменение в разделах панели добавляет событие в журнал." action={<Button type="button" variant="secondary" onClick={clearAudit}><Trash2 className="h-4 w-4" /> Очистить журнал</Button>} />
      <div className="grid gap-4">{data.audit.length > 0 ? data.audit.map((event) => <AdminCard key={event.id} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><div className="flex gap-3"><ListChecks className="mt-1 h-5 w-5 text-blue-700" /><div><p className="text-base font-black text-slate-950">{event.title}</p><p className="mt-1 text-sm font-semibold text-slate-500">{event.section} · {event.actor}</p></div></div><StatusPill tone="slate"><Clock3 className="h-3 w-3" /> {event.date}</StatusPill></AdminCard>) : <EmptyNote>Журнал пуст. Измените любой раздел — события появятся здесь.</EmptyNote>}</div>
    </>
  );
}

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { SiteContentPayload, SiteContentView } from '@/features/site-content/types';

const defaultPublishedSiteContent: SiteContentPayload = {
  heroEyebrow: 'Для руководителей, организаций и государственных структур',
  heroTitle: 'Повышение квалификации для серьёзных решений',
  heroDescription: 'Институт профессионального развития сопровождает профессиональное развитие управленцев, команд и ответственных специалистов. Строгий деловой формат, официальные документы, персональный подбор и конфиденциальная обработка запроса.',
  organizationTitle: 'Для организаций и государственных структур',
  organizationDescription: 'Оставьте запрос — эксперт уточнит цель обучения, состав слушателей, требования к документам, формат и стоимость. Заявка сразу попадёт в админ-панель сайта, где менеджер увидит данные клиента, тему обращения и статус обработки.'
};

const dataDirectory = path.join(process.cwd(), '.local-data');
const contentFilePath = path.join(dataDirectory, 'site-content.json');

async function ensureDataDirectory(): Promise<void> {
  await mkdir(dataDirectory, { recursive: true });
}

function isStringRecord(value: unknown): value is Record<string, string> {
  return value !== null && typeof value === 'object';
}

function normalizePayload(value: unknown): SiteContentPayload | null {
  if (!isStringRecord(value)) return null;
  if (typeof value.heroEyebrow !== 'string') return null;
  if (typeof value.heroTitle !== 'string') return null;
  if (typeof value.heroDescription !== 'string') return null;
  if (typeof value.organizationTitle !== 'string') return null;
  if (typeof value.organizationDescription !== 'string') return null;
  return {
    heroEyebrow: value.heroEyebrow,
    heroTitle: value.heroTitle,
    heroDescription: value.heroDescription,
    organizationTitle: value.organizationTitle,
    organizationDescription: value.organizationDescription
  };
}

function defaultView(): SiteContentView {
  return {
    ...defaultPublishedSiteContent,
    draft: defaultPublishedSiteContent,
    updatedAt: null,
    lastPublishedAt: null
  };
}

export async function readLocalSiteContent(): Promise<SiteContentView> {
  try {
    const raw = await readFile(contentFilePath, 'utf8');
    const parsed: unknown = JSON.parse(raw);
    if (parsed === null || typeof parsed !== 'object') return defaultView();
    const record = parsed as Record<string, unknown>;
    const published = normalizePayload(record.published);
    const draft = normalizePayload(record.draft);
    if (published === null) return defaultView();
    return {
      ...published,
      draft: draft ?? published,
      updatedAt: typeof record.updatedAt === 'string' ? record.updatedAt : null,
      lastPublishedAt: typeof record.lastPublishedAt === 'string' ? record.lastPublishedAt : null
    };
  } catch {
    return defaultView();
  }
}

export async function writeLocalSiteContent(content: SiteContentPayload, mode: 'draft' | 'publish'): Promise<SiteContentView> {
  const current = await readLocalSiteContent();
  const now = new Date().toISOString();
  const published: SiteContentPayload = mode === 'publish' ? content : {
    heroEyebrow: current.heroEyebrow,
    heroTitle: current.heroTitle,
    heroDescription: current.heroDescription,
    organizationTitle: current.organizationTitle,
    organizationDescription: current.organizationDescription
  };
  const next: SiteContentView = {
    ...published,
    draft: content,
    updatedAt: now,
    lastPublishedAt: mode === 'publish' ? now : current.lastPublishedAt
  };
  await ensureDataDirectory();
  await writeFile(contentFilePath, JSON.stringify({ published, draft: content, updatedAt: next.updatedAt, lastPublishedAt: next.lastPublishedAt }, null, 2), 'utf8');
  return next;
}

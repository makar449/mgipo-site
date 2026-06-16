import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { Prisma } from '@prisma/client';
import { services as baseServices } from '@/features/services/data';
import { heroStats, legalDocuments } from '@/lib/brand-content';
import type { CmsContent, CmsView } from '@/features/admin-cms/types';
import { cmsContentSchema, cmsViewSchema } from '@/features/admin-cms/types';
import { serviceSchema, categories, type Service } from '@/features/services/types';

const dataDirectory = path.join(process.cwd(), '.local-data');
const cmsFilePath = path.join(dataDirectory, 'admin-cms.json');
const publicCmsCacheTtlMs = 30_000;

type PrismaClientInstance = typeof import('@/lib/db').prisma;
let prismaClientPromise: Promise<PrismaClientInstance> | null = null;

async function getPrismaClient(): Promise<PrismaClientInstance> {
  prismaClientPromise ??= import('@/lib/db').then((module) => module.prisma);
  return prismaClientPromise;
}

function isStaticExportRuntime(): boolean {
  return process.env.GITHUB_PAGES === 'true' || process.env.NEXT_PUBLIC_STATIC_EXPORT === 'true';
}


let publicCmsCache: { view: CmsView; expiresAt: number } | null = null;

function readPublicCmsCache(): CmsView | null {
  if (publicCmsCache === null) return null;
  if (publicCmsCache.expiresAt <= Date.now()) {
    publicCmsCache = null;
    return null;
  }
  return publicCmsCache.view;
}

function writePublicCmsCache(view: CmsView): void {
  publicCmsCache = { view, expiresAt: Date.now() + publicCmsCacheTtlMs };
}

const defaultNavigation: CmsContent['navigation'] = [
  { id: 'home', href: '/', label: 'Главная', visible: true },
  { id: 'about', href: '/about', label: 'О компании', visible: true },
  { id: 'services', href: '/services', label: 'Программы', visible: true },
  { id: 'corporate', href: '/corporate', label: 'Организациям', visible: true },
  { id: 'documents', href: '/documents', label: 'Документы', visible: true },
  { id: 'contacts', href: '/contacts', label: 'Контакты', visible: true }
];

const defaultPages: CmsContent['pages'] = [
  { id: 'about', title: 'О компании', description: 'Институт профессионального развития сопровождает обучение руководителей, специалистов и организаций в строгом деловом формате.', visible: true },
  { id: 'corporate', title: 'Для организаций', description: 'Корпоративные заявки, подбор программ под должности, отрасли и требования к документам.', visible: true },
  { id: 'documents', title: 'Документы', description: 'Официальные сведения, перечни программ и правовые материалы.', visible: true },
  { id: 'contacts', title: 'Контакты', description: 'Форма заявки, телефон, email, адрес и рабочее время.', visible: true }
];

type DbServiceRow = Prisma.ServiceGetPayload<{
  include: {
    category: true;
    variants: true;
    faq: true;
    modules: true;
    benefits: true;
    includes: true;
    suitableFor: true;
  };
}>;

type DbFooterColumn = Prisma.FooterColumnGetPayload<{ include: { links: true } }>;

type DbCmsShape = {
  settings: Prisma.SiteSettingsGetPayload<Record<string, never>> | null;
  navigation: ReadonlyArray<Prisma.NavigationItemGetPayload<Record<string, never>>>;
  footerColumns: ReadonlyArray<DbFooterColumn>;
  documents: ReadonlyArray<Prisma.DocumentGetPayload<Record<string, never>>>;
  pages: ReadonlyArray<Prisma.PageContentGetPayload<Record<string, never>>>;
  services: ReadonlyArray<DbServiceRow>;
};

function defaultServicesRecord(): Record<string, Service> {
  return Object.fromEntries(baseServices.map((service) => [service.id, service]));
}

function getCategoryTitle(value: string): Service['category'] {
  const parsed = categories.find((category) => category === value);
  return parsed ?? 'Разные отрасли';
}

function normalizeFormat(value: string): Service['formats'][number] {
  if (value === 'Онлайн' || value === 'Очно' || value === 'Дистанционно' || value === 'Смешанный') return value;
  return 'Дистанционно';
}

function normalizeDocument(value: string): Service['documentType'] {
  if (value === 'Удостоверение' || value === 'Сертификат' || value === 'Диплом' || value === 'Протокол проверки знаний') return value;
  return 'Диплом';
}

function normalizeAccent(value: string): Service['accent'] {
  if (value === 'cyan' || value === 'blue' || value === 'green' || value === 'orange' || value === 'violet' || value === 'gold') return value;
  return 'blue';
}

function dbServiceToService(row: DbServiceRow): Service {
  return serviceSchema.parse({
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: getCategoryTitle(row.category.title),
    headline: row.headline,
    shortDescription: row.shortDescription,
    fullDescription: row.fullDescription,
    minPrice: row.minPrice,
    maxPrice: row.maxPrice,
    duration: row.duration,
    formats: row.formats.map(normalizeFormat),
    documentType: normalizeDocument(row.documentType),
    documentDescription: row.documentDescription,
    programModules: [...row.modules].sort((left, right) => left.sortOrder - right.sortOrder).map((item) => item.title),
    suitableFor: [...row.suitableFor].sort((left, right) => left.sortOrder - right.sortOrder).map((item) => item.title),
    includes: [...row.includes].sort((left, right) => left.sortOrder - right.sortOrder).map((item) => item.title),
    benefits: [...row.benefits].sort((left, right) => left.sortOrder - right.sortOrder).map((item) => item.title),
    keywords: row.keywords,
    synonyms: row.synonyms,
    popularity: row.popularity,
    isNew: row.popularity >= 90,
    status: row.status === 'PUBLISHED' ? 'active' : 'hidden',
    variants: [...row.variants].sort((left, right) => left.sortOrder - right.sortOrder).map((variant) => ({
      id: variant.id,
      title: variant.title,
      hours: variant.hours,
      format: normalizeFormat(variant.format),
      price: variant.price,
      paymentLabel: variant.paymentLabel
    })),
    faq: [...row.faq].sort((left, right) => left.sortOrder - right.sortOrder).map((item) => ({ question: item.question, answer: item.answer })),
    accent: normalizeAccent(row.accent),
    sourceDocumentHref: row.sourceDocumentHref ?? '/documents',
    sourceDocumentLabel: row.sourceDocumentLabel ?? 'Документы программы'
  });
}

function createContentFromDb(shape: DbCmsShape): CmsContent | null {
  if (shape.settings === null || shape.services.length === 0) return null;

  const settings = shape.settings;
  const servicesRecord = Object.fromEntries(shape.services.map((service) => {
    const parsed = dbServiceToService(service);
    return [parsed.id, parsed];
  }));

  const homePage = shape.pages.find((page) => page.pageKey === 'home');
  const homeBlocks = homePage?.blocks;
  const homeDraft = typeof homeBlocks === 'object' && homeBlocks !== null && !Array.isArray(homeBlocks) ? homeBlocks as Partial<CmsContent['home']> : {};

  return cmsContentSchema.parse({
    identity: {
      shortName: settings.shortName,
      fullName: settings.fullName,
      descriptor: settings.descriptor,
      phone: settings.phone,
      email: settings.email,
      address: settings.address,
      workHours: settings.workHours,
      license: settings.license
    },
    navigation: [...shape.navigation].sort((left, right) => left.sortOrder - right.sortOrder).map((item) => ({ id: item.key, href: item.href, label: item.label, visible: item.visible })),
    home: {
      heroEyebrow: typeof homeDraft.heroEyebrow === 'string' ? homeDraft.heroEyebrow : 'Для руководителей, организаций и государственных структур',
      heroTitle: typeof homeDraft.heroTitle === 'string' ? homeDraft.heroTitle : 'Повышение квалификации для серьёзных решений',
      heroDescription: typeof homeDraft.heroDescription === 'string' ? homeDraft.heroDescription : 'Институт профессионального развития сопровождает профессиональное развитие управленцев, команд и ответственных специалистов.',
      primaryCtaLabel: typeof homeDraft.primaryCtaLabel === 'string' ? homeDraft.primaryCtaLabel : 'Подобрать программу',
      secondaryCtaLabel: typeof homeDraft.secondaryCtaLabel === 'string' ? homeDraft.secondaryCtaLabel : 'Связаться с экспертом',
      organizationTitle: typeof homeDraft.organizationTitle === 'string' ? homeDraft.organizationTitle : 'Для организаций и государственных структур',
      organizationDescription: typeof homeDraft.organizationDescription === 'string' ? homeDraft.organizationDescription : 'Оставьте запрос — эксперт уточнит цель обучения, состав слушателей, требования к документам, формат и стоимость.',
      stats: Array.isArray(homeDraft.stats) ? homeDraft.stats : heroStats.map((stat, index) => ({ id: `stat-${index + 1}`, value: stat.value, label: stat.label, visible: true }))
    },
    footer: {
      description: 'Институт профессионального развития для руководителей, организаций и государственных структур. Строгий формат взаимодействия, официальные документы и персональное сопровождение заявки.',
      copyright: '© 2026 Институт профессионального развития. Все права защищены.',
      columns: [...shape.footerColumns].sort((left, right) => left.sortOrder - right.sortOrder).map((column) => ({
        id: column.key,
        title: column.title,
        visible: column.visible,
        links: [...column.links].sort((left, right) => left.sortOrder - right.sortOrder).map((link) => ({ href: link.href, label: link.label, visible: link.visible }))
      }))
    },
    documents: shape.documents.map((document) => ({ id: document.id, title: document.title, description: document.description, href: document.href, visible: document.visible })),
    pages: shape.pages.map((page) => ({ id: page.pageKey, title: page.title, description: page.description, visible: page.status === 'PUBLISHED' })),
    seo: {
      defaultTitle: 'МГИПО — программы профессиональной переподготовки',
      defaultDescription: 'Каталог программ профессиональной переподготовки: отраслевые направления, диплом, обучение от 256 до 1024 часов, стоимость от 10 000 рублей.',
      keywords: 'МГИПО, профессиональная переподготовка, ДПП, диплом, руководители, организации',
      ogTitle: 'МГИПО — профессиональная переподготовка',
      ogDescription: 'Строгий сайт образовательного института с каталогом программ, заявками и админ-панелью.'
    },
    theme: {
      primaryBlue: settings.primaryBlue,
      background: settings.background,
      text: settings.textColor,
      radius: settings.radius === 'strict' || settings.radius === 'balanced' || settings.radius === 'soft' ? settings.radius : 'balanced',
      density: settings.density === 'compact' || settings.density === 'balanced' || settings.density === 'spacious' ? settings.density : 'balanced'
    },
    services: servicesRecord,
    hiddenServiceIds: shape.services.filter((service) => service.status !== 'PUBLISHED').map((service) => service.id)
  });
}

export function createDefaultCmsContent(): CmsContent {
  return cmsContentSchema.parse({
    identity: {
      shortName: 'МГИПО',
      fullName: 'Институт профессионального развития',
      descriptor: 'Институт профессионального развития',
      phone: '+7 (495) 120-00-01',
      email: 'info@mgipo.ru',
      address: 'Россия, Москва',
      workHours: 'Пн–Пт: 09:00–18:00',
      license: 'Реквизиты лицензии вносятся в админ-панели после подтверждения заказчиком'
    },
    navigation: defaultNavigation,
    home: {
      heroEyebrow: 'Для руководителей, организаций и государственных структур',
      heroTitle: 'Повышение квалификации для серьёзных решений',
      heroDescription: 'Институт профессионального развития сопровождает профессиональное развитие управленцев, команд и ответственных специалистов. Строгий деловой формат, официальные документы, персональный подбор и конфиденциальная обработка запроса.',
      primaryCtaLabel: 'Подобрать программу',
      secondaryCtaLabel: 'Связаться с экспертом',
      organizationTitle: 'Для организаций и государственных структур',
      organizationDescription: 'Оставьте запрос — эксперт уточнит цель обучения, состав слушателей, требования к документам, формат и стоимость. Заявка сразу попадёт в админ-панель сайта, где менеджер увидит данные клиента, тему обращения и статус обработки.',
      stats: heroStats.map((stat, index) => ({ id: `stat-${index + 1}`, value: stat.value, label: stat.label, visible: true }))
    },
    footer: {
      description: 'Институт профессионального развития для руководителей, организаций и государственных структур. Строгий формат взаимодействия, официальные документы и персональное сопровождение заявки.',
      copyright: '© 2026 Институт профессионального развития. Все права защищены.',
      columns: [
        { id: 'company', title: 'Компания', visible: true, links: [{ href: '/about', label: 'О компании', visible: true }, { href: '/corporate', label: 'Организациям', visible: true }, { href: '/documents', label: 'Лицензии и документы', visible: true }, { href: '/reviews', label: 'Отзывы', visible: true }, { href: '/cases', label: 'Кейсы', visible: true }] },
        { id: 'programs', title: 'Программы', visible: true, links: [{ href: '/services', label: 'Каталог программ', visible: true }, { href: '/prices', label: 'Цены', visible: true }, { href: '/compare', label: 'Сравнение', visible: true }, { href: '/favorites', label: 'Избранное', visible: true }, { href: '/faq', label: 'Вопросы и ответы', visible: true }] },
        { id: 'legal', title: 'Правовая информация', visible: true, links: [{ href: '/legal/privacy', label: 'Политика конфиденциальности', visible: true }, { href: '/legal/consent', label: 'Согласие на обработку данных', visible: true }, { href: '/legal/terms', label: 'Оферта', visible: true }, { href: '/legal/requisites', label: 'Реквизиты', visible: true }] }
      ]
    },
    documents: legalDocuments.map((document, index) => ({ id: `document-${index + 1}`, title: document.title, description: document.description, href: document.href, visible: true })),
    pages: defaultPages,
    seo: {
      defaultTitle: 'МГИПО — программы профессиональной переподготовки',
      defaultDescription: 'Каталог программ профессиональной переподготовки: отраслевые направления, диплом, обучение от 256 до 1024 часов, стоимость от 10 000 рублей.',
      keywords: 'МГИПО, профессиональная переподготовка, ДПП, диплом, руководители, организации',
      ogTitle: 'МГИПО — профессиональная переподготовка',
      ogDescription: 'Строгий сайт образовательного института с каталогом программ, заявками и админ-панелью.'
    },
    theme: {
      primaryBlue: '#1057d8',
      background: '#ffffff',
      text: '#071527',
      radius: 'balanced',
      density: 'balanced'
    },
    services: defaultServicesRecord(),
    hiddenServiceIds: []
  });
}

async function ensureDataDirectory(): Promise<void> {
  await mkdir(dataDirectory, { recursive: true });
}

function normalizeView(value: unknown): CmsView | null {
  const parsed = cmsViewSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}

function createDefaultCmsView(): CmsView {
  const now = new Date('2026-01-01T00:00:00.000Z').toISOString();
  const content = createDefaultCmsContent();
  return { published: content, draft: content, updatedAt: now, lastPublishedAt: now };
}

async function readLocalCmsView(): Promise<CmsView> {
  try {
    const raw = await readFile(cmsFilePath, 'utf8');
    const parsed: unknown = JSON.parse(raw);
    const normalized = normalizeView(parsed);
    if (normalized !== null) return normalized;
  } catch {
    // local file is optional on first launch
  }
  const now = new Date().toISOString();
  const content = createDefaultCmsContent();
  return { published: content, draft: content, updatedAt: now, lastPublishedAt: null };
}

async function writeLocalCmsView(content: CmsContent, mode: 'draft' | 'publish'): Promise<CmsView> {
  const current = await readLocalCmsView();
  const now = new Date().toISOString();
  const parsed = cmsContentSchema.parse(content);
  const next: CmsView = {
    published: mode === 'publish' ? parsed : current.published,
    draft: parsed,
    updatedAt: now,
    lastPublishedAt: mode === 'publish' ? now : current.lastPublishedAt
  };
  await ensureDataDirectory();
  await writeFile(cmsFilePath, JSON.stringify(next, null, 2), 'utf8');
  return next;
}

async function readDbCmsView(): Promise<CmsView | null> {
  if (isStaticExportRuntime()) return null;
  try {
    const prisma = await getPrismaClient();
    const [settings, navigation, footerColumns, documents, pages, services] = await Promise.all([
      prisma.siteSettings.findUnique({ where: { id: 'main' } }),
      prisma.navigationItem.findMany({ orderBy: { sortOrder: 'asc' } }),
      prisma.footerColumn.findMany({ include: { links: true }, orderBy: { sortOrder: 'asc' } }),
      prisma.document.findMany({ orderBy: { updatedAt: 'desc' } }),
      prisma.pageContent.findMany({ orderBy: { updatedAt: 'desc' } }),
      prisma.service.findMany({
        include: { category: true, variants: true, faq: true, modules: true, benefits: true, includes: true, suitableFor: true },
        orderBy: [{ popularity: 'desc' }, { title: 'asc' }]
      })
    ]);
    const published = createContentFromDb({ settings, navigation, footerColumns, documents, pages, services });
    if (published === null || settings === null) return null;
    const draft = normalizeDraftPayload(settings.draftPayload) ?? published;
    return {
      published,
      draft,
      updatedAt: settings.updatedAt.toISOString(),
      lastPublishedAt: settings.publishedAt?.toISOString() ?? null
    };
  } catch {
    return null;
  }
}

function normalizeDraftPayload(value: Prisma.JsonValue | null): CmsContent | null {
  if (value === null) return null;
  const parsed = cmsContentSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}

async function upsertServiceRelations(service: Service, categoryId: string, prisma: PrismaClientInstance): Promise<void> {
  await prisma.service.upsert({
    where: { id: service.id },
    update: {
      slug: service.slug,
      title: service.title,
      categoryId,
      headline: service.headline,
      shortDescription: service.shortDescription,
      fullDescription: service.fullDescription,
      minPrice: service.minPrice,
      maxPrice: service.maxPrice,
      duration: service.duration,
      formats: service.formats,
      documentType: service.documentType,
      documentDescription: service.documentDescription,
      keywords: service.keywords,
      synonyms: service.synonyms,
      popularity: service.popularity,
      accent: service.accent,
      sourceDocumentHref: service.sourceDocumentHref,
      sourceDocumentLabel: service.sourceDocumentLabel,
      status: service.status === 'active' ? 'PUBLISHED' : 'HIDDEN',
      version: { increment: 1 }
    },
    create: {
      id: service.id,
      slug: service.slug,
      title: service.title,
      categoryId,
      headline: service.headline,
      shortDescription: service.shortDescription,
      fullDescription: service.fullDescription,
      minPrice: service.minPrice,
      maxPrice: service.maxPrice,
      duration: service.duration,
      formats: service.formats,
      documentType: service.documentType,
      documentDescription: service.documentDescription,
      keywords: service.keywords,
      synonyms: service.synonyms,
      popularity: service.popularity,
      accent: service.accent,
      sourceDocumentHref: service.sourceDocumentHref,
      sourceDocumentLabel: service.sourceDocumentLabel,
      status: service.status === 'active' ? 'PUBLISHED' : 'HIDDEN'
    }
  });

  await Promise.all([
    prisma.serviceVariant.deleteMany({ where: { serviceId: service.id } }),
    prisma.serviceFaq.deleteMany({ where: { serviceId: service.id } }),
    prisma.serviceModule.deleteMany({ where: { serviceId: service.id } }),
    prisma.serviceBenefit.deleteMany({ where: { serviceId: service.id } }),
    prisma.serviceInclude.deleteMany({ where: { serviceId: service.id } }),
    prisma.serviceAudience.deleteMany({ where: { serviceId: service.id } })
  ]);

  await Promise.all([
    prisma.serviceVariant.createMany({ data: service.variants.map((variant, index) => ({ id: variant.id, serviceId: service.id, title: variant.title, hours: variant.hours, format: variant.format, price: variant.price, paymentLabel: variant.paymentLabel, sortOrder: index })) }),
    prisma.serviceFaq.createMany({ data: service.faq.map((item, index) => ({ serviceId: service.id, question: item.question, answer: item.answer, sortOrder: index })) }),
    prisma.serviceModule.createMany({ data: service.programModules.map((title, index) => ({ serviceId: service.id, title, sortOrder: index })) }),
    prisma.serviceBenefit.createMany({ data: service.benefits.map((title, index) => ({ serviceId: service.id, title, sortOrder: index })) }),
    prisma.serviceInclude.createMany({ data: service.includes.map((title, index) => ({ serviceId: service.id, title, sortOrder: index })) }),
    prisma.serviceAudience.createMany({ data: service.suitableFor.map((title, index) => ({ serviceId: service.id, title, sortOrder: index })) })
  ]);
}

async function writeDbCmsView(content: CmsContent, mode: 'draft' | 'publish'): Promise<CmsView | null> {
  if (isStaticExportRuntime()) return null;
  try {
    const prisma = await getPrismaClient();
    const parsed = cmsContentSchema.parse(content);
    await prisma.siteSettings.upsert({
      where: { id: 'main' },
      update: {
        shortName: parsed.identity.shortName,
        fullName: parsed.identity.fullName,
        descriptor: parsed.identity.descriptor,
        phone: parsed.identity.phone,
        email: parsed.identity.email,
        address: parsed.identity.address,
        workHours: parsed.identity.workHours,
        license: parsed.identity.license,
        primaryBlue: parsed.theme.primaryBlue,
        background: parsed.theme.background,
        textColor: parsed.theme.text,
        radius: parsed.theme.radius,
        density: parsed.theme.density,
        draftPayload: parsed as unknown as Prisma.InputJsonValue,
        publishedAt: mode === 'publish' ? new Date() : undefined
      },
      create: {
        id: 'main',
        shortName: parsed.identity.shortName,
        fullName: parsed.identity.fullName,
        descriptor: parsed.identity.descriptor,
        phone: parsed.identity.phone,
        email: parsed.identity.email,
        address: parsed.identity.address,
        workHours: parsed.identity.workHours,
        license: parsed.identity.license,
        primaryBlue: parsed.theme.primaryBlue,
        background: parsed.theme.background,
        textColor: parsed.theme.text,
        radius: parsed.theme.radius,
        density: parsed.theme.density,
        draftPayload: parsed as unknown as Prisma.InputJsonValue,
        publishedAt: mode === 'publish' ? new Date() : null
      }
    });

    for (const [index, item] of parsed.navigation.entries()) {
      await prisma.navigationItem.upsert({ where: { key: item.id }, update: { href: item.href, label: item.label, visible: item.visible, sortOrder: index }, create: { key: item.id, href: item.href, label: item.label, visible: item.visible, sortOrder: index } });
    }

    for (const [index, column] of parsed.footer.columns.entries()) {
      const dbColumn = await prisma.footerColumn.upsert({ where: { key: column.id }, update: { title: column.title, visible: column.visible, sortOrder: index }, create: { key: column.id, title: column.title, visible: column.visible, sortOrder: index } });
      await prisma.footerLink.deleteMany({ where: { columnId: dbColumn.id } });
      if (column.links.length > 0) {
        await prisma.footerLink.createMany({ data: column.links.map((link, linkIndex) => ({ columnId: dbColumn.id, href: link.href, label: link.label, visible: link.visible, sortOrder: linkIndex })) });
      }
    }

    for (const document of parsed.documents) {
      await prisma.document.upsert({ where: { id: document.id }, update: { title: document.title, description: document.description, href: document.href, visible: document.visible, status: document.visible ? 'PUBLISHED' : 'HIDDEN' }, create: { id: document.id, title: document.title, description: document.description, href: document.href, visible: document.visible, status: document.visible ? 'PUBLISHED' : 'HIDDEN' } });
    }

    for (const page of parsed.pages) {
      await prisma.pageContent.upsert({ where: { pageKey: page.id }, update: { slug: `/${page.id}`, title: page.title, description: page.description, h1: page.title, blocks: page.id === 'home' ? parsed.home as unknown as Prisma.InputJsonValue : { description: page.description }, status: page.visible ? 'PUBLISHED' : 'HIDDEN', publishedAt: mode === 'publish' ? new Date() : undefined }, create: { pageKey: page.id, slug: `/${page.id}`, title: page.title, description: page.description, h1: page.title, blocks: page.id === 'home' ? parsed.home as unknown as Prisma.InputJsonValue : { description: page.description }, status: page.visible ? 'PUBLISHED' : 'HIDDEN', publishedAt: mode === 'publish' ? new Date() : null } });
    }

    const homePage = await prisma.pageContent.upsert({ where: { pageKey: 'home' }, update: { slug: '/', title: parsed.home.heroTitle, description: parsed.home.heroDescription, h1: parsed.home.heroTitle, blocks: parsed.home as unknown as Prisma.InputJsonValue, status: 'PUBLISHED', publishedAt: mode === 'publish' ? new Date() : undefined }, create: { pageKey: 'home', slug: '/', title: parsed.home.heroTitle, description: parsed.home.heroDescription, h1: parsed.home.heroTitle, blocks: parsed.home as unknown as Prisma.InputJsonValue, status: 'PUBLISHED', publishedAt: mode === 'publish' ? new Date() : null } });

    await prisma.seoMeta.upsert({ where: { pageId: homePage.id }, update: { title: parsed.seo.defaultTitle, description: parsed.seo.defaultDescription, keywords: parsed.seo.keywords, ogTitle: parsed.seo.ogTitle, ogDescription: parsed.seo.ogDescription, noIndex: false }, create: { pageId: homePage.id, pageKey: 'home', title: parsed.seo.defaultTitle, description: parsed.seo.defaultDescription, keywords: parsed.seo.keywords, ogTitle: parsed.seo.ogTitle, ogDescription: parsed.seo.ogDescription, noIndex: false } });

    if (mode === 'publish') {
      const categoryMap = new Map<string, string>();
      const services = Object.values(parsed.services);
      for (const service of services) {
        if (!categoryMap.has(service.category)) {
          const dbCategory = await prisma.category.upsert({ where: { slug: service.category.toLowerCase().replace(/\s+/g, '-') }, update: { title: service.category, status: 'PUBLISHED' }, create: { slug: service.category.toLowerCase().replace(/\s+/g, '-'), title: service.category, description: `Программы направления «${service.category}»`, status: 'PUBLISHED' } });
          categoryMap.set(service.category, dbCategory.id);
        }
        const categoryId = categoryMap.get(service.category);
        if (categoryId !== undefined) await upsertServiceRelations(service, categoryId, prisma);
      }
    }

    await prisma.adminAuditLog.create({ data: { action: mode === 'publish' ? 'CMS_PUBLISHED' : 'CMS_DRAFT_SAVED', actorEmail: 'admin', entityType: 'CMS', payload: { services: Object.keys(parsed.services).length, pages: parsed.pages.length } } });
    return readDbCmsView();
  } catch {
    return null;
  }
}

export async function readCmsView(options: { fresh?: boolean } = {}): Promise<CmsView> {
  if (isStaticExportRuntime()) {
    const view = createDefaultCmsView();
    writePublicCmsCache(view);
    return view;
  }

  if (options.fresh !== true) {
    const cached = readPublicCmsCache();
    if (cached !== null) return cached;
  }

  const dbView = await readDbCmsView();
  const view = dbView ?? await readLocalCmsView();
  writePublicCmsCache(view);
  return view;
}

export async function writeCmsView(content: CmsContent, mode: 'draft' | 'publish'): Promise<CmsView> {
  const dbView = await writeDbCmsView(content, mode);
  const view = dbView ?? await writeLocalCmsView(content, mode);
  writePublicCmsCache(view);
  return view;
}

export async function getPublishedCmsContent(): Promise<CmsContent> {
  const view = await readCmsView();
  return view.published;
}

export async function getDraftCmsContent(): Promise<CmsContent> {
  const view = await readCmsView({ fresh: true });
  return view.draft;
}

export async function getPublishedServices(): Promise<ReadonlyArray<Service>> {
  if (isStaticExportRuntime()) return baseServices;
  const view = await readCmsView();
  return Object.values(view.published.services).filter((service) => service.status === 'active' && !view.published.hiddenServiceIds.includes(service.id));
}

export async function getPublishedServiceBySlug(slug: string): Promise<Service | undefined> {
  const services = await getPublishedServices();
  return services.find((service) => service.slug === slug);
}

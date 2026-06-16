import { prisma } from '@/lib/db';
import type { SiteContentPayload, SiteContentView } from '@/features/site-content/types';
import { readLocalSiteContent } from '@/lib/local-site-content';

export const defaultPublishedSiteContent: SiteContentPayload = {
  heroEyebrow: 'Для руководителей, организаций и государственных структур',
  heroTitle: 'Повышение квалификации для серьёзных решений',
  heroDescription: 'Институт профессионального развития сопровождает профессиональное развитие управленцев, команд и ответственных специалистов. Строгий деловой формат, официальные документы, персональный подбор и конфиденциальная обработка запроса.',
  organizationTitle: 'Для организаций и государственных структур',
  organizationDescription: 'Оставьте запрос — эксперт уточнит цель обучения, состав слушателей, требования к документам, формат и стоимость. Заявка сразу попадёт в админ-панель сайта, где менеджер увидит данные клиента, тему обращения и статус обработки.'
};

function toDraft(content: {
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  organizationTitle: string;
  organizationDescription: string;
  draftHeroEyebrow: string | null;
  draftHeroTitle: string | null;
  draftHeroDescription: string | null;
  draftOrganizationTitle: string | null;
  draftOrganizationDescription: string | null;
}): SiteContentPayload {
  return {
    heroEyebrow: content.draftHeroEyebrow ?? content.heroEyebrow,
    heroTitle: content.draftHeroTitle ?? content.heroTitle,
    heroDescription: content.draftHeroDescription ?? content.heroDescription,
    organizationTitle: content.draftOrganizationTitle ?? content.organizationTitle,
    organizationDescription: content.draftOrganizationDescription ?? content.organizationDescription
  };
}

function fallbackView(): SiteContentView {
  return {
    ...defaultPublishedSiteContent,
    draft: defaultPublishedSiteContent,
    updatedAt: null,
    lastPublishedAt: null
  };
}

export async function getSiteContentView(): Promise<SiteContentView> {
  try {
    const content = await prisma.siteContent.findUnique({ where: { id: 'main' } });
    if (content === null) return fallbackView();
    return {
      heroEyebrow: content.heroEyebrow,
      heroTitle: content.heroTitle,
      heroDescription: content.heroDescription,
      organizationTitle: content.organizationTitle,
      organizationDescription: content.organizationDescription,
      draft: toDraft(content),
      updatedAt: content.updatedAt.toISOString(),
      lastPublishedAt: content.lastPublishedAt?.toISOString() ?? null
    };
  } catch {
    return readLocalSiteContent();
  }
}

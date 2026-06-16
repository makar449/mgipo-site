import { NextResponse } from 'next/server';
import { siteContentUpdateSchema } from '@/features/site-content/types';
import { getAdminSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { defaultPublishedSiteContent, getSiteContentView } from '@/lib/site-content';
import { writeLocalSiteContent } from '@/lib/local-site-content';
import { rejectUnsafeOrigin } from '@/lib/security';

export const runtime = 'nodejs';

function isDatabaseConnectionError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return message.includes("Can't reach database server") || message.includes('ECONNREFUSED') || message.includes('P1001') || message.includes('database server');
}

export async function GET() {
  const session = await getAdminSession();
  if (session === null) return NextResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Требуется вход администратора.' } }, { status: 401 });
  const content = await getSiteContentView();
  return NextResponse.json({ content });
}

export async function PATCH(request: Request) {
  const csrfResponse = rejectUnsafeOrigin(request);
  if (csrfResponse !== null) return csrfResponse;
  const session = await getAdminSession();
  if (session === null) return NextResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Требуется вход администратора.' } }, { status: 401 });
  const payload: unknown = await request.json().catch(() => null);
  const parsed = siteContentUpdateSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: { code: 'INVALID_INPUT', message: parsed.error.issues[0]?.message ?? 'Некорректные данные контента.' } }, { status: 400 });
  }

  const draftData = {
    draftHeroEyebrow: parsed.data.content.heroEyebrow,
    draftHeroTitle: parsed.data.content.heroTitle,
    draftHeroDescription: parsed.data.content.heroDescription,
    draftOrganizationTitle: parsed.data.content.organizationTitle,
    draftOrganizationDescription: parsed.data.content.organizationDescription
  };

  const publishedData = parsed.data.mode === 'publish'
    ? {
        heroEyebrow: parsed.data.content.heroEyebrow,
        heroTitle: parsed.data.content.heroTitle,
        heroDescription: parsed.data.content.heroDescription,
        organizationTitle: parsed.data.content.organizationTitle,
        organizationDescription: parsed.data.content.organizationDescription,
        lastPublishedAt: new Date()
      }
    : {};

  try {
    const content = await prisma.siteContent.upsert({
      where: { id: 'main' },
      create: {
        id: 'main',
        ...defaultPublishedSiteContent,
        ...draftData,
        ...publishedData
      },
      update: {
        ...draftData,
        ...publishedData
      }
    });

    await prisma.auditLog.create({
      data: {
        action: parsed.data.mode === 'publish' ? 'SITE_CONTENT_PUBLISHED' : 'SITE_CONTENT_DRAFT_SAVED',
        actorEmail: session.email,
        entityId: content.id,
        payload: { mode: parsed.data.mode, fields: Object.keys(parsed.data.content) }
      }
    });

    return NextResponse.json({ content: await getSiteContentView(), storage: 'database' });
  } catch (error) {
    if (!isDatabaseConnectionError(error)) throw error;
    const content = await writeLocalSiteContent(parsed.data.content, parsed.data.mode);
    return NextResponse.json({ content, storage: 'local-file', warning: 'PostgreSQL не подключён. Контент сохранён локально в .local-data/site-content.json.' });
  }
}

import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { prisma } from '@/lib/db';
import { assertRateLimit } from '@/lib/rate-limit';
import { leadInputSchema } from '@/features/leads/types';
import { getPublishedServices } from '@/lib/admin-cms';
import { createLocalLead } from '@/lib/local-leads';

export const runtime = 'nodejs';

function sanitize(value: string | undefined): string | undefined {
  if (value === undefined) return undefined;
  return value.replace(/[<>]/g, '').replace(/\s+/g, ' ').trim();
}

function getClientKey(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return forwarded ?? request.headers.get('x-real-ip') ?? 'unknown';
}

function detectPriority(comment: string | undefined): 'HIGH' | 'NORMAL' {
  if (comment === undefined) return 'NORMAL';
  const normalized = comment.toLowerCase();
  return normalized.includes('срочно') || normalized.includes('организац') || normalized.includes('сотрудник') || normalized.includes('отдел') || normalized.includes('руковод') ? 'HIGH' : 'NORMAL';
}

function isDatabaseConnectionError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return message.includes("Can't reach database server") || message.includes('ECONNREFUSED') || message.includes('P1001') || message.includes('database server');
}

export async function POST(request: Request) {
  try {
    assertRateLimit(`lead:${getClientKey(request)}`, 8, 60_000);
    const payload: unknown = await request.json();
    const parsed = leadInputSchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json({ error: { code: 'INVALID_INPUT', message: parsed.error.issues[0]?.message ?? 'Проверьте поля формы.' } }, { status: 400 });
    }
    const services = await getPublishedServices();
    const service = services.find((item) => item.id === parsed.data.serviceId);
    if (service === undefined) {
      return NextResponse.json({ error: { code: 'SERVICE_NOT_FOUND', message: 'Выбранная программа не найдена.' } }, { status: 400 });
    }

    const headerStore = await headers();
    const priority = detectPriority(parsed.data.comment);
    const sanitizedEmail = sanitize(parsed.data.email);
    const sanitizedComment = sanitize(parsed.data.comment);
    const data = {
      name: sanitize(parsed.data.name) ?? parsed.data.name,
      phone: sanitize(parsed.data.phone) ?? parsed.data.phone,
      ...(sanitizedEmail === undefined ? {} : { email: sanitizedEmail }),
      serviceId: service.id,
      serviceTitle: service.title,
      ...(sanitizedComment === undefined ? {} : { comment: sanitizedComment }),
      source: sanitize(parsed.data.source) ?? 'website',
      preferredContact: parsed.data.preferredContact,
      consentAccepted: parsed.data.consentAccepted,
      priority
    };

    try {
      const lead = await prisma.lead.create({
        data: {
          ...data,
          status: 'NEW',
          events: {
            create: {
              toStatus: 'NEW',
              note: 'Заявка создана через форму сайта и сохранена в админ-панели.'
            }
          }
        }
      });
      await prisma.auditLog.create({
        data: {
          action: 'LEAD_CREATED_ON_SITE',
          entityId: lead.id,
          payload: { serviceId: service.id, source: lead.source, preferredContact: lead.preferredContact, userAgent: headerStore.get('user-agent') }
        }
      });
      return NextResponse.json({ lead: { id: lead.id, status: lead.status, createdAt: lead.createdAt }, storage: 'database' }, { status: 201 });
    } catch (error) {
      if (!isDatabaseConnectionError(error)) throw error;
      const localLead = await createLocalLead(data);
      return NextResponse.json({ lead: { id: localLead.id, status: localLead.status, createdAt: localLead.createdAt }, storage: 'local-file', warning: 'PostgreSQL не подключён. Заявка сохранена локально в .local-data/leads.json.' }, { status: 201 });
    }
  } catch (error) {
    if (error instanceof Error && error.message === 'RATE_LIMITED') {
      return NextResponse.json({ error: { code: 'RATE_LIMITED', message: 'Слишком много заявок. Попробуйте чуть позже.' } }, { status: 429 });
    }
    return NextResponse.json({ error: { code: 'INTERNAL_ERROR', message: 'Заявка не сохранена. Попробуйте позже.' } }, { status: 500 });
  }
}

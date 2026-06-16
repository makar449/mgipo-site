import { NextResponse } from 'next/server';
import { updateLeadStatusSchema } from '@/features/leads/types';
import { getAdminSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { updateLocalLead } from '@/lib/local-leads';
import { rejectUnsafeOrigin } from '@/lib/security';

export const runtime = 'nodejs';

type RouteContext = { params: Promise<{ id: string }> };

function isDatabaseConnectionError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return message.includes("Can't reach database server") || message.includes('ECONNREFUSED') || message.includes('P1001') || message.includes('database server');
}

export async function PATCH(request: Request, context: RouteContext) {
  const csrfResponse = rejectUnsafeOrigin(request);
  if (csrfResponse !== null) return csrfResponse;
  const session = await getAdminSession();
  if (session === null) return NextResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Требуется вход администратора.' } }, { status: 401 });
  const { id } = await context.params;
  const payload: unknown = await request.json().catch(() => null);
  const parsed = updateLeadStatusSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: { code: 'INVALID_INPUT', message: 'Некорректные данные заявки.' } }, { status: 400 });
  }
  try {
    const current = await prisma.lead.findUnique({ where: { id } });
    if (current === null) {
      return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Заявка не найдена.' } }, { status: 404 });
    }
    const lead = await prisma.lead.update({
      where: { id },
      data: {
        status: parsed.data.status,
        ...(parsed.data.priority === undefined ? {} : { priority: parsed.data.priority }),
        ...(parsed.data.managerNote === undefined ? {} : { managerNote: parsed.data.managerNote }),
        lastStatusChangedAt: current.status === parsed.data.status ? current.lastStatusChangedAt : new Date(),
        events: {
          create: {
            fromStatus: current.status,
            toStatus: parsed.data.status,
            actorEmail: session.email,
            note: parsed.data.managerNote ?? undefined
          }
        }
      },
      include: { events: { orderBy: { createdAt: 'desc' }, take: 6 } }
    });
    await prisma.auditLog.create({ data: { action: 'LEAD_UPDATED', actorEmail: session.email, entityId: id, payload: { status: parsed.data.status, priority: parsed.data.priority, managerNote: parsed.data.managerNote } } });
    return NextResponse.json({ lead, storage: 'database' });
  } catch (error) {
    if (!isDatabaseConnectionError(error)) throw error;
    const lead = await updateLocalLead({
      id,
      status: parsed.data.status,
      ...(parsed.data.priority === undefined ? {} : { priority: parsed.data.priority }),
      ...(parsed.data.managerNote === undefined ? {} : { managerNote: parsed.data.managerNote }),
      actorEmail: session.email
    });
    if (lead === null) {
      return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Локальная заявка не найдена.' } }, { status: 404 });
    }
    return NextResponse.json({ lead, storage: 'local-file', warning: 'PostgreSQL не подключён. Изменение сохранено локально.' });
  }
}

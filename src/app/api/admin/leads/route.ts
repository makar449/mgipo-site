import { NextResponse } from 'next/server';
import { leadStatusSchema } from '@/features/leads/types';
import { getAdminSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { listLocalLeads } from '@/lib/local-leads';

export const runtime = 'nodejs';

function isDatabaseConnectionError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return message.includes("Can't reach database server") || message.includes('ECONNREFUSED') || message.includes('P1001') || message.includes('database server');
}

export async function GET(request: Request) {
  const session = await getAdminSession();
  if (session === null) return NextResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Требуется вход администратора.' } }, { status: 401 });
  const url = new URL(request.url);
  const statusParam = url.searchParams.get('status');
  const q = (url.searchParams.get('q') ?? '').trim();
  const parsedStatus = statusParam === null || statusParam === 'ALL' ? null : leadStatusSchema.safeParse(statusParam);
  if (parsedStatus !== null && !parsedStatus.success) {
    return NextResponse.json({ error: { code: 'INVALID_STATUS', message: 'Некорректный статус.' } }, { status: 400 });
  }
  const status = parsedStatus === null ? null : parsedStatus.data;
  const searchWhere = q.length === 0 ? undefined : {
    OR: [
      { name: { contains: q, mode: 'insensitive' as const } },
      { phone: { contains: q, mode: 'insensitive' as const } },
      { email: { contains: q, mode: 'insensitive' as const } },
      { serviceTitle: { contains: q, mode: 'insensitive' as const } },
      { comment: { contains: q, mode: 'insensitive' as const } }
    ]
  };
  try {
    const leads = await prisma.lead.findMany({
      where: { ...(status === null ? {} : { status }), ...(searchWhere ?? {}) },
      include: { events: { orderBy: { createdAt: 'desc' }, take: 6 } },
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
      take: 250
    });
    return NextResponse.json({ leads, storage: 'database' });
  } catch (error) {
    if (!isDatabaseConnectionError(error)) throw error;
    const leads = await listLocalLeads({ status, query: q });
    return NextResponse.json({ leads, storage: 'local-file', warning: 'PostgreSQL не подключён. Показаны локально сохранённые заявки.' });
  }
}

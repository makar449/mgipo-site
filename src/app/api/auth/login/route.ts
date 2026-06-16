import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminToken, verifyAdminCredentials } from '@/lib/auth';
import { getServerEnv } from '@/lib/env';
import { prisma } from '@/lib/db';
import { assertRateLimit } from '@/lib/rate-limit';

async function writeAuditLogSafely(data: { action: string; actorEmail?: string; payload?: Record<string, unknown> }): Promise<void> {
  try {
    await prisma.adminAuditLog.create({ data: { action: data.action, actorEmail: data.actorEmail, payload: data.payload, entityType: 'AUTH' } });
  } catch {
    try {
      await prisma.auditLog.create({ data });
    } catch {
      // login must not crash if audit storage is unavailable in local mode
    }
  }
}

function getClientIp(request: Request): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? request.headers.get('x-real-ip') ?? 'local';
}

export const runtime = 'nodejs';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export async function POST(request: Request) {
  const clientIp = getClientIp(request);
  try {
    assertRateLimit(`admin-login:${clientIp}`, 8, 60_000);
  } catch {
    return NextResponse.json({ error: { code: 'RATE_LIMITED', message: 'Слишком много попыток входа. Подождите минуту и повторите.' } }, { status: 429 });
  }

  const payload: unknown = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: { code: 'INVALID_INPUT', message: 'Введите email и пароль.' } }, { status: 400 });
  }
  const result = await verifyAdminCredentials(parsed.data.email, parsed.data.password);
  if (!result.allowed) {
    await writeAuditLogSafely({ action: 'ADMIN_LOGIN_FAILED', actorEmail: parsed.data.email, payload: { reason: 'invalid_credentials', clientIp } });
    return NextResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Неверный email или пароль.' } }, { status: 401 });
  }
  const env = getServerEnv();
  const token = await createAdminToken({ email: parsed.data.email.toLowerCase(), role: result.role, issuedAt: Math.floor(Date.now() / 1000) });
  const cookieStore = await cookies();
  cookieStore.set(env.AUTH_COOKIE_NAME, token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 8 });
  await writeAuditLogSafely({ action: 'ADMIN_LOGIN_SUCCESS', actorEmail: parsed.data.email.toLowerCase(), payload: { role: result.role, clientIp } });
  return NextResponse.json({ ok: true });
}

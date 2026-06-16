import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { getLocalAdminCredentialsForDevelopment, getServerEnv } from '@/lib/env';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function isBcryptHash(value: string): boolean {
  return /^\$2[aby]\$\d{2}\$/.test(value.trim());
}

async function checkDatabase(): Promise<{ ok: boolean; message: string }> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { ok: true, message: 'PostgreSQL доступен.' };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { ok: false, message: message.includes("Can't reach database server") || message.includes('ECONNREFUSED') ? 'PostgreSQL не запущен. Будет использован локальный fallback там, где он предусмотрен.' : message };
  }
}

export async function GET() {
  const env = getServerEnv();
  const local = getLocalAdminCredentialsForDevelopment();
  const database = await checkDatabase();
  const envHashLooksValid = isBcryptHash(env.ADMIN_PASSWORD_HASH);
  const envPasswordCheck = envHashLooksValid ? await bcrypt.compare(local.password, env.ADMIN_PASSWORD_HASH).catch(() => false) : false;

  return NextResponse.json(
    {
      adminEmail: env.ADMIN_EMAIL,
      localDevelopmentLoginEnabled: local.enabled,
      localDevelopmentPassword: process.env.NODE_ENV === 'production' ? null : local.password,
      adminPasswordHashLooksValid: envHashLooksValid,
      adminPasswordHashMatchesLocalPassword: envPasswordCheck,
      authSecretConfigured: env.AUTH_SECRET.length >= 32,
      database,
      recommendedLogin: process.env.NODE_ENV === 'production' ? null : { email: local.email, password: local.password }
    },
    { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
  );
}

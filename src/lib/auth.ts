import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { getLocalAdminCredentialsForDevelopment, getServerEnv } from '@/lib/env';

export type AdminSession = {
  email: string;
  issuedAt: number;
  role?: string;
};

const encoder = new TextEncoder();

function getSecret(): Uint8Array {
  return encoder.encode(getServerEnv().AUTH_SECRET);
}

function normalizeHash(value: string): string {
  return value.trim().replace(/^[\'"]+|[\'"]+$/g, '');
}

function isBcryptHash(value: string): boolean {
  return /^\$2[aby]\$\d{2}\$/.test(value);
}

async function verifyAdminCredentialsFromDatabase(email: string, password: string): Promise<{ allowed: true; role: string } | { allowed: false }> {
  try {
    const user = await prisma.adminUser.findUnique({ where: { email }, include: { role: true } });
    if (user === null || !user.isActive) return { allowed: false };
    const allowed = await bcrypt.compare(password, user.passwordHash);
    if (!allowed) return { allowed: false };
    await prisma.adminUser.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    return { allowed: true, role: user.role.key };
  } catch {
    return { allowed: false };
  }
}

async function verifyAdminCredentialsFromEnv(email: string, password: string): Promise<boolean> {
  const env = getServerEnv();
  if (email !== env.ADMIN_EMAIL.toLowerCase()) return false;

  const normalizedHash = normalizeHash(env.ADMIN_PASSWORD_HASH);
  if (isBcryptHash(normalizedHash)) {
    const hashMatches = await bcrypt.compare(password, normalizedHash);
    if (hashMatches) return true;
  }

  if (process.env.NODE_ENV !== 'production') {
    const devPassword = env.ADMIN_DEV_PASSWORD ?? 'admin2026';
    return password === devPassword;
  }

  return false;
}

export async function verifyAdminCredentials(email: string, password: string): Promise<{ allowed: true; role: string } | { allowed: false }> {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedPassword = password.trim();
  const localCredentials = getLocalAdminCredentialsForDevelopment();

  if (localCredentials.enabled && normalizedEmail === localCredentials.email && normalizedPassword === localCredentials.password) {
    return { allowed: true, role: 'OWNER' };
  }

  const databaseResult = await verifyAdminCredentialsFromDatabase(normalizedEmail, normalizedPassword);
  if (databaseResult.allowed) return databaseResult;
  const envResult = await verifyAdminCredentialsFromEnv(normalizedEmail, normalizedPassword);
  return envResult ? { allowed: true, role: 'OWNER' } : { allowed: false };
}

export async function createAdminToken(session: AdminSession): Promise<string> {
  return new SignJWT({ email: session.email, role: session.role ?? 'OWNER' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(session.issuedAt)
    .setExpirationTime('8h')
    .sign(getSecret());
}

export async function readAdminSessionFromToken(token: string | undefined): Promise<AdminSession | null> {
  if (token === undefined || token.length === 0) return null;
  try {
    const verified = await jwtVerify(token, getSecret());
    const email = verified.payload.email;
    const role = verified.payload.role;
    if (typeof email !== 'string') return null;
    return { email, role: typeof role === 'string' ? role : 'OWNER', issuedAt: typeof verified.payload.iat === 'number' ? verified.payload.iat : 0 };
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const env = getServerEnv();
  const cookieStore = await cookies();
  return readAdminSessionFromToken(cookieStore.get(env.AUTH_COOKIE_NAME)?.value);
}

export async function requireAdminSession(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (session === null) redirect('/admin/login');
  return session;
}

export async function verifyAdminRequest(request: Request): Promise<boolean> {
  const env = getServerEnv();
  const cookieHeader = request.headers.get('cookie');
  if (cookieHeader === null) return false;
  const token = cookieHeader
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${env.AUTH_COOKIE_NAME}=`))
    ?.slice(env.AUTH_COOKIE_NAME.length + 1);
  const session = await readAdminSessionFromToken(token);
  return session !== null;
}

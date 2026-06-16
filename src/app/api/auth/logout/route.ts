import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getServerEnv } from '@/lib/env';

export async function POST() {
  const env = getServerEnv();
  const cookieStore = await cookies();
  cookieStore.delete(env.AUTH_COOKIE_NAME);
  return NextResponse.json({ ok: true });
}

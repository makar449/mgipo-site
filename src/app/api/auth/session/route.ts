import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  const session = await getAdminSession();
  return NextResponse.json({ authenticated: session !== null, email: session?.email ?? null });
}

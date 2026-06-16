import { NextResponse } from 'next/server';

export function isSameOriginRequest(request: Request): boolean {
  if (process.env.NODE_ENV !== 'production') return true;
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  if (origin === null || host === null) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export function rejectUnsafeOrigin(request: Request): NextResponse | null {
  return isSameOriginRequest(request) ? null : NextResponse.json({ error: { code: 'CSRF_BLOCKED', message: 'Запрос отклонён защитой CSRF.' } }, { status: 403 });
}

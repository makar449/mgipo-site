import { NextResponse } from 'next/server';
import { readCmsView, writeCmsView } from '@/lib/admin-cms';
import { cmsPatchSchema } from '@/features/admin-cms/types';
import { verifyAdminRequest } from '@/lib/auth';
import { rejectUnsafeOrigin } from '@/lib/security';

export const dynamic = 'force-dynamic';

function cmsJson(payload: unknown, init?: ResponseInit) {
  return NextResponse.json(payload, {
    ...init,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
      ...(init?.headers ?? {})
    }
  });
}

export async function GET(request: Request) {
  const allowed = await verifyAdminRequest(request);
  if (!allowed) return cmsJson({ error: { code: 'UNAUTHORIZED', message: 'Требуется вход администратора.' } }, { status: 401 });
  const view = await readCmsView({ fresh: true });
  return cmsJson({ cms: view });
}

export async function PATCH(request: Request) {
  const csrfResponse = rejectUnsafeOrigin(request);
  if (csrfResponse !== null) return csrfResponse;
  const allowed = await verifyAdminRequest(request);
  if (!allowed) return cmsJson({ error: { code: 'UNAUTHORIZED', message: 'Требуется вход администратора.' } }, { status: 401 });
  const payload: unknown = await request.json().catch(() => null);
  const parsed = cmsPatchSchema.safeParse(payload);
  if (!parsed.success) {
    return cmsJson({ error: { code: 'BAD_REQUEST', message: 'Некорректные данные CMS.', details: parsed.error.flatten() } }, { status: 400 });
  }
  const view = await writeCmsView(parsed.data.content, parsed.data.mode);
  return cmsJson({ cms: view });
}

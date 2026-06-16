import { NextResponse } from 'next/server';
import { readCmsView } from '@/lib/admin-cms';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  const cms = await readCmsView({ fresh: true });
  return NextResponse.json(
    {
      updatedAt: cms.updatedAt,
      lastPublishedAt: cms.lastPublishedAt,
      publishedHash: `${cms.lastPublishedAt ?? 'draft'}:${cms.updatedAt}`
    },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        Pragma: 'no-cache',
        Expires: '0'
      }
    }
  );
}

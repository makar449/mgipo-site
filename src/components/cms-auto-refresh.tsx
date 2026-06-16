'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

type CmsVersionPayload = {
  updatedAt: string;
  lastPublishedAt: string | null;
  publishedHash: string;
};

function isCmsVersionPayload(value: unknown): value is CmsVersionPayload {
  return value !== null && typeof value === 'object' && 'publishedHash' in value && typeof (value as { publishedHash: unknown }).publishedHash === 'string';
}

async function fetchCmsVersion(signal: AbortSignal): Promise<CmsVersionPayload | null> {
  const response = await fetch('/api/cms/version', {
    method: 'GET',
    cache: 'no-store',
    signal,
    headers: { Accept: 'application/json' }
  });
  if (!response.ok) return null;
  const payload: unknown = await response.json().catch(() => null);
  return isCmsVersionPayload(payload) ? payload : null;
}

export function CmsAutoRefresh() {
  if (process.env.NEXT_PUBLIC_STATIC_EXPORT === 'true') return null;
  if (typeof window !== 'undefined' && window.location.hostname.endsWith('github.io')) return null;
  const router = useRouter();
  const pathname = usePathname();
  const currentHashRef = useRef<string | null>(null);
  const refreshingRef = useRef(false);

  useEffect(() => {
    if (pathname.startsWith('/admin')) return undefined;

    const controller = new AbortController();

    async function checkVersion(): Promise<void> {
      if (document.visibilityState !== 'visible' || refreshingRef.current) return;
      const version = await fetchCmsVersion(controller.signal).catch(() => null);
      if (version === null) return;
      if (currentHashRef.current === null) {
        currentHashRef.current = version.publishedHash;
        return;
      }
      if (currentHashRef.current !== version.publishedHash) {
        currentHashRef.current = version.publishedHash;
        refreshingRef.current = true;
        router.refresh();
        window.setTimeout(() => {
          refreshingRef.current = false;
        }, 1500);
      }
    }

    const handleFocus = (): void => {
      void checkVersion();
    };

    void checkVersion();
    const interval = window.setInterval(() => void checkVersion(), 12_000);
    window.addEventListener('focus', handleFocus);

    return () => {
      controller.abort();
      window.clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [pathname, router]);

  return null;
}

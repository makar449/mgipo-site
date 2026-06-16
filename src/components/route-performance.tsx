'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ADMIN_PREFETCH_ROUTES, getGithubPagesBasePath, normalizeInternalHref, PUBLIC_PREFETCH_ROUTES } from '@/lib/routes';

type RoutePerformanceProps = {
  scope?: 'public' | 'admin' | 'all';
};

const PROGRESS_START_DELAY_MS = 180;
const PROGRESS_TIMEOUT_MS = 1400;

function getRoutes(scope: RoutePerformanceProps['scope']): string[] {
  const publicCore = ['/', '/services/', '/documents/', '/contacts/', '/prices/'];
  const adminCore = ['/admin/dashboard/', '/admin/home/', '/admin/services/', '/admin/leads/', '/admin/settings/'];
  if (scope === 'admin') return adminCore;
  if (scope === 'all') return [...publicCore, ...adminCore];
  return publicCore;
}

function isPrefetchableRoute(href: string): boolean {
  if (!href.startsWith('/') || href.startsWith('//')) return false;
  if (href.startsWith('/api/')) return false;
  if (href.startsWith('/_next/')) return false;
  return true;
}

function toRouterPrefetchRoute(href: string): string {
  const normalized = normalizeInternalHref(href);
  const basePath = typeof window === 'undefined' ? '' : getGithubPagesBasePath(window.location.pathname);
  if (basePath.length > 0 && normalized.startsWith(`${basePath}/`)) {
    return normalizeInternalHref(normalized.slice(basePath.length));
  }
  if (basePath.length > 0 && normalized === basePath) return '/';
  return normalized;
}

function getAnchorRoute(target: EventTarget | null): string | null {
  if (!(target instanceof Element)) return null;
  const anchor = target.closest<HTMLAnchorElement>('a[href]');
  if (anchor === null) return null;
  const rawHref = anchor.getAttribute('href');
  if (rawHref === null || rawHref.length === 0) return null;
  if (rawHref.startsWith('http') || rawHref.startsWith('mailto:') || rawHref.startsWith('tel:')) return null;
  return normalizeInternalHref(rawHref);
}

export function RoutePerformance({ scope = 'public' }: RoutePerformanceProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const progressTimeoutRef = useRef<number | null>(null);
  const progressStartRef = useRef<number | null>(null);
  const prefetchedRoutesRef = useRef<Set<string>>(new Set());
  const routes = useMemo(() => getRoutes(scope), [scope]);

  useEffect(() => {
    setIsNavigating(false);
    if (progressStartRef.current !== null) {
      window.clearTimeout(progressStartRef.current);
      progressStartRef.current = null;
    }
    if (progressTimeoutRef.current !== null) {
      window.clearTimeout(progressTimeoutRef.current);
      progressTimeoutRef.current = null;
    }
  }, [pathname]);

  useEffect(() => {
    function safePrefetch(route: string): void {
      const routerRoute = toRouterPrefetchRoute(route);
      if (!isPrefetchableRoute(routerRoute)) return;
      if (prefetchedRoutesRef.current.has(routerRoute)) return;
      prefetchedRoutesRef.current.add(routerRoute);
      try {
        router.prefetch(routerRoute);
      } catch {
        // Prefetch is only a speed hint. Navigation must never depend on it.
      }
    }

    const idleWarmup = window.setTimeout(() => {
      routes.slice(0, scope === 'admin' ? 3 : 4).forEach((route, index) => {
        window.setTimeout(() => safePrefetch(route), index * 180);
      });
    }, 900);

    const prefetchFromEvent = (event: Event) => {
      const route = getAnchorRoute(event.target);
      if (route === null) return;
      safePrefetch(route);
    };

    const showProgressOnNavigation = (event: MouseEvent) => {
      const route = getAnchorRoute(event.target);
      if (route === null || !isPrefetchableRoute(route)) return;
      const targetUrl = new URL(route, window.location.origin);
      const currentPath = normalizeInternalHref(window.location.pathname.replace(getGithubPagesBasePath(window.location.pathname), '') || '/');
      if (targetUrl.pathname === currentPath && targetUrl.hash === window.location.hash) return;
      if (progressStartRef.current !== null) window.clearTimeout(progressStartRef.current);
      if (progressTimeoutRef.current !== null) window.clearTimeout(progressTimeoutRef.current);
      progressStartRef.current = window.setTimeout(() => {
        setIsNavigating(true);
        progressTimeoutRef.current = window.setTimeout(() => setIsNavigating(false), PROGRESS_TIMEOUT_MS);
      }, PROGRESS_START_DELAY_MS);
    };

    document.addEventListener('pointerover', prefetchFromEvent, true);
    document.addEventListener('focusin', prefetchFromEvent, true);
    document.addEventListener('pointerdown', prefetchFromEvent, true);
    document.addEventListener('click', showProgressOnNavigation, true);

    return () => {
      window.clearTimeout(idleWarmup);
      document.removeEventListener('pointerover', prefetchFromEvent, true);
      document.removeEventListener('focusin', prefetchFromEvent, true);
      document.removeEventListener('pointerdown', prefetchFromEvent, true);
      document.removeEventListener('click', showProgressOnNavigation, true);
      if (progressStartRef.current !== null) window.clearTimeout(progressStartRef.current);
      if (progressTimeoutRef.current !== null) window.clearTimeout(progressTimeoutRef.current);
    };
  }, [router, routes, scope]);

  return <div aria-hidden="true" className={isNavigating ? 'route-progress route-progress-active' : 'route-progress'} />;
}

export const PUBLIC_PREFETCH_ROUTES = [
  '/',
  '/about/',
  '/services/',
  '/prices/',
  '/corporate/',
  '/documents/',
  '/contacts/',
  '/reviews/',
  '/cases/',
  '/faq/',
  '/compare/',
  '/favorites/',
  '/legal/privacy/',
  '/legal/consent/',
  '/legal/terms/',
  '/legal/requisites/'
] as const;

export const ADMIN_PREFETCH_ROUTES = [
  '/admin/',
  '/admin/login/',
  '/admin/dashboard/',
  '/admin/home/',
  '/admin/services/',
  '/admin/categories/',
  '/admin/documents/',
  '/admin/legal/',
  '/admin/navigation/',
  '/admin/footer/',
  '/admin/contacts/',
  '/admin/leads/',
  '/admin/pages/',
  '/admin/seo/',
  '/admin/settings/',
  '/admin/users/',
  '/admin/audit/'
] as const;

const FILE_EXTENSION_PATTERN = /\.[a-z0-9]{2,8}$/i;

function splitHash(href: string): { beforeHash: string; hash: string } {
  const hashIndex = href.indexOf('#');
  if (hashIndex === -1) return { beforeHash: href, hash: '' };
  return { beforeHash: href.slice(0, hashIndex), hash: href.slice(hashIndex) };
}

function splitQuery(href: string): { pathname: string; query: string } {
  const queryIndex = href.indexOf('?');
  if (queryIndex === -1) return { pathname: href, query: '' };
  return { pathname: href.slice(0, queryIndex), query: href.slice(queryIndex) };
}

export function normalizeInternalHref(href: string): string {
  if (href.length === 0) return href;
  if (!href.startsWith('/') || href.startsWith('//')) return href;
  const { beforeHash, hash } = splitHash(href);
  const { pathname, query } = splitQuery(beforeHash);
  if (pathname === '' || pathname === '/') return `/${query}${hash}`;
  if (FILE_EXTENSION_PATTERN.test(pathname)) return `${pathname}${query}${hash}`;
  if (pathname.endsWith('/')) return `${pathname}${query}${hash}`;
  return `${pathname}/${query}${hash}`;
}

export function getGithubPagesBasePath(pathname: string): string {
  return pathname === '/mgipo-site' || pathname.startsWith('/mgipo-site/') ? '/mgipo-site' : '';
}

export function toDocumentPrefetchHref(route: string, currentPathname: string): string {
  const normalized = normalizeInternalHref(route);
  if (!normalized.startsWith('/') || normalized.startsWith('//')) return normalized;
  const basePath = getGithubPagesBasePath(currentPathname);
  if (basePath.length > 0 && (normalized === basePath || normalized.startsWith(`${basePath}/`))) return normalized;
  return `${basePath}${normalized}`;
}

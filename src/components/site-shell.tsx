import type { ReactNode } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { PremiumBackground } from '@/components/premium-background';
import { FloatingContact } from '@/components/floating-contact';
import { DemoCmsRuntime } from '@/components/demo-cms-runtime';
import { RoutePerformance } from '@/components/route-performance';
import { getPublishedCmsContent } from '@/lib/admin-cms';
import type { CmsContent } from '@/features/admin-cms/types';

export async function SiteShell({ children, cms: providedCms }: { children: ReactNode; cms?: CmsContent }) {
  const cms = providedCms ?? await getPublishedCmsContent();
  return (
    <div className="min-h-screen overflow-hidden">
      <PremiumBackground />
      <RoutePerformance scope="public" />
      <DemoCmsRuntime />
      <Header identity={cms.identity} navigation={cms.navigation} />
      <main>{children}</main>
      <FloatingContact phone={cms.identity.phone} />
      <Footer identity={cms.identity} footer={cms.footer} />
    </div>
  );
}

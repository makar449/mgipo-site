import { AdminSeoPage } from '@/components/admin-lite/pages/seo';
import { createMetadata } from '@/lib/metadata';

export const dynamic = 'force-static';
export const revalidate = false;

export const metadata = createMetadata({
  title: 'Админ-панель — SEO',
  description: 'Управление SEO-настройками.',
  path: '/admin/seo',
  noIndex: true
});

export default function Page() {
  return <AdminSeoPage />;
}

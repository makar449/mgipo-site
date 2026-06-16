import { AdminFooterPage } from '@/components/admin-lite/pages/footer';
import { createMetadata } from '@/lib/metadata';

export const dynamic = 'force-static';
export const revalidate = false;

export const metadata = createMetadata({
  title: 'Админ-панель — футер',
  description: 'Управление футером сайта.',
  path: '/admin/footer',
  noIndex: true
});

export default function Page() {
  return <AdminFooterPage />;
}

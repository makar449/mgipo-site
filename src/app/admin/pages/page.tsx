import { AdminPagesPage } from '@/components/admin-lite/pages/pages';
import { createMetadata } from '@/lib/metadata';

export const dynamic = 'force-static';
export const revalidate = false;

export const metadata = createMetadata({
  title: 'Админ-панель — страницы',
  description: 'Управление страницами сайта.',
  path: '/admin/pages',
  noIndex: true
});

export default function Page() {
  return <AdminPagesPage />;
}

import { AdminCategoriesPage } from '@/components/admin-lite/pages/categories';
import { createMetadata } from '@/lib/metadata';

export const dynamic = 'force-static';
export const revalidate = false;

export const metadata = createMetadata({
  title: 'Админ-панель — категории',
  description: 'Управление категориями программ.',
  path: '/admin/categories',
  noIndex: true
});

export default function Page() {
  return <AdminCategoriesPage />;
}

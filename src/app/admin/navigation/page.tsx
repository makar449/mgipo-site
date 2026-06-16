import { AdminNavigationPage } from '@/components/admin-lite/pages/navigation';
import { createMetadata } from '@/lib/metadata';

export const dynamic = 'force-static';
export const revalidate = false;

export const metadata = createMetadata({
  title: 'Админ-панель — навигация',
  description: 'Управление меню сайта.',
  path: '/admin/navigation',
  noIndex: true
});

export default function Page() {
  return <AdminNavigationPage />;
}

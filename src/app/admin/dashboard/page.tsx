import { AdminDashboardPage } from '@/components/admin-lite/pages/dashboard';
import { createMetadata } from '@/lib/metadata';

export const dynamic = 'force-static';
export const revalidate = false;

export const metadata = createMetadata({
  title: 'Админ-панель — дашборд',
  description: 'Сводная страница управления сайтом.',
  path: '/admin/dashboard',
  noIndex: true
});

export default function Page() {
  return <AdminDashboardPage />;
}

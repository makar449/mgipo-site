import { AdminDashboardPage } from '@/components/admin-lite/pages/dashboard';
import { createMetadata } from '@/lib/metadata';

export const dynamic = 'force-static';
export const revalidate = false;

export const metadata = createMetadata({
  title: 'Админ-панель сайта',
  description: 'Панель управления сайтом МГИПО.',
  path: '/admin',
  noIndex: true
});

export default function Page() {
  return <AdminDashboardPage />;
}

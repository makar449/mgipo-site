import { AdminSettingsPage } from '@/components/admin-lite/pages/settings';
import { createMetadata } from '@/lib/metadata';

export const dynamic = 'force-static';
export const revalidate = false;

export const metadata = createMetadata({
  title: 'Админ-панель — настройки',
  description: 'Общие настройки сайта.',
  path: '/admin/settings',
  noIndex: true
});

export default function Page() {
  return <AdminSettingsPage />;
}

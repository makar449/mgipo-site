import { AdminLegalPage } from '@/components/admin-lite/pages/legal';
import { createMetadata } from '@/lib/metadata';

export const dynamic = 'force-static';
export const revalidate = false;

export const metadata = createMetadata({
  title: 'Админ-панель — правовые страницы',
  description: 'Управление правовыми страницами.',
  path: '/admin/legal',
  noIndex: true
});

export default function Page() {
  return <AdminLegalPage />;
}

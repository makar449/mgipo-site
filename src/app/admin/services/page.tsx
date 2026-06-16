import { AdminServicesPage } from '@/components/admin-lite/pages/services';
import { createMetadata } from '@/lib/metadata';

export const dynamic = 'force-static';
export const revalidate = false;

export const metadata = createMetadata({
  title: 'Админ-панель — программы',
  description: 'Управление образовательными программами.',
  path: '/admin/services',
  noIndex: true
});

export default function Page() {
  return <AdminServicesPage />;
}

import { AdminLeadsPage } from '@/components/admin-lite/pages/leads';
import { createMetadata } from '@/lib/metadata';

export const dynamic = 'force-static';
export const revalidate = false;

export const metadata = createMetadata({
  title: 'Админ-панель — заявки',
  description: 'Управление заявками сайта.',
  path: '/admin/leads',
  noIndex: true
});

export default function Page() {
  return <AdminLeadsPage />;
}

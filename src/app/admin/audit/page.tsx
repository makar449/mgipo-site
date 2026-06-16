import { AdminAuditPage } from '@/components/admin-lite/pages/audit';
import { createMetadata } from '@/lib/metadata';

export const dynamic = 'force-static';
export const revalidate = false;

export const metadata = createMetadata({
  title: 'Админ-панель — журнал действий',
  description: 'История действий администратора.',
  path: '/admin/audit',
  noIndex: true
});

export default function Page() {
  return <AdminAuditPage />;
}

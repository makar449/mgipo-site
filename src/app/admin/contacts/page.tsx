import { AdminContactsPage } from '@/components/admin-lite/pages/contacts';
import { createMetadata } from '@/lib/metadata';

export const dynamic = 'force-static';
export const revalidate = false;

export const metadata = createMetadata({
  title: 'Админ-панель — контакты',
  description: 'Управление контактными данными.',
  path: '/admin/contacts',
  noIndex: true
});

export default function Page() {
  return <AdminContactsPage />;
}

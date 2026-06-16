import { AdminUsersPage } from '@/components/admin-lite/pages/users';
import { createMetadata } from '@/lib/metadata';

export const dynamic = 'force-static';
export const revalidate = false;

export const metadata = createMetadata({
  title: 'Админ-панель — пользователи',
  description: 'Управление пользователями и ролями.',
  path: '/admin/users',
  noIndex: true
});

export default function Page() {
  return <AdminUsersPage />;
}

import { DemoAdminLogin } from '@/components/demo-admin-login';
import { createMetadata } from '@/lib/metadata';

export const dynamic = 'force-static';
export const revalidate = false;

export const metadata = createMetadata({
  title: 'Вход в админ-панель',
  description: 'Вход в панель управления сайтом МГИПО.',
  path: '/admin/login',
  noIndex: true
});

export default function AdminLoginPage() {
  return <DemoAdminLogin />;
}

import { AdminHomePage } from '@/components/admin-lite/pages/home';
import { createMetadata } from '@/lib/metadata';

export const dynamic = 'force-static';
export const revalidate = false;

export const metadata = createMetadata({
  title: 'Админ-панель — главная',
  description: 'Редактирование главной страницы сайта.',
  path: '/admin/home',
  noIndex: true
});

export default function Page() {
  return <AdminHomePage />;
}

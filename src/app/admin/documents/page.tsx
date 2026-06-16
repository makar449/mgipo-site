import { AdminDocumentsPage } from '@/components/admin-lite/pages/documents';
import { createMetadata } from '@/lib/metadata';

export const dynamic = 'force-static';
export const revalidate = false;

export const metadata = createMetadata({
  title: 'Админ-панель — документы',
  description: 'Управление документами сайта.',
  path: '/admin/documents',
  noIndex: true
});

export default function Page() {
  return <AdminDocumentsPage />;
}

import { SiteShell } from '@/components/site-shell';
import { FavoritesClient } from '@/components/favorites-client';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { createMetadata } from '@/lib/metadata';

export const metadata = createMetadata({ title: 'Избранные программы', description: 'Список программ, которые пользователь сохранил в избранное.', path: '/favorites' });

export default function FavoritesPage() {
  return <SiteShell><section className="container-px mx-auto max-w-7xl py-16 sm:py-20"><Breadcrumbs items={[{ label: 'Избранное' }]} /><div className="mt-8"><FavoritesClient /></div></section></SiteShell>;
}

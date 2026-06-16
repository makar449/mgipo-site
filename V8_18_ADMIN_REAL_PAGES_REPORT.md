# V8.18 — Admin real pages fix

В этой версии админ-панель переделана как набор настоящих отдельных страниц, а не как вкладочный/preview-переключатель.

## Что исправлено

- Удалён старый компонент `demo-admin-panel.tsx`.
- Удалены импорты `DemoAdminDirectPage` из маршрутов админки.
- Убрана логика `activeTab`, `initialTab`, `setActiveTab`.
- Убраны видимые формулировки про preview/предпросмотр/вкладки.
- Админка больше не оборачивается в публичный `SiteShell`, поэтому это выглядит как отдельная панель управления, а не как блок внутри сайта.
- Каждый раздел `/admin/.../` импортирует свой конкретный компонент страницы.
- Сайдбар ведёт по прямым URL.

## Реальные маршруты

- `/admin/`
- `/admin/login/`
- `/admin/dashboard/`
- `/admin/home/`
- `/admin/services/`
- `/admin/programs/`
- `/admin/categories/`
- `/admin/documents/`
- `/admin/legal/`
- `/admin/navigation/`
- `/admin/footer/`
- `/admin/contacts/`
- `/admin/leads/`
- `/admin/pages/`
- `/admin/seo/`
- `/admin/settings/`
- `/admin/users/`
- `/admin/audit/`

## Вход

- email: `admin@mgipo.ru`
- password: `demo2026`

## Ограничение GitHub Pages

GitHub Pages не запускает сервер, Prisma и API. Поэтому изменения сохраняются в браузере через `localStorage` до подключения общей базы данных.

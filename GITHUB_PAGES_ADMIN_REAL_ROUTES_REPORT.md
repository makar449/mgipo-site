# v8.17 — Admin real routes

Исправление демо-админки для GitHub Pages.

## Что изменено

- Админские разделы больше не работают как preview-переключатель одной страницы.
- Каждый раздел имеет собственный прямой маршрут `/admin/<section>/`.
- Удалён старый переключатель `activeTab / initialTab` из демо-компонента админки.
- Удалён старый неиспользуемый компонент `src/components/admin-dashboard.tsx`, где оставались preview-переключатели.
- Sidebar ведёт на прямые URL:
  - `/admin/dashboard/`
  - `/admin/home/`
  - `/admin/services/`
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

## Ограничение

Это всё ещё demo-админка для GitHub Pages: без сервера, Supabase и общей базы. Правки сохраняются в localStorage текущего браузера. Следующий этап — Supabase.

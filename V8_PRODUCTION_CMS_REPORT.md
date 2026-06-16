# V8 Production CMS & QA Pass

## Что исправлено фундаментально

1. Проект переименован в `mgipo-site`.
2. Убрана путаница с папками `site_v60`, `site_v62`, `site_v70` внутри самого проекта.
3. Добавлен единый локальный запуск через `npm run setup:local`.
4. Добавлена production-строгость env: в production больше нельзя работать с дефолтными секретами.
5. Добавлена expanded Prisma-схема для полноценной CMS.
6. CMS больше не ограничена одним JSON-файлом: добавлен DB-first CMS service layer.
7. Local JSON fallback сохранён только как dev-режим для запуска без Docker/PostgreSQL.
8. Публичный сайт продолжает брать опубликованные данные через общий CMS слой.
9. Добавлены разделы админки по URL: `/admin/dashboard`, `/admin/leads`, `/admin/pages`, `/admin/home`, `/admin/services`, `/admin/categories`, `/admin/documents`, `/admin/legal`, `/admin/navigation`, `/admin/footer`, `/admin/seo`, `/admin/settings`, `/admin/users`, `/admin/audit`.
10. Добавлена полноценная модель ролей: OWNER, ADMIN, MANAGER, EDITOR, VIEWER.
11. Добавлена модель AdminUser.
12. Добавлена модель AdminAuditLog.
13. Добавлены модели SiteSettings, PageContent, NavigationItem, FooterColumn, FooterLink, Category, Service, ServiceVariant, ServiceFaq, ServiceModule, ServiceBenefit, Document, LegalPage, SeoMeta.
14. Seed теперь создаёт роли, админа и публикует CMS/каталог в базу.
15. Авторизация сначала проверяет администратора в БД, затем использует dev fallback.
16. Login больше не падает из-за недоступности audit log.
17. Добавлен rate-limit на login.
18. Добавлена базовая CSRF/same-origin защита для admin PATCH endpoints.
19. Добавлены security headers в `next.config.mjs`.
20. Добавлен noindex для admin/login и admin.
21. Исправлен Turbopack root warning через `turbopack.root`.
22. Убраны публичные заглушки реквизитов из `company.ts`; реквизиты теперь описаны как данные, управляемые админкой.
23. Добавлены smoke/unit/a11y/visual/static checks.

## Проверки, которые выполнены

- `npm run lint` — без ошибок.
- `npm run check:content` — без ошибок.
- `npm run test:unit` — успешно.
- `npm run test:e2e:smoke` — успешно.
- `npm run test:a11y` — успешно.
- `npm run test:visual` — успешно.
- `npm run setup:local` — успешно.

## Что остаётся для настоящего production-деплоя

1. Подключить реальный PostgreSQL.
2. Выполнить `npx prisma generate` и `npx prisma db push` или migrations в окружении с доступом к Prisma binaries.
3. Заменить тестовые контакты и реквизиты на реальные данные заказчика.
4. Загрузить реальные PDF лицензий/правовых документов.
5. Подключить hosting/domain/SSL.
6. Прогнать реальный браузерный Playwright visual test после деплоя.

## Локальный запуск

```powershell
npm install
npm run setup:local
npx prisma generate
npm run dev
```

Админка:

```text
http://localhost:3000/admin/login
admin@example.com
admin2026
```

## PostgreSQL запуск

```powershell
docker compose up -d
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

# MGIPO Site v8

Production-oriented Next.js сайт для образовательной организации с каталогом программ профессиональной переподготовки, заявками, админ-панелью и CMS-слоем.

## Быстрый запуск без Docker

```powershell
npm install
npm run setup:local
npx prisma generate
npm run dev
```

Сайт:

```text
http://localhost:3000
```

Админка:

```text
http://localhost:3000/admin/login
Email: admin@example.com
Пароль: admin2026
```

Без Docker сайт использует local fallback для разработки. Для production нужен PostgreSQL.

## Запуск с PostgreSQL/Docker

```powershell
npm install
npm run setup:local
docker compose up -d
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

## Проверки

```powershell
npm run lint
npm run check:content
npm run test:unit
npm run test:e2e:smoke
npm run test:a11y
npm run test:visual
```

## Production notes

- В production дефолтные `AUTH_SECRET`, `ADMIN_PASSWORD_HASH` и `DATABASE_URL` запрещены.
- Админка закрыта httpOnly-cookie.
- Admin pages закрыты `noindex`.
- Основная CMS-архитектура: PostgreSQL → CMS service layer → публичные страницы.
- Local `.local-data` нужен только для разработки без базы.

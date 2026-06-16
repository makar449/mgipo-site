# Исправление входа в админ-панель

В этой версии вход в админку исправлен:

- `scripts/hash-admin-password.ts` больше не ломается из-за top-level await;
- в архив добавлены готовые `.env` и `.env.local` для локального запуска;
- дефолтный локальный вход: `admin@example.com` / `admin2026`;
- логин больше не падает из-за недоступного audit-log: если база временно не отвечает, запись аудита пропускается, а не ломает авторизацию.

## Быстрый запуск

```powershell
cd C:\Users\makar\Downloads\institutional-qualification-next-v6-1-admin-login-fixed\site_v60
npm install
.\setup-admin-local.ps1
npx prisma generate
npm run dev
```

Открыть:

```text
http://localhost:3000/admin/login
```

Данные:

```text
Email: admin@example.com
Пароль: admin2026
```

## Для полноценной работы заявок и админ-таблиц

Нужен PostgreSQL:

```powershell
docker compose up -d
npx prisma db push
npm run dev
```

# Запуск MGIPO site v8 на Windows

1. Откройте папку проекта `mgipo-site-v8` в VS Code.
2. В терминале выполните:

```powershell
npm install
npm run setup:local
npx prisma generate
npm run dev
```

3. Откройте сайт:

```text
http://localhost:3000
```

4. Админ-панель:

```text
http://localhost:3000/admin/login
```

Данные входа после `npm run setup:local`:

```text
Email: admin@example.com
Пароль: admin2026
```

## Без Docker

Сайт и админка могут открываться локально через `.local-data`. Это режим разработки.

## С Docker/PostgreSQL

```powershell
docker compose up -d
npx prisma db push
npm run db:seed
npm run dev
```

В production используйте PostgreSQL и реальные переменные окружения. Local fallback нужен только для разработки.

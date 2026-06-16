# V8.3 — фикс входа в админку

Эта версия исправляет проблему, из-за которой локальный вход в админку мог постоянно падать из-за Docker/PostgreSQL, некорректного `.env`, короткого `ADMIN_PASSWORD_HASH` или старого dev-пароля.

## Локальный вход

В режиме разработки включён безопасный dev-fallback:

- Email: `admin@example.com`
- Пароль: `admin2026`

Он работает только если `NODE_ENV !== production` и `ADMIN_DEV_LOGIN_ENABLED="true"`.

В production fallback запрещён: нужно настраивать реального администратора, bcrypt-hash, PostgreSQL и секреты.

## Самый простой запуск на Windows

Открой папку проекта и запусти:

```powershell
.\START_LOCAL_ADMIN.cmd
```

Команда сделает:

1. `npm install`
2. `npm run setup:local`
3. `npx prisma generate`
4. `npm run doctor:admin`
5. `npm run dev`

Потом открыть:

```text
http://localhost:3000/admin/login
```

## Диагностика

```powershell
npm run doctor:admin
```

Показывает:

- какой email используется;
- какой локальный пароль используется;
- включён ли dev-вход;
- похож ли `ADMIN_PASSWORD_HASH` на bcrypt;
- совпадает ли hash с локальным паролем;
- настроен ли `AUTH_SECRET`;
- какой `DATABASE_URL` используется.

## Важное

Docker/PostgreSQL нужен для полноценной production-базы. Но сам локальный вход в админку теперь не должен ломаться только из-за отсутствия Docker.

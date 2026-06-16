# Admin login fixed v6.2

Локальный вход теперь не зависит от Docker/PostgreSQL.

Данные входа:
- Email: admin@example.com
- Пароль: admin2026

Если PostgreSQL не запущен, сайт не падает:
- заявки сохраняются локально в `.local-data/leads.json`;
- админка читает локальные заявки;
- черновики главной страницы сохраняются в `.local-data/site-content.json`.

Для production нужно подключить PostgreSQL и заменить ADMIN_DEV_PASSWORD на нормальный bcrypt hash.

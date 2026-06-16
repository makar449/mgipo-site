# V8.20 — No-lag performance pass without visual redesign

Цель: убрать ощущение зависания у публичного сайта и демо-админки на GitHub Pages, не меняя визуальный дизайн, анимации, блоки, тексты и композицию.

## Что изменено

1. Добавлен единый RoutePerformance-слой:
   - заранее прогревает ключевые публичные и админские маршруты;
   - запускает Next router.prefetch для внутренних страниц;
   - добавляет document-prefetch для GitHub Pages static HTML;
   - догревает ссылки при hover/focus;
   - показывает тонкий loading-state только во время перехода, чтобы не было ощущения зависания.

2. Все внутренние ссылки нормализуются через trailing slash:
   - /services -> /services/
   - /contacts#lead-form -> /contacts/#lead-form
   Это убирает лишние GitHub Pages redirects и попытки открыть несуществующий static path.

3. Админка больше не ждёт client-only localStorage guard перед показом страницы:
   - страницы рендерятся сразу с дефолтными демо-данными;
   - после hydration данные из localStorage подставляются поверх;
   - если сессии нет, создаётся demo-session, чтобы прямые URL админки открывались сразу для показа заказчику.

4. Вход в админку заранее прогревает dashboard/services/leads.

5. Публичный сайт получил prefetch/warmup без изменения визуала.

6. Декоративный premium background не удалён, но изолирован по paint-layer:
   - contain: paint;
   - transform: translateZ(0);
   - backface-visibility.
   Визуально фон остаётся тем же, но браузер меньше перерисовывает всю страницу при скролле/переходах.

7. Добавлен analyze:static script для просмотра крупнейших JS/CSS chunks после production/static build.

## Что не менялось

- Дизайн сайта не перепроектировался.
- Анимации не удалялись.
- Hero, карточки, правовые страницы, футер и админская структура сохранены.
- Демо-админка остаётся GitHub Pages-compatible без сервера и без Supabase.

## Ограничение

GitHub Pages всё равно остаётся статическим хостингом. Реальная серверная CMS/заявки/общая база появятся только после подключения Supabase или серверного хостинга. Этот pass оптимизирует именно текущий GitHub Pages demo mode.

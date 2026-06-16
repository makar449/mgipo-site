# v5.8 Design Changelog

- Header: навигация больше не переносится в две строки.
- Header: “Для организаций” заменено на “Организациям”.
- Hero: двухколоночная компоновка включается только на широких экранах.
- Hero: на планшетах и телефонах текст и визуальный блок не конкурируют за ширину.
- Hero: для ultra-small экранов 3D скрывается, чтобы не ломать интерфейс.
- Forms: обычный select программы заменён на premium-search picker.
- Forms: список программ стал искать по названию, категории, ключевым словам и синонимам.
- Mobile forms: picker открывается как нижняя панель, а не как огромный системный список.
- Catalog: карточки выводятся порциями, поэтому интерфейс быстрее.
- Admin: заявки выводятся порциями, чтобы панель не лагала.
- Global UI: усилена защита от переполнения текста и горизонтального скролла.
- Mobile performance: декоративные анимации отключены на touch-устройствах.

## v6.0 final screenshot-based polish
- Rebuilt header with compact logo to prevent navigation collision.
- Enlarged and repositioned hero visual.
- Added motion to every visible desktop hero visual layer.
- Increased secondary copy size across the site.
- Added strict no-overlap rules for lead form and program picker.
- Added final responsive overrides for 320/375/768/1024/1280/1440+.

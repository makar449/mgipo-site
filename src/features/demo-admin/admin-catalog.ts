import type { DemoCategory, DemoService } from '@/components/admin-lite/shared';

export const demoAdminServices = [
  {
    "id": "demo-program-01",
    "title": "Агроном защищенного грунта",
    "slug": "pp-agronomiya-agronom-zaschischennogo-grunta",
    "category": "Агрономия",
    "format": "Дистанционно, Онлайн",
    "duration": "256–1024 часа",
    "price": "от 10 000 ₽",
    "document": "Диплом",
    "status": "published",
    "popular": true,
    "updatedAt": "40 ключевых программ"
  },
  {
    "id": "demo-program-02",
    "title": "Архитектура",
    "slug": "pp-arhitektura-arhitektura",
    "category": "Архитектура",
    "format": "Дистанционно, Онлайн",
    "duration": "256–1024 часа",
    "price": "от 10 000 ₽",
    "document": "Диплом",
    "status": "published",
    "popular": true,
    "updatedAt": "40 ключевых программ"
  },
  {
    "id": "demo-program-03",
    "title": "Бухгалтер",
    "slug": "pp-buhgalterskoe-delo-buhgalter",
    "category": "Бухгалтерское дело",
    "format": "Дистанционно, Онлайн",
    "duration": "256–1024 часа",
    "price": "от 10 000 ₽",
    "document": "Диплом",
    "status": "published",
    "popular": true,
    "updatedAt": "40 ключевых программ"
  },
  {
    "id": "demo-program-04",
    "title": "Кинология",
    "slug": "pp-veterinariya-kinologiya",
    "category": "Ветеринария",
    "format": "Дистанционно, Онлайн",
    "duration": "256–1024 часа",
    "price": "от 10 000 ₽",
    "document": "Диплом",
    "status": "published",
    "popular": true,
    "updatedAt": "40 ключевых программ"
  },
  {
    "id": "demo-program-05",
    "title": "Государственное и муниципальное управление",
    "slug": "pp-gosudarstvennoe-i-municipalnoe-upravlenie-gosudarstvennoe-i-municipalnoe-upravlenie",
    "category": "Государственное и муниципальное управление",
    "format": "Дистанционно, Онлайн",
    "duration": "256–1024 часа",
    "price": "от 10 000 ₽",
    "document": "Диплом",
    "status": "published",
    "popular": true,
    "updatedAt": "40 ключевых программ"
  },
  {
    "id": "demo-program-06",
    "title": "Горный инженер",
    "slug": "pp-gornoe-delo-gornyy-inzhener",
    "category": "Горное дело",
    "format": "Дистанционно, Онлайн",
    "duration": "256–1024 часа",
    "price": "от 10 000 ₽",
    "document": "Диплом",
    "status": "published",
    "popular": true,
    "updatedAt": "40 ключевых программ"
  },
  {
    "id": "demo-program-07",
    "title": "Лингвистика",
    "slug": "pp-gumanitarnye-nauki-lingvistika",
    "category": "Гуманитарные науки",
    "format": "Дистанционно, Онлайн",
    "duration": "256–1024 часа",
    "price": "от 10 000 ₽",
    "document": "Диплом",
    "status": "published",
    "popular": true,
    "updatedAt": "40 ключевых программ"
  },
  {
    "id": "demo-program-08",
    "title": "Дизайнер интерфейсов и пользовательского опыта",
    "slug": "pp-dizayn-dizayner-interfeysov-i-polzovatelskogo-opyta",
    "category": "Дизайн",
    "format": "Дистанционно, Онлайн",
    "duration": "256–1024 часа",
    "price": "от 10 000 ₽",
    "document": "Диплом",
    "status": "published",
    "popular": true,
    "updatedAt": "40 ключевых программ"
  },
  {
    "id": "demo-program-09",
    "title": "Журналист",
    "slug": "pp-zhurnalistika-zhurnalist",
    "category": "Журналистика",
    "format": "Дистанционно, Онлайн",
    "duration": "256–1024 часа",
    "price": "от 10 000 ₽",
    "document": "Диплом",
    "status": "published",
    "popular": true,
    "updatedAt": "40 ключевых программ"
  },
  {
    "id": "demo-program-10",
    "title": "Кадастровый инженер",
    "slug": "pp-zemleustroystvo-i-kadastr-kadastrovyy-inzhener",
    "category": "Землеустройство и кадастр",
    "format": "Дистанционно, Онлайн",
    "duration": "256–1024 часа",
    "price": "от 10 000 ₽",
    "document": "Диплом",
    "status": "published",
    "popular": true,
    "updatedAt": "40 ключевых программ"
  },
  {
    "id": "demo-program-11",
    "title": "Python программист",
    "slug": "pp-informacionnye-tehnologii-python-programmist",
    "category": "Информационные технологии",
    "format": "Дистанционно, Онлайн",
    "duration": "256–1024 часа",
    "price": "от 10 000 ₽",
    "document": "Диплом",
    "status": "published",
    "popular": true,
    "updatedAt": "40 ключевых программ"
  },
  {
    "id": "demo-program-12",
    "title": "Инженерно-геодезические изыскания",
    "slug": "pp-inzhenernye-izyskaniya-inzhenerno-geodezicheskie-izyskaniya",
    "category": "Инженерные изыскания",
    "format": "Дистанционно, Онлайн",
    "duration": "256–1024 часа",
    "price": "от 10 000 ₽",
    "document": "Диплом",
    "status": "published",
    "popular": true,
    "updatedAt": "40 ключевых программ"
  },
  {
    "id": "demo-program-13",
    "title": "Внутренние и наружные инженерные системы",
    "slug": "pp-inzhenernye-sistemy-vnutrennie-i-naruzhnye-inzhenernye-sistemy",
    "category": "Инженерные системы",
    "format": "Дистанционно, Онлайн",
    "duration": "256–1024 часа",
    "price": "от 10 000 ₽",
    "document": "Диплом",
    "status": "published",
    "popular": false,
    "updatedAt": "40 ключевых программ"
  },
  {
    "id": "demo-program-14",
    "title": "Кадровое делопроизводство",
    "slug": "pp-kadrovoe-deloproizvodstvo-kadrovoe-deloproizvodstvo",
    "category": "Кадровое делопроизводство",
    "format": "Дистанционно, Онлайн",
    "duration": "256–1024 часа",
    "price": "от 10 000 ₽",
    "document": "Диплом",
    "status": "published",
    "popular": false,
    "updatedAt": "40 ключевых программ"
  },
  {
    "id": "demo-program-15",
    "title": "Культуролог",
    "slug": "pp-kultura-i-iskusstvo-kulturolog",
    "category": "Культура и искусство",
    "format": "Дистанционно, Онлайн",
    "duration": "256–1024 часа",
    "price": "от 10 000 ₽",
    "document": "Диплом",
    "status": "published",
    "popular": false,
    "updatedAt": "40 ключевых программ"
  },
  {
    "id": "demo-program-16",
    "title": "Директор по маркетингу",
    "slug": "pp-marketing-direktor-po-marketingu",
    "category": "Маркетинг",
    "format": "Дистанционно, Онлайн",
    "duration": "256–1024 часа",
    "price": "от 10 000 ₽",
    "document": "Диплом",
    "status": "published",
    "popular": false,
    "updatedAt": "40 ключевых программ"
  },
  {
    "id": "demo-program-17",
    "title": "Антикризисное управление",
    "slug": "pp-menedzhment-antikrizisnoe-upravlenie",
    "category": "Менеджмент",
    "format": "Дистанционно, Онлайн",
    "duration": "256–1024 часа",
    "price": "от 10 000 ₽",
    "document": "Диплом",
    "status": "published",
    "popular": false,
    "updatedAt": "40 ключевых программ"
  },
  {
    "id": "demo-program-18",
    "title": "Металлургия",
    "slug": "pp-metallurgiya-metallurgiya",
    "category": "Металлургия",
    "format": "Дистанционно, Онлайн",
    "duration": "256–1024 часа",
    "price": "от 10 000 ₽",
    "document": "Диплом",
    "status": "published",
    "popular": false,
    "updatedAt": "40 ключевых программ"
  },
  {
    "id": "demo-program-19",
    "title": "Метрология, стандартизация и сертификация",
    "slug": "pp-metrologicheskiy-kontrol-metrologiya-standartizaciya-i-sertifikaciya",
    "category": "Метрологический контроль",
    "format": "Дистанционно, Онлайн",
    "duration": "256–1024 часа",
    "price": "от 10 000 ₽",
    "document": "Диплом",
    "status": "published",
    "popular": false,
    "updatedAt": "40 ключевых программ"
  },
  {
    "id": "demo-program-20",
    "title": "44 ФЗ и 223 ФЗ",
    "slug": "pp-zakupki-i-kontraktnaya-sistema-44-fz-i-223-fz",
    "category": "Закупки и контрактная система",
    "format": "Дистанционно, Онлайн",
    "duration": "256–1024 часа",
    "price": "от 10 000 ₽",
    "document": "Диплом",
    "status": "published",
    "popular": false,
    "updatedAt": "40 ключевых программ"
  },
  {
    "id": "demo-program-21",
    "title": "Бурение нефтяных и газовых скважин",
    "slug": "pp-neftegazovoe-delo-burenie-neftyanyh-i-gazovyh-skvazhin",
    "category": "Нефтегазовое дело",
    "format": "Дистанционно, Онлайн",
    "duration": "256–1024 часа",
    "price": "от 10 000 ₽",
    "document": "Диплом",
    "status": "published",
    "popular": false,
    "updatedAt": "40 ключевых программ"
  },
  {
    "id": "demo-program-22",
    "title": "Оценка стоимости недвижимости",
    "slug": "pp-ocenochnaya-deyatelnost-ocenka-stoimosti-nedvizhimosti",
    "category": "Оценочная деятельность",
    "format": "Дистанционно, Онлайн",
    "duration": "256–1024 часа",
    "price": "от 10 000 ₽",
    "document": "Диплом",
    "status": "published",
    "popular": false,
    "updatedAt": "40 ключевых программ"
  },
  {
    "id": "demo-program-23",
    "title": "Технолог пищевого производства",
    "slug": "pp-pischevaya-promyshlennost-tehnolog-pischevogo-proizvodstva",
    "category": "Пищевая промышленность",
    "format": "Дистанционно, Онлайн",
    "duration": "256–1024 часа",
    "price": "от 10 000 ₽",
    "document": "Диплом",
    "status": "published",
    "popular": false,
    "updatedAt": "40 ключевых программ"
  },
  {
    "id": "demo-program-24",
    "title": "Эксплуатация подъемных сооружений для людей",
    "slug": "pp-podemnye-sooruzheniya-ekspluataciya-podemnyh-sooruzheniy-dlya-lyudey",
    "category": "Подъемные сооружения",
    "format": "Дистанционно, Онлайн",
    "duration": "256–1024 часа",
    "price": "от 10 000 ₽",
    "document": "Диплом",
    "status": "published",
    "popular": false,
    "updatedAt": "40 ключевых программ"
  },
  {
    "id": "demo-program-25",
    "title": "Инженер-проектировщик",
    "slug": "pp-proektirovanie-inzhener-proektirovschik",
    "category": "Проектирование",
    "format": "Дистанционно, Онлайн",
    "duration": "256–1024 часа",
    "price": "от 10 000 ₽",
    "document": "Диплом",
    "status": "published",
    "popular": false,
    "updatedAt": "40 ключевых программ"
  },
  {
    "id": "demo-program-26",
    "title": "Промышленная безопасность для руководителей",
    "slug": "pp-promyshlennaya-bezopasnost-promyshlennaya-bezopasnost-dlya-rukovoditeley",
    "category": "Промышленная безопасность",
    "format": "Дистанционно, Онлайн",
    "duration": "256–1024 часа",
    "price": "от 10 000 ₽",
    "document": "Диплом",
    "status": "published",
    "popular": false,
    "updatedAt": "40 ключевых программ"
  },
  {
    "id": "demo-program-27",
    "title": "Сварочное производство",
    "slug": "pp-raznye-otrasli-svarochnoe-proizvodstvo",
    "category": "Разные отрасли",
    "format": "Дистанционно, Онлайн",
    "duration": "256–1024 часа",
    "price": "от 10 000 ₽",
    "document": "Диплом",
    "status": "published",
    "popular": false,
    "updatedAt": "40 ключевых программ"
  },
  {
    "id": "demo-program-28",
    "title": "Авиационная и ракетно- космическая техника",
    "slug": "pp-raketno-kosmicheskaya-promyshlennost-aviacionnaya-i-raketno-kosmicheskaya-tehnika",
    "category": "Ракетно-космическая промышленность",
    "format": "Дистанционно, Онлайн",
    "duration": "256–1024 часа",
    "price": "от 10 000 ₽",
    "document": "Диплом",
    "status": "published",
    "popular": false,
    "updatedAt": "40 ключевых программ"
  },
  {
    "id": "demo-program-29",
    "title": "Режиссура кино и телевидения",
    "slug": "pp-rezhissura-kino-i-televidenie-rezhissura-kino-i-televideniya",
    "category": "Режиссура кино и телевидение",
    "format": "Дистанционно, Онлайн",
    "duration": "256–1024 часа",
    "price": "от 10 000 ₽",
    "document": "Диплом",
    "status": "published",
    "popular": false,
    "updatedAt": "40 ключевых программ"
  },
  {
    "id": "demo-program-30",
    "title": "Реставрация и приспособление объектов архитектурного наследия",
    "slug": "pp-restavraciya-restavraciya-i-prisposoblenie-obektov-arhitekturnogo-naslediya",
    "category": "Реставрация",
    "format": "Дистанционно, Онлайн",
    "duration": "256–1024 часа",
    "price": "от 10 000 ₽",
    "document": "Диплом",
    "status": "published",
    "popular": false,
    "updatedAt": "40 ключевых программ"
  },
  {
    "id": "demo-program-31",
    "title": "Ритуальный агент (похоронный агент)",
    "slug": "pp-ritualnye-uslugi-ritualnyy-agent-pohoronnyy-agent",
    "category": "Ритуальные услуги",
    "format": "Дистанционно, Онлайн",
    "duration": "256–1024 часа",
    "price": "от 10 000 ₽",
    "document": "Диплом",
    "status": "published",
    "popular": false,
    "updatedAt": "40 ключевых программ"
  },
  {
    "id": "demo-program-32",
    "title": "Многоканальные телекоммуникационные системы",
    "slug": "pp-svyaz-i-telekommunikacii-mnogokanalnye-telekommunikacionnye-sistemy",
    "category": "Связь и телекоммуникации",
    "format": "Дистанционно, Онлайн",
    "duration": "256–1024 часа",
    "price": "от 10 000 ₽",
    "document": "Диплом",
    "status": "published",
    "popular": false,
    "updatedAt": "40 ключевых программ"
  },
  {
    "id": "demo-program-33",
    "title": "Специалист по социальной работе",
    "slug": "pp-socialnoe-obsluzhivanie-specialist-po-socialnoy-rabote",
    "category": "Социальное обслуживание",
    "format": "Дистанционно, Онлайн",
    "duration": "256–1024 часа",
    "price": "от 10 000 ₽",
    "document": "Диплом",
    "status": "published",
    "popular": false,
    "updatedAt": "40 ключевых программ"
  },
  {
    "id": "demo-program-34",
    "title": "Безопасность строительства и осуществление строительного контроля",
    "slug": "pp-stroitelstvo-bezopasnost-stroitelstva-i-osuschestvlenie-stroitelnogo-kontrolya",
    "category": "Строительство",
    "format": "Дистанционно, Онлайн",
    "duration": "256–1024 часа",
    "price": "от 10 000 ₽",
    "document": "Диплом",
    "status": "published",
    "popular": false,
    "updatedAt": "40 ключевых программ"
  },
  {
    "id": "demo-program-35",
    "title": "Торговое дело",
    "slug": "pp-torgovlya-i-tovarovedenie-torgovoe-delo",
    "category": "Торговля и товароведение",
    "format": "Дистанционно, Онлайн",
    "duration": "256–1024 часа",
    "price": "от 10 000 ₽",
    "document": "Диплом",
    "status": "published",
    "popular": false,
    "updatedAt": "40 ключевых программ"
  },
  {
    "id": "demo-program-36",
    "title": "Безопасность дорожного движения",
    "slug": "pp-transportnaya-bezopasnost-bezopasnost-dorozhnogo-dvizheniya",
    "category": "Транспортная безопасность",
    "format": "Дистанционно, Онлайн",
    "duration": "256–1024 часа",
    "price": "от 10 000 ₽",
    "document": "Диплом",
    "status": "published",
    "popular": false,
    "updatedAt": "40 ключевых программ"
  },
  {
    "id": "demo-program-37",
    "title": "Монтаж и сервис современного холодильного оборудования",
    "slug": "pp-holodilnoe-oborudovanie-montazh-i-servis-sovremennogo-holodilnogo-oborudovaniya",
    "category": "Холодильное оборудование",
    "format": "Дистанционно, Онлайн",
    "duration": "256–1024 часа",
    "price": "от 10 000 ₽",
    "document": "Диплом",
    "status": "published",
    "popular": false,
    "updatedAt": "40 ключевых программ"
  },
  {
    "id": "demo-program-38",
    "title": "Бизнес-аналитик",
    "slug": "pp-ekonomika-i-finansy-biznes-analitik",
    "category": "Экономика и финансы",
    "format": "Дистанционно, Онлайн",
    "duration": "256–1024 часа",
    "price": "от 10 000 ₽",
    "document": "Диплом",
    "status": "published",
    "popular": false,
    "updatedAt": "40 ключевых программ"
  },
  {
    "id": "demo-program-39",
    "title": "Инженер-электрик",
    "slug": "pp-energetika-inzhener-elektrik",
    "category": "Энергетика",
    "format": "Дистанционно, Онлайн",
    "duration": "256–1024 часа",
    "price": "от 10 000 ₽",
    "document": "Диплом",
    "status": "published",
    "popular": false,
    "updatedAt": "40 ключевых программ"
  },
  {
    "id": "demo-program-40",
    "title": "Договорное право",
    "slug": "pp-yurisprudenciya-dogovornoe-pravo",
    "category": "Юриспруденция",
    "format": "Дистанционно, Онлайн",
    "duration": "256–1024 часа",
    "price": "от 10 000 ₽",
    "document": "Диплом",
    "status": "published",
    "popular": false,
    "updatedAt": "40 ключевых программ"
  }
] satisfies DemoService[];

export const demoAdminCategories = [
  {
    "id": "cat-agronomiya",
    "title": "Агрономия",
    "slug": "agronomiya",
    "count": 1,
    "status": "published",
    "description": "Направление каталога профессиональной переподготовки: Агрономия."
  },
  {
    "id": "cat-arhitektura",
    "title": "Архитектура",
    "slug": "arhitektura",
    "count": 1,
    "status": "published",
    "description": "Направление каталога профессиональной переподготовки: Архитектура."
  },
  {
    "id": "cat-buhgalterskoe-delo",
    "title": "Бухгалтерское дело",
    "slug": "buhgalterskoe-delo",
    "count": 1,
    "status": "published",
    "description": "Направление каталога профессиональной переподготовки: Бухгалтерское дело."
  },
  {
    "id": "cat-veterinariya",
    "title": "Ветеринария",
    "slug": "veterinariya",
    "count": 1,
    "status": "published",
    "description": "Направление каталога профессиональной переподготовки: Ветеринария."
  },
  {
    "id": "cat-gosudarstvennoe-i-municipalnoe-upravlenie",
    "title": "Государственное и муниципальное управление",
    "slug": "gosudarstvennoe-i-municipalnoe-upravlenie",
    "count": 1,
    "status": "published",
    "description": "Направление каталога профессиональной переподготовки: Государственное и муниципальное управление."
  },
  {
    "id": "cat-gornoe-delo",
    "title": "Горное дело",
    "slug": "gornoe-delo",
    "count": 1,
    "status": "published",
    "description": "Направление каталога профессиональной переподготовки: Горное дело."
  },
  {
    "id": "cat-gumanitarnye-nauki",
    "title": "Гуманитарные науки",
    "slug": "gumanitarnye-nauki",
    "count": 1,
    "status": "published",
    "description": "Направление каталога профессиональной переподготовки: Гуманитарные науки."
  },
  {
    "id": "cat-dizayn",
    "title": "Дизайн",
    "slug": "dizayn",
    "count": 1,
    "status": "published",
    "description": "Направление каталога профессиональной переподготовки: Дизайн."
  },
  {
    "id": "cat-zhurnalistika",
    "title": "Журналистика",
    "slug": "zhurnalistika",
    "count": 1,
    "status": "published",
    "description": "Направление каталога профессиональной переподготовки: Журналистика."
  },
  {
    "id": "cat-zemleustroystvo-i-kadastr",
    "title": "Землеустройство и кадастр",
    "slug": "zemleustroystvo-i-kadastr",
    "count": 1,
    "status": "published",
    "description": "Направление каталога профессиональной переподготовки: Землеустройство и кадастр."
  },
  {
    "id": "cat-informacionnye-tehnologii",
    "title": "Информационные технологии",
    "slug": "informacionnye-tehnologii",
    "count": 1,
    "status": "published",
    "description": "Направление каталога профессиональной переподготовки: Информационные технологии."
  },
  {
    "id": "cat-inzhenernye-izyskaniya",
    "title": "Инженерные изыскания",
    "slug": "inzhenernye-izyskaniya",
    "count": 1,
    "status": "published",
    "description": "Направление каталога профессиональной переподготовки: Инженерные изыскания."
  },
  {
    "id": "cat-inzhenernye-sistemy",
    "title": "Инженерные системы",
    "slug": "inzhenernye-sistemy",
    "count": 1,
    "status": "published",
    "description": "Направление каталога профессиональной переподготовки: Инженерные системы."
  },
  {
    "id": "cat-kadrovoe-deloproizvodstvo",
    "title": "Кадровое делопроизводство",
    "slug": "kadrovoe-deloproizvodstvo",
    "count": 1,
    "status": "published",
    "description": "Направление каталога профессиональной переподготовки: Кадровое делопроизводство."
  },
  {
    "id": "cat-kultura-i-iskusstvo",
    "title": "Культура и искусство",
    "slug": "kultura-i-iskusstvo",
    "count": 1,
    "status": "published",
    "description": "Направление каталога профессиональной переподготовки: Культура и искусство."
  },
  {
    "id": "cat-marketing",
    "title": "Маркетинг",
    "slug": "marketing",
    "count": 1,
    "status": "published",
    "description": "Направление каталога профессиональной переподготовки: Маркетинг."
  },
  {
    "id": "cat-menedzhment",
    "title": "Менеджмент",
    "slug": "menedzhment",
    "count": 1,
    "status": "published",
    "description": "Направление каталога профессиональной переподготовки: Менеджмент."
  },
  {
    "id": "cat-metallurgiya",
    "title": "Металлургия",
    "slug": "metallurgiya",
    "count": 1,
    "status": "published",
    "description": "Направление каталога профессиональной переподготовки: Металлургия."
  },
  {
    "id": "cat-metrologicheskiy-kontrol",
    "title": "Метрологический контроль",
    "slug": "metrologicheskiy-kontrol",
    "count": 1,
    "status": "published",
    "description": "Направление каталога профессиональной переподготовки: Метрологический контроль."
  },
  {
    "id": "cat-zakupki-i-kontraktnaya-sistema",
    "title": "Закупки и контрактная система",
    "slug": "zakupki-i-kontraktnaya-sistema",
    "count": 1,
    "status": "published",
    "description": "Направление каталога профессиональной переподготовки: Закупки и контрактная система."
  },
  {
    "id": "cat-neftegazovoe-delo",
    "title": "Нефтегазовое дело",
    "slug": "neftegazovoe-delo",
    "count": 1,
    "status": "published",
    "description": "Направление каталога профессиональной переподготовки: Нефтегазовое дело."
  },
  {
    "id": "cat-ocenochnaya-deyatelnost",
    "title": "Оценочная деятельность",
    "slug": "ocenochnaya-deyatelnost",
    "count": 1,
    "status": "published",
    "description": "Направление каталога профессиональной переподготовки: Оценочная деятельность."
  },
  {
    "id": "cat-pischevaya-promyshlennost",
    "title": "Пищевая промышленность",
    "slug": "pischevaya-promyshlennost",
    "count": 1,
    "status": "published",
    "description": "Направление каталога профессиональной переподготовки: Пищевая промышленность."
  },
  {
    "id": "cat-podemnye-sooruzheniya",
    "title": "Подъемные сооружения",
    "slug": "podemnye-sooruzheniya",
    "count": 1,
    "status": "published",
    "description": "Направление каталога профессиональной переподготовки: Подъемные сооружения."
  },
  {
    "id": "cat-proektirovanie",
    "title": "Проектирование",
    "slug": "proektirovanie",
    "count": 1,
    "status": "published",
    "description": "Направление каталога профессиональной переподготовки: Проектирование."
  },
  {
    "id": "cat-promyshlennaya-bezopasnost",
    "title": "Промышленная безопасность",
    "slug": "promyshlennaya-bezopasnost",
    "count": 1,
    "status": "published",
    "description": "Направление каталога профессиональной переподготовки: Промышленная безопасность."
  },
  {
    "id": "cat-raznye-otrasli",
    "title": "Разные отрасли",
    "slug": "raznye-otrasli",
    "count": 1,
    "status": "published",
    "description": "Направление каталога профессиональной переподготовки: Разные отрасли."
  },
  {
    "id": "cat-raketno-kosmicheskaya-promyshlennost",
    "title": "Ракетно-космическая промышленность",
    "slug": "raketno-kosmicheskaya-promyshlennost",
    "count": 1,
    "status": "published",
    "description": "Направление каталога профессиональной переподготовки: Ракетно-космическая промышленность."
  },
  {
    "id": "cat-rezhissura-kino-i-televidenie",
    "title": "Режиссура кино и телевидение",
    "slug": "rezhissura-kino-i-televidenie",
    "count": 1,
    "status": "published",
    "description": "Направление каталога профессиональной переподготовки: Режиссура кино и телевидение."
  },
  {
    "id": "cat-restavraciya",
    "title": "Реставрация",
    "slug": "restavraciya",
    "count": 1,
    "status": "published",
    "description": "Направление каталога профессиональной переподготовки: Реставрация."
  },
  {
    "id": "cat-ritualnye-uslugi",
    "title": "Ритуальные услуги",
    "slug": "ritualnye-uslugi",
    "count": 1,
    "status": "published",
    "description": "Направление каталога профессиональной переподготовки: Ритуальные услуги."
  },
  {
    "id": "cat-svyaz-i-telekommunikacii",
    "title": "Связь и телекоммуникации",
    "slug": "svyaz-i-telekommunikacii",
    "count": 1,
    "status": "published",
    "description": "Направление каталога профессиональной переподготовки: Связь и телекоммуникации."
  },
  {
    "id": "cat-socialnoe-obsluzhivanie",
    "title": "Социальное обслуживание",
    "slug": "socialnoe-obsluzhivanie",
    "count": 1,
    "status": "published",
    "description": "Направление каталога профессиональной переподготовки: Социальное обслуживание."
  },
  {
    "id": "cat-stroitelstvo",
    "title": "Строительство",
    "slug": "stroitelstvo",
    "count": 1,
    "status": "published",
    "description": "Направление каталога профессиональной переподготовки: Строительство."
  },
  {
    "id": "cat-torgovlya-i-tovarovedenie",
    "title": "Торговля и товароведение",
    "slug": "torgovlya-i-tovarovedenie",
    "count": 1,
    "status": "published",
    "description": "Направление каталога профессиональной переподготовки: Торговля и товароведение."
  },
  {
    "id": "cat-transportnaya-bezopasnost",
    "title": "Транспортная безопасность",
    "slug": "transportnaya-bezopasnost",
    "count": 1,
    "status": "published",
    "description": "Направление каталога профессиональной переподготовки: Транспортная безопасность."
  },
  {
    "id": "cat-holodilnoe-oborudovanie",
    "title": "Холодильное оборудование",
    "slug": "holodilnoe-oborudovanie",
    "count": 1,
    "status": "published",
    "description": "Направление каталога профессиональной переподготовки: Холодильное оборудование."
  },
  {
    "id": "cat-ekonomika-i-finansy",
    "title": "Экономика и финансы",
    "slug": "ekonomika-i-finansy",
    "count": 1,
    "status": "published",
    "description": "Направление каталога профессиональной переподготовки: Экономика и финансы."
  },
  {
    "id": "cat-energetika",
    "title": "Энергетика",
    "slug": "energetika",
    "count": 1,
    "status": "published",
    "description": "Направление каталога профессиональной переподготовки: Энергетика."
  },
  {
    "id": "cat-yurisprudenciya",
    "title": "Юриспруденция",
    "slug": "yurisprudenciya",
    "count": 1,
    "status": "published",
    "description": "Направление каталога профессиональной переподготовки: Юриспруденция."
  }
] satisfies DemoCategory[];

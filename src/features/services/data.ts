import { serviceSchema, type Service } from '@/features/services/types';
import { publicProfessionalRetrainingCatalog } from '@/features/services/program-catalog';

const CATEGORY_SLUGS = {
  "Агрономия": "agronomiya",
  "Архитектура": "arhitektura",
  "Бухгалтерское дело": "buhgalterskoe-delo",
  "Ветеринария": "veterinariya",
  "Государственное и муниципальное управление": "gosudarstvennoe-i-municipalnoe-upravlenie",
  "Горное дело": "gornoe-delo",
  "Гуманитарные науки": "gumanitarnye-nauki",
  "Дизайн": "dizayn",
  "Журналистика": "zhurnalistika",
  "Землеустройство и кадастр": "zemleustroystvo-i-kadastr",
  "Информационные технологии": "informacionnye-tehnologii",
  "Инженерные изыскания": "inzhenernye-izyskaniya",
  "Инженерные системы": "inzhenernye-sistemy",
  "Кадровое делопроизводство": "kadrovoe-deloproizvodstvo",
  "Корпоративное обучение": "korporativnoe-obuchenie",
  "Культура и искусство": "kultura-i-iskusstvo",
  "Маркетинг": "marketing",
  "Менеджмент": "menedzhment",
  "Металлургия": "metallurgiya",
  "Метрологический контроль": "metrologicheskiy-kontrol",
  "Закупки и контрактная система": "zakupki-i-kontraktnaya-sistema",
  "Нефтегазовое дело": "neftegazovoe-delo",
  "Оценочная деятельность": "ocenochnaya-deyatelnost",
  "Пищевая промышленность": "pischevaya-promyshlennost",
  "Подъемные сооружения": "podemnye-sooruzheniya",
  "Проектирование": "proektirovanie",
  "Промышленная безопасность": "promyshlennaya-bezopasnost",
  "Разные отрасли": "raznye-otrasli",
  "Ракетно-космическая промышленность": "raketno-kosmicheskaya-promyshlennost",
  "Режиссура кино и телевидение": "rezhissura-kino-i-televidenie",
  "Реставрация": "restavraciya",
  "Ритуальные услуги": "ritualnye-uslugi",
  "Связь и телекоммуникации": "svyaz-i-telekommunikacii",
  "Социальное обслуживание": "socialnoe-obsluzhivanie",
  "Строительство": "stroitelstvo",
  "Торговля и товароведение": "torgovlya-i-tovarovedenie",
  "Транспортная безопасность": "transportnaya-bezopasnost",
  "Холодильное оборудование": "holodilnoe-oborudovanie",
  "Экономика и финансы": "ekonomika-i-finansy",
  "Энергетика": "energetika",
  "Юриспруденция": "yurisprudenciya"
} as const;

const premiumProgramTitles = new Set<string>([
  'Государственное и муниципальное управление',
  'Государственная и муниципальная служба',
  'Контрактный управляющий',
  'Специалист в сфере предупреждения коррупционных правонарушений',
  'Антикризисное управление',
  'Бизнес-тренер',
  'Директор по маркетингу',
  'Бухгалтер',
  'Бухгалтер 1С',
  'Python программист',
  'Аналитик данных (Data Scientist)',
  'Юриспруденция',
  'Адвокатура',
  'Договорное право',
  'Кадровое делопроизводство',
  'Документационное обеспечение управления',
  'Промышленная безопасность для руководителей',
  'Безопасность строительства и осуществление строительного контроля'
]);

const executiveCategories = new Set<string>([
  'Государственное и муниципальное управление',
  'Менеджмент',
  'Экономика и финансы',
  'Юриспруденция',
  'Кадровое делопроизводство',
  'Бухгалтерское дело',
  'Информационные технологии',
  'Промышленная безопасность',
  'Строительство',
  'Проектирование'
]);

const categorySynonyms: Record<string, readonly string[]> = {
  'Государственное и муниципальное управление': ['гму', 'госслужба', 'муниципальное управление', 'государственная служба', 'закупки'],
  'Закупки и контрактная система': ['44 фз', '223 фз', 'контрактная система', 'закупки'],
  'Информационные технологии': ['ит', 'it', 'программирование', 'python', '1с', 'данные', 'разработка'],
  'Экономика и финансы': ['финансы', 'банк', 'аудит', 'брокер', 'экономист'],
  'Бухгалтерское дело': ['бухгалтер', '1с', 'налоги', 'учет', 'зарплата'],
  'Юриспруденция': ['юрист', 'право', 'адвокат', 'договор', 'земельное право'],
  'Кадровое делопроизводство': ['кадры', 'делопроизводство', 'архив', 'трудовое законодательство', 'воинский учет'],
  'Менеджмент': ['управление', 'руководитель', 'бизнес', 'качество', 'гостиничное дело'],
  'Маркетинг': ['маркетинг', 'реклама', 'pr', 'бренд', 'продажи'],
  'Строительство': ['стройка', 'строительный контроль', 'инженер', 'градостроительство'],
  'Архитектура': ['архитектор', 'ландшафт', 'дизайн', 'проектирование'],
  'Проектирование': ['проектировщик', 'autocad', 'инженерные системы', 'тепловые сети'],
  'Промышленная безопасность': ['безопасность', 'опасный объект', 'сертификация', 'неразрушающий контроль'],
  'Нефтегазовое дело': ['нефть', 'газ', 'скважины', 'гсм', 'газораспределение'],
  'Энергетика': ['энергетика', 'электрик', 'атомные станции', 'электроснабжение'],
  'Транспортная безопасность': ['транспорт', 'бдд', 'автотранспорт', 'диспетчер'],
  'Медицина': ['медицина', 'медицинский', 'экспертиза'],
  'Агрономия': ['сельское хозяйство', 'агроном', 'фермерство', 'растения'],
  'Ветеринария': ['ветеринария', 'животные', 'кинология', 'зоопсихология']
};

const accentByCategory: Record<string, Service['accent']> = {
  'Государственное и муниципальное управление': 'blue',
  'Менеджмент': 'blue',
  'Экономика и финансы': 'cyan',
  'Юриспруденция': 'violet',
  'Информационные технологии': 'cyan',
  'Бухгалтерское дело': 'green',
  'Кадровое делопроизводство': 'green',
  'Промышленная безопасность': 'orange',
  'Строительство': 'blue',
  'Проектирование': 'blue'
};

const transliteration: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'c', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya'
};

function slugify(value: string): string {
  const slug = value
    .toLowerCase()
    .split('')
    .map((char) => transliteration[char] ?? (/[a-z0-9]/.test(char) ? char : '-'))
    .join('')
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return slug.length > 0 ? slug : 'program';
}

function uniqueTokens(...values: string[]): string[] {
  const tokens = new Set<string>();
  values
    .join(' ')
    .toLowerCase()
    .replace(/[«»(),.;:]/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 1)
    .forEach((token) => tokens.add(token));
  return [...tokens];
}

function computePopularity(category: string, title: string, index: number): number {
  let score = 70;
  if (executiveCategories.has(category)) score += 12;
  if (premiumProgramTitles.has(title)) score += 14;
  if (/руковод|управлен|государ|муницип|контракт|директор|безопас|юрист|бухгалтер|python|data|аудит/i.test(title)) score += 7;
  score -= Math.min(index, 20);
  return Math.max(55, Math.min(100, score));
}

function buildService(category: string, sourceDocumentHref: string, title: string, index: number): Service {
  const categorySlug = CATEGORY_SLUGS[category as keyof typeof CATEGORY_SLUGS] ?? slugify(category);
  const serviceSlug = `pp-${categorySlug}-${slugify(title)}`;
  const popularity = computePopularity(category, title, index);
  const categoryWords = categorySynonyms[category] ?? [];
  const keywords = uniqueTokens(title, category, 'профессиональная переподготовка', 'дпп', 'диплом', 'мгипо', ...categoryWords);

  return serviceSchema.parse({
    id: serviceSlug,
    slug: serviceSlug,
    title,
    category,
    headline: `Профессиональная переподготовка: ${title}`,
    shortDescription: `ДПП по направлению «${title}» с присвоением квалификации, дипломом и сроком обучения от 256 до 1024 часов.`,
    fullDescription: `Программа профессиональной переподготовки «${title}» относится к направлению «${category}». Обучение рассчитано на слушателей, которым нужно подтвердить или получить квалификацию, оформить официальный диплом и пройти программу в деловом дистанционном формате.`,
    minPrice: 10000,
    maxPrice: 10000,
    duration: 'от 256 до 1024 академических часов',
    formats: ['Дистанционно', 'Онлайн'],
    documentType: 'Диплом',
    documentDescription: 'После успешного завершения программы оформляется диплом о профессиональной переподготовке с присвоением квалификации по выбранному направлению.',
    programModules: [
      `Профессиональная база направления «${title}»`,
      'Нормативные требования и отраслевые стандарты',
      'Прикладные профессиональные компетенции',
      'Практические задания и итоговая аттестация',
      'Оформление диплома о профессиональной переподготовке'
    ],
    suitableFor: [
      'Руководители и специалисты организаций',
      'Сотрудники, которым требуется новая квалификация',
      'Слушатели с высшим или средним профессиональным образованием',
      `Специалисты направления «${category}»`
    ],
    includes: [
      'Подбор программы под задачу слушателя или организации',
      'Учебные материалы и сопровождение менеджера',
      'Итоговая аттестация',
      'Оформление диплома после завершения обучения'
    ],
    benefits: [
      'Официальная программа профессиональной переподготовки',
      'Единый старт стоимости от 10 000 рублей',
      'Формат подходит для занятых специалистов и организаций',
      'Программа включена в реальный перечень МГИПО'
    ],
    keywords,
    synonyms: [...new Set([...categoryWords, category, title, 'профпереподготовка', 'получить квалификацию', 'диплом переподготовки'])],
    popularity,
    isNew: popularity >= 90,
    status: 'active',
    variants: [
      { id: `${serviceSlug}-256`, title: 'Базовая программа', hours: 256, format: 'Дистанционно', price: 10000, paymentLabel: 'Стоимость от 10 000 рублей' },
      { id: `${serviceSlug}-520`, title: 'Расширенная программа', hours: 520, format: 'Онлайн', price: 10000, paymentLabel: 'Итоговая стоимость уточняется по заявке' },
      { id: `${serviceSlug}-1024`, title: 'Углублённая программа', hours: 1024, format: 'Дистанционно', price: 10000, paymentLabel: 'Для комплексной переподготовки' }
    ],
    faq: [
      { question: 'Какой документ выдаётся после обучения?', answer: 'По итогам программы оформляется диплом о профессиональной переподготовке с присвоением квалификации.' },
      { question: 'Сколько длится обучение?', answer: 'В перечне указана длительность от 256 до 1024 часов. Точный объём подбирается по задаче слушателя или организации.' },
      { question: 'Какая стоимость программы?', answer: 'Стоимость начинается от 10 000 рублей. Итоговые условия уточняются после выбора направления, объёма часов и формата обучения.' },
      { question: 'Можно ли обучаться дистанционно?', answer: 'Да, для программ профессиональной переподготовки доступен дистанционный формат с сопровождением менеджера.' }
    ],
    accent: accentByCategory[category] ?? 'blue',
    sourceDocumentHref,
    sourceDocumentLabel: `Перечень программ: ${category}`
  });
}

export const services = publicProfessionalRetrainingCatalog.flatMap((entry) =>
  entry.programs.map((program, index) => buildService(entry.category, entry.sourceDocumentHref, program, index))
).filter((service) => service.status === 'active') satisfies ReadonlyArray<Service>;

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}

export function getRelatedServices(service: Service, limit = 3): ReadonlyArray<Service> {
  return services
    .filter((candidate) => candidate.id !== service.id)
    .map((candidate) => ({
      service: candidate,
      score: (candidate.category === service.category ? 80 : 0) + candidate.keywords.filter((keyword) => service.keywords.includes(keyword)).length * 10 + candidate.popularity / 10
    }))
    .sort((left, right) => right.score - left.score)
    .slice(0, limit)
    .map((item) => item.service);
}

export function getPriceBounds(): { min: number; max: number } {
  return {
    min: Math.min(...services.map((service) => service.minPrice)),
    max: Math.max(...services.map((service) => service.maxPrice))
  };
}

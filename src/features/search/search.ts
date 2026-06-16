import type { Service } from '@/features/services/types';
import { normalizeText } from '@/lib/format';

export type SearchResult = { service: Service; score: number; matchedTerms: ReadonlyArray<string> };

const semanticDictionary = new Map<string, ReadonlyArray<string>>([
  ['гму', ['государственное и муниципальное управление', 'государственная служба', 'муниципальная служба']],
  ['госслужба', ['государственная и муниципальная служба', 'государственное управление']],
  ['44 фз', ['закупки', 'контрактная система', 'контрактный управляющий']],
  ['223 фз', ['закупки', 'контрактная система']],
  ['закупки', ['контрактный управляющий', 'эксперт в сфере закупок', '44 фз', '223 фз']],
  ['руководитель', ['менеджмент', 'управление', 'гму', 'директор', 'руководитель организации']],
  ['управление', ['менеджмент', 'государственное и муниципальное управление', 'антикризисное управление']],
  ['директор', ['менеджмент', 'директор по маркетингу', 'директор музея', 'руководитель']],
  ['бухгалтер', ['бухгалтерское дело', 'бухгалтер 1с', 'зарплата', 'налоги']],
  ['1с', ['1с программист', 'бухгалтер 1с', 'корпоративное обучение сотрудников 1с']],
  ['python', ['python программист', 'информационные технологии', 'программирование']],
  ['программист', ['python программист', '1с программист', 'веб-разработка', 'информационные технологии']],
  ['айти', ['информационные технологии', 'it', 'веб-разработка', 'аналитик данных']],
  ['it', ['информационные технологии', 'python', '1с', 'веб-разработка']],
  ['data', ['аналитик данных', 'data scientist', 'большие данные']],
  ['кадры', ['кадровое делопроизводство', 'документоведение', 'воинский учет', 'трудовое законодательство']],
  ['hr', ['кадровое делопроизводство', 'аналитик по управлению персоналом', 'персонал']],
  ['юрист', ['юриспруденция', 'адвокатура', 'договорное право', 'гражданское право']],
  ['право', ['юриспруденция', 'административное право', 'договорное право', 'конституционное право']],
  ['строительство', ['строительный контроль', 'проектирование', 'архитектура', 'градостроительство']],
  ['стройка', ['строительство', 'безопасность строительства', 'дорожное строительство']],
  ['архитектор', ['архитектура', 'ландшафтный архитектор', 'архитектор-реставратор']],
  ['дизайн', ['дизайнер интерьера', 'веб-дизайн', 'промышленный дизайн', 'ландшафтный дизайн']],
  ['маркетинг', ['директор по маркетингу', 'интернет-маркетинг', 'реклама и связи с общественностью']],
  ['финансы', ['экономика и финансы', 'банковское дело', 'аудитор', 'брокер']],
  ['нефть', ['нефтегазовое дело', 'бурение нефтяных и газовых скважин', 'геология нефти и газа']],
  ['газ', ['нефтегазовое дело', 'газовое хозяйство', 'газораспределение и газопотребление']],
  ['энергетика', ['инженер-электрик', 'атомные станции', 'гидроэлектростанции']],
  ['безопасность', ['промышленная безопасность', 'транспортная безопасность', 'безопасность строительства']],
  ['транспорт', ['транспортная безопасность', 'безопасность дорожного движения', 'диспетчер автомобильного транспорта']],
  ['медицина', ['медико-социальная экспертиза', 'ветеринарно-санитарная экспертиза']],
  ['животные', ['ветеринария', 'зоопсихология', 'кинология', 'зоолог']],
  ['агроном', ['агрономия', 'сельское хозяйство', 'фермерское хозяйство']],
  ['культура', ['культура и искусство', 'режиссура кино и телевидение', 'музыка']],
  ['документ', ['диплом', 'профессиональная переподготовка', 'дпп']],
  ['диплом', ['профессиональная переподготовка', 'дпп', 'присвоение квалификации']],
  ['новая профессия', ['профессиональная переподготовка', 'диплом', 'квалификация']],
  ['сменить профессию', ['профессиональная переподготовка', 'новая квалификация', 'диплом']]
]);

function tokenize(value: string): ReadonlyArray<string> {
  const normalized = normalizeText(value);
  return normalized.length === 0 ? [] : normalized.split(' ').filter((token) => token.length > 1);
}

function expandQuery(query: string): ReadonlyArray<string> {
  const normalizedQuery = normalizeText(query);
  const tokenSet = new Set<string>(tokenize(normalizedQuery));
  semanticDictionary.forEach((expansions, key) => {
    const keyTokens = tokenize(key);
    const matched = normalizedQuery.includes(key) || keyTokens.some((token) => tokenSet.has(token));
    if (matched) {
      expansions.forEach((expansion) => {
        tokenSet.add(normalizeText(expansion));
        tokenize(expansion).forEach((token) => tokenSet.add(token));
      });
    }
  });
  return [...tokenSet];
}

function haystack(service: Service): string {
  return normalizeText([
    service.title,
    service.category,
    service.headline,
    service.shortDescription,
    service.fullDescription,
    service.duration,
    service.documentType,
    service.documentDescription,
    ...service.formats,
    ...service.programModules,
    ...service.suitableFor,
    ...service.includes,
    ...service.benefits,
    ...service.keywords,
    ...service.synonyms
  ].join(' '));
}

export function searchServices(source: ReadonlyArray<Service>, query: string, limit = 8): ReadonlyArray<SearchResult> {
  const normalizedQuery = normalizeText(query);
  if (normalizedQuery.length === 0) {
    return [...source]
      .sort((left, right) => right.popularity - left.popularity)
      .slice(0, limit)
      .map((service) => ({ service, score: service.popularity / 100, matchedTerms: [] }));
  }

  const expanded = expandQuery(query);
  return source
    .map((service) => {
      const text = haystack(service);
      const title = normalizeText(service.title);
      const category = normalizeText(service.category);
      const matchedTerms: string[] = [];
      let score = 0;

      if (title.includes(normalizedQuery)) {
        score += 90;
        matchedTerms.push(normalizedQuery);
      }
      if (text.includes(normalizedQuery)) {
        score += 45;
        matchedTerms.push(normalizedQuery);
      }
      expanded.forEach((term) => {
        if (term.length < 2) return;
        if (title.includes(term)) {
          score += 26;
          matchedTerms.push(term);
        } else if (category.includes(term)) {
          score += 20;
          matchedTerms.push(term);
        } else if (text.includes(term)) {
          score += 10;
          matchedTerms.push(term);
        }
      });
      score += service.popularity / 20;
      return { service, score, matchedTerms: [...new Set(matchedTerms)].slice(0, 5) };
    })
    .filter((result) => result.score >= 10)
    .sort((left, right) => right.score - left.score)
    .slice(0, limit);
}

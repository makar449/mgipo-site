import { z } from 'zod';

export const categories = ["Агрономия", "Архитектура", "Бухгалтерское дело", "Ветеринария", "Государственное и муниципальное управление", "Горное дело", "Гуманитарные науки", "Дизайн", "Журналистика", "Землеустройство и кадастр", "Информационные технологии", "Инженерные изыскания", "Инженерные системы", "Кадровое делопроизводство", "Культура и искусство", "Маркетинг", "Менеджмент", "Металлургия", "Метрологический контроль", "Закупки и контрактная система", "Нефтегазовое дело", "Оценочная деятельность", "Пищевая промышленность", "Подъемные сооружения", "Проектирование", "Промышленная безопасность", "Разные отрасли", "Ракетно-космическая промышленность", "Режиссура кино и телевидение", "Реставрация", "Ритуальные услуги", "Связь и телекоммуникации", "Социальное обслуживание", "Строительство", "Торговля и товароведение", "Транспортная безопасность", "Холодильное оборудование", "Экономика и финансы", "Энергетика", "Юриспруденция"] as const;
export const categorySchema = z.enum(categories);
export const trainingFormatSchema = z.enum(['Онлайн', 'Очно', 'Дистанционно', 'Смешанный']);
export const documentTypeSchema = z.enum(['Удостоверение', 'Сертификат', 'Диплом', 'Протокол проверки знаний']);

export const serviceVariantSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  hours: z.number().int().positive(),
  format: trainingFormatSchema,
  price: z.number().int().nonnegative(),
  paymentLabel: z.string().min(1)
});

export const faqSchema = z.object({ question: z.string().min(1), answer: z.string().min(1) });

export const serviceSchema = z.object({
  id: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  category: categorySchema,
  headline: z.string().min(1),
  shortDescription: z.string().min(1),
  fullDescription: z.string().min(1),
  minPrice: z.number().int().nonnegative(),
  maxPrice: z.number().int().nonnegative(),
  duration: z.string().min(1),
  formats: z.array(trainingFormatSchema).min(1),
  documentType: documentTypeSchema,
  documentDescription: z.string().min(1),
  programModules: z.array(z.string().min(1)).min(3),
  suitableFor: z.array(z.string().min(1)).min(2),
  includes: z.array(z.string().min(1)).min(2),
  benefits: z.array(z.string().min(1)).min(2),
  keywords: z.array(z.string().min(1)).min(1),
  synonyms: z.array(z.string().min(1)).min(1),
  popularity: z.number().int().min(0).max(100),
  isNew: z.boolean(),
  status: z.enum(['active', 'hidden']),
  variants: z.array(serviceVariantSchema).min(1),
  faq: z.array(faqSchema).min(3),
  accent: z.enum(['cyan', 'blue', 'green', 'orange', 'violet', 'gold']),
  sourceDocumentHref: z.string().min(1),
  sourceDocumentLabel: z.string().min(1)
});

export type Service = z.infer<typeof serviceSchema>;
export type ServiceVariant = z.infer<typeof serviceVariantSchema>;
export type ServiceCategory = z.infer<typeof categorySchema>;
export type TrainingFormat = z.infer<typeof trainingFormatSchema>;
export type DocumentType = z.infer<typeof documentTypeSchema>;
export const trainingFormats = trainingFormatSchema.options;
export const documentTypes = documentTypeSchema.options;

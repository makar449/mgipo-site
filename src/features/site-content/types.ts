import { z } from 'zod';

export const siteContentInputSchema = z.object({
  heroEyebrow: z.string().trim().min(6, 'Укажите верхнюю подпись').max(140, 'Подпись слишком длинная'),
  heroTitle: z.string().trim().min(12, 'Укажите заголовок главного экрана').max(140, 'Заголовок слишком длинный'),
  heroDescription: z.string().trim().min(40, 'Описание должно быть подробнее').max(720, 'Описание слишком длинное'),
  organizationTitle: z.string().trim().min(8, 'Укажите заголовок блока организаций').max(140, 'Заголовок слишком длинный'),
  organizationDescription: z.string().trim().min(40, 'Описание должно быть подробнее').max(720, 'Описание слишком длинное')
});

export const siteContentUpdateSchema = z.object({
  mode: z.enum(['draft', 'publish']),
  content: siteContentInputSchema
});

export type SiteContentInput = z.input<typeof siteContentInputSchema>;
export type SiteContentPayload = z.output<typeof siteContentInputSchema>;

export type SiteContentView = SiteContentPayload & {
  draft: SiteContentPayload;
  updatedAt: string | null;
  lastPublishedAt: string | null;
};

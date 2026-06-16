import { z } from 'zod';

export const contactMethodSchema = z.enum(['phone', 'email']);

export const leadInputSchema = z.object({
  name: z.string().trim().min(2, 'Введите ФИО или имя').max(100, 'Имя слишком длинное'),
  phone: z.string().trim().min(7, 'Введите телефон').max(30, 'Телефон слишком длинный').regex(/^[+()\-\s0-9]+$/, 'Телефон указан некорректно'),
  email: z.string().trim().email('Введите корректный email').max(120, 'Email слишком длинный').or(z.literal('')).transform((value) => (value === '' ? undefined : value)),
  serviceId: z.string().trim().min(1, 'Выберите услугу'),
  preferredContact: contactMethodSchema.default('phone'),
  consentAccepted: z.boolean().refine((value) => value, 'Подтвердите согласие на обработку персональных данных'),
  comment: z.string().trim().max(1200, 'Комментарий слишком длинный').or(z.literal('')).transform((value) => (value === '' ? undefined : value)),
  source: z.string().trim().max(80).optional().default('website')
});

export const leadStatusSchema = z.enum(['NEW', 'IN_PROGRESS', 'PROCESSED', 'REJECTED']);
export const leadPrioritySchema = z.enum(['LOW', 'NORMAL', 'HIGH']);

export const updateLeadStatusSchema = z.object({
  status: leadStatusSchema,
  priority: leadPrioritySchema.optional(),
  managerNote: z.string().trim().max(1200).optional()
});

export type LeadInput = z.input<typeof leadInputSchema>;
export type LeadPayload = z.output<typeof leadInputSchema>;
export type LeadStatus = z.infer<typeof leadStatusSchema>;
export type LeadPriority = z.infer<typeof leadPrioritySchema>;
export type ContactMethod = z.infer<typeof contactMethodSchema>;

export const leadStatusLabels: Record<LeadStatus, string> = {
  NEW: 'Новая',
  IN_PROGRESS: 'В работе',
  PROCESSED: 'Обработана',
  REJECTED: 'Отклонена'
};

export const leadPriorityLabels: Record<LeadPriority, string> = {
  LOW: 'Низкий',
  NORMAL: 'Обычный',
  HIGH: 'Высокий'
};

export const contactMethodLabels: Record<ContactMethod, string> = {
  phone: 'Позвонить',
  email: 'Написать на email'
};

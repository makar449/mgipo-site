export const DEMO_CONTENT_STORAGE_KEY = 'mgipo_demo_content_v2_40_programs';
export const DEMO_SESSION_STORAGE_KEY = 'mgipo_demo_admin_session_v1';

export type DemoContent = {
  heroEyebrow: string;
  heroLine1: string;
  heroLine2: string;
  heroLine3: string;
  heroDescription: string;
  primaryButton: string;
  secondaryButton: string;
  phone: string;
  email: string;
  address: string;
  workHours: string;
  footerDescription: string;
  noticeTitle: string;
  noticeText: string;
  updatedAt: string;
};

export const defaultDemoContent: DemoContent = {
  heroEyebrow: 'МГИПО — традиции, качество, результат',
  heroLine1: 'Профессиональное',
  heroLine2: 'развитие',
  heroLine3: 'управления',
  heroDescription: 'Дополнительное профессиональное образование для руководителей, специалистов и команд, которые создают эффективность и развивают будущее.',
  primaryButton: 'Выбрать программу',
  secondaryButton: 'Смотреть видео о институте',
  phone: '+7 (495) 120-00-01',
  email: 'info@mgipo.ru',
  address: 'Россия, Москва',
  workHours: 'ПН–ПТ: 09:00–18:00',
  footerDescription: 'Институт профессионального развития для руководителей, организаций и государственных структур. Строгий формат взаимодействия, официальные документы и персональное сопровождение заявки.',
  noticeTitle: 'Демо-админка подключена',
  noticeText: 'Для презентации заказчику изменения сохраняются в браузере и сразу видны на публичной части этого же устройства. После подключения Supabase эти правки будут сохраняться в общей базе и появляться у всех пользователей.',
  updatedAt: ''
};

export function normalizeDemoContent(value: Partial<DemoContent> | null | undefined): DemoContent {
  return {
    ...defaultDemoContent,
    ...(value ?? {}),
    updatedAt: value?.updatedAt ?? defaultDemoContent.updatedAt
  };
}

export const company = {
  name: process.env.NEXT_PUBLIC_COMPANY_NAME ?? 'Институт профессионального развития',
  shortName: 'МГИПО',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  phone: '+7 (495) 120-00-01',
  email: 'info@mgipo.ru',
  address: 'Россия, Москва',
  workHours: 'Пн–Пт: 09:00–18:00',
  license: 'Реквизиты лицензии и правовые документы управляются через административную панель',
  requisites: {
    legalName: 'Реквизиты юридического лица управляются через административную панель',
    inn: 'Данные вносятся владельцем сайта',
    ogrn: 'Данные вносятся владельцем сайта',
    kpp: 'Данные вносятся владельцем сайта',
    bank: 'Данные вносятся владельцем сайта',
    bik: 'Данные вносятся владельцем сайта',
    account: 'Данные вносятся владельцем сайта',
    correspondentAccount: 'Данные вносятся владельцем сайта'
  }
} as const;

export const navigation = [
  { href: '/', label: 'Главная' },
  { href: '/about', label: 'О компании' },
  { href: '/services', label: 'Программы' },
  { href: '/corporate', label: 'Организациям' },
  { href: '/documents', label: 'Документы' },
  { href: '/contacts', label: 'Контакты' }
] as const;

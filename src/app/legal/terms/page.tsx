import { LegalDocumentPage } from '@/components/legal-document-page';
import { createMetadata } from '@/lib/metadata';

export const metadata = createMetadata({ title: 'Договор оферты', description: 'Условия оказания образовательных услуг и взаимодействия с пользователем.', path: '/legal/terms' });

const paragraphs = [
  'Договор оферты описывает общие условия оказания образовательных услуг, порядок записи, оплаты, прохождения обучения и получения документов.',
  'Конкретные условия программы, стоимость, длительность, формат и итоговый документ уточняются до начала обучения.',
  'Отправка заявки не является оплатой услуги и не создаёт обязательств до согласования условий с менеджером.',
  'Для организаций условия обучения могут оформляться отдельным договором с учетом количества слушателей и выбранных программ.'
] as const;

export default function TermsPage() {
  return <LegalDocumentPage title="Договор оферты" currentLabel="Договор оферты" paragraphs={paragraphs} variant="terms" />;
}

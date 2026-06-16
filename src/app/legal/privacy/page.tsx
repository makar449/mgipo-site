import { LegalDocumentPage } from '@/components/legal-document-page';
import { createMetadata } from '@/lib/metadata';

export const metadata = createMetadata({ title: 'Политика конфиденциальности', description: 'Политика конфиденциальности сайта образовательного центра.', path: '/legal/privacy' });

const paragraphs = [
  'Сайт обрабатывает данные, которые пользователь указывает в формах: имя, телефон, email, выбранную программу, способ связи и комментарий.',
  'Данные используются для связи с пользователем, подбора программы обучения, расчёта условий, подготовки документов и обработки заявки.',
  'Доступ к заявкам предоставляется только уполномоченным сотрудникам, которые занимаются консультацией и сопровождением обучения.',
  'Пользователь может запросить уточнение, исправление или удаление своих данных, направив обращение на контактный email компании.'
] as const;

export default function PrivacyPage() {
  return <LegalDocumentPage title="Политика конфиденциальности" currentLabel="Политика конфиденциальности" paragraphs={paragraphs} variant="privacy" />;
}

import { MessageCircle, Phone } from 'lucide-react';
import { normalizeInternalHref } from '@/lib/routes';

type FloatingContactProps = {
  phone: string;
};

export function FloatingContact({ phone }: FloatingContactProps) {
  return (
    <div className="fixed bottom-5 right-5 z-40 hidden flex-col gap-3 md:flex">
      <a href={`tel:${phone.replace(/[^+0-9]/g, '')}`} className="focus-ring group flex h-12 w-12 items-center justify-center rounded-[1rem] border border-slate-200 bg-white text-slate-950 shadow-executive transition hover:border-blue-300 hover:bg-blue-50" aria-label="Позвонить">
        <Phone className="h-5 w-5 text-blue-700 transition group-hover:scale-110" />
      </a>
      <a href={normalizeInternalHref('/contacts#lead-form')} className="focus-ring group flex h-12 w-12 items-center justify-center rounded-[1rem] border border-blue-700 bg-blue-700 text-white shadow-cobalt transition hover:bg-blue-800" aria-label="Запросить консультацию">
        <MessageCircle className="h-5 w-5 transition group-hover:scale-110" />
      </a>
    </div>
  );
}

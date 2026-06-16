'use client';

import { services } from '@/features/services/data';
import { Button } from '@/components/ui/button';
import { useProgramStorage } from '@/components/use-program-storage';
import { formatPrice } from '@/lib/format';

export function CompareClient() {
  const { compareIds, clearCompare } = useProgramStorage();
  const compared = services.filter((service) => compareIds.includes(service.id));
  if (compared.length === 0) {
    return (
      <div className="glass luxury-border rounded-[2rem] p-8 text-center">
        <h1 className="text-4xl font-black text-slate-950">Сравнение пустое</h1>
        <p className="mx-auto mt-4 max-w-xl text-slate-600">Нажмите кнопку сравнения на карточках программ, чтобы увидеть разницу по цене, документу, срокам и формату.</p>
        <Button href="/services" className="mt-7">Выбрать программы</Button>
      </div>
    );
  }
  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-sm font-bold uppercase tracking-[0.22em] text-blue-700">Сравнение</p><h1 className="mt-2 text-4xl font-black text-slate-950">Сравнение программ</h1></div>
        <Button type="button" variant="secondary" onClick={clearCompare}>Очистить сравнение</Button>
      </div>
      <div className="overflow-x-auto rounded-[2rem] border border-slate-200">
        <table className="min-w-[760px] w-full border-collapse bg-white text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-950">
              <th className="p-4">Параметр</th>
              {compared.map((service) => <th key={service.id} className="p-4">{service.title}</th>)}
            </tr>
          </thead>
          <tbody className="text-slate-600">
            <CompareRow label="Цена" values={compared.map((service) => `от ${formatPrice(service.minPrice)}`)} />
            <CompareRow label="Длительность" values={compared.map((service) => service.duration)} />
            <CompareRow label="Формат" values={compared.map((service) => service.formats.join(', '))} />
            <CompareRow label="Документ" values={compared.map((service) => service.documentType)} />
            <CompareRow label="Кому подходит" values={compared.map((service) => service.suitableFor.slice(0, 3).join(', '))} />
            <tr className="border-t border-slate-200">
              <td className="p-4 font-black text-slate-950">Действие</td>
              {compared.map((service) => <td key={service.id} className="p-4"><Button href={`/services/${service.slug}`} size="sm">Подробнее</Button></td>)}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CompareRow({ label, values }: { label: string; values: ReadonlyArray<string> }) {
  return <tr className="border-b border-slate-200"><td className="p-4 font-black text-slate-950">{label}</td>{values.map((value, index) => <td key={`${label}-${index}`} className="p-4">{value}</td>)}</tr>;
}

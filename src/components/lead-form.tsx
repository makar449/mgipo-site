'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Send, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useForm, useWatch } from 'react-hook-form';
import { useState } from 'react';
import { leadInputSchema, type LeadInput } from '@/features/leads/types';
import type { Service } from '@/features/services/types';
import { ProgramPicker } from '@/components/program-picker';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import { normalizeInternalHref } from '@/lib/routes';

type LeadFormProps = {
  serviceId?: string;
  compact?: boolean;
  source?: string;
  services: ReadonlyArray<Service>;
};

type SubmitState = { kind: 'idle' | 'loading' | 'success' | 'error'; message: string };

export function LeadForm({ serviceId = '', compact = false, source = 'website-form', services }: LeadFormProps) {
  const isStaticPublicMode = process.env.NEXT_PUBLIC_STATIC_EXPORT === 'true' || (typeof window !== 'undefined' && window.location.hostname.endsWith('github.io'));
  const [state, setState] = useState<SubmitState>({ kind: 'idle', message: '' });
  const form = useForm<LeadInput>({
    resolver: zodResolver(leadInputSchema),
    defaultValues: { name: '', phone: '', email: '', serviceId, preferredContact: 'phone', consentAccepted: true, comment: '', source }
  });

  const selectedServiceId = useWatch({ control: form.control, name: 'serviceId' }) ?? ''; 

  async function onSubmit(values: LeadInput): Promise<void> {
    if (isStaticPublicMode) {
      form.reset({ name: '', phone: '', email: '', serviceId, preferredContact: 'phone', consentAccepted: true, comment: '', source });
      setState({ kind: 'success', message: 'Заявка принята в презентационном режиме. После подключения Supabase она будет сохраняться в общей базе.' });
      return;
    }

    setState({ kind: 'loading', message: 'Отправляем запрос...' });
    const response = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values)
    });
    const payload: unknown = await response.json().catch(() => null);
    if (!response.ok) {
      const message = payload !== null && typeof payload === 'object' && 'error' in payload ? String((payload as { error?: { message?: string } }).error?.message ?? 'Не удалось отправить запрос.') : 'Не удалось отправить запрос.';
      setState({ kind: 'error', message });
      return;
    }
    form.reset({ name: '', phone: '', email: '', serviceId, preferredContact: 'phone', consentAccepted: true, comment: '', source });
    setState({ kind: 'success', message: 'Заявка принята и уже доступна в админ-панели сайта. Менеджер увидит ФИО, телефон, email, тему и суть запроса.' });
  }

  const fieldClass = 'focus-ring min-h-[3.25rem] rounded-[1rem] border border-slate-200 bg-white px-4 py-3 text-base font-semibold leading-6 text-slate-950 outline-none placeholder:text-slate-500 transition hover:border-blue-200';

  return (
    <form id="lead-form" onSubmit={form.handleSubmit(onSubmit)} className={cn('executive-panel luxury-border allow-overflow rounded-[1.6rem] p-5 sm:p-6', compact ? 'bg-white' : '')} noValidate>
      <div className="flex items-start gap-3">
        <span className="rounded-[1rem] border border-blue-200 bg-blue-50 p-3 text-blue-800"><ShieldCheck className="h-5 w-5" /></span>
        <div className="min-w-0">
          <p className="institutional-kicker text-[10px]">Конфиденциальный запрос</p>
          <h2 className="mt-2 font-serif text-2xl font-bold text-slate-950">Запросить консультацию</h2>
          <p className="mt-2 text-base leading-7 text-slate-600">Заявка сразу попадёт в закрытую панель сайта. Менеджер увидит контактные данные, выбранную программу и суть запроса.</p>
        </div>
      </div>
      <div className="mt-6 grid gap-5">
        <div className="grid gap-2">
          <label htmlFor="lead-name" className="text-[0.82rem] font-black uppercase tracking-[0.16em] text-slate-600">ФИО / имя</label>
          <input id="lead-name" {...form.register('name')} className={fieldClass} placeholder="Введите ФИО или имя" />
          {form.formState.errors.name ? <p className="text-xs font-semibold text-red-700">{form.formState.errors.name.message}</p> : null}
        </div>
        <div className="grid gap-2">
          <label htmlFor="lead-phone" className="text-[0.82rem] font-black uppercase tracking-[0.16em] text-slate-600">Телефон</label>
          <input id="lead-phone" {...form.register('phone')} className={fieldClass} placeholder="+7 (___) ___-__-__" />
          {form.formState.errors.phone ? <p className="text-xs font-semibold text-red-700">{form.formState.errors.phone.message}</p> : null}
        </div>
        <div className="grid gap-2">
          <label htmlFor="lead-email" className="text-[0.82rem] font-black uppercase tracking-[0.16em] text-slate-600">Email</label>
          <input id="lead-email" {...form.register('email')} className={fieldClass} placeholder="example@mail.ru" />
          {form.formState.errors.email ? <p className="text-xs font-semibold text-red-700">{form.formState.errors.email.message}</p> : null}
        </div>
        <div className="grid gap-2">
          <label htmlFor="lead-service-picker" className="text-[0.82rem] font-black uppercase tracking-[0.16em] text-slate-600">Программа</label>
          <input type="hidden" {...form.register('serviceId')} />
          <div id="lead-service-picker">
            {form.formState.errors.serviceId?.message === undefined ? (
              <ProgramPicker value={selectedServiceId} services={services} onChange={(nextValue) => void form.setValue('serviceId', nextValue, { shouldTouch: true, shouldDirty: true, shouldValidate: true })} />
            ) : (
              <ProgramPicker value={selectedServiceId} services={services} onChange={(nextValue) => void form.setValue('serviceId', nextValue, { shouldTouch: true, shouldDirty: true, shouldValidate: true })} error={form.formState.errors.serviceId.message} />
            )}
          </div>
          {form.formState.errors.serviceId ? <p className="text-xs font-semibold text-red-700">{form.formState.errors.serviceId.message}</p> : null}
        </div>
        <div className="grid gap-2">
          <label htmlFor="lead-contact" className="text-[0.82rem] font-black uppercase tracking-[0.16em] text-slate-600">Предпочтительный способ связи</label>
          <select id="lead-contact" {...form.register('preferredContact')} className={fieldClass}>
            <option value="phone">Позвонить</option>
            <option value="email">Написать на email</option>
          </select>
        </div>
        <div className="grid gap-2">
          <label htmlFor="lead-comment" className="text-[0.82rem] font-black uppercase tracking-[0.16em] text-slate-600">Комментарий</label>
          <textarea id="lead-comment" {...form.register('comment')} className={cn(fieldClass, 'min-h-28 py-4')} placeholder="Кратко опишите задачу, тему обращения, должность или количество слушателей" />
          {form.formState.errors.comment ? <p className="text-xs font-semibold text-red-700">{form.formState.errors.comment.message}</p> : null}
        </div>
      </div>
      <label className="mt-5 flex items-start gap-3 rounded-[1rem] border border-slate-200 bg-slate-50 p-4 text-base leading-7 text-slate-600">
        <input type="checkbox" {...form.register('consentAccepted')} className="mt-1 h-4 w-4 rounded border-slate-200 bg-white accent-blue-700" />
        <span>Я согласен на обработку персональных данных и принимаю условия <Link href={normalizeInternalHref('/legal/consent')} className="font-bold text-blue-700 hover:text-blue-800">согласия</Link>.</span>
      </label>
      {form.formState.errors.consentAccepted ? <p className="mt-2 text-xs font-semibold text-red-700">{form.formState.errors.consentAccepted.message}</p> : null}
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" disabled={state.kind === 'loading'}>
          <Send className="h-4 w-4" /> {state.kind === 'loading' ? 'Отправляем...' : 'Отправить запрос'}
        </Button>
        <p className={cn('text-base font-semibold', state.kind === 'success' ? 'text-emerald-700' : state.kind === 'error' ? 'text-red-700' : 'text-slate-600')}>{state.message || 'Данные защищены и используются только для связи по заявке.'}</p>
      </div>
    </form>
  );
}

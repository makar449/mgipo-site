'use client';

import { useRouter } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { DEMO_SESSION_STORAGE_KEY } from '@/features/demo-admin/demo-content';
import { RoutePerformance } from '@/components/route-performance';

export function DemoAdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@mgipo.ru');
  const [password, setPassword] = useState('demo2026');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      router.prefetch('/admin/dashboard/');
      window.setTimeout(() => router.prefetch('/admin/services/'), 160);
      window.setTimeout(() => router.prefetch('/admin/leads/'), 320);
    }, 700);
    return () => window.clearTimeout(timeout);
  }, [router]);

  function submit(): void {
    if (email.trim().length < 3 || password.trim().length < 4) {
      setMessage('Введите email и пароль для входа.');
      return;
    }
    window.localStorage.setItem(DEMO_SESSION_STORAGE_KEY, JSON.stringify({ email: email.trim(), signedAt: new Date().toISOString() }));
    router.push('/admin/dashboard/');
  }

  return (
    <>
      <RoutePerformance scope="admin" />
      <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.12),transparent_34rem),linear-gradient(180deg,#f8fbff_0%,#eef4ff_100%)] px-4 py-12 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-xl rounded-[1.7rem] border border-blue-100 bg-white/95 p-7 shadow-institutional sm:p-9">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-700">
          <ShieldCheck className="h-7 w-7" />
        </div>
        <p className="mt-6 text-xs font-black uppercase tracking-[0.24em] text-blue-800">Административный доступ</p>
        <h1 className="mt-3 font-serif text-4xl font-bold leading-tight text-slate-950">Вход в панель управления</h1>
        <p className="mt-4 text-base leading-8 text-slate-600">Откройте панель управления сайтом, чтобы показать заказчику отдельные страницы: главная, программы, документы, заявки, SEO, пользователи и журнал действий.</p>

        <div className="mt-7 grid gap-4">
          <label className="grid gap-2">
            <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-600">Email</span>
            <input value={email} onChange={(event) => setEmail(event.target.value)} className="min-h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-950 outline-none transition focus:border-blue-400" />
          </label>
          <label className="grid gap-2">
            <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-600">Пароль</span>
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="min-h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-950 outline-none transition focus:border-blue-400" />
          </label>
        </div>

        {message ? <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">{message}</p> : null}

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Button type="button" onClick={submit}>Войти</Button>
          <Button href="/" variant="secondary">На сайт</Button>
        </div>
        <p className="mt-5 text-sm font-semibold leading-6 text-slate-500">Данные входа для показа: admin@mgipo.ru / demo2026.</p>
      </section>
      </main>
    </>
  );
}

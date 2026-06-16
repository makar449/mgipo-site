'use client';

import { useRouter } from 'next/navigation';
import { LockKeyhole } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type LoginState = { kind: 'idle' | 'loading' | 'error'; message: string };

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [state, setState] = useState<LoginState>({ kind: 'idle', message: '' });

  async function submit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setState({ kind: 'loading', message: 'Проверяем доступ...' });
    const response = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
    if (!response.ok) {
      const payload: unknown = await response.json().catch(() => null);
      const message = payload !== null && typeof payload === 'object' && 'error' in payload ? String((payload as { error?: { message?: string } }).error?.message ?? 'Не удалось войти.') : 'Не удалось войти.';
      setState({ kind: 'error', message });
      return;
    }
    router.push('/admin');
    router.refresh();
  }

  return (
    <Card className="mx-auto max-w-md">
      <LockKeyhole className="h-10 w-10 text-blue-700" />
      <h1 className="mt-5 text-3xl font-black text-slate-950">Вход администратора</h1>
      <p className="mt-3 text-sm leading-7 text-slate-600">Пароль проверяется только на сервере. После входа используется httpOnly-cookie.</p>
      <form onSubmit={submit} className="mt-6 grid gap-4">
        <div className="grid gap-2"><label htmlFor="admin-email" className="text-xs font-bold uppercase tracking-[0.18em] text-slate-600">Email</label><input id="admin-email" value={email} onChange={(event) => setEmail(event.target.value)} className="focus-ring min-h-12 rounded-2xl border border-slate-200 bg-white/90 px-4 text-slate-950 outline-none" placeholder="admin@example.com" /></div>
        <div className="grid gap-2"><label htmlFor="admin-password" className="text-xs font-bold uppercase tracking-[0.18em] text-slate-600">Пароль</label><input id="admin-password" value={password} onChange={(event) => setPassword(event.target.value)} type="password" className="focus-ring min-h-12 rounded-2xl border border-slate-200 bg-white/90 px-4 text-slate-950 outline-none" placeholder="••••••••" /></div>
        <Button type="submit" disabled={state.kind === 'loading'}>{state.kind === 'loading' ? 'Входим...' : 'Войти'}</Button>
        {state.message ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{state.message}</p> : null}
      </form>
    </Card>
  );
}

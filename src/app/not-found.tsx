import { SiteShell } from '@/components/site-shell';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <SiteShell>
      <section className="container-px mx-auto flex min-h-[62vh] max-w-7xl items-center justify-center py-24 text-center">
        <div className="glass luxury-border max-w-2xl rounded-[2.5rem] p-8 sm:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-700">404</p>
          <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">Страница не найдена</h1>
          <p className="mt-5 text-base leading-8 text-slate-600">Ссылка могла устареть. Перейдите в каталог программ или оставьте заявку — мы поможем подобрать направление.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/services">Перейти в каталог</Button>
            <Button href="/contacts#lead-form" variant="secondary">Оставить заявку</Button>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

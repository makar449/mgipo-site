import { BarChart3, BriefcaseBusiness, FileBadge2, Landmark, Scale, ShieldCheck, Users } from 'lucide-react';

const lowerFeatureGroups = [
  [
    { icon: BarChart3, label: 'Практика и кейсы', description: 'Реальные задачи и прикладные решения' },
    { icon: FileBadge2, label: 'Официальные документы', description: 'Комплект документов по итогам обучения' }
  ],
  [
    { icon: Users, label: 'Индивидуальный подбор', description: 'Программа под цели команды' },
    { icon: ShieldCheck, label: 'Конфиденциальность', description: 'Безопасная обработка обращения' }
  ]
] as const;

export function Hero3DScene() {
  return (
    <div className="hero-visual-shell hero-visual-clean hero-visual-animated pointer-events-none relative ml-auto w-full max-w-[900px] overflow-hidden rounded-[1.75rem] border border-blue-100 bg-gradient-to-br from-white via-slate-50 to-blue-50/95 p-4 shadow-institutional sm:rounded-[2rem] sm:p-5 lg:max-w-[900px] xl:max-w-[930px]" aria-label="Визуальный блок профессионального развития управления">
      <div className="hero-aura absolute inset-0 bg-[radial-gradient(circle_at_78%_30%,rgba(16,87,216,.16),transparent_33rem)]" aria-hidden="true" />
      <div className="hero-ring hero-ring-slow absolute -right-14 top-8 h-[22rem] w-[22rem] rounded-full border border-blue-200/70 opacity-60" aria-hidden="true" />
      <div className="hero-ring hero-ring-fast absolute -right-6 top-20 h-[17rem] w-[17rem] rounded-full border border-blue-200/50 opacity-70" aria-hidden="true" />
      <div className="hero-ground-glow absolute bottom-4 left-8 right-8 h-24 rounded-[50%] bg-blue-200/32 blur-2xl" aria-hidden="true" />
      <div className="absolute inset-x-6 bottom-4 h-8 rounded-[50%] border border-blue-100 bg-white/80" aria-hidden="true" />

      <div className="hero-clean-stage relative z-[2] flex min-h-0 flex-col gap-4 sm:gap-5">
        <div className="flex items-center justify-between gap-4">
          <div className="hero-chip-motion inline-flex items-center gap-2 rounded-[.85rem] border border-blue-100 bg-white px-3 py-2 text-sm font-black text-slate-950 shadow-executive">
            <Landmark className="h-4 w-4 text-blue-800" />
            Институт
          </div>
          <div className="hero-chip-motion hero-chip-delay inline-flex items-center gap-2 rounded-[.85rem] border border-blue-100 bg-white px-3 py-2 text-sm font-black text-slate-950 shadow-executive">
            <FileBadge2 className="h-4 w-4 text-blue-800" />
            Диплом
          </div>
        </div>

        <div className="hero-clean-top grid gap-4 lg:grid-cols-[minmax(0,1fr)_13.75rem] xl:grid-cols-[minmax(0,1fr)_14rem]">
          <div className="hero-card-motion relative min-w-0 overflow-hidden rounded-[1.45rem] border border-blue-100 bg-white/95 p-4 shadow-executive sm:p-5 lg:p-6">
            <div className="absolute left-4 top-1/2 hidden -translate-y-1/2 items-end gap-2 sm:flex" aria-hidden="true">
              <span className="block h-24 w-7 rounded-lg bg-blue-950/95" />
              <span className="block h-36 w-7 rounded-lg bg-blue-700" />
            </div>
            <div className="relative min-w-0 sm:pl-20">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-blue-800 sm:text-xs">Закрытый формат</p>
              <h3 className="mt-2 max-w-[25rem] font-serif text-[2rem] font-bold leading-[1.04] text-slate-950 sm:text-[2.45rem] lg:text-[2.75rem] xl:text-[2.95rem]">Профессиональное развитие управления</h3>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[1rem] border border-slate-200 bg-white p-3 shadow-sm">
                  <BriefcaseBusiness className="h-5 w-5 text-blue-800" />
                  <p className="mt-2 text-sm font-black text-slate-950">Руководителям</p>
                </div>
                <div className="rounded-[1rem] border border-slate-200 bg-white p-3 shadow-sm">
                  <ShieldCheck className="h-5 w-5 text-blue-800" />
                  <p className="mt-2 text-sm font-black text-slate-950">Официально</p>
                </div>
                <div className="rounded-[1rem] border border-slate-200 bg-white p-3 shadow-sm">
                  <BarChart3 className="h-5 w-5 text-blue-800" />
                  <p className="mt-2 text-sm font-black text-slate-950">Результат</p>
                </div>
              </div>
            </div>
            <div className="absolute bottom-3 left-4 inline-flex items-center gap-2 rounded-[.85rem] border border-blue-100 bg-white px-3 py-2 text-xs font-black text-slate-950 shadow-executive sm:left-5">
              <Users className="h-4 w-4 text-blue-800" />
              Команды
            </div>
          </div>

          <aside className="hero-document-card hero-card-motion hero-doc-motion rounded-[1.35rem] border border-blue-100 bg-white/96 p-4 shadow-institutional lg:p-5">
            <FileBadge2 className="h-8 w-8 text-blue-800" />
            <p className="mt-3 text-[10px] font-black uppercase tracking-[0.18em] text-blue-800">Документ</p>
            <p className="mt-2 font-serif text-[1.25rem] font-bold leading-tight text-slate-950">Диплом профессиональной переподготовки</p>
            <div className="mt-4 h-px bg-slate-200" />
            <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">256–1024 часа · от 10 000 ₽</p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-[.85rem] border border-blue-100 bg-blue-50/80 px-3 py-2 text-xs font-black text-blue-900">
              <Scale className="h-4 w-4" />
              Управление
            </div>
          </aside>
        </div>

        <div className="hero-clean-bottom grid gap-4 xl:grid-cols-[1fr_15rem_1fr] xl:items-stretch">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            {lowerFeatureGroups[0].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="hero-mini-card-motion rounded-[1.15rem] border border-blue-100 bg-white/88 p-4 shadow-executive backdrop-blur-xl">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[.9rem] border border-blue-100 bg-blue-50 text-blue-800"><Icon className="h-5 w-5" /></span>
                    <div>
                      <p className="text-sm font-black leading-tight text-blue-900">{item.label}</p>
                      <p className="mt-1 text-xs font-semibold leading-5 text-slate-600">{item.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="hero-architecture-core hero-core-motion relative min-h-[11rem] overflow-hidden rounded-[1.25rem] border border-blue-100 bg-gradient-to-br from-white/74 via-blue-50/82 to-white/90 shadow-executive">
            <div className="absolute inset-0 hero-network-lines opacity-70" />
            <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-200/80" />
            <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-300/55" />
            <svg className="absolute bottom-3 left-1/2 h-28 w-44 -translate-x-1/2 text-blue-700" viewBox="0 0 280 170" aria-hidden="true">
              <path d="M25 70 L140 18 L255 70" fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
              <path d="M44 78 H236" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              <path d="M55 144 H225" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              <path d="M69 86 V137 M105 86 V137 M140 86 V137 M176 86 V137 M211 86 V137" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
              <path d="M58 86 H222 M58 137 H222" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            {lowerFeatureGroups[1].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="hero-mini-card-motion rounded-[1.15rem] border border-blue-100 bg-white/88 p-4 shadow-executive backdrop-blur-xl">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[.9rem] border border-blue-100 bg-blue-50 text-blue-800"><Icon className="h-5 w-5" /></span>
                    <div>
                      <p className="text-sm font-black leading-tight text-blue-900">{item.label}</p>
                      <p className="mt-1 text-xs font-semibold leading-5 text-slate-600">{item.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

import Link from 'next/link';
import { Landmark } from 'lucide-react';
import type { CmsIdentity } from '@/features/admin-cms/types';

type LogoProps = {
  identity?: Pick<CmsIdentity, 'shortName' | 'descriptor'>;
};

export function Logo({ identity = { shortName: 'МГИПО', descriptor: 'Институт профессионального развития' } }: LogoProps) {
  return (
    <Link href="/" className="focus-ring group flex min-w-0 items-center gap-2 rounded-2xl sm:gap-3">
      <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-[0.8rem] border border-blue-200 bg-white shadow-executive sm:h-12 sm:w-12 sm:rounded-[0.9rem]">
        <span className="absolute inset-1 rounded-[0.65rem] border border-blue-100" />
        <span className="absolute bottom-1 left-1 right-1 h-px bg-gradient-to-r from-transparent via-blue-600/50 to-transparent" />
        <Landmark className="relative h-5 w-5 text-blue-800 sm:h-6 sm:w-6" />
      </span>
      <span className="leading-tight">
        <span className="block whitespace-nowrap font-serif text-base font-bold uppercase tracking-[0.12em] text-slate-950 sm:text-lg sm:tracking-[0.16em]">{identity.shortName}</span>
        <span className="hidden whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500 transition group-hover:text-blue-700 2xl:block">{identity.descriptor}</span>
      </span>
    </Link>
  );
}

import Link from 'next/link';
import { BookOpenCheck, Building2, Clock3, GraduationCap, Landmark, Mail, MapPin, Phone, Scale, ShieldCheck } from 'lucide-react';
import { Logo } from '@/components/logo';
import type { CmsContent, CmsIdentity } from '@/features/admin-cms/types';

const footerIcons = [Building2, GraduationCap, Scale, BookOpenCheck] as const;

type FooterProps = {
  identity: CmsIdentity;
  footer: CmsContent['footer'];
};

export function Footer({ identity, footer }: FooterProps) {
  return (
    <footer className="reference-footer relative overflow-hidden border-t border-blue-100 bg-white py-10 sm:py-12">
      <div className="absolute inset-0 footer-orbit-lines" aria-hidden="true" />
      <div className="container-px relative mx-auto max-w-[1560px]">
        <div className="grid gap-5 lg:grid-cols-[1.42fr_repeat(3,0.98fr)]">
          <section className="reference-footer-card reference-footer-brand rounded-[1.55rem] border border-blue-100 bg-white/94 p-6 shadow-institutional sm:p-8">
            <Logo identity={identity} />
            <p data-demo-text="footer-description" className="mt-7 max-w-[30rem] text-[1.08rem] font-medium leading-8 text-slate-600">{footer.description}</p>
            <div className="mt-7 h-px bg-slate-200" />
            <div className="mt-6 grid gap-4 text-[1.05rem] font-medium text-slate-600">
              <a data-demo-href="phone" href={`tel:${identity.phone.replace(/[^+0-9]/g, '')}`} className="flex items-center gap-4 transition hover:text-blue-700"><span className="flex h-9 w-9 items-center justify-center rounded-[0.85rem] border border-blue-100 bg-blue-50 text-blue-700"><Phone className="h-4 w-4" /></span><span data-demo-text="phone">{identity.phone}</span></a>
              <a data-demo-href="email" href={`mailto:${identity.email}`} className="flex items-center gap-4 transition hover:text-blue-700"><span className="flex h-9 w-9 items-center justify-center rounded-[0.85rem] border border-blue-100 bg-blue-50 text-blue-700"><Mail className="h-4 w-4" /></span><span data-demo-text="email">{identity.email}</span></a>
              <span className="flex items-center gap-4"><span className="flex h-9 w-9 items-center justify-center rounded-[0.85rem] border border-blue-100 bg-blue-50 text-blue-700"><MapPin className="h-4 w-4" /></span><span data-demo-text="address">{identity.address}</span></span>
            </div>
          </section>
          {footer.columns.filter((column) => column.visible).map((column, index) => {
            const Icon = footerIcons[index % footerIcons.length] ?? Landmark;
            return (
              <section key={column.id} className="reference-footer-card rounded-[1.55rem] border border-slate-200 bg-white/96 p-6 shadow-executive sm:p-7">
                <div className="flex h-14 w-14 items-center justify-center rounded-[1.05rem] border border-blue-100 bg-blue-50 text-blue-700"><Icon className="h-7 w-7" /></div>
                <h2 className="mt-5 max-w-[12rem] text-[1.05rem] font-black uppercase tracking-[0.17em] text-slate-950">{column.title}</h2>
                <div className="mt-4 h-[3px] w-14 rounded-full bg-blue-700" />
                <div className="mt-6 divide-y divide-slate-200">
                  {column.links.filter((link) => link.visible).map((link) => (
                    <Link key={`${column.id}-${link.href}-${link.label}`} href={link.href} prefetch={false} className="group flex items-center justify-between gap-3 py-3 text-[1.03rem] font-medium text-slate-600 transition hover:text-blue-700">
                      <span>{link.label}</span>
                      <span className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-700">›</span>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
        <div className="mt-6 flex flex-col gap-4 rounded-[1.25rem] border border-blue-100 bg-white/92 p-4 text-sm font-semibold uppercase tracking-[0.12em] text-slate-500 shadow-executive sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <span className="flex items-center gap-3"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[0.9rem] border border-blue-100 bg-blue-50 text-blue-700"><ShieldCheck className="h-5 w-5" /></span>{footer.copyright}</span>
          <span className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
            <span className="flex items-center gap-3"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[0.9rem] border border-blue-100 bg-blue-50 text-blue-700"><Clock3 className="h-5 w-5" /></span><span data-demo-text="work-hours">{identity.workHours}</span></span>
            <a href="https://www.agile-business-pro.com/" target="_blank" rel="noreferrer" className="agile-business-public-link inline-flex items-center justify-center rounded-full border border-sky-300 bg-sky-400 px-5 py-3 text-xs font-black uppercase tracking-[0.14em] text-[#ff1f1f] shadow-[0_14px_32px_rgba(56,189,248,.32)] transition hover:border-sky-400 hover:bg-sky-300 hover:text-[#ff0000] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-500">сделано Agile business</a>
          </span>
        </div>
      </div>
    </footer>
  );
}

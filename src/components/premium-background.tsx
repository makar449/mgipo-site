export function PremiumBackground() {
  return (
    <div aria-hidden="true" className="premium-background-layer pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="premium-background-blob absolute left-[-14rem] top-[-14rem] h-[30rem] w-[30rem] rounded-full bg-blue-50/95 blur-2xl" />
      <div className="premium-background-blob absolute right-[-18rem] top-[8rem] hidden h-[34rem] w-[34rem] rounded-full bg-sky-50/90 blur-2xl md:block" />
      <div className="premium-background-blob absolute bottom-[-20rem] left-[28%] hidden h-[34rem] w-[34rem] rounded-full bg-slate-50/95 blur-2xl lg:block" />
    </div>
  );
}

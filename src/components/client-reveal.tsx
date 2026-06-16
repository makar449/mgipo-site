import type { CSSProperties, ReactNode } from 'react';

export function ClientReveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const style: CSSProperties | undefined = delay > 0 ? { animationDelay: `${Math.min(delay, 0.24)}s` } : undefined;
  return <div className="min-w-0 content-stable reveal-motion" style={style}>{children}</div>;
}

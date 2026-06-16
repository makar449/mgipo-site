import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

export function Card({ className, children, ...props }: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div className={cn('executive-panel luxury-border rounded-[1.45rem] p-5 sm:p-6', className)} {...props}>
      {children}
    </div>
  );
}

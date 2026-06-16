import Link from 'next/link';
import type { MouseEventHandler, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { normalizeInternalHref } from '@/lib/routes';

type CommonProps = {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

type LinkButtonProps = CommonProps & {
  href: string;
  target?: string;
  rel?: string;
  download?: string | boolean;
  prefetch?: boolean;
  id?: string;
  title?: string;
  'aria-label'?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
};

type NativeButtonProps = CommonProps & {
  href?: undefined;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  id?: string;
  title?: string;
  name?: string;
  value?: string;
  'aria-label'?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

type ButtonProps = LinkButtonProps | NativeButtonProps;

const base = 'focus-ring group inline-flex min-w-0 items-center justify-center gap-2 rounded-[0.85rem] text-center font-black tracking-[0.02em] leading-tight transition duration-200 disabled:pointer-events-none disabled:opacity-45';
const variants = {
  primary: 'executive-shine border border-blue-700 bg-blue-700 text-white shadow-cobalt hover:bg-blue-800 hover:shadow-institutional',
  secondary: 'border border-blue-200 bg-white text-blue-800 shadow-executive hover:border-blue-500 hover:bg-blue-50',
  ghost: 'text-slate-700 hover:bg-blue-50 hover:text-blue-800',
  danger: 'border border-blue-200 bg-white text-blue-800 shadow-executive hover:border-blue-500 hover:bg-blue-50'
} as const;
const sizes = {
  sm: 'min-h-10 px-3.5 text-xs sm:px-4 sm:text-sm',
  md: 'min-h-11 px-4 text-sm sm:min-h-12 sm:px-5',
  lg: 'min-h-12 px-5 text-xs uppercase tracking-[0.1em] sm:min-h-14 sm:px-7 sm:text-sm'
} as const;

export function Button(props: ButtonProps) {
  const { children, variant = 'primary', size = 'md', className } = props;
  const classes = cn(base, variants[variant], sizes[size], className);

  if (typeof props.href === 'string') {
    const normalizedHref = normalizeInternalHref(props.href);
    const prefetch = props.prefetch ?? false;
    return (
      <Link
        href={normalizedHref}
        className={classes}
        {...(props.target === undefined ? {} : { target: props.target })}
        {...(props.rel === undefined ? {} : { rel: props.rel })}
        {...(prefetch === undefined ? {} : { prefetch })}
        {...(props.download === undefined ? {} : { download: props.download })}
        {...(props.id === undefined ? {} : { id: props.id })}
        {...(props.title === undefined ? {} : { title: props.title })}
        {...(props['aria-label'] === undefined ? {} : { 'aria-label': props['aria-label'] })}
        {...(props.onClick === undefined ? {} : { onClick: props.onClick })}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={props.type ?? 'button'}
      className={classes}
      {...(props.disabled === undefined ? {} : { disabled: props.disabled })}
      {...(props.id === undefined ? {} : { id: props.id })}
      {...(props.title === undefined ? {} : { title: props.title })}
      {...(props.name === undefined ? {} : { name: props.name })}
      {...(props.value === undefined ? {} : { value: props.value })}
      {...(props['aria-label'] === undefined ? {} : { 'aria-label': props['aria-label'] })}
      {...(props.onClick === undefined ? {} : { onClick: props.onClick })}
    >
      {children}
    </button>
  );
}

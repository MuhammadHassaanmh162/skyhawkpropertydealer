import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Spinner } from './Spinner';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'whatsapp';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  fullWidth?: boolean;
}

const variants: Record<Variant, string> = {
  primary:  'bg-ink text-white font-semibold hover:bg-ink-700 active:bg-ink-800',
  secondary:'border border-warm-border text-ink-600 hover:border-ink-900 hover:text-ink',
  ghost:    'text-ink-500 hover:text-ink hover:bg-warm',
  danger:   'bg-red-50 border border-red-200 text-red-600 hover:bg-red-100',
  whatsapp: 'bg-wa text-white font-semibold hover:bg-wa-600',
};

const sizes: Record<Size, string> = {
  sm: 'px-4 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-sm',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading, fullWidth, className, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={twMerge(
          clsx(
            'inline-flex items-center justify-center gap-2 rounded-xl transition-all duration-150 font-medium',
            variants[variant],
            sizes[size],
            fullWidth && 'w-full',
            (disabled || isLoading) && 'opacity-50 cursor-not-allowed',
            className
          )
        )}
        {...props}
      >
        {isLoading && <Spinner size="sm" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

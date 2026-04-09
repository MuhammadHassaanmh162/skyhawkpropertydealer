import { type InputHTMLAttributes, forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-ink">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={twMerge(
            clsx(
              'w-full bg-white border rounded-xl px-4 py-2.5 text-ink placeholder-ink-300 text-sm',
              'focus:outline-none focus:ring-2 transition-colors duration-150',
              error
                ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                : 'border-warm-border focus:border-ink-900 focus:ring-ink-900/10',
              className
            )
          )}
          {...props}
        />
        {error      && <p className="text-xs text-red-500">{error}</p>}
        {helperText && !error && <p className="text-xs text-ink-400">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

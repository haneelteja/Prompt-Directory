import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-[var(--color-text-muted)]">{label}</label>
      )}
      <input
        ref={ref}
        className={`w-full px-3 py-2 bg-[var(--color-bg-elevated)] border rounded-lg text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent ${
          error ? 'border-[var(--color-error)]' : 'border-[var(--color-border)]'
        } ${className}`}
        {...props}
      />
      {error && <span className="text-sm text-[var(--color-error)]">{error}</span>}
    </div>
  )
);

Input.displayName = 'Input';

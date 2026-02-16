import { TextareaHTMLAttributes, forwardRef } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', ...props }, ref) => (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-[var(--color-text-muted)]">{label}</label>
      )}
      <textarea
        ref={ref}
        className={`w-full px-3 py-2 bg-[var(--color-bg-elevated)] border rounded-lg text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent resize-y min-h-[120px] font-mono text-sm ${
          error ? 'border-[var(--color-error)]' : 'border-[var(--color-border)]'
        } ${className}`}
        {...props}
      />
      {error && <span className="text-sm text-[var(--color-error)]">{error}</span>}
    </div>
  )
);

Textarea.displayName = 'Textarea';

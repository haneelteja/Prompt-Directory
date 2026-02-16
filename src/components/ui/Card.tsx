import { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({ padding = 'md', className = '', children, ...props }: CardProps) {
  const paddingClass = {
    none: '',
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6',
  }[padding];

  return (
    <div
      className={`bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-[var(--radius-lg)] ${paddingClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

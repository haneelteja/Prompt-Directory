import type { PromptLayout } from '@/types';

interface PromptViewSwitcherProps {
  layout: PromptLayout;
  onChange: (layout: PromptLayout) => void;
}

const options: Array<{ value: PromptLayout; label: string }> = [
  { value: 'grid', label: 'Cards' },
  { value: 'list', label: 'List' },
  { value: 'table', label: 'Table' },
];

export function PromptViewSwitcher({ layout, onChange }: PromptViewSwitcherProps) {
  return (
    <div className="inline-flex items-center rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-1">
      {options.map((option) => {
        const active = option.value === layout;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              active
                ? 'bg-[var(--color-accent)] text-white'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-hover)]'
            }`}
            aria-pressed={active}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

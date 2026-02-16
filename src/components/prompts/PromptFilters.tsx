import { Input } from '@/components/ui/Input';
import type { Category, Tag } from '@/types';
import type { PromptFilters as FilterType } from '@/services/promptService';

interface PromptFiltersProps {
  filters: FilterType;
  onFiltersChange: (f: Partial<FilterType>) => void;
  categories: Category[];
  tags: Tag[];
}

export function PromptFilters({
  filters,
  onFiltersChange,
  categories,
  tags,
}: PromptFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
      <div className="flex-1 min-w-[200px]">
        <Input
          placeholder="Search prompts..."
          value={filters.search ?? ''}
          onChange={(e) => onFiltersChange({ search: e.target.value })}
        />
      </div>
      <div className="flex gap-2 flex-wrap">
        <select
          className="px-3 py-2 bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          value={filters.category_id ?? ''}
          onChange={(e) =>
            onFiltersChange({ category_id: e.target.value || null })
          }
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          className="px-3 py-2 bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          value={filters.tag_ids?.[0] ?? ''}
          onChange={(e) =>
            onFiltersChange({
              tag_ids: e.target.value ? [e.target.value] : undefined,
            })
          }
        >
          <option value="">All tags</option>
          {tags.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2 px-3 py-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.favorites_only ?? false}
            onChange={(e) =>
              onFiltersChange({ favorites_only: e.target.checked || undefined })
            }
            className="rounded border-[var(--color-border)] text-[var(--color-accent)] focus:ring-[var(--color-accent)]"
          />
          <span className="text-sm text-[var(--color-text-muted)]">Favorites only</span>
        </label>
      </div>
    </div>
  );
}

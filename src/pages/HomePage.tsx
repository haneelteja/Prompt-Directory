import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePrompts } from '@/hooks/usePrompts';
import { categoryService } from '@/services/categoryService';
import { tagService } from '@/services/tagService';
import type { Category, Tag } from '@/types';
import { PromptCard } from '@/components/prompts/PromptCard';
import { PromptFilters } from '@/components/prompts/PromptFilters';

export function HomePage() {
  const { prompts, loading, error, filters, updateFilters, refetch } = usePrompts();
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    Promise.all([categoryService.getAll(), tagService.getAll()]).then(
      ([cats, tgs]) => {
        setCategories(cats);
        setTags(tgs);
      }
    );
  }, []);

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-[var(--color-error)]">{error.message}</p>
        <p className="text-sm text-[var(--color-text-muted)] mt-2">
          Ensure Supabase is configured. Check .env for VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-text)] mb-2">
          Your Prompts
        </h1>
        <p className="text-[var(--color-text-muted)]">
          Store, organize, and reuse your favorite prompts.
        </p>
      </div>

      <div className="mb-6">
        <PromptFilters
          filters={filters}
          onFiltersChange={updateFilters}
          categories={categories}
          tags={tags}
        />
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-40 bg-[var(--color-bg-elevated)] rounded-[var(--radius-lg)] animate-pulse"
            />
          ))}
        </div>
      ) : prompts.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-[var(--color-border)] rounded-[var(--radius-lg)]">
          <p className="text-[var(--color-text-muted)] text-lg mb-2">
            No prompts yet
          </p>
          <p className="text-sm text-[var(--color-text-muted)] mb-4">
            Create your first prompt to get started.
          </p>
          <Link
            to="/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] transition-colors"
          >
            + New Prompt
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {prompts.map((prompt) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              onRefetch={refetch}
            />
          ))}
        </div>
      )}
    </div>
  );
}

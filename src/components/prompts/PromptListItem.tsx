import { Link } from 'react-router-dom';
import type { MouseEvent } from 'react';
import type { PromptWithRelations } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { usePromptMutations } from '@/store/usePromptMutations';

interface PromptListItemProps {
  prompt: PromptWithRelations;
  onRefetch?: () => void;
}

export function PromptListItem({ prompt, onRefetch }: PromptListItemProps) {
  const { copy, copied } = useCopyToClipboard();
  const { toggleFavorite, remove } = usePromptMutations(onRefetch);

  const handleCopy = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    copy(prompt.content);
  };

  const handleFavorite = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(prompt.id);
  };

  const handleDelete = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Delete this prompt?')) {
      remove(prompt.id);
    }
  };

  return (
    <Link to={`/prompt/${prompt.id}`}>
      <Card className="group hover:border-[var(--color-accent)]/50 transition-all cursor-pointer">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-[var(--color-text)] truncate">{prompt.title}</h3>
              {prompt.is_favorite && (
                <span className="px-2 py-0.5 rounded-full text-xs bg-amber-400/15 text-amber-300">
                  Favorite
                </span>
              )}
              {prompt.category && (
                <span className="px-2 py-0.5 rounded-full text-xs bg-[var(--color-accent)]/15 text-[var(--color-accent)]">
                  {prompt.category.name}
                </span>
              )}
            </div>

            {prompt.description && (
              <p className="mt-2 text-sm text-[var(--color-text-muted)] line-clamp-2">
                {prompt.description}
              </p>
            )}

            <p className="mt-2 text-sm text-[var(--color-text-muted)] font-mono line-clamp-2">
              {prompt.content.slice(0, 180)}
              {prompt.content.length > 180 ? '...' : ''}
            </p>

            {prompt.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {prompt.tags.slice(0, 5).map((tag) => (
                  <span
                    key={tag.id}
                    className="px-2 py-0.5 rounded text-xs bg-[var(--color-bg-hover)] text-[var(--color-text-muted)]"
                  >
                    {tag.name}
                  </span>
                ))}
                {prompt.tags.length > 5 && (
                  <span className="px-2 py-0.5 rounded text-xs bg-[var(--color-bg-hover)] text-[var(--color-text-muted)]">
                    +{prompt.tags.length - 5} more
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="sm" onClick={handleCopy}>
              {copied ? 'Copied' : 'Copy'}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleFavorite}>
              {prompt.is_favorite ? 'Unfavorite' : 'Favorite'}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Card>
    </Link>
  );
}

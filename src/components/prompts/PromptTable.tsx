import { Link } from 'react-router-dom';
import type { MouseEvent } from 'react';
import type { PromptWithRelations } from '@/types';
import { Button } from '@/components/ui/Button';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { usePromptMutations } from '@/store/usePromptMutations';

interface PromptTableProps {
  prompts: PromptWithRelations[];
  onRefetch?: () => void;
}

interface PromptTableRowProps {
  prompt: PromptWithRelations;
  onRefetch?: () => void;
}

function PromptTableRow({ prompt, onRefetch }: PromptTableRowProps) {
  const { copy, copied } = useCopyToClipboard();
  const { toggleFavorite, remove } = usePromptMutations(onRefetch);

  const stop = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleCopy = (e: MouseEvent) => {
    stop(e);
    copy(prompt.content);
  };

  const handleFavorite = (e: MouseEvent) => {
    stop(e);
    toggleFavorite(prompt.id);
  };

  const handleDelete = (e: MouseEvent) => {
    stop(e);
    if (window.confirm('Delete this prompt?')) {
      remove(prompt.id);
    }
  };

  return (
    <tr className="border-t border-[var(--color-border)] hover:bg-[var(--color-bg-hover)]/40 transition-colors">
      <td className="px-4 py-3">
        <Link to={`/prompt/${prompt.id}`} className="block">
          <div className="min-w-0">
            <p className="font-medium text-[var(--color-text)] truncate">{prompt.title}</p>
            {prompt.description && (
              <p className="text-xs text-[var(--color-text-muted)] mt-1 line-clamp-1">
                {prompt.description}
              </p>
            )}
          </div>
        </Link>
      </td>
      <td className="px-4 py-3 text-sm text-[var(--color-text-muted)]">
        {prompt.category?.name ?? 'Uncategorized'}
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-1 max-w-[220px]">
          {prompt.tags.length === 0 ? (
            <span className="text-sm text-[var(--color-text-muted)]">No tags</span>
          ) : (
            prompt.tags.slice(0, 3).map((tag) => (
              <span
                key={tag.id}
                className="px-2 py-0.5 rounded text-xs bg-[var(--color-bg-hover)] text-[var(--color-text-muted)]"
              >
                {tag.name}
              </span>
            ))
          )}
          {prompt.tags.length > 3 && (
            <span className="px-2 py-0.5 rounded text-xs bg-[var(--color-bg-hover)] text-[var(--color-text-muted)]">
              +{prompt.tags.length - 3}
            </span>
          )}
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-[var(--color-text-muted)]">
        {prompt.is_favorite ? 'Yes' : 'No'}
      </td>
      <td className="px-4 py-3 text-sm text-[var(--color-text-muted)]">
        {new Date(prompt.updated_at).toLocaleDateString()}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
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
      </td>
    </tr>
  );
}

export function PromptTable({ prompts, onRefetch }: PromptTableProps) {
  return (
    <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="text-left text-xs uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
            <th className="px-4 py-3 font-medium">Prompt</th>
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 font-medium">Tags</th>
            <th className="px-4 py-3 font-medium">Favorite</th>
            <th className="px-4 py-3 font-medium">Updated</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {prompts.map((prompt) => (
            <PromptTableRow key={prompt.id} prompt={prompt} onRefetch={onRefetch} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

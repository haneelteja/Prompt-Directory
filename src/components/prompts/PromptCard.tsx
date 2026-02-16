import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import type { PromptWithRelations } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { usePromptMutations } from '@/store/usePromptMutations';

interface PromptCardProps {
  prompt: PromptWithRelations;
  onRefetch?: () => void;
}

export function PromptCard({ prompt, onRefetch }: PromptCardProps) {
  const { copy, copied } = useCopyToClipboard();
  const { toggleFavorite, remove } = usePromptMutations(onRefetch);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    copy(prompt.content);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(prompt.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Delete this prompt?')) {
      remove(prompt.id);
    }
  };

  const preview = prompt.content.slice(0, 120) + (prompt.content.length > 120 ? '...' : '');

  return (
    <Link to={`/prompt/${prompt.id}`}>
      <Card className="group hover:border-[var(--color-accent)]/50 transition-all cursor-pointer">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-[var(--color-text)] truncate">{prompt.title}</h3>
              {prompt.is_favorite && (
                <span className="text-amber-400" title="Favorite">★</span>
              )}
            </div>
            {prompt.description && (
              <p className="text-sm text-[var(--color-text-muted)] mt-1 line-clamp-2">
                {prompt.description}
              </p>
            )}
            <div className="mt-2 text-sm text-[var(--color-text-muted)] font-mono line-clamp-2">
              <ReactMarkdown>{preview}</ReactMarkdown>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {prompt.category && (
                <span className="px-2 py-0.5 rounded text-xs bg-[var(--color-accent)]/20 text-[var(--color-accent)]">
                  {prompt.category.name}
                </span>
              )}
              {prompt.tags?.map((t) => (
                <span
                  key={t.id}
                  className="px-2 py-0.5 rounded text-xs bg-[var(--color-bg-hover)] text-[var(--color-text-muted)]"
                >
                  {t.name}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              title={copied ? 'Copied!' : 'Copy'}
            >
              {copied ? '✓' : '📋'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFavorite}
              title={prompt.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              {prompt.is_favorite ? '★' : '☆'}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDelete} title="Delete">
              🗑
            </Button>
          </div>
        </div>
      </Card>
    </Link>
  );
}

import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { usePrompt } from '@/hooks/usePrompt';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { usePromptMutations } from '@/store/usePromptMutations';
import { promptService } from '@/services/promptService';
import type { PromptVersion } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export function PromptDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { prompt, loading, error, refetch } = usePrompt(id ?? null);
  const { copy, copied } = useCopyToClipboard();
  const { toggleFavorite, remove } = usePromptMutations(refetch);
  const [versions, setVersions] = useState<PromptVersion[]>([]);
  const [showVersions, setShowVersions] = useState(false);

  useEffect(() => {
    if (id) {
      promptService.getVersions(id).then(setVersions);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-[var(--color-bg-elevated)] rounded w-1/3" />
          <div className="h-4 bg-[var(--color-bg-elevated)] rounded w-2/3" />
          <div className="h-32 bg-[var(--color-bg-elevated)] rounded" />
        </div>
      </div>
    );
  }

  if (error || !prompt) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-[var(--color-error)]">Prompt not found.</p>
        <Link to="/" className="text-[var(--color-accent)] mt-2 inline-block">
          ← Back to prompts
        </Link>
      </div>
    );
  }

  const handleCopy = () => copy(prompt.content);
  const handleFavorite = () => toggleFavorite(prompt.id);
  const handleDelete = () => {
    if (window.confirm('Delete this prompt? This cannot be undone.')) {
      remove(prompt.id);
      navigate('/');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        to="/"
        className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-accent)] mb-6 inline-block"
      >
        ← Back to prompts
      </Link>

      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">
            {prompt.title}
            {prompt.is_favorite && (
              <span className="ml-2 text-amber-400" title="Favorite">★</span>
            )}
          </h1>
          <div className="flex flex-wrap gap-2 mt-2">
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
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={handleCopy}
          >
            {copied ? 'Copied!' : 'Copy'}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleFavorite}>
            {prompt.is_favorite ? '★ Unfavorite' : '☆ Favorite'}
          </Button>
          <Link to={`/prompt/${prompt.id}/edit`}>
            <Button variant="secondary" size="sm">
              Edit
            </Button>
          </Link>
          <Button variant="danger" size="sm" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>

      {prompt.description && (
        <p className="text-[var(--color-text-muted)] mb-6">{prompt.description}</p>
      )}

      <Card className="mb-6">
        <div className="prose prose-invert prose-sm max-w-none font-mono text-sm whitespace-pre-wrap">
          <ReactMarkdown>{prompt.content}</ReactMarkdown>
        </div>
      </Card>

      {versions.length > 0 && (
        <div>
          <button
            onClick={() => setShowVersions(!showVersions)}
            className="text-sm text-[var(--color-accent)] hover:underline"
          >
            {showVersions ? 'Hide' : 'Show'} version history ({versions.length})
          </button>
          {showVersions && (
            <div className="mt-4 space-y-2">
              {versions.map((v) => (
                <Card key={v.id} padding="sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs text-[var(--color-text-muted)]">
                        v{v.version_number} · {new Date(v.created_at).toLocaleString()}
                      </span>
                      <p className="text-sm mt-1 line-clamp-2">{v.content.slice(0, 150)}...</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

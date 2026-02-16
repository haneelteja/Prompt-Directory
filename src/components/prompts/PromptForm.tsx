import { useState, FormEvent } from 'react';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import type { Category, Tag } from '@/types';
import type { CreatePromptInput } from '@/services/promptService';

interface PromptFormProps {
  categories: Category[];
  tags: Tag[];
  initial?: Partial<CreatePromptInput> & { id?: string };
  onSubmit: (data: CreatePromptInput) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
}

export function PromptForm({
  categories,
  tags,
  initial,
  onSubmit,
  onCancel,
  submitLabel = 'Create Prompt',
}: PromptFormProps) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [content, setContent] = useState(initial?.content ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [categoryId, setCategoryId] = useState(initial?.category_id ?? '');
  const [isFavorite, setIsFavorite] = useState(initial?.is_favorite ?? false);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(
    initial?.tag_ids ?? []
  );
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!title.trim()) err.title = 'Title is required';
    if (!content.trim()) err.content = 'Content is required';
    setErrors(err);
    if (Object.keys(err).length > 0) return;

    setLoading(true);
    try {
      await onSubmit({
        title: title.trim(),
        content: content.trim(),
        description: description.trim() || undefined,
        category_id: categoryId || null,
        is_favorite: isFavorite,
        tag_ids: selectedTagIds.length ? selectedTagIds : undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleTag = (id: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="e.g. Code Review Prompt"
        error={errors.title}
        autoFocus
      />
      <Textarea
        label="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Brief description of when to use this prompt"
      />
      <Textarea
        label="Prompt Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Enter your prompt. Use {{variable}} for placeholders."
        error={errors.content}
        className="min-h-[200px]"
      />
      <div>
        <label className="text-sm font-medium text-[var(--color-text-muted)] block mb-2">
          Category
        </label>
        <select
          className="w-full px-3 py-2 bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg text-[var(--color-text)]"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">None</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-sm font-medium text-[var(--color-text-muted)] block mb-2">
          Tags
        </label>
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => toggleTag(t.id)}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                selectedTagIds.includes(t.id)
                  ? 'bg-[var(--color-accent)] text-white'
                  : 'bg-[var(--color-bg-hover)] text-[var(--color-text-muted)] hover:bg-[var(--color-border)]'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={isFavorite}
          onChange={(e) => setIsFavorite(e.target.checked)}
          className="rounded border-[var(--color-border)] text-[var(--color-accent)]"
        />
        <span className="text-sm">Add to favorites</span>
      </label>
      <div className="flex gap-3 pt-4">
        <Button type="submit" loading={loading}>
          {submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

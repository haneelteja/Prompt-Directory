import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePrompt } from '@/hooks/usePrompt';
import { PromptForm } from '@/components/prompts/PromptForm';
import { usePromptMutations } from '@/store/usePromptMutations';
import { categoryService } from '@/services/categoryService';
import { tagService } from '@/services/tagService';
import type { Category, Tag } from '@/types';

export function EditPromptPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { prompt, loading, error } = usePrompt(id ?? null);
  const { update } = usePromptMutations();
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

  if (loading || !prompt) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="animate-pulse h-64 bg-[var(--color-bg-elevated)] rounded-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center text-[var(--color-error)]">
        Prompt not found.
      </div>
    );
  }

  const handleSubmit = async (data: Parameters<typeof update>[1]) => {
    if (!id) return;
    await update(id, data);
    navigate(`/prompt/${id}`);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-[var(--color-text)] mb-6">
        Edit Prompt
      </h1>
      <PromptForm
        categories={categories}
        tags={tags}
        initial={{
          title: prompt.title,
          content: prompt.content,
          description: prompt.description ?? undefined,
          category_id: prompt.category_id ?? undefined,
          is_favorite: prompt.is_favorite,
          tag_ids: prompt.tags?.map((t) => t.id),
        }}
        onSubmit={handleSubmit}
        onCancel={() => navigate(`/prompt/${id}`)}
        submitLabel="Save Changes"
      />
    </div>
  );
}

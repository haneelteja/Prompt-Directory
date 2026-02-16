import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PromptForm } from '@/components/prompts/PromptForm';
import { usePromptMutations } from '@/store/usePromptMutations';
import { categoryService } from '@/services/categoryService';
import { tagService } from '@/services/tagService';
import type { Category, Tag } from '@/types';

export function NewPromptPage() {
  const navigate = useNavigate();
  const { create } = usePromptMutations();
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

  const handleSubmit = async (data: Parameters<typeof create>[0]) => {
    const prompt = await create(data);
    if (prompt) navigate(`/prompt/${prompt.id}`);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-[var(--color-text)] mb-6">
        New Prompt
      </h1>
      <PromptForm
        categories={categories}
        tags={tags}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/')}
        submitLabel="Create Prompt"
      />
    </div>
  );
}

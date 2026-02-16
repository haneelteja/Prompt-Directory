/**
 * Prompt CRUD operations - Supabase integration layer
 */

import { supabase } from '@/lib/supabase';
import type { Prompt, PromptWithRelations, PromptVersion, Tag, Category } from '@/types';

export interface CreatePromptInput {
  title: string;
  content: string;
  description?: string;
  category_id?: string | null;
  is_favorite?: boolean;
  tag_ids?: string[];
}

export interface UpdatePromptInput {
  title?: string;
  content?: string;
  description?: string | null;
  category_id?: string | null;
  is_favorite?: boolean;
  tag_ids?: string[];
}

export interface PromptFilters {
  search?: string;
  category_id?: string | null;
  tag_ids?: string[];
  favorites_only?: boolean;
}

async function fetchPromptsWithRelations(prompts: Prompt[]): Promise<PromptWithRelations[]> {
  if (prompts.length === 0) return [];

  const categoryIds = [...new Set(prompts.map((p) => p.category_id).filter(Boolean))] as string[];
  const promptIds = prompts.map((p) => p.id);

  const [categoriesRes, tagsRes] = await Promise.all([
    categoryIds.length > 0
      ? supabase.from('categories').select('*').in('id', categoryIds)
      : { data: [] },
    supabase
      .from('prompt_tags')
      .select('prompt_id, tag_id, tags(id, name, slug, created_at)')
      .in('prompt_id', promptIds),
  ]);

  const categoryMap = new Map(
    (categoriesRes.data ?? []).map((c: Category) => [c.id, c])
  );
  const tagsByPrompt = new Map<string, Tag[]>();
  const tagRows = (tagsRes.data ?? []) as Array<{ prompt_id: string; tags: Tag | Tag[] | null }>;
  tagRows.forEach((row) => {
    const tagOrTags = row.tags;
    const tags = Array.isArray(tagOrTags) ? tagOrTags : tagOrTags ? [tagOrTags] : [];
    tags.forEach((tag) => {
      const existing = tagsByPrompt.get(row.prompt_id) ?? [];
      existing.push(tag);
      tagsByPrompt.set(row.prompt_id, existing);
    });
  });

  return prompts.map((p) => ({
    ...p,
    category: (p.category_id ? categoryMap.get(p.category_id) ?? null : null) as Category | null,
    tags: tagsByPrompt.get(p.id) ?? [],
  })) as PromptWithRelations[];
}

export const promptService = {
  async getAll(filters?: PromptFilters): Promise<PromptWithRelations[]> {
    let query = supabase
      .from('prompts')
      .select('*')
      .order('updated_at', { ascending: false });

    if (filters?.favorites_only) {
      query = query.eq('is_favorite', true);
    }
    if (filters?.category_id) {
      query = query.eq('category_id', filters.category_id);
    }
    if (filters?.tag_ids?.length) {
      const { data } = await supabase
        .from('prompt_tags')
        .select('prompt_id')
        .in('tag_id', filters.tag_ids);
      const promptIds = [...new Set((data ?? []).map((r) => r.prompt_id))];
      if (promptIds.length === 0) return [];
      query = query.in('id', promptIds);
    }
    if (filters?.search?.trim()) {
      const term = filters.search.trim();
      query = query.or(
        `title.ilike.%${term}%,content.ilike.%${term}%,description.ilike.%${term}%`
      );
    }

    const { data, error } = await query;
    if (error) throw error;
    return fetchPromptsWithRelations(data ?? []);
  },

  async getById(id: string): Promise<PromptWithRelations | null> {
    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .eq('id', id)
      .single();
    if (error || !data) return null;
    const [withRelations] = await fetchPromptsWithRelations([data]);
    return withRelations ?? null;
  },

  async create(input: CreatePromptInput): Promise<PromptWithRelations> {
    const { tag_ids, ...promptData } = input;
    const { data: prompt, error } = await supabase
      .from('prompts')
      .insert({
        title: promptData.title,
        content: promptData.content,
        description: promptData.description ?? null,
        category_id: promptData.category_id ?? null,
        is_favorite: promptData.is_favorite ?? false,
      })
      .select()
      .single();
    if (error) throw error;

    if (tag_ids?.length) {
      await supabase.from('prompt_tags').insert(
        tag_ids.map((tag_id) => ({ prompt_id: prompt.id, tag_id }))
      );
    }

    const [withRelations] = await fetchPromptsWithRelations([prompt]);
    return withRelations!;
  },

  async update(id: string, input: UpdatePromptInput): Promise<PromptWithRelations> {
    const { tag_ids, ...promptData } = input;
    const current = await this.getById(id);
    if (!current) throw new Error('Prompt not found');

    // Save version before updating (if content/title changed)
    const contentChanged =
      (promptData.content !== undefined && promptData.content !== current.content) ||
      (promptData.title !== undefined && promptData.title !== current.title);
    if (contentChanged) {
      await this.createVersion(current);
    }

    const updatePayload: Record<string, unknown> = {};
    if (promptData.title !== undefined) updatePayload.title = promptData.title;
    if (promptData.content !== undefined) updatePayload.content = promptData.content;
    if (promptData.description !== undefined) updatePayload.description = promptData.description;
    if (promptData.category_id !== undefined) updatePayload.category_id = promptData.category_id;
    if (promptData.is_favorite !== undefined) updatePayload.is_favorite = promptData.is_favorite;

    if (Object.keys(updatePayload).length > 0) {
      const { error } = await supabase
        .from('prompts')
        .update(updatePayload)
        .eq('id', id);
      if (error) throw error;
    }

    if (tag_ids !== undefined) {
      await supabase.from('prompt_tags').delete().eq('prompt_id', id);
      if (tag_ids.length > 0) {
        await supabase.from('prompt_tags').insert(
          tag_ids.map((tag_id) => ({ prompt_id: id, tag_id }))
        );
      }
    }

    const updated = await this.getById(id);
    if (!updated) throw new Error('Prompt not found after update');
    return updated;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('prompts').delete().eq('id', id);
    if (error) throw error;
  },

  async toggleFavorite(id: string): Promise<PromptWithRelations> {
    const prompt = await this.getById(id);
    if (!prompt) throw new Error('Prompt not found');
    return this.update(id, { is_favorite: !prompt.is_favorite });
  },

  async getVersions(promptId: string): Promise<PromptVersion[]> {
    const { data, error } = await supabase
      .from('prompt_versions')
      .select('*')
      .eq('prompt_id', promptId)
      .order('version_number', { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  async createVersion(prompt: Prompt): Promise<void> {
    const { count } = await supabase
      .from('prompt_versions')
      .select('*', { count: 'exact', head: true })
      .eq('prompt_id', prompt.id);
    const versionNumber = (count ?? 0) + 1;
    await supabase.from('prompt_versions').insert({
      prompt_id: prompt.id,
      version_number: versionNumber,
      title: prompt.title,
      content: prompt.content,
      description: prompt.description,
    });
  },
};

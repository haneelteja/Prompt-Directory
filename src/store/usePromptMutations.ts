/**
 * Prompt mutations - Create, update, delete with toast feedback
 */

import { useCallback } from 'react';
import { promptService, type CreatePromptInput, type UpdatePromptInput } from '@/services/promptService';
import { useToastStore } from './useToastStore';

export function usePromptMutations(onSuccess?: () => void) {
  const addToast = useToastStore((s) => s.add);

  const create = useCallback(
    async (input: CreatePromptInput) => {
      try {
        const prompt = await promptService.create(input);
        addToast('Prompt created successfully', 'success');
        onSuccess?.();
        return prompt;
      } catch (err) {
        addToast(err instanceof Error ? err.message : 'Failed to create prompt', 'error');
        throw err;
      }
    },
    [addToast, onSuccess]
  );

  const update = useCallback(
    async (id: string, input: UpdatePromptInput) => {
      try {
        const prompt = await promptService.update(id, input);
        addToast('Prompt updated successfully', 'success');
        onSuccess?.();
        return prompt;
      } catch (err) {
        addToast(err instanceof Error ? err.message : 'Failed to update prompt', 'error');
        throw err;
      }
    },
    [addToast, onSuccess]
  );

  const remove = useCallback(
    async (id: string) => {
      try {
        await promptService.delete(id);
        addToast('Prompt deleted', 'success');
        onSuccess?.();
      } catch (err) {
        addToast(err instanceof Error ? err.message : 'Failed to delete prompt', 'error');
        throw err;
      }
    },
    [addToast, onSuccess]
  );

  const toggleFavorite = useCallback(
    async (id: string) => {
      try {
        const prompt = await promptService.toggleFavorite(id);
        addToast(prompt.is_favorite ? 'Added to favorites' : 'Removed from favorites', 'success');
        onSuccess?.();
        return prompt;
      } catch (err) {
        addToast(err instanceof Error ? err.message : 'Failed to update favorite', 'error');
        throw err;
      }
    },
    [addToast, onSuccess]
  );

  return { create, update, remove, toggleFavorite };
}

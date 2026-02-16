/**
 * usePrompt - Fetch single prompt by ID
 */

import { useState, useEffect, useCallback } from 'react';
import { promptService } from '@/services/promptService';
import type { PromptWithRelations } from '@/types';

export function usePrompt(id: string | null) {
  const [prompt, setPrompt] = useState<PromptWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    if (!id) {
      setPrompt(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await promptService.getById(id);
      setPrompt(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch prompt'));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { prompt, loading, error, refetch };
}

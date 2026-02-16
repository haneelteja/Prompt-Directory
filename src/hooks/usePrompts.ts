/**
 * usePrompts - Fetch and filter prompts with reactive state
 */

import { useState, useEffect, useCallback } from 'react';
import { promptService, type PromptFilters } from '@/services/promptService';
import type { PromptWithRelations } from '@/types';

export function usePrompts(initialFilters?: PromptFilters) {
  const [prompts, setPrompts] = useState<PromptWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<PromptFilters>(initialFilters ?? {});

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await promptService.getAll(filters);
      setPrompts(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch prompts'));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const updateFilters = useCallback((newFilters: Partial<PromptFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  return { prompts, loading, error, filters, updateFilters, refetch };
}

/**
 * Category CRUD - Supabase integration
 */

import { supabase } from '@/lib/supabase';
import type { Category } from '@/types';

export const categoryService = {
  async getAll(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data ?? [];
  },
};

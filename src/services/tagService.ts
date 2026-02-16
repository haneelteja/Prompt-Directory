/**
 * Tag CRUD - Supabase integration
 */

import { supabase } from '@/lib/supabase';
import type { Tag } from '@/types';

export const tagService = {
  async getAll(): Promise<Tag[]> {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .order('name', { ascending: true });
    if (error) throw error;
    return data ?? [];
  },

  async create(name: string): Promise<Tag> {
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const { data, error } = await supabase
      .from('tags')
      .insert({ name, slug })
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};

/**
 * Core type definitions for Prompt Directory
 */

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parent_id: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface Prompt {
  id: string;
  title: string;
  content: string;
  description: string | null;
  category_id: string | null;
  is_favorite: boolean;
  owner_id: string | null;
  visibility: 'personal' | 'team' | 'public';
  team_id: string | null;
  created_at: string;
  updated_at: string;
  // Joined/aggregated
  category?: Category | null;
  tags?: Tag[];
}

export interface PromptVersion {
  id: string;
  prompt_id: string;
  version_number: number;
  title: string;
  content: string;
  description: string | null;
  created_at: string;
}

export interface PromptWithRelations extends Prompt {
  category: Category | null;
  tags: Tag[];
}

export type PromptVisibility = 'personal' | 'team' | 'public';

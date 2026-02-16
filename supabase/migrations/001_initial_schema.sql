-- Prompt Directory - Production Database Schema
-- Designed for single-user initially, future-ready for multi-user & teams

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CORE TABLES
-- ============================================

-- Categories (with future subcategory support via parent_id)
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tags (many-to-many with prompts)
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Teams (future-ready: must exist before prompts.team_id FK)
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Prompts (core entity)
CREATE TABLE prompts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  is_favorite BOOLEAN DEFAULT FALSE,
  -- Future-ready: ownership & sharing
  owner_id UUID, -- NULL for anonymous/single-user, will reference auth.users(id)
  visibility TEXT DEFAULT 'personal' CHECK (visibility IN ('personal', 'team', 'public')),
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL, -- Future: team ownership
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Prompt-Tag junction (many-to-many)
CREATE TABLE prompt_tags (
  prompt_id UUID REFERENCES prompts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (prompt_id, tag_id)
);

-- Prompt versions (version history)
CREATE TABLE prompt_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prompt_id UUID NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(prompt_id, version_number)
);

-- ============================================
-- FUTURE-READY: Team Members & Permissions
-- ============================================

CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL, -- auth.users(id)
  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

-- ============================================
-- INDEXES (Performance)
-- ============================================

CREATE INDEX idx_prompts_category ON prompts(category_id);
CREATE INDEX idx_prompts_owner ON prompts(owner_id);
CREATE INDEX idx_prompts_favorite ON prompts(is_favorite) WHERE is_favorite = TRUE;
CREATE INDEX idx_prompts_created ON prompts(created_at DESC);
CREATE INDEX idx_prompts_visibility ON prompts(visibility);

CREATE INDEX idx_prompt_tags_prompt ON prompt_tags(prompt_id);
CREATE INDEX idx_prompt_tags_tag ON prompt_tags(tag_id);

CREATE INDEX idx_prompt_versions_prompt ON prompt_versions(prompt_id);

-- Full-text search (keyword search + future AI semantic search)
CREATE INDEX idx_prompts_content_search ON prompts USING gin(to_tsvector('english', title || ' ' || COALESCE(description, '') || ' ' || content));

-- ============================================
-- ROW LEVEL SECURITY (Future: enable when auth is added)
-- ============================================

-- ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Users can view own prompts" ON prompts FOR SELECT USING (owner_id = auth.uid() OR visibility = 'public');
-- CREATE POLICY "Users can insert own prompts" ON prompts FOR INSERT WITH CHECK (owner_id = auth.uid());
-- CREATE POLICY "Users can update own prompts" ON prompts FOR UPDATE USING (owner_id = auth.uid());

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER prompts_updated_at
  BEFORE UPDATE ON prompts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

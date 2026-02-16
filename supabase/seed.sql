-- Seed data for initial setup
INSERT INTO categories (name, slug, description, sort_order) VALUES
  ('Development', 'development', 'Code and development-related prompts', 1),
  ('Writing', 'writing', 'Content creation and copywriting prompts', 2),
  ('Analysis', 'analysis', 'Data analysis and research prompts', 3),
  ('General', 'general', 'General-purpose prompts', 4);

INSERT INTO tags (name, slug) VALUES
  ('code-review', 'code-review'),
  ('documentation', 'documentation'),
  ('refactoring', 'refactoring'),
  ('email', 'email'),
  ('summary', 'summary');

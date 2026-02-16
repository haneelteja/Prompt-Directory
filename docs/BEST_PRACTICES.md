# Best Practices & Scalability Notes

## Code Quality

- **Modular components**: Each component has a single responsibility
- **Reusable hooks**: `usePrompts`, `usePrompt`, `useCopyToClipboard` encapsulate logic
- **Environment config**: All secrets in `.env`, never committed
- **TypeScript**: Strict mode, proper typing throughout

## Supabase Integration

- **Service layer**: All DB access through `promptService`, `categoryService`, `tagService`
- **Error handling**: Try/catch with toast notifications
- **Relations**: Fetched via joins, not N+1 queries

## Scalability

1. **Pagination**: Add `range()` to Supabase queries when prompt count grows
2. **Debounce search**: Debounce the search input (e.g. 300ms) to reduce API calls
3. **Caching**: Consider React Query or SWR for client-side cache
4. **RLS**: Enable Row Level Security when adding auth

## AI Semantic Search (Future)

1. Add `embedding vector(1536)` column to prompts
2. Generate embeddings on create/update (OpenAI or Supabase pgvector)
3. Query: `ORDER BY embedding <-> query_embedding LIMIT 20`

## Multi-User (Future)

1. Enable Supabase Auth
2. Set `owner_id = auth.uid()` on insert
3. Uncomment RLS policies in migration
4. Add auth context/provider

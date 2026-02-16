# Prompt Directory - Architecture

## High-Level Architecture (Text Diagram)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         PROMPT DIRECTORY APP                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────────────┐  │
│  │   React UI   │───▶│  Zustand     │───▶│  Custom Hooks            │  │
│  │   (Pages &   │    │  (Toast)     │    │  (usePrompts, usePrompt,  │  │
│  │   Components)│    └──────────────┘    │   useCopyToClipboard)    │  │
│  └──────┬───────┘                        └────────────┬─────────────┘  │
│         │                                              │                │
│         │         ┌────────────────────────────────────┘                │
│         │         │                                                      │
│         ▼         ▼                                                      │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                    Services Layer                                 │   │
│  │  (promptService, categoryService, tagService)                     │   │
│  └────────────────────────────┬─────────────────────────────────────┘   │
│                               │                                          │
│                               ▼                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                    Supabase Client                                 │   │
│  │  (PostgreSQL + Auth-ready + Storage-ready)                        │   │
│  └────────────────────────────┬─────────────────────────────────────┘   │
│                               │                                          │
└───────────────────────────────┼─────────────────────────────────────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │   Supabase Cloud      │
                    │   - PostgreSQL        │
                    │   - Auth (future)    │
                    │   - Storage (future) │
                    └───────────────────────┘
```

## Tech Stack Summary

| Layer | Technology |
|-------|------------|
| Framework | React 18 + TypeScript |
| Build | Vite 5 |
| Styling | Tailwind CSS |
| State | Zustand (toast), React hooks (data) |
| Backend | Supabase (PostgreSQL, Auth-ready) |
| Routing | React Router v6 |
| Markdown | react-markdown |

## Data Flow

1. **Read**: `usePrompts` / `usePrompt` → `promptService.getAll/getById` → Supabase
2. **Write**: User action → `usePromptMutations` → `promptService.create/update/delete` → Supabase → Toast
3. **Copy**: `useCopyToClipboard` → `navigator.clipboard.writeText`

## Future-Ready Extensions

### Multi-User Auth
- Enable Supabase Auth
- Set `owner_id = auth.uid()` on create
- Enable RLS policies (see migration comments)

### Team Sharing
- `teams` and `team_members` tables exist
- Add `team_id` to prompts for shared libraries
- Permission checks via `team_members.role`

### AI Semantic Search
- Add `embedding` column (vector type) to prompts
- Use Supabase pgvector or external embedding API
- Query: `ORDER BY embedding <-> query_embedding LIMIT N`

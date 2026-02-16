# Prompt Directory

A production-ready React application for storing, organizing, searching, and managing reusable prompts. Built for professionals (Business Analysts, developers, prompt engineers) with future-ready architecture for multi-user collaboration and AI-powered semantic search.

![Prompt Directory](https://img.shields.io/badge/React-18-61dafb) ![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178c6) ![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e)

## Features

- **Prompt Management**: Create, edit, delete, view prompts with Markdown support
- **One-Click Copy**: Fast copy to clipboard with visual feedback
- **Organization**: Categories, tags, favorites
- **Search & Filter**: Keyword search, filter by category, tags, favorites
- **Version History**: Automatic versioning on edits, view previous versions
- **Placeholder Support**: Use `{{variable}}` syntax for reusable placeholders

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 18 + TypeScript |
| Build | Vite 5 |
| Styling | Tailwind CSS |
| State | Zustand + React Hooks |
| Backend | Supabase (PostgreSQL) |
| Routing | React Router v6 |

## Quick Start

```bash
npm install
cp .env.example .env
# Edit .env with your Supabase credentials
npm run dev
```

See [docs/SETUP.md](docs/SETUP.md) for detailed setup instructions.

## Project Structure

```
src/
├── components/       # UI components
│   ├── Layout/       # Header, Layout
│   ├── prompts/     # PromptCard, PromptForm, PromptDetail, PromptFilters
│   └── ui/          # Button, Input, Textarea, Card
├── config/          # Environment config
├── hooks/           # usePrompts, usePrompt, useCopyToClipboard
├── lib/             # Supabase client
├── pages/           # HomePage, NewPromptPage, EditPromptPage
├── services/        # promptService, categoryService, tagService
├── store/           # Toast, mutations
└── types/           # TypeScript definitions
```

## Database Schema

- **prompts**: Core entity with title, content, description, category, favorites
- **categories**: Hierarchical (parent_id for subcategories)
- **tags**: Many-to-many with prompts
- **prompt_versions**: Version history
- **teams**, **team_members**: Future-ready for sharing

Run `supabase/migrations/001_initial_schema.sql` in your Supabase SQL Editor.

## Future Roadmap

- **Multi-user Auth**: Supabase Auth + RLS policies
- **Team Sharing**: Shared prompt libraries
- **AI Semantic Search**: Vector embeddings + similarity search

## License

MIT

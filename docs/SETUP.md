# Prompt Directory - Setup Instructions

## Prerequisites

- Node.js 18+
- npm or pnpm
- Supabase account (free tier works)

## Step 1: Clone & Install

```bash
cd "Prompt Directory"
npm install
```

## Step 2: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a project
2. Wait for the database to be ready
3. Go to **Project Settings** → **API** and copy:
   - Project URL
   - `anon` public key

## Step 3: Run Database Migrations

1. In Supabase Dashboard, go to **SQL Editor**
2. Copy the contents of `supabase/migrations/001_initial_schema.sql`
3. Run the SQL
4. (Optional) Run `supabase/seed.sql` for sample categories and tags

## Step 4: Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and set:

```
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## Step 5: Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Production Build

```bash
npm run build
npm run preview
```

## Folder Structure

```
src/
├── components/       # UI components
│   ├── Layout/       # Header, Layout
│   ├── prompts/     # PromptCard, PromptForm, PromptDetail, PromptFilters
│   ├── ui/          # Button, Input, Textarea, Card
│   └── Toast.tsx
├── config/          # env.ts
├── hooks/           # usePrompts, usePrompt, useCopyToClipboard
├── lib/             # supabase client
├── pages/           # HomePage, NewPromptPage, EditPromptPage
├── services/       # promptService, categoryService, tagService
├── store/           # useToastStore, usePromptMutations
├── styles/          # index.css
└── types/           # TypeScript definitions
```

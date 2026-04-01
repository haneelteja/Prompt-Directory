# Prompt Directory

A production-ready desktop and web application for storing, organizing, searching, and managing reusable prompts. Built with Electron, React, and Supabase, featuring Google OAuth and a shared cloud backend.

![React](https://img.shields.io/badge/React-18-61dafb) ![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178c6) ![Electron](https://img.shields.io/badge/Electron-33-47848f) ![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e)

## Features

- Google sign in with Supabase Auth
- Prompt create, edit, delete, copy, favorite
- Categories, tags, and filtering
- Prompt version history
- Web app plus Electron desktop app

## Tech Stack

| Layer | Technology |
|-------|------------|
| Desktop | Electron 33 |
| Framework | React 18 + TypeScript |
| Build | Vite 5 |
| Auth | Supabase Auth (Google OAuth) |
| Backend | Supabase (PostgreSQL) |
| Styling | Tailwind CSS |

## Quick Start

### Web

```bash
npm install
cp .env.example .env
# Edit .env with Supabase credentials
npm run dev
```

Required environment variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_APP_URL` for hosted and desktop OAuth handoff

### Desktop

```bash
npm install
cp .env.example .env
# Configure Supabase + Google OAuth
npm run electron:dev
```

### Build Desktop Installer

```bash
npm run electron:build
```

Output: `release/`

## Supabase Setup

1. Create a project at [supabase.com](https://supabase.com).
2. Run `supabase/setup.sql` in the SQL editor.
3. Run `supabase/migrations/002_auth_profiles_rls.sql`.
4. Enable Google in Authentication -> Providers.
5. In Authentication -> URL Configuration:
   - Set Site URL to your deployed web app, for example `https://prompt-directory-mu.vercel.app`
   - Add redirect URLs:
     - `http://localhost:3000/auth/callback`
     - `https://prompt-directory-mu.vercel.app/auth/callback`
     - `https://prompt-directory-mu.vercel.app/auth/desktop`
6. In Google Cloud OAuth, add the Supabase redirect URI:
   - `https://<your-project-ref>.supabase.co/auth/v1/callback`

## Vercel Deployment

This project is a Vite SPA, so production deploys need both environment variables and SPA rewrites.

Environment variables to configure in Vercel:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_APP_URL`

Routing:

- `vercel.json` rewrites all routes to `index.html` so `/auth/callback` works with React Router.

## Production Checklist

- Supabase Site URL points to the deployed app, not localhost
- Supabase Redirect URLs include both local and production callback URLs
- Google OAuth redirect URI points to `https://<project-ref>.supabase.co/auth/v1/callback`
- Vercel environment variables are configured before deploy
- Vercel is deployed from the latest `main`
- Do not share URLs containing auth tokens

## Project Structure

```text
electron/          Main process and preload
src/context/       Auth context
src/components/    Layout, auth, prompts, UI
src/pages/         Login, callback, home, edit, new
src/services/      Supabase-backed data services
supabase/          Schema and migrations
```

## License

MIT

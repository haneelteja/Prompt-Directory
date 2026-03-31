# Prompt Directory

A production-ready **desktop** and web application for storing, organizing, searching, and managing reusable prompts. Built with Electron, React, and Supabase—featuring Google OAuth and future-ready architecture for team collaboration and AI semantic search.

![React](https://img.shields.io/badge/React-18-61dafb) ![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178c6) ![Electron](https://img.shields.io/badge/Electron-33-47848f) ![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e)

## Features

- **Google Authentication**: Sign up, login, logout with Google OAuth
- **Prompt Management**: Create, edit, delete, view prompts with Markdown support
- **One-Click Copy**: Fast copy to clipboard with visual feedback
- **Organization**: Categories, tags, favorites
- **Search & Filter**: Keyword search, filter by category, tags, favorites
- **Version History**: Automatic versioning on edits, view previous versions
- **Desktop App**: Installable for Windows, macOS, and Linux

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

### Desktop
```bash
npm install
cp .env.example .env
# Configure Supabase + Google OAuth (see docs/DESKTOP_SETUP.md)
npm run electron:dev
```

### Build Desktop Installer
```bash
npm run electron:build
# Output: release/
```

## Supabase Setup

1. Create project at [supabase.com](https://supabase.com)
2. Run `supabase/setup.sql` in SQL Editor
3. Run `supabase/migrations/002_auth_profiles_rls.sql` (for auth)
4. Enable Google provider in Authentication → Providers
5. Add redirect URLs: `http://localhost:42813/auth/callback` (desktop), `http://localhost:3000/auth/callback` (dev)

See [docs/DESKTOP_SETUP.md](docs/DESKTOP_SETUP.md) for full desktop setup.

## Project Structure

```
├── electron/          # Main process, preload
├── src/
│   ├── context/      # AuthContext
│   ├── components/   # AuthGuard, Layout, prompts, ui
│   ├── pages/        # Login, AuthCallback, Home, etc.
│   └── services/     # promptService, Supabase
└── supabase/         # Migrations, setup
```

## License

MIT

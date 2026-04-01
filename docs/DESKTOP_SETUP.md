# Prompt Directory Desktop Setup

## Overview

The desktop app uses Electron as a shell around the same React app and Supabase backend used by the web app.

Desktop sign-in flow:

1. User clicks Google sign in in Electron.
2. Electron opens the hosted web route `/auth/desktop` in the system browser.
3. Supabase and Google complete OAuth in the browser.
4. The hosted app redirects back to the desktop app using the custom protocol:
   - `prompt-directory://auth/callback`
5. Electron passes the callback URL to the renderer.
6. The renderer stores the session with Supabase and loads the app.

## Required Environment Variables

Add these to `.env` before running or building Electron:

```bash
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-public-key>
VITE_APP_URL=https://prompt-directory-mu.vercel.app
```

`VITE_APP_URL` should point to the hosted web app that serves `/auth/desktop` and `/auth/callback`.

## Supabase Configuration

In Supabase Authentication -> URL Configuration:

- Site URL:
  - `https://prompt-directory-mu.vercel.app`
- Redirect URLs:
  - `http://localhost:3000/auth/callback`
  - `https://prompt-directory-mu.vercel.app/auth/callback`
  - `https://prompt-directory-mu.vercel.app/auth/desktop`

In Google Cloud OAuth:

- Authorized redirect URI:
  - `https://<your-project-ref>.supabase.co/auth/v1/callback`

## Local Development

```bash
npm install
npm run electron:dev
```

This runs:

- Vite on `http://localhost:3000`
- Electron pointing at the local renderer

## Desktop Build

```bash
npm run electron:build
```

Build output is written to `release/`.

## Security Notes

- No service role key is used in the desktop renderer
- Electron renderer runs with context isolation
- Only the minimal preload bridge is exposed
- OAuth completion uses the custom `prompt-directory://` protocol instead of exposing Node APIs to the renderer

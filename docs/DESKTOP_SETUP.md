# Prompt Directory - Desktop Setup

## Tech Stack

| Layer | Technology |
|-------|------------|
| Desktop | Electron 33 |
| Frontend | React 18 + TypeScript + Vite |
| Auth | Supabase Auth (Google OAuth) |
| Data | Supabase PostgreSQL |
| Build | electron-builder |

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    ELECTRON MAIN PROCESS                         │
│  - Window management                                              │
│  - Auth callback server (localhost:42813)                         │
│  - IPC (getAuthRedirectUrl, openExternal, onAuthCallback)        │
└────────────────────────────┬────────────────────────────────────┘
                             │ contextBridge (secure)
┌────────────────────────────▼────────────────────────────────────┐
│                    RENDERER (React)                              │
│  - AuthContext (session, signIn, signOut)                         │
│  - AuthGuard, LoginPage, AuthCallbackPage                        │
│  - Prompt CRUD, Search, Versioning                               │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                    SUPABASE                                     │
│  - Auth (Google OAuth)                                           │
│  - PostgreSQL (prompts, profiles, RLS)                          │
└─────────────────────────────────────────────────────────────────┘
```

## Google OAuth Flow

1. User clicks "Sign in with Google"
2. App gets OAuth URL from Supabase
3. **Electron**: Opens URL in system browser via `shell.openExternal`
4. **Web**: Redirects to OAuth URL
5. User signs in on Google
6. Supabase redirects to callback URL:
   - **Electron**: `http://localhost:42813/auth/callback` (server in main process)
   - **Web**: `{origin}/auth/callback`
7. App exchanges code for session
8. Session stored in Supabase client (localStorage)

## Supabase Configuration

1. **Enable Google Provider**  
   - Supabase Dashboard → Authentication → Providers → Google  
   - Add Google OAuth credentials

2. **Add Redirect URLs**  
   - Authentication → URL Configuration → Redirect URLs  
   - Add:
     - `http://localhost:42813/auth/callback` (Electron)
     - `http://localhost:3000/auth/callback` (dev)
     - Your production URL + `/auth/callback`

3. **Run migrations**  
   - `001_initial_schema.sql`  
   - `002_auth_profiles_rls.sql`

## Development

```bash
npm install
cp .env.example .env
# Edit .env with Supabase credentials

# Run desktop app
npm run electron:dev
```

## Build & Package

```bash
# Windows (NSIS installer + portable)
# macOS (DMG + ZIP)
# Linux (AppImage + deb)
npm run electron:build
```

Output: `release/` directory

## Security

- **No Node in renderer**: contextIsolation, no nodeIntegration
- **Preload**: Only exposes getAuthRedirectUrl, openExternal, onAuthCallback
- **Secrets**: Supabase anon key in .env (safe for client-side)
- **RLS**: Prompts filtered by owner_id in database

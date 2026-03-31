# Sync & Windows Build

## Automatic Cloud Sync

Desktop and cloud use the **same Supabase project**. Data sync is automatic:

- **Desktop → Cloud**: When you create/edit/delete in the desktop app, changes are saved to Supabase. Open the cloud app to see them.
- **Cloud → Desktop**: When you update in the cloud, refocus the desktop window to refetch and see changes.
- **Same account**: Sign in with the same Google account on both to access the same prompts.

No manual upload or sync step is required.

## Supabase Redirect URLs

Add these in Supabase Dashboard → Authentication → URL Configuration:

- `https://prompt-directory-kappa.vercel.app/auth/callback`
- `https://prompt-directory-kappa.vercel.app/auth/desktop`

## Building Windows .exe Installer

```bash
# Set env vars (or use .env)
$env:VITE_SUPABASE_URL="https://warmxfpiwotahrymwcth.supabase.co"
$env:VITE_SUPABASE_ANON_KEY="your-key"
$env:VITE_APP_URL="https://prompt-directory-kappa.vercel.app"

npm run electron:build
```

**Output** (in `release/` folder):

- `Prompt Directory Setup x.x.x.exe` – NSIS installer (recommended)
- `Prompt Directory x.x.x.exe` – Portable (no install)

Run the Setup .exe to install on Windows PCs.

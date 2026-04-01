# Sync and Build

## Cloud Sync

Desktop and web use the same Supabase project, so data sync is automatic.

- Desktop -> Cloud: prompt changes are written to Supabase immediately
- Cloud -> Desktop: refocusing the desktop window refreshes data
- Same Google account: both clients see the same prompts

No manual import or export step is required.

## Web Deployment

For hosted deploys:

- configure `VITE_SUPABASE_URL`
- configure `VITE_SUPABASE_ANON_KEY`
- configure `VITE_APP_URL`
- keep `vercel.json` in place so `/auth/callback` is routed to `index.html`

## Windows Build

```bash
$env:VITE_SUPABASE_URL="https://<your-project-ref>.supabase.co"
$env:VITE_SUPABASE_ANON_KEY="<your-public-key>"
$env:VITE_APP_URL="https://prompt-directory-mu.vercel.app"

npm run electron:build
```

Output in `release/`:

- `Prompt Directory Setup x.x.x.exe`
- `Prompt Directory x.x.x.exe`

## Recommended Release Practice

- Do not commit generated `release/` or `dist-electron/` artifacts to git
- Build installers in CI or locally when needed
- Publish installers as release assets instead of storing them in the main source history

# Supabase Keepalive

This repo includes a lightweight keepalive job for Supabase free-tier projects.

## Architecture

- Database heartbeat RPC in `supabase/migrations/003_keepalive_heartbeat.sql`
- Node runner in `scripts/supabase-keepalive.mjs`
- GitHub Actions scheduler in `.github/workflows/supabase-keepalive.yml`

The workflow runs every 6 hours and writes a single heartbeat row through a server-side RPC using the Supabase service-role key stored in GitHub Secrets.

## One-Time Setup

1. Apply `supabase/migrations/003_keepalive_heartbeat.sql` to your Supabase project.
2. In GitHub repository settings, add these Actions secrets:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Optionally run the workflow manually once with `workflow_dispatch`.

## Why This Approach

- no local machine dependency
- one small database write every 6 hours
- service-role key stays server-side
- simple logs and retry behavior through GitHub Actions

## Notes

- The heartbeat table is intentionally tiny and append-only.
- If the scheduled run fails, GitHub Actions marks the workflow red and the next scheduled run will try again automatically.

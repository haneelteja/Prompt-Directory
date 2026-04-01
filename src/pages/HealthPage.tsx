import { env } from '@/config/env';

export function HealthPage() {
  const checks = [
    {
      label: 'App bundle',
      status: 'ok',
      detail: 'Frontend loaded successfully',
    },
    {
      label: 'Supabase config',
      status: env.hasSupabaseConfig ? 'ok' : 'missing',
      detail: env.hasSupabaseConfig
        ? 'Required environment variables are present'
        : `Missing: ${env.missingSupabaseEnvKeys.join(', ')}`,
    },
    {
      label: 'Runtime mode',
      status: env.isProd ? 'ok' : 'info',
      detail: env.isProd ? 'Production build' : 'Development build',
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <p className="text-sm font-medium text-[var(--color-accent)] mb-2">Health Check</p>
          <h1 className="text-3xl font-bold mb-3">Prompt Directory is up</h1>
          <p className="text-[var(--color-text-muted)]">
            Use this page to confirm the deployed frontend is reachable and correctly configured.
          </p>
        </div>

        <div className="space-y-4">
          {checks.map((check) => (
            <div
              key={check.label}
              className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="font-semibold">{check.label}</h2>
                  <p className="text-sm text-[var(--color-text-muted)] mt-1">{check.detail}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    check.status === 'ok'
                      ? 'bg-[var(--color-success)]/15 text-[var(--color-success)]'
                      : check.status === 'missing'
                        ? 'bg-[var(--color-error)]/15 text-[var(--color-error)]'
                        : 'bg-[var(--color-warning)]/15 text-[var(--color-warning)]'
                  }`}
                >
                  {check.status.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5">
          <h2 className="font-semibold mb-3">Deployment Details</h2>
          <dl className="grid gap-3 text-sm">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-[var(--color-text-muted)]">Origin</dt>
              <dd className="font-mono">{typeof window !== 'undefined' ? window.location.origin : 'N/A'}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-[var(--color-text-muted)]">Expected hosted app URL</dt>
              <dd className="font-mono">{env.appUrl || 'Not configured'}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-[var(--color-text-muted)]">Supabase URL</dt>
              <dd className="font-mono">{env.supabaseUrl || 'Missing'}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}

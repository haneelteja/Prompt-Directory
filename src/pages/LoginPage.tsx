/**
 * Login page - Google OAuth
 */

import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';

export function LoginPage() {
  const { signInWithGoogle, loading, authError } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] p-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <span className="text-4xl text-[var(--color-accent)]">◆</span>
          <h1 className="text-2xl font-bold text-[var(--color-text)] mt-4">
            Prompt Directory
          </h1>
          <p className="text-[var(--color-text-muted)] mt-2">
            Your personal prompt repository. Sign in to get started.
          </p>
        </div>

        <div className="space-y-4">
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={signInWithGoogle}
            disabled={loading}
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Signing in...
              </span>
            ) : (
              'Sign in with Google'
            )}
          </Button>

          {authError && (
            <div className="rounded-lg border border-[var(--color-error)]/30 bg-[var(--color-error)]/10 px-4 py-3 text-sm text-[var(--color-error)] text-left">
              {authError}
            </div>
          )}
        </div>

        <p className="text-xs text-[var(--color-text-muted)] mt-8">
          By signing in, you agree to sync your prompts securely with your account.
        </p>
      </div>
    </div>
  );
}

/**
 * OAuth callback handler - Web & Desktop
 * Supabase redirects here after Google sign-in.
 * If source=desktop: redirects to prompt-directory:// with tokens for desktop app.
 * Otherwise: stays on web app.
 */

import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

const PROTOCOL_CALLBACK = 'prompt-directory://auth/callback';

function isAbortError(err: unknown): boolean {
  return err instanceof Error && err.name === 'AbortError';
}

export function AuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isDesktop = searchParams.get('source') === 'desktop';
  const [error, setError] = useState<string | null>(null);
  const didHandleCallback = useRef(false);

  useEffect(() => {
    if (didHandleCallback.current) return;
    didHandleCallback.current = true;

    const handleCallback = async () => {
      const hash = window.location.hash?.slice(1);
      const params = new URLSearchParams(hash || window.location.search);
      const code = params.get('code');
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');

      try {
        if (code) {
          const { data, error: err } = await supabase.auth.exchangeCodeForSession(code);
          if (err) throw err;
          if (isDesktop && data?.session) {
            const { access_token, refresh_token, expires_in } = data.session;
            const fragment = `access_token=${encodeURIComponent(access_token)}&refresh_token=${encodeURIComponent(refresh_token)}&expires_in=${expires_in || 3600}`;
            window.location.href = `${PROTOCOL_CALLBACK}#${fragment}`;
            return;
          }
        } else if (accessToken && refreshToken) {
          const { error: err } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (err) throw err;
        } else {
          throw new Error('No auth data in callback');
        }
        if (!isDesktop) navigate('/', { replace: true });
      } catch (err) {
        if (isAbortError(err)) {
          return;
        }
        if (isDesktop) {
          const msg = err instanceof Error ? err.message : 'Authentication failed';
          window.location.href = `${PROTOCOL_CALLBACK}?error=${encodeURIComponent(msg)}`;
        } else {
          setError(err instanceof Error ? err.message : 'Authentication failed');
        }
      }
    };
    handleCallback();
  }, [navigate, isDesktop]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
        <div className="text-center">
          <p className="text-[var(--color-error)] mb-4">{error}</p>
          <a href="/" className="text-[var(--color-accent)]">Return home</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-2 border-[var(--color-accent)] border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-[var(--color-text-muted)]">Completing sign in...</p>
      </div>
    </div>
  );
}

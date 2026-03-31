/**
 * Desktop OAuth entry point - Cloud page
 * Desktop app opens this URL; it redirects to Google OAuth.
 * After auth, /auth/callback redirects back to desktop via prompt-directory:// protocol.
 */

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { env } from '@/config/env';

const PROTOCOL_CALLBACK = 'prompt-directory://auth/callback';

export function AuthDesktopPage() {
  useEffect(() => {
    const initAuth = async () => {
      const cloudUrl = env.appUrl || window.location.origin;
      const redirectTo = `${cloudUrl}/auth/callback?source=desktop`;

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          queryParams: { access_type: 'offline', prompt: 'consent' },
        },
      });

      if (error) {
        window.location.href = `${PROTOCOL_CALLBACK}?error=${encodeURIComponent(error.message)}`;
        return;
      }
      if (data?.url) {
        window.location.href = data.url;
      }
    };
    initAuth();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-2 border-[var(--color-accent)] border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-[var(--color-text-muted)]">Redirecting to sign in...</p>
      </div>
    </div>
  );
}

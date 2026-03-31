/**
 * Auth Context - Session management with Supabase
 * Handles Google OAuth, session persistence, and user state
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { supabase } from '@/lib/supabase';
import { env } from '@/config/env';
import { upsertProfileFromUser } from '@/services/profileService';
import type { User, Session } from '@supabase/supabase-js';
import { isElectron } from '@/lib/auth';

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  authError: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refetch: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function isAbortError(err: unknown): boolean {
  return err instanceof Error && err.name === 'AbortError';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const consumeSessionFromUrlHash = useCallback(async (): Promise<boolean> => {
    if (typeof window === 'undefined' || !window.location.hash) return false;

    const params = new URLSearchParams(window.location.hash.slice(1));
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');

    if (!accessToken || !refreshToken) return false;

    const { data, error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    if (error) throw error;

    if (data?.session) {
      setSession(data.session);
      setUser(data.session.user);
      await upsertProfileFromUser(data.session.user);
    }

    window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
    return true;
  }, []);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const consumedHashSession = await consumeSessionFromUrlHash();
      if (consumedHashSession) return;

      const { data: { session: s } } = await supabase.auth.getSession();
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) await upsertProfileFromUser(s.user);
    } catch (err) {
      if (!isAbortError(err)) {
        throw err;
      }
    } finally {
      setLoading(false);
    }
  }, [consumeSessionFromUrlHash]);

  useEffect(() => {
    refetch();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        try {
          setSession(session);
          setUser(session?.user ?? null);
          if (session?.user) {
            await upsertProfileFromUser(session.user);
          }
        } catch (err) {
          if (!isAbortError(err)) {
            console.error('Auth state change error:', err);
          }
        } finally {
          setLoading(false);
        }
      }
    );
    return () => subscription.unsubscribe();
  }, [refetch]);

  const signInWithGoogle = useCallback(async () => {
    setLoading(true);
    setAuthError(null);
    try {
      if (isElectron() && window.electronAPI?.openExternal) {
        const cloudUrl = env.appUrl || 'https://prompt-directory-kappa.vercel.app';
        const authUrl = `${cloudUrl}/auth/desktop`;
        await window.electronAPI.openExternal(authUrl);
      } else {
        const redirectTo = window.location.origin + '/auth/callback';
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo, queryParams: { access_type: 'offline', prompt: 'consent' } },
        });
        if (error) throw error;
        if (!data?.url) {
          throw new Error(
            'Google sign-in could not start. Check that the Google provider is enabled in Supabase and that the redirect URL is allowed.'
          );
        }
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Sign in error:', err);
      setAuthError(
        err instanceof Error
          ? err.message
          : 'Google sign-in failed. Check Supabase Auth provider and redirect URL settings.'
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  }, []);

  useEffect(() => {
    if (!isElectron() || !window.electronAPI) return;
    const cleanup = window.electronAPI.onAuthCallback(async (callbackUrl) => {
      try {
        const errorMatch = callbackUrl.match(/\?error=([^&#]+)/);
        const errorParam = errorMatch ? decodeURIComponent(errorMatch[1]) : null;
        if (errorParam) {
          console.error('OAuth error:', decodeURIComponent(errorParam));
          return;
        }
        const hashPart = callbackUrl.includes('#') ? callbackUrl.split('#')[1] : '';
        const params = new URLSearchParams(hashPart);
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        if (accessToken && refreshToken) {
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (!error && data?.session) {
            setSession(data.session);
            setUser(data.session.user);
            await upsertProfileFromUser(data.session.user);
          }
        }
      } catch (err) {
        console.error('Auth callback error:', err);
      } finally {
        setLoading(false);
      }
    });
    return cleanup;
  }, []);

  const value: AuthContextValue = {
    user,
    session,
    loading,
    authError,
    signInWithGoogle,
    signOut,
    refetch,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

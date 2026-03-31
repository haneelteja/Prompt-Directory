/**
 * Environment-based configuration
 * Uses Vite's import.meta.env for build-time variables
 */

const getRequiredEnv = (key: string, fallback?: string): string => {
  const value = import.meta.env[key] ?? fallback;
  if (!value && !fallback) {
    console.warn(`Missing env: ${key}`);
  }
  return value ?? '';
};

const getOptionalEnv = (key: string, fallback = ''): string => {
  return import.meta.env[key] ?? fallback;
};

const missingSupabaseEnvKeys = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'].filter(
  (key) => !import.meta.env[key]
);

export const env = {
  supabaseUrl: getRequiredEnv('VITE_SUPABASE_URL', ''),
  supabaseAnonKey: getRequiredEnv('VITE_SUPABASE_ANON_KEY', ''),
  /** Cloud app URL - used for desktop OAuth redirect (e.g. https://prompt-directory-kappa.vercel.app) */
  appUrl: getOptionalEnv('VITE_APP_URL', ''),
  hasSupabaseConfig: missingSupabaseEnvKeys.length === 0,
  missingSupabaseEnvKeys,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const;

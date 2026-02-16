/**
 * Environment-based configuration
 * Uses Vite's import.meta.env for build-time variables
 */

const getEnv = (key: string, fallback?: string): string => {
  const value = import.meta.env[key] ?? fallback;
  if (!value && !fallback) {
    console.warn(`Missing env: ${key}`);
  }
  return value ?? '';
};

export const env = {
  supabaseUrl: getEnv('VITE_SUPABASE_URL', ''),
  supabaseAnonKey: getEnv('VITE_SUPABASE_ANON_KEY', ''),
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const;

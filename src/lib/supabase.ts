/**
 * Supabase client - production-ready integration layer
 */

import { createClient } from '@supabase/supabase-js';
import { env } from '@/config/env';

if (!env.hasSupabaseConfig) {
  console.warn(
    `Supabase credentials missing. Set ${env.missingSupabaseEnvKeys.join(' and ')} in your environment.`
  );
}

// Use a harmless placeholder client when env vars are missing so the app can render
// a setup screen instead of crashing during module initialization.
const supabaseUrl = env.supabaseUrl || 'https://placeholder.supabase.co';
const supabaseAnonKey = env.supabaseAnonKey || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

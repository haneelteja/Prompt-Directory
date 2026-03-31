/**
 * Profile service - syncs Google user details to profiles table
 * Ensures profile exists on login (for users who signed up before trigger)
 */

import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

export async function upsertProfileFromUser(user: User): Promise<void> {
  const { error } = await supabase.from('profiles').upsert(
    {
      id: user.id,
      email: user.email ?? null,
      full_name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
      avatar_url: user.user_metadata?.avatar_url ?? user.user_metadata?.picture ?? null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' }
  );
  if (error) {
    console.warn('Profile sync failed (non-fatal):', error.message);
  }
}

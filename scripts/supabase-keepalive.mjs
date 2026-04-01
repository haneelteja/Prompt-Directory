import { createClient } from '@supabase/supabase-js';

const requiredEnv = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'];
const missingEnv = requiredEnv.filter((key) => !process.env[key]);

if (missingEnv.length > 0) {
  console.error(`Missing required environment variables: ${missingEnv.join(', ')}`);
  process.exit(1);
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

const source = process.env.SUPABASE_KEEPALIVE_SOURCE || 'github-actions';
const maxAttempts = Number.parseInt(process.env.SUPABASE_KEEPALIVE_RETRIES || '3', 10);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function recordHeartbeat() {
  const { data, error } = await supabase.rpc('record_project_heartbeat', {
    p_source: source,
  });

  if (error) throw error;

  console.log('Keepalive heartbeat recorded:', JSON.stringify(data));
}

async function main() {
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      console.log(`Keepalive attempt ${attempt}/${maxAttempts}`);
      await recordHeartbeat();
      return;
    } catch (error) {
      console.error(`Keepalive attempt ${attempt} failed:`, error);
      if (attempt === maxAttempts) {
        process.exit(1);
      }
      await sleep(attempt * 5000);
    }
  }
}

await main();

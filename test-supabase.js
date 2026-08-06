import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config();

const url = process.env.VITE_SUPABASE_URL || '';
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

if (!url || !key) {
  console.log('Missing env vars');
  process.exit(1);
}

const supabaseUrl = url.startsWith('http') ? url : `https://${url}.supabase.co`;
const supabase = createClient(supabaseUrl, key);

async function test() {
  const { data, error } = await supabase.from('app_config').select('*').eq('id', 1).single();
  console.log('Data:', data);
  console.log('Error:', error);
}

test();

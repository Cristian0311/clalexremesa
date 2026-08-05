import { createClient } from '@supabase/supabase-js';
const supabaseUrlRaw = (process.env.VITE_SUPABASE_URL || '').trim();
const supabaseUrl = supabaseUrlRaw.startsWith('http') 
  ? supabaseUrlRaw 
  : (supabaseUrlRaw ? `https://${supabaseUrlRaw}.supabase.co` : '');
const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '').trim();
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

async function test() {
  console.log("Supabase URL:", supabaseUrl);
  console.log("Supabase Key starts with:", supabaseKey.substring(0, 5));
  if (!supabase) {
    console.log("No supabase instance");
    return;
  }
  const { data, error } = await supabase.from('app_config').upsert({ id: 1, data: { test: true } });
  console.log("Upsert:", { data, error });
  
  const { data: d2, error: e2 } = await supabase.from('app_config').select('data').eq('id', 1).single();
  console.log("Select:", { data: d2, error: e2 });
}
test();

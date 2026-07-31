import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabaseUrlRaw = process.env.VITE_SUPABASE_URL || '';
const supabaseUrl = supabaseUrlRaw.startsWith('http') 
  ? supabaseUrlRaw 
  : (supabaseUrlRaw ? `https://${supabaseUrlRaw}.supabase.co` : '');
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
if(supabaseUrl && supabaseKey) {
  console.log('Connecting to Supabase at', supabaseUrl);
  const supabase = createClient(supabaseUrl, supabaseKey);
  supabase.from('app_config').select('*').limit(1).then(({data, error}) => {
    if(error) {
      console.log('Error querying Supabase:', error.message);
    } else {
      console.log('Successfully queried app_config:', data ? data.length + ' rows' : 'No data');
      console.log(JSON.stringify(data, null, 2));
    }
  });
} else {
  console.log('Missing Supabase URL or Key');
}

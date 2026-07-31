import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
if(supabaseUrl && supabaseKey) {
  const supabase = createClient(supabaseUrl, supabaseKey);
  supabase.from('app_config').select('data').eq('id', 1).single().then(({data}) => {
    if(data) {
      const config = data.data;
      config.email = 'clalexremesa@gmail.com';
      config.whatsapp = '51986771394';
      supabase.from('app_config').upsert({ id: 1, data: config }).then(() => console.log('Updated config'));
    }
  });
}

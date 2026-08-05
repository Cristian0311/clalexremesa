import { createClient } from '@supabase/supabase-js';

const supabaseUrlRaw = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabaseUrl = supabaseUrlRaw.startsWith('http') 
  ? supabaseUrlRaw 
  : (supabaseUrlRaw ? `https://${supabaseUrlRaw}.supabase.co` : '');
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

if (supabaseUrl && supabaseAnonKey) {
  console.log('[Supabase Debug] ✅ Cliente inicializado con URL:', supabaseUrl);
} else {
  console.warn('[Supabase Debug] ⚠️ Faltan credenciales de Supabase (URL o Anon Key)');
}

export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

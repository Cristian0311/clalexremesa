import { createClient } from '@supabase/supabase-js';

const supabaseUrlRaw = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabaseUrl = supabaseUrlRaw.startsWith('http') 
  ? supabaseUrlRaw 
  : (supabaseUrlRaw ? `https://${supabaseUrlRaw}.supabase.co` : '');
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

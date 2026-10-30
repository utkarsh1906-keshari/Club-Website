import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-project-id')) {
  if (import.meta.env?.DEV) {
    console.error(
      'Supabase credentials missing or unconfigured in environment. ' +
      'Please check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
    );
  }
}

export const supabase =
  supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-project-id')
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      })
    : null;

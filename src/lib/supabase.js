import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Initialize Supabase client if valid environment variables are present
export const supabase =
  supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-project-id')
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

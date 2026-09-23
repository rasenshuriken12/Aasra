import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing Supabase environment variables!');
    console.error('Check your .env.local file for VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
} else {
    console.log('✅ Supabase connection initialized');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

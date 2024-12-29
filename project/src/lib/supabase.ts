import { createClient } from '@supabase/supabase-js';
import { useAuthStore } from '../stores/authStore';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Set up auth state listener
supabase.auth.onAuthStateChange((event, session) => {
  const authStore = useAuthStore.getState();
  authStore.setUser(session?.user ?? null);
});
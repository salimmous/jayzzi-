import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    storage: window.localStorage,
    detectSessionInUrl: true,
  }
});

// Initialize auth with default admin
export const initializeAuth = async () => {
  try {
    // First check if we're already authenticated
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      // Try to sign in with default credentials
      const { data, error } = await supabase.auth.signInWithPassword({
        email: import.meta.env.VITE_DEFAULT_ADMIN_EMAIL,
        password: import.meta.env.VITE_DEFAULT_ADMIN_PASSWORD
      });

      if (error) {
        // If login fails, try to sign up
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: import.meta.env.VITE_DEFAULT_ADMIN_EMAIL,
          password: import.meta.env.VITE_DEFAULT_ADMIN_PASSWORD,
          options: {
            data: {
              name: 'Admin',
              role: 'admin'
            }
          }
        });

        if (signUpError) {
          console.error('Failed to create admin account:', signUpError.message);
          return false;
        }
      }
    }

    return true;
  } catch (error) {
    console.error('Auth initialization error:', error);
    return false;
  }
};

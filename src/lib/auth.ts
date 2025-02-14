import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from './supabase';
import { useSettingsStore } from './settings';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkAuth: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>; // Add resetPassword
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      loading: true,
      error: null,

      checkAuth: async () => {
        try {
          const { data: { session }, error } = await supabase.auth.getSession();

          if (error) throw error;

          if (session?.user) {
            // Load settings after successful authentication
            await useSettingsStore.getState().loadSettings();

            set({
              user: {
                id: session.user.id,
                email: session.user.email!,
                name: session.user.user_metadata.name || session.user.email!.split('@')[0]
              },
              loading: false
            });
          } else {
            set({ user: null, loading: false });
          }
        } catch (error) {
          set({
            error: (error as Error).message,
            user: null,
            loading: false
          });
        }
      },

      signIn: async (email: string, password: string) => {
        try {
          set({ loading: true, error: null });

          const { data: { session }, error } = await supabase.auth.signInWithPassword({
            email,
            password
          });

          if (error) throw error;

          if (session?.user) {
            // Load settings after successful login
            await useSettingsStore.getState().loadSettings();

            set({
              user: {
                id: session.user.id,
                email: session.user.email!,
                name: session.user.user_metadata.name || session.user.email!.split('@')[0]
              }
            });
          }
        } catch (error) {
          set({ error: (error as Error).message });
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      signOut: async () => {
        try {
          set({ loading: true, error: null });
          const { error } = await supabase.auth.signOut();
          if (error) throw error;
          set({ user: null });
          // Clear settings on logout
          useSettingsStore.getState().clearSettings();
        } catch (error) {
          set({ error: (error as Error).message });
        } finally {
          set({ loading: false });
        }
      },
      resetPassword: async (email: string) => {
        try {
          set({ loading: true, error: null });
          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/update-password`,
          });
          if (error) throw error;
        } catch (error) {
          set({ error: (error as Error).message });
          throw error;
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user })
    }
  )
);

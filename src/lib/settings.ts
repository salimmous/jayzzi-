import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from './supabase';

interface Settings {
  openaiKey: string;
  midjourneyKey: string;
  wordpressUrl: string;
  wordpressToken: string;
  anthropicKey: string;
  stabilityKey: string;
  googleAiKey: string;
  replicateKey: string;
}

interface SettingsStore {
  settings: Settings;
  loading: boolean;
  error: string | null;
  updateSettings: (settings: Partial<Settings>) => Promise<void>;
  clearSettings: () => Promise<void>;
  loadSettings: () => Promise<void>;
  validateApiKey: (key: string, type: keyof Settings) => Promise<boolean>;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      settings: {
        openaiKey: '',
        midjourneyKey: '',
        wordpressUrl: '',
        wordpressToken: '',
        anthropicKey: '',
        stabilityKey: '',
        googleAiKey: '',
        replicateKey: ''
      },
      loading: false,
      error: null,

      validateApiKey: async (key: string, type: keyof Settings) => {
        if (!key.trim()) return true;
        
        try {
          set({ error: null });
          
          switch (type) {
            case 'openaiKey':
              if (!key.startsWith('sk-')) {
                throw new Error('Invalid OpenAI API key format. Key should start with "sk-"');
              }
              return true;

            case 'midjourneyKey':
              return true;

            case 'anthropicKey':
              if (!key.startsWith('sk-ant-')) {
                throw new Error('Invalid Anthropic API key format. Key should start with "sk-ant-"');
              }
              return true;

            case 'stabilityKey':
              if (!key.startsWith('sk-')) {
                throw new Error('Invalid Stability API key format. Key should start with "sk-"');
              }
              return true;

            case 'replicateKey':
              if (!key.startsWith('r8_')) {
                throw new Error('Invalid Replicate API key format. Key should start with "r8_"');
              }
              return true;

            default:
              return true;
          }
        } catch (error) {
          set({ error: (error as Error).message });
          return false;
        }
      },

      loadSettings: async () => {
        try {
          set({ loading: true, error: null });
          const { data: { user } } = await supabase.auth.getUser();
          
          if (!user) {
            throw new Error('Not authenticated');
          }

          // First try to get settings directly
          const { data: settings, error: settingsError } = await supabase
            .from('settings')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();

          // If that fails, try decrypted view
          if (settingsError) {
            const { data: decryptedSettings, error: decryptedError } = await supabase
              .from('decrypted_settings')
              .select('*')
              .eq('user_id', user.id)
              .maybeSingle();

            if (decryptedError && decryptedError.code !== 'PGRST116') {
              throw decryptedError;
            }

            if (decryptedSettings) {
              set({
                settings: {
                  openaiKey: decryptedSettings.openai_key || '',
                  midjourneyKey: decryptedSettings.midjourney_key || '',
                  wordpressUrl: decryptedSettings.wordpress_url || '',
                  wordpressToken: decryptedSettings.wordpress_token || '',
                  anthropicKey: decryptedSettings.anthropic_key || '',
                  stabilityKey: decryptedSettings.stability_key || '',
                  googleAiKey: decryptedSettings.google_ai_key || '',
                  replicateKey: decryptedSettings.replicate_key || ''
                }
              });
            }
          } else if (settings) {
            // Handle non-encrypted settings
            set({
              settings: {
                openaiKey: settings.openai_key || '',
                midjourneyKey: settings.midjourney_key || '',
                wordpressUrl: settings.wordpress_url || '',
                wordpressToken: settings.wordpress_token || '',
                anthropicKey: settings.anthropic_key || '',
                stabilityKey: settings.stability_key || '',
                googleAiKey: settings.google_ai_key || '',
                replicateKey: settings.replicate_key || ''
              }
            });
          }
        } catch (error) {
          console.error('Failed to load settings:', error);
          set({ error: 'Failed to load settings. Please try again.' });
        } finally {
          set({ loading: false });
        }
      },

      updateSettings: async (newSettings) => {
        try {
          set({ loading: true, error: null });
          const { data: { user } } = await supabase.auth.getUser();
          
          if (!user) {
            throw new Error('Not authenticated');
          }

          // Validate API keys before saving
          for (const [key, value] of Object.entries(newSettings)) {
            if (value !== undefined) {
              const isValid = await get().validateApiKey(value, key as keyof Settings);
              if (!isValid) {
                throw new Error(`Invalid ${key} format`);
              }
            }
          }

          // Convert camelCase to snake_case
          const settingsToUpdate = Object.entries(newSettings).reduce((acc, [key, value]) => {
            if (value !== undefined) {
              const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
              acc[snakeKey] = value;
            }
            return acc;
          }, {} as Record<string, any>);

          // Add user_id
          settingsToUpdate.user_id = user.id;

          // Try direct update first
          const { error: updateError } = await supabase
            .from('settings')
            .upsert(settingsToUpdate);

          if (updateError) {
            // If encryption is not set up, store values directly
            const { error: insertError } = await supabase.rpc('store_settings', {
              p_user_id: user.id,
              p_settings: settingsToUpdate
            });

            if (insertError) {
              throw new Error('Failed to save settings. Please contact support.');
            }
          }

          // Update local state
          set(state => ({
            settings: {
              ...state.settings,
              ...newSettings
            }
          }));

          // Reload to ensure consistency
          await get().loadSettings();
        } catch (error) {
          console.error('Settings update error:', error);
          set({ error: (error as Error).message });
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      clearSettings: async () => {
        try {
          set({ loading: true, error: null });
          const { data: { user } } = await supabase.auth.getUser();
          
          if (!user) {
            throw new Error('Not authenticated');
          }

          const { error } = await supabase
            .from('settings')
            .delete()
            .eq('user_id', user.id);

          if (error) throw error;

          set({
            settings: {
              openaiKey: '',
              midjourneyKey: '',
              wordpressUrl: '',
              wordpressToken: '',
              anthropicKey: '',
              stabilityKey: '',
              googleAiKey: '',
              replicateKey: ''
            }
          });
        } catch (error) {
          console.error('Clear settings error:', error);
          set({ error: 'Failed to clear settings. Please try again.' });
          throw error;
        } finally {
          set({ loading: false });
        }
      }
    }),
    {
      name: 'settings-storage',
      partialize: (state) => ({ settings: state.settings })
    }
  )
);

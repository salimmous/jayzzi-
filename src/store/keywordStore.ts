import { create } from 'zustand';
import { KeywordData } from '../types';
import { supabase } from '../lib/supabase';

interface KeywordStore {
  keywords: KeywordData[];
  loading: boolean;
  error: string | null;
  fetchKeywords: () => Promise<void>;
  searchKeywords: (keyword: string) => Promise<void>;
  trackKeyword: (keyword: string) => Promise<void>;
  untrackKeyword: (keywordId: string) => Promise<void>;
  exportKeywords: (keywordIds: string[]) => Promise<void>;
  updateKeywordMetrics: () => Promise<void>;
}

export const useKeywordStore = create<KeywordStore>((set, get) => ({
  keywords: [],
  loading: false,
  error: null,

  fetchKeywords: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('keywords')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      set({ keywords: data as KeywordData[] });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  searchKeywords: async (keyword) => {
    set({ loading: true, error: null });
    try {
      // Implementation for keyword search
      const { data, error } = await supabase
        .from('keywords')
        .select('*')
        .ilike('keyword', `%${keyword}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      set({ keywords: data as KeywordData[] });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  trackKeyword: async (keyword) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('keywords')
        .insert([{ 
          keyword,
          volume: 0,
          followers: 0,
          popularity: 0,
          position: 0,
          change: 0
        }])
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        keywords: [...state.keywords, data as KeywordData]
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  untrackKeyword: async (keywordId) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('keywords')
        .delete()
        .eq('id', keywordId);

      if (error) throw error;

      set(state => ({
        keywords: state.keywords.filter(k => k.id !== keywordId)
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  exportKeywords: async (keywordIds) => {
    const keywords = get().keywords.filter(k => keywordIds.includes(k.id));
    const csv = [
      ['Keyword', 'Volume', 'Followers', 'Position', 'Change', 'Updated'],
      ...keywords.map(k => [
        k.keyword,
        k.volume.toString(),
        k.followers.toString(),
        k.position.toString(),
        k.change.toString(),
        new Date(k.updatedAt).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'keywords.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  updateKeywordMetrics: async () => {
    set({ loading: true, error: null });
    try {
      const keywords = get().keywords;
      for (const keyword of keywords) {
        // Here you would integrate with Pinterest API to get real metrics
        // For now, we'll simulate random changes
        const change = Math.floor(Math.random() * 21) - 10;
        const { error } = await supabase
          .from('keywords')
          .update({
            position: keyword.position + change,
            change,
            updatedAt: new Date().toISOString()
          })
          .eq('id', keyword.id);

        if (error) throw error;
      }
      await get().fetchKeywords();
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
}));

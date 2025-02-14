import { create } from 'zustand';
import { supabase } from './supabase.ts'; //.ts extension

interface ImageStore {
  images: {
    id: string;
    url: string;
    articleId: string;
    folder: string;
    createdAt: Date;
  }[];
  loading: boolean;
  error: string | null;
  fetchImages: () => Promise<void>;
  moveImages: (imageIds: string[], targetFolder: string) => Promise<void>;
  deleteImages: (imageIds: string[]) => Promise<void>;
  searchImages: (query: string) => Promise<void>;
}

export const useImageStore = create<ImageStore>((set, get) => ({
  images: [],
  loading: false,
  error: null,

  fetchImages: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('images')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      set({ images: data });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  moveImages: async (imageIds: string[], targetFolder: string) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('images')
        .update({ folder: targetFolder })
        .in('id', imageIds);

      if (error) throw error;

      // Update local state
      set(state => ({
        images: state.images.map(img =>
          imageIds.includes(img.id) ? { ...img, folder: targetFolder } : img
        )
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  deleteImages: async (imageIds: string[]) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('images')
        .delete()
        .in('id', imageIds);

      if (error) throw error;

      // Update local state
      set(state => ({
        images: state.images.filter(img => !imageIds.includes(img.id))
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  searchImages: async (query: string) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('images')
        .select('*')
        .or(`articleId.ilike.%${query}%,folder.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      set({ images: data });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
}));

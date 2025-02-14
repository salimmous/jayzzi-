import { supabase } from './supabase';

export default {
  query: async <T>(sql: string, params?: any[]): Promise<T[]> => {
    console.warn("The `db.query` function is deprecated for direct SQL queries. Use Supabase client methods instead.");
    // You should replace calls to db.query with direct Supabase calls.
    // This is just a placeholder to prevent immediate errors.
    return [];
  },

  queryOne: async <T>(sql: string, params?: any[]): Promise<T | null> => {
    console.warn("The `db.queryOne` function is deprecated. Use Supabase client methods instead.");
    // You should replace calls to db.queryOne with direct Supabase calls.
    return null;
  },

  supabase // Export the Supabase client directly
};

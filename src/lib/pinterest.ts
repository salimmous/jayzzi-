import { supabase } from './supabase.ts';

interface PinterestConfig {
  accessToken: string;
  apiUrl: string;
}

class PinterestAPI {
  private config: PinterestConfig;

  constructor() {
    this.config = {
      accessToken: import.meta.env.VITE_PINTEREST_ACCESS_TOKEN || '',
      apiUrl: 'https://api.pinterest.com/v5'
    };
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.config.apiUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.config.accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    if (!response.ok) {
      throw new Error(`Pinterest API Error: ${response.statusText}`);
    }

    return response.json();
  }

  async searchPins(query: string, limit = 50) {
    try{
        return await this.request(`/pins/search?query=${encodeURIComponent(query)}&limit=${limit}`);
    } catch (error) {
        console.error("Failed to search pins in Pinterest", error);
        throw error;
    }
  }

  async getTopPins(query: string) {
     try {
        const response = await this.searchPins(query);
        return response.items.map((pin: any) => ({
          id: pin.id,
          title: pin.title,
          description: pin.description,
          link: pin.link,
          saves: pin.save_count || 0,
          comments: pin.comment_count || 0,
          reactions: pin.reaction_counts?.total || 0
        }));
    } catch (error){
        console.error("Failed to get top pins from Pinterest", error);
        throw error;
    }
  }

  async getTrendingKeywords(category?: string) {
    try {
        return await this.request(`/trends${category ? `?category=${category}` : ''}`);
    } catch (error) {
        console.error("Failed to get trending keywords from Pinterest", error);
        throw error;
    }
  }

  async getKeywordMetrics(keyword: string) {
    try {
        const searchResults = await this.searchPins(keyword, 100);
        const pins = searchResults.items;

        return {
          volume: pins.length,
          saves: pins.reduce((acc: number, pin: any) => acc + (pin.save_count || 0), 0),
          engagement: pins.reduce((acc: number, pin: any) =>
            acc + (pin.save_count || 0) + (pin.comment_count || 0) + (pin.reaction_counts?.total || 0), 0
          )
        };
    } catch(error) {
        console.error("Failed to get keyword metrics from Pinterest", error);
        throw error;
    }
  }
}

export const pinterestApi = new PinterestAPI();

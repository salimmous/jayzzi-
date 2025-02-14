import { supabase } from './supabase';

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
    return this.request(`/pins/search?query=${encodeURIComponent(query)}&limit=${limit}`);
  }

  async getTopPins(query: string) {
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
  }

  async getTrendingKeywords(category?: string) {
    return this.request(`/trends${category ? `?category=${category}` : ''}`);
  }

  async getKeywordMetrics(keyword: string) {
    const searchResults = await this.searchPins(keyword, 100);
    const pins = searchResults.items;

    return {
      volume: pins.length,
      saves: pins.reduce((acc: number, pin: any) => acc + (pin.save_count || 0), 0),
      engagement: pins.reduce((acc: number, pin: any) => 
        acc + (pin.save_count || 0) + (pin.comment_count || 0) + (pin.reaction_counts?.total || 0), 0
      )
    };
  }
}

export const pinterestApi = new PinterestAPI();

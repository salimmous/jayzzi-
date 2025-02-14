import { supabase } from './supabase';
import { pinterestApi } from './pinterest';

interface KeywordMetrics {
  volume: number;
  saves: number;
  engagement: number;
}

class KeywordResearchAPI {
  async searchKeywords(seed: string) {
    try {
      // Get Pinterest trending data
      const trends = await pinterestApi.getTrendingKeywords();
      
      // Filter and sort by relevance to seed keyword
      const relatedKeywords = trends.filter((trend: any) => 
        trend.term.toLowerCase().includes(seed.toLowerCase())
      );

      // Get metrics for each keyword
      const keywordsWithMetrics = await Promise.all(
        relatedKeywords.map(async (keyword: any) => {
          const metrics = await pinterestApi.getKeywordMetrics(keyword.term);
          return {
            keyword: keyword.term,
            volume: metrics.volume,
            saves: metrics.saves,
            engagement: metrics.engagement,
            popularity: this.calculatePopularity(metrics)
          };
        })
      );

      return keywordsWithMetrics;
    } catch (error) {
      console.error('Keyword research error:', error);
      throw error;
    }
  }

  private calculatePopularity(metrics: KeywordMetrics): number {
    const maxScore = 100;
    const volumeWeight = 0.4;
    const savesWeight = 0.3;
    const engagementWeight = 0.3;

    // Normalize metrics to 0-1 range
    const normalizedVolume = Math.min(metrics.volume / 1000, 1);
    const normalizedSaves = Math.min(metrics.saves / 10000, 1);
    const normalizedEngagement = Math.min(metrics.engagement / 20000, 1);

    // Calculate weighted score
    const score = (
      normalizedVolume * volumeWeight +
      normalizedSaves * savesWeight +
      normalizedEngagement * engagementWeight
    ) * maxScore;

    return Math.round(score);
  }

  async trackKeyword(keyword: string) {
    try {
      const metrics = await pinterestApi.getKeywordMetrics(keyword);
      
      const { data, error } = await supabase
        .from('keywords')
        .insert({
          keyword,
          volume: metrics.volume,
          saves: metrics.saves,
          popularity: this.calculatePopularity(metrics),
          position: 0,
          change: 0
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to track keyword:', error);
      throw error;
    }
  }

  async updateKeywordMetrics(keywordId: string) {
    try {
      const { data: keyword } = await supabase
        .from('keywords')
        .select('keyword')
        .eq('id', keywordId)
        .single();

      if (!keyword) throw new Error('Keyword not found');

      const metrics = await pinterestApi.getKeywordMetrics(keyword.keyword);
      const popularity = this.calculatePopularity(metrics);

      const { error } = await supabase
        .from('keywords')
        .update({
          volume: metrics.volume,
          saves: metrics.saves,
          popularity,
          updated_at: new Date().toISOString()
        })
        .eq('id', keywordId);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to update keyword metrics:', error);
      throw error;
    }
  }
}

export const keywordApi = new KeywordResearchAPI();

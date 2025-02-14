import { supabase } from './supabase.ts';
import { pinterestApi } from './pinterest.ts';
import { GoogleKeywordResult } from '../types/index.ts';
import { useSettingsStore } from './settings.ts';

class KeywordResearchAPI {
  private calculatePopularity(metrics: { volume: number; saves: number; engagement: number }): number {
    const maxScore = 100;
    const volumeWeight = 0.4;
    const savesWeight = 0.3;
    const engagementWeight = 0.3;

    // Normalize metrics (adjust these thresholds as needed)
    const normalizedVolume = Math.min(metrics.volume / 10000, 1);
    const normalizedSaves = Math.min(metrics.saves / 20000, 1);
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
      throw error; // Re-throw for handling in the UI
    }
  }

  async updateKeywordMetrics(keywordId: string) {
    try {
      const { data: keyword, error: keywordError } = await supabase
        .from('keywords')
        .select('keyword')
        .eq('id', keywordId)
        .single();

      if (keywordError) throw keywordError;
      if (!keyword) throw new Error('Keyword not found');

      const metrics = await pinterestApi.getKeywordMetrics(keyword.keyword);
      const popularity = this.calculatePopularity(metrics);

      const { error: updateError } = await supabase
        .from('keywords')
        .update({
          volume: metrics.volume,
          saves: metrics.saves,
          popularity,
          updated_at: new Date().toISOString()
        })
        .eq('id', keywordId);

      if (updateError) throw updateError;
    } catch (error) {
      console.error('Failed to update keyword metrics:', error);
      throw error; // Re-throw for handling in the UI
    }
  }

  async searchGoogleKeywords(keyword: string): Promise<GoogleKeywordResult[]> {
    const settings = useSettingsStore.getState().settings;
    const apiKey = settings.googleAdsApiKey;
    const customerId = 'YOUR_CUSTOMER_ID'; //  Replace with actual Customer ID or fetch from settings

    if (!apiKey) {
      throw new Error('Google Ads API key is not set.');
    }
    if (!customerId) {
      throw new Error('Google Ads Customer ID is not set.');
    }


    const url = `https://googleads.googleapis.com/v14/customers/${customerId}:generateKeywordIdeas`; //  Replace with the correct endpoint
    const headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'developer-token': 'YOUR_DEVELOPER_TOKEN', // Replace with your developer token
    };
    const body = JSON.stringify({
      keywordTexts: [keyword],
      languageCode: 'en-US', //  Or fetch from settings/user input
      //  Add other parameters as needed based on the API documentation
    });

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: body,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Google Ads API error: ${response.status} - ${errorData.error.message}`);
      }

      const data = await response.json();

      //  Adapt this to the actual response structure from the Google Ads API
      const results: GoogleKeywordResult[] = data.results.map((item: any) => ({
        keyword: item.text,
        volume: item.keywordIdeaMetrics.avgMonthlySearches,
        competition: item.keywordIdeaMetrics.competition, // This might need mapping to a numerical value
        cpc: item.keywordIdeaMetrics.averageCpc, // This might need conversion
      }));

      return results;

    } catch (error:any) {
      console.error('Failed to fetch Google keywords:', error);
      throw new Error(`Failed to fetch Google keywords: ${error.message}`);
    }
  }
}

export const keywordApi = new KeywordResearchAPI();

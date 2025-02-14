import React, { useEffect } from 'react';
// import { useAnalyticsStore } from '../store/analyticsStore'; // REMOVED - Inlining the store
import { Bar, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { create } from 'zustand'; // Import create
import { ArticleAnalytics, PinAnalytics, KeywordAnalytics } from '../types'; // Import types

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

// --- Inlined Analytics Store ---
interface AnalyticsStore {
  articleAnalytics: ArticleAnalytics[];
  pinAnalytics: PinAnalytics[];
  keywordAnalytics: KeywordAnalytics[];
  fetchArticleAnalytics: () => Promise<void>;
  fetchPinAnalytics: () => Promise<void>;
  fetchKeywordAnalytics: () => Promise<void>;
}

// Helper function to generate random data with trends
const generateTrendData = (count: number, base: number, trend: 'up' | 'down' | 'fluctuate') => {
    let value = base;
    const data = [];
    for (let i = 0; i < count; i++) {
        if (trend === 'up') {
            value += Math.random() * (base * 0.1); // Upward trend
        } else if (trend === 'down') {
            value -= Math.random() * (base * 0.1); // Downward trend
        } else {
            value += (Math.random() - 0.5) * (base * 0.2); // Fluctuate
        }
        data.push(Math.max(0, Math.round(value))); // Ensure non-negative
    }
    return data;
};

const useAnalyticsStore = create<AnalyticsStore>((set) => ({
  articleAnalytics: [],
  pinAnalytics: [],
  keywordAnalytics: [],
  fetchArticleAnalytics: async () => {
    const numArticles = 10;
    const articleData = Array.from({ length: numArticles }, (_, i) => ({
      articleId: `${i + 1}`,
      views: generateTrendData(1, 1000 + i * 200, 'fluctuate')[0],
      shares: generateTrendData(1, 50 + i * 10, 'fluctuate')[0],
      comments: generateTrendData(1, 20 + i * 5, 'fluctuate')[0],
      timeSpent: generateTrendData(1, 120 + i * 30, 'fluctuate')[0],
    }));
    set({ articleAnalytics: articleData });
  },
  fetchPinAnalytics: async () => {
    const numPins = 10;
        const pinData = Array.from({ length: numPins }, (_, i) => ({
            pinId: `${i + 1}`,
            impressions: generateTrendData(1, 5000 + i * 500, 'fluctuate')[0],
            saves: generateTrendData(1, 200 + i * 20, 'fluctuate')[0],
            clicks: generateTrendData(1, 100 + i * 10, 'fluctuate')[0],
            outboundClicks: generateTrendData(1, 50 + i * 5, 'fluctuate')[0],
        }));
        set({ pinAnalytics: pinData });
  },
  fetchKeywordAnalytics: async () => {
     const numKeywords = 10;
        const keywordData = Array.from({ length: numKeywords }, (_, i) => ({
            keywordId: `${i + 1}`,
            searchVolume: generateTrendData(1, 10000 - i * 500, 'down')[0],
            ranking: generateTrendData(1, 1 + i, 'up')[0],
            ctr: generateTrendData(1, 3 + Math.random(), 'fluctuate')[0], // CTR is usually a small percentage
        }));
        set({ keywordAnalytics: keywordData });
  },
}));
// --- End Inlined Store ---

function Analytics() {
  const {
    articleAnalytics,
    pinAnalytics,
    keywordAnalytics,
    fetchArticleAnalytics,
    fetchPinAnalytics,
    fetchKeywordAnalytics,
  } = useAnalyticsStore();

  useEffect(() => {
    fetchArticleAnalytics();
    fetchPinAnalytics();
    fetchKeywordAnalytics();
  }, [fetchArticleAnalytics, fetchPinAnalytics, fetchKeywordAnalytics]);

  const articleViewsData = {
    labels: articleAnalytics.map((a) => `Article ${a.articleId}`),
    datasets: [
      {
        label: 'Views',
        data: articleAnalytics.map((a) => a.views),
        backgroundColor: 'rgba(59, 130, 246, 0.5)', // Blue
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

    const articleEngagementData = {
        labels: articleAnalytics.map(a => `Article ${a.articleId}`),
        datasets: [
            {
                label: 'Shares',
                data: articleAnalytics.map(a => a.shares),
                backgroundColor: 'rgba(34, 197, 94, 0.5)', // Green
                borderColor: 'rgba(34, 197, 94, 1)',
                borderWidth: 1,
            },
            {
                label: 'Comments',
                data: articleAnalytics.map(a => a.comments),
                backgroundColor: 'rgba(239, 68, 68, 0.5)', // Red
                borderColor: 'rgba(239, 68, 68, 1)',
                borderWidth: 1,
            },
        ],
    };

  const pinImpressionsData = {
    labels: pinAnalytics.map((p) => `Pin ${p.pinId}`),
    datasets: [
      {
        label: 'Impressions',
        data: pinAnalytics.map((p) => p.impressions),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

    const pinEngagementData = {
        labels: pinAnalytics.map(p => `Pin ${p.pinId}`),
        datasets: [
            {
                label: 'Saves',
                data: pinAnalytics.map(p => p.saves),
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
            {
                label: 'Clicks',
                data: pinAnalytics.map(p => p.clicks),
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
            },
             {
                label: 'Outbound Clicks',
                data: pinAnalytics.map(p => p.outboundClicks),
                borderColor: 'rgb(153, 102, 255)',
                backgroundColor: 'rgba(153, 102, 255, 0.5)',
            }
        ],
    };

  const keywordRankingData = {
    labels: keywordAnalytics.map((k) => `Keyword ${k.keywordId}`),
    datasets: [
      {
        label: 'Ranking',
        data: keywordAnalytics.map((k) => k.ranking),
        borderColor: 'rgb(255, 205, 86)',
        backgroundColor: 'rgba(255, 205, 86, 0.5)',
      },
    ],
  };

    const keywordVolumeData = {
        labels: keywordAnalytics.map((k) => `Keyword ${k.keywordId}`),
        datasets: [
            {
                label: 'Search Volume',
                data: keywordAnalytics.map((k) => k.searchVolume),
                backgroundColor: 'rgba(16, 185, 129, 0.5)', // Emerald
                borderColor: 'rgba(16, 185, 129, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            tooltip: { // Enable tooltips
                enabled: true,
                mode: 'index', // Show tooltips for all datasets at a specific index
                intersect: false, // Tooltip displays even if the mouse isn't directly over a point
            },
        },
        scales: { //Make scales start at 0
            y: {
                beginAtZero: true
            }
        }
    };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Analytics Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Article Analytics */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Article Views</h2>
          <Bar options={options} data={articleViewsData} />
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Article Engagement</h2>
          <Bar options={options} data={articleEngagementData} />
        </div>

        {/* Pin Analytics */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Pin Impressions</h2>
          <Line options={options} data={pinImpressionsData} />
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Pin Engagement</h2>
          <Line options={options} data={pinEngagementData} />
        </div>

        {/* Keyword Analytics */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Keyword Ranking</h2>
          <Line options={options} data={keywordRankingData} />
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Keyword Volume</h2>
          <Bar options={options} data={keywordVolumeData} />
        </div>
      </div>
    </div>
  );
}

export default Analytics;

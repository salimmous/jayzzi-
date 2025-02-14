export type AIModel = 'ideogram' | 'flux-dev' | 'midjourney' | 'imagefx';

export type ImageSize = '3:4' | '2:3' | '3:2';

export interface ArticleSection {
  id: string;
  title: string;
  content?: string;
  order: number;
}

export interface ArticleOptions {
  imagePrompt?: string;
  textPrompt?: string;
  keywords: string[];
  checkPlagiarism: boolean;
  imageCount: number;
  imageSize: ImageSize;
}

export interface Article {
  id: string;
  title: string;
  sections: ArticleSection[];
  options: ArticleOptions;
  images: string[];
  status: 'draft' | 'processing' | 'completed' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
  wordpressDraft: boolean;
  wordpressPostId?: string; // Add WordPress post ID
  wordpressUrl?: string; // Add WordPress URL
}

export interface PinData {
  id: string;
  articleId: string;
  title: string;
  description: string;
  image: string;
  interests: string[];
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  createdAt: Date;
}

export interface KeywordData {
  id: string;
  keyword: string;
  volume: number;
  followers: number;
  popularity: number;
  position: number;
  change: number;
  updatedAt: Date;
}

export interface PinMetrics {
  id: string;
  title: string;
  score: number;
  saves: number;
  position: number;
  repins: number;
  reactions: number;
  comments: number;
  createdAt: Date;
}

// Calendar Event Type
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'article' | 'pin';
  status: 'scheduled' | 'draft' | 'published';
  articleId?: string; // Link to article
  pinId?: string; // Link to pin
}

// Analytics Data Types (Placeholders)
export interface ArticleAnalytics {
  articleId: string;
  views: number;
  shares: number;
  comments: number;
  timeSpent: number;
}

export interface PinAnalytics {
  pinId: string;
  impressions: number;
  saves: number;
  clicks: number;
  outboundClicks: number;
}

export interface KeywordAnalytics {
  keywordId: string;
  searchVolume: number;
  ranking: number;
  ctr: number;
}

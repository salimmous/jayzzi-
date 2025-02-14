import { Session, SupabaseClient } from '@supabase/supabase-js';

export interface Page {
	name: string;
	href: string;
	icon: React.ForwardRefExoticComponent<
		Omit<React.SVGProps<SVGSVGElement>, 'ref'> & {
			title?: string | undefined;
			titleId?: string | undefined;
		} & React.RefAttributes<SVGSVGElement>
	>;
	current: boolean;
}

export type UserRole = 'user' | 'admin' | 'superadmin';

export interface User {
	id: string;
	email: string;
	name: string;
	avatarUrl: string;
	role: UserRole;
	organizationId: string;
}

export interface Organization {
	id: string;
	name: string;
	slug: string;
	description: string;
	logoUrl: string;
	website: string;
	createdAt: string;
	updatedAt: string;
}

export interface Settings {
	openAiApiKey: string;
	stabilityApiKey: string;
	googleApiKey: string;
	pinterestAccessToken: string;
	pinterestBoardId: string;
	wordpressUrl: string;
	wordpressUsername: string;
	wordpressPassword?: string; // Consider removing this and using application passwords
	defaultModel: AIModel;
	defaultImageSize: ImageSize;
}

export type AIModel = 'DALL-E' | 'Stable Diffusion' | 'Midjourney';
export type ImageSize = '256x256' | '512x512' | '1024x1024';

export interface Article {
	id: string;
	title: string;
	sections: ArticleSection[];
	options: ArticleOptions;
	images: string[];
	status: ArticleStatus;
	createdAt: Date;
	updatedAt: Date;
	wordpressDraft: boolean;
}

export interface ArticleSection {
	id: string;
	title: string;
	content: string;
	order: number;
}

export interface ArticleOptions {
	title: string;
	sections: { title: string }[];
	imagePrompt?: string;
	textPrompt?: string;
	keywords: string[];
	checkPlagiarism: boolean;
	imageCount: number;
	imageSize: ImageSize;
}

export type ArticleStatus = 'draft' | 'in_progress' | 'completed' | 'published';

export interface KeywordData {
	id: string;
	keyword: string;
	volume: number;
	followers: number;
	position: number;
	change: number;
	updatedAt: string;
}

export interface PinData {
	id: string;
	title: string;
	description: string;
	image: string;
	link: string;
	createdAt: string;
	updatedAt: string;
	metrics: PinMetrics;
}

export interface PinMetrics {
	saves: number;
	impressions: number;
	clicks: number;
	outboundClicks: number;
	repins: number;
	reactions: number;
	comments: number;
}

export interface CalendarEvent {
	id: string;
	title: string;
	start: Date;
	end: Date;
	allDay: boolean;
	resource?: any;
}

export interface GoogleKeywordResult {
  keyword: string;
  volume: number;
  competition: number; // Represented as a fraction (e.g., 0.5 for 50%)
  cpc: number; // Cost per click
}

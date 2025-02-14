import { create } from 'zustand';
import { Article, ArticleOptions, ArticleSection } from '../types';
import { api } from '../lib/api';
import { supabase } from '../lib/supabase';

interface ArticleStore {
  articles: Article[];
  addArticle: (article: Article) => void;
  updateArticle: (id: string, article: Partial<Article>) => void;
  deleteArticle: (id: string) => void;
  getArticle: (id: string) => Article | undefined;
  generateArticle: (title: string, options: ArticleOptions) => Promise<void>;
  generateBulkArticles: (titles: string[], options: ArticleOptions) => Promise<void>;
  downloadImages: (articleId: string) => Promise<void>;
  copyArticle: (articleId: string) => Promise<void>;
  createWordPressDraft: (articleId: string) => Promise<void>;
  regenerateImage: (articleId: string, imageIndex: number, customPrompt?: string) => Promise<void>;
}

const mockArticle: Article = {
    id: 'test-article-1',
    title: 'Test Article',
    sections: [
        { id: 'section-1', title: 'Section 1', content: 'This is the content of section 1.', order: 0 },
        { id: 'section-2', title: 'Section 2', content: 'This is the content of section 2.', order: 1 },
    ],
    options: {
        imagePrompt: 'Test image prompt',
        textPrompt: 'Test text prompt',
        keywords: ['test', 'article'],
        checkPlagiarism: false,
        imageCount: 2,
        imageSize: '3:4',
    },
    images: ['https://via.placeholder.com/300x400', 'https://via.placeholder.com/400x300'],
    status: 'completed',
    createdAt: new Date(),
    updatedAt: new Date(),
    wordpressDraft: false,
    wordpressPostId: '123',
    wordpressUrl: 'https://example.com/test-article',
};

export const useArticleStore = create<ArticleStore>((set, get) => ({
  articles: [mockArticle], // Initialize with mock data

  addArticle: (article) => set((state) => ({
    articles: [...state.articles, article]
  })),

  updateArticle: (id, article) => set((state) => ({
    articles: state.articles.map((a) =>
      a.id === id ? { ...a, ...article } : a
    ),
  })),

  deleteArticle: (id) => set((state) => ({
    articles: state.articles.filter((a) => a.id !== id),
  })),

  getArticle: (id) => get().articles.find((a) => a.id === id),

  generateArticle: async (title, options) => {
    // Implementation for article generation
  },

  generateBulkArticles: async (titles, options) => {
    // Implementation for bulk article generation
  },

  downloadImages: async (articleId) => {
    const article = get().getArticle(articleId);
    if (!article) throw new Error('Article not found');

    await api.downloadImages(article.images);
  },

  copyArticle: async (articleId) => {
    const article = get().getArticle(articleId);
    if (!article) throw new Error('Article not found');

    await api.copyArticleToClipboard(article);
  },

  createWordPressDraft: async (articleId) => {
    const article = get().getArticle(articleId);
    if (!article) throw new Error('Article not found');

    await api.createWordPressDraft(article);

    // Update article status in database
    const { error } = await supabase
      .from('articles')
      .update({ wordpressDraft: true })
      .eq('id', articleId);

    if (error) throw error;

    // Update local state
    set(state => ({
      articles: state.articles.map(a =>
        a.id === articleId ? { ...a, wordpressDraft: true } : a
      )
    }));
  },

  regenerateImage: async (articleId, imageIndex, customPrompt) => {
    const article = get().getArticle(articleId);
    if (!article) throw new Error('Article not found');

    const newImageUrl = await api.regenerateImage({
      model: article.options.model || 'ideogram',
      prompt: customPrompt || article.options.imagePrompt || '',
      size: article.options.imageSize,
    });

    // Update image in database
    const newImages = [...article.images];
    newImages[imageIndex] = newImageUrl;

    const { error } = await supabase
      .from('articles')
      .update({ images: newImages })
      .eq('id', articleId);

    if (error) throw error;

    // Update local state
    set(state => ({
      articles: state.articles.map(a =>
        a.id === articleId ? { ...a, images: newImages } : a
      )
    }));
  },
}));

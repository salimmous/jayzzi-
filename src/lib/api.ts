import { AIModel, ImageSize } from '../types';
import JSZip from 'jszip';

interface GenerateImageParams {
  model: AIModel;
  prompt: string;
  size: ImageSize;
  referenceImage?: File;
}

interface GenerateArticleParams {
  title: string;
  sections: { title: string }[];
  imagePrompt?: string;
  textPrompt?: string;
  keywords: string[];
  checkPlagiarism: boolean;
  imageCount: number;
  imageSize: ImageSize;
}

// Helper function to simulate API delay and potential errors
const simulateApiCall = async <T>(data: T, errorRate = 0.05, delay = 1000): Promise<T> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < errorRate) {
        reject(new Error('Simulated API error'));
      } else {
        resolve(data);
      }
    }, delay);
  });
};

export const api = {
  generateImage: async ({ model, prompt, size, referenceImage }: GenerateImageParams) => {
    return simulateApiCall('https://via.placeholder.com/150');
  },

  generateArticle: async (params: GenerateArticleParams) => {
    return simulateApiCall({
      id: 'dummy-article-id',
      title: params.title,
      sections: params.sections.map((s, i) => ({
        id: `section-${i}`,
        title: s.title,
        content: `This is placeholder content for section ${s.title}.`,
        order: i,
      })),
      options: params,
      images: Array(params.imageCount).fill('https://via.placeholder.com/150'),
      status: 'completed',
      createdAt: new Date(),
      updatedAt: new Date(),
      wordpressDraft: false,
    });
  },

  describeImage: async (image: File) => {
    return simulateApiCall('This is a placeholder image description.');
  },

  checkPlagiarism: async (text: string) => {
    return simulateApiCall(0.1); // 10% plagiarism
  },

  downloadImages: async (images: string[]): Promise<void> => {
    try {
      const zip = new JSZip();
      const imagePromises = images.map(async (url, index) => {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch image: ${url}`);
        const blob = await response.blob();
        const extension = url.split('.').pop() || 'jpg';
        zip.file(`image-${index + 1}.${extension}`, blob);
      });

      await Promise.all(imagePromises);
      const content = await zip.generateAsync({ type: 'blob' });
      const downloadUrl = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'article-images.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading images:', error);
      throw error; // Re-throw to handle in calling function
    }
  },

  copyArticleToClipboard: async (article: any): Promise<void> => {
    try {
      const content = article.sections.map(section => `<h2>${section.title}</h2>${section.content}`).join('\n\n');
      const imageGallery = article.images.map(url => `<figure><img src="${url}" alt="${article.title}" /></figure>`).join('\n');
      const formattedContent = `<h1>${article.title}</h1>${content}<div class="image-gallery">${imageGallery}</div>`;
      await navigator.clipboard.writeText(formattedContent);
    } catch (error) {
      console.error('Error copying article to clipboard:', error);
      throw error;
    }
  },

  createWordPressDraft: async (article: any): Promise<void> => {
    return simulateApiCall(undefined, 0.2); // Higher error rate for external API
  },

  regenerateImage: async (params: GenerateImageParams): Promise<string> => {
    return simulateApiCall('https://via.placeholder.com/150');
  },

  searchPinterest: async (keyword: string) => {
    return simulateApiCall([
      { id: '1', title: `Pin related to ${keyword} 1`, score: 90, saves: 100, position: 1, repins: 50, reactions: 20, comments: 5, createdAt: new Date() },
      { id: '2', title: `Pin related to ${keyword} 2`, score: 80, saves: 80, position: 2, repins: 40, reactions: 15, comments: 3, createdAt: new Date() },
    ], 0.1);
  },

  generatePinDescription: async (title: string, interests: string[]) => {
    return simulateApiCall(`This is a placeholder pin description for "${title}" related to ${interests.join(', ')}.`);
  },

  publishToWordPress: async (articleId: string): Promise<string> => {
    return simulateApiCall('https://your-wordpress-site.com/placeholder-post-url', 0.2);
  },

  updateWordPressPost: async (articleId: string, postId: string): Promise<void> => {
    return simulateApiCall(undefined, 0.2);
  },

  getArticleSuggestions: async (prompt: string): Promise<string[]> => {
    return simulateApiCall([
      `Suggested Article Title 1 for ${prompt}`,
      `Suggested Article Title 2 for ${prompt}`,
      `Suggested Article Title 3 for ${prompt}`,
    ]);
  },

  getKeywordSuggestions: async (keyword: string): Promise<string[]> => {
    return simulateApiCall([
      `Suggested Keyword 1 for ${keyword}`,
      `Suggested Keyword 2 for ${keyword}`,
      `Suggested Keyword 3 for ${keyword}`,
    ]);
  },

  getPinDescriptionSuggestions: async (title: string, interests: string[]): Promise<string[]> => {
    return simulateApiCall([
      `Suggested Pin Description 1 for ${title}`,
      `Suggested Pin Description 2 for ${title}`,
      `Suggested Pin Description 3 for ${title}`,
    ]);
  },
};

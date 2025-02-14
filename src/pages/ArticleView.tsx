import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, Copy, FileEdit, PenTool, RefreshCw, Pencil } from 'lucide-react';
import { useArticleStore } from '../store/articleStore';
import { formatDate } from '../lib/utils';

function ArticleView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const article = useArticleStore((state) => state.getArticle(id || ''));
  const { downloadImages, copyArticle, createWordPressDraft, regenerateImage } = useArticleStore();
  const [regeneratingImage, setRegeneratingImage] = useState<number | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState({
    download: false,
    copy: false,
    wordpress: false,
    regenerate: false
  });

  if (!article) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-700">Article not found</h2>
      </div>
    );
  }

  const handleDownloadImages = async () => {
    try {
      setLoading(prev => ({ ...prev, download: true }));
      await downloadImages(id!);
    } catch (error) {
      console.error('Failed to download images:', error);
    } finally {
      setLoading(prev => ({ ...prev, download: false }));
    }
  };

  const handleCopyArticle = async () => {
    try {
      setLoading(prev => ({ ...prev, copy: true }));
      await copyArticle(id!);
    } catch (error) {
      console.error('Failed to copy article:', error);
    } finally {
      setLoading(prev => ({ ...prev, copy: false }));
    }
  };

  const handleCreateWordPressDraft = async () => {
    try {
      setLoading(prev => ({ ...prev, wordpress: true }));
      await createWordPressDraft(id!);
    } catch (error) {
      console.error('Failed to create WordPress draft:', error);
    } finally {
      setLoading(prev => ({ ...prev, wordpress: false }));
    }
  };

  const handleRegenerateImage = async (index: number, prompt?: string) => {
    try {
      setRegeneratingImage(index);
      await regenerateImage(id!, index, prompt);
    } catch (error) {
      console.error('Failed to regenerate image:', error);
    } finally {
      setRegeneratingImage(null);
      setShowPromptModal(false);
      setCustomPrompt('');
    }
  };

  const handlePinGeneration = () => {
    navigate('/pins/generator', { state: { articleId: id } });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{article.title}</h1>
        <div className="flex space-x-4">
          <button
            onClick={handleDownloadImages}
            disabled={loading.download}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center disabled:opacity-50"
          >
            <Download size={20} className="mr-2" />
            {loading.download ? 'Downloading...' : 'Download Images'}
          </button>
          <button
            onClick={handleCopyArticle}
            disabled={loading.copy}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center disabled:opacity-50"
          >
            <Copy size={20} className="mr-2" />
            {loading.copy ? 'Copying...' : 'Copy Article'}
          </button>
          <button
            onClick={handleCreateWordPressDraft}
            disabled={loading.wordpress}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center disabled:opacity-50"
          >
            <FileEdit size={20} className="mr-2" />
            {loading.wordpress ? 'Creating...' : 'Create WordPress Draft'}
          </button>
          <button
            onClick={handlePinGeneration}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
          >
            <PenTool size={20} className="mr-2" />
            Generate Pins
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex justify-between text-sm text-gray-500 mb-4">
          <span>Created: {formatDate(article.createdAt)}</span>
          <span>Status: {article.status}</span>
        </div>

        {article.sections.map((section, index) => (
          <div key={section.id} className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
            <div className="prose max-w-none">
              {section.content && <p>{section.content}</p>}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {article.images.map((image, index) => (
          <div key={index} className="relative group">
            <img
              src={image}
              alt={`Article image ${index + 1}`}
              className="w-full h-64 object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
              <button
                onClick={() => handleRegenerateImage(index)}
                disabled={regeneratingImage === index}
                className="px-3 py-1 bg-white text-black rounded-md text-sm flex items-center"
              >
                <RefreshCw size={16} className="mr-1" />
                {regeneratingImage === index ? 'Regenerating...' : 'Regenerate'}
              </button>
              <button
                onClick={() => {
                  setSelectedImageIndex(index);
                  setShowPromptModal(true);
                }}
                className="px-3 py-1 bg-white text-black rounded-md text-sm flex items-center"
              >
                <Pencil size={16} className="mr-1" />
                Custom Prompt
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Custom Prompt Modal */}
      {showPromptModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            <h3 className="text-xl font-semibold mb-4">Custom Generation Prompt</h3>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              className="w-full p-2 border rounded-md mb-4"
              rows={4}
              placeholder="Enter custom prompt for image generation..."
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowPromptModal(false);
                  setCustomPrompt('');
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRegenerateImage(selectedImageIndex!, customPrompt)}
                disabled={!customPrompt.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                Generate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ArticleView;

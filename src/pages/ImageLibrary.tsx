import React, { useState } from 'react';
import { Download, Trash2, FolderPlus, Move } from 'lucide-react';
import { useArticleStore } from '../store/articleStore';

interface ImageItem {
  id: string;
  url: string;
  articleTitle: string;
  createdAt: Date;
  folder: string;
}

function ImageLibrary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [currentFolder, setCurrentFolder] = useState('article_images');
  const articles = useArticleStore((state) => state.articles);

  // Flatten all images from articles into a single array with metadata
  const images: ImageItem[] = articles.flatMap(article =>
    article.images.map((url, index) => ({
      id: `${article.id}-${index}`,
      url,
      articleTitle: article.title,
      createdAt: article.createdAt,
      folder: 'article_images'
    }))
  );

  const filteredImages = images.filter(image =>
    image.folder === currentFolder &&
    image.articleTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectImage = (id: string) => {
    setSelectedImages(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const handleDownload = () => {
    const selectedUrls = images
      .filter(img => selectedImages.includes(img.id))
      .map(img => img.url);

    useArticleStore.getState().downloadImages(selectedUrls);
  };

  const handleDelete = () => {
    // Implement delete logic
    console.log('Deleting selected images:', selectedImages);
  };

  const handleMove = () => {
    // Implement move logic
    console.log('Moving selected images:', selectedImages);
  };

    const handleAddFolder = () => {
        console.log("Add Folder clicked");
    }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Image Library</h1>
      </div>

      <div className="flex gap-8">
        {/* Folders Sidebar */}
        <div className="w-64 bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Folders</h2>
            <button onClick={handleAddFolder} className="text-blue-600 hover:text-blue-800">
              <FolderPlus size={20} />
            </button>
          </div>
          <div className="space-y-2">
            <button
              onClick={() => setCurrentFolder('article_images')}
              className={`w-full text-left px-3 py-2 rounded-md ${
                currentFolder === 'article_images'
                  ? 'bg-blue-50 text-blue-600'
                  : 'hover:bg-gray-50'
              }`}
            >
              article_images
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            {/* Search and Actions */}
            <div className="flex justify-between items-center mb-6">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search images in this folder..."
                  className="w-full pl-4 pr-10 py-2 border rounded-md"
                />
              </div>

              {selectedImages.length > 0 && (
                <div className="flex space-x-4">
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                  >
                    <Trash2 size={20} className="mr-2" />
                    Delete
                  </button>
                  <button
                    onClick={handleMove}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                  >
                    <Move size={20} className="mr-2" />
                    Move
                  </button>
                  <button
                    onClick={handleDownload}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
                  >
                    <Download size={20} className="mr-2" />
                    Download
                  </button>
                </div>
              )}
            </div>

            {/* Image Grid */}
            <div className="grid grid-cols-3 gap-4">
              {filteredImages.map((image) => (
                <div
                  key={image.id}
                  className={`relative group ${
                    selectedImages.includes(image.id) ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <div className="absolute top-2 left-2 z-10">
                    <input
                      type="checkbox"
                      checked={selectedImages.includes(image.id)}
                      onChange={() => handleSelectImage(image.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                  <img
                    src={image.url}
                    alt={image.articleTitle}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
                    <button
                      onClick={() => handleDownload()}
                      className="px-3 py-1 bg-white text-black rounded-md text-sm"
                    >
                      Download
                    </button>
                    <button
                      onClick={() => handleDelete()}
                      className="px-3 py-1 bg-white text-black rounded-md text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImageLibrary;

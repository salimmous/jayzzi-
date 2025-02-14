import React, { useState } from 'react';
import { useArticleStore } from '../store/articleStore';
import { PenTool, Eye, Trash2 } from 'lucide-react';
import { formatDate } from '../lib/utils';

interface PinStatus {
  articleId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  pinsGenerated: number;
}

function PinData() {
  const articles = useArticleStore((state) => state.articles);
  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);
  const [pinStatuses] = useState<PinStatus[]>([]);

  const handleSelectArticle = (id: string) => {
    setSelectedArticles(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedArticles.length === articles.length) {
      setSelectedArticles([]);
    } else {
      setSelectedArticles(articles.map(a => a.id));
    }
  };

  const handleGeneratePins = () => {
    // Implement pin generation logic
    console.log('Generating pins for:', selectedArticles);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Pin Data</h1>
        
        {selectedArticles.length > 0 && (
          <button
            onClick={handleGeneratePins}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <PenTool size={20} className="mr-2" />
            Generate Pin Content
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  checked={selectedArticles.length === articles.length}
                  onChange={handleSelectAll}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Article Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pins Generated
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {articles.map((article) => {
              const pinStatus = pinStatuses.find(p => p.articleId === article.id);
              
              return (
                <tr key={article.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedArticles.includes(article.id)}
                      onChange={() => handleSelectArticle(article.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {article.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(article.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${!pinStatus ? 'bg-gray-100 text-gray-800' :
                        pinStatus.status === 'completed' ? 'bg-green-100 text-green-800' :
                        pinStatus.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                        pinStatus.status === 'failed' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'}`}
                    >
                      {pinStatus?.status || 'Not Started'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {pinStatus?.pinsGenerated || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-4">
                      <button
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye size={20} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PinData;

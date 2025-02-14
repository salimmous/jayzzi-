import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Trash2, Filter, RotateCcw } from 'lucide-react';
import { useArticleStore } from '../store/articleStore';
import { formatDate } from '../lib/utils';

type StatusFilter = 'all' | 'completed' | 'processing' | 'rejected';
type DateFilter = 'all' | 'today' | 'week' | 'month';

function ArticleLibrary() {
  const navigate = useNavigate();
  const articles = useArticleStore((state) => state.articles);
  const deleteArticle = useArticleStore((state) => state.deleteArticle);
  
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>('all');
  const [selectedDate, setSelectedDate] = useState<DateFilter>('all');
  
  const filteredArticles = articles.filter(article => {
    const matchesStatus = selectedStatus === 'all' || article.status === selectedStatus;
    
    if (selectedDate === 'all') return matchesStatus;
    
    const articleDate = new Date(article.createdAt);
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - articleDate.getTime()) / (1000 * 60 * 60 * 24));
    
    switch (selectedDate) {
      case 'today':
        return matchesStatus && daysDiff < 1;
      case 'week':
        return matchesStatus && daysDiff < 7;
      case 'month':
        return matchesStatus && daysDiff < 30;
      default:
        return matchesStatus;
    }
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Article Library</h1>
      </div>

      {/* Filters */}
      <div className="bg-blue-500 p-4 rounded-lg mb-8 flex items-center justify-between">
        <div className="flex items-center space-x-4 text-white">
          <Filter size={20} />
          <span>Filter By</span>
          
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value as DateFilter)}
            className="bg-blue-600 text-white px-3 py-1 rounded-md border border-blue-400"
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
          
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as StatusFilter)}
            className="bg-blue-600 text-white px-3 py-1 rounded-md border border-blue-400"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="processing">Processing</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        
        <button
          onClick={() => {
            setSelectedStatus('all');
            setSelectedDate('all');
          }}
          className="flex items-center text-white hover:text-blue-100"
        >
          <RotateCcw size={16} className="mr-2" />
          Reset Filter
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Draft
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredArticles.map((article) => (
              <tr key={article.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 bg-gray-200 rounded-full flex-shrink-0" />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {article.title}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${article.status === 'completed' ? 'bg-green-100 text-green-800' :
                      article.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'}`}
                  >
                    {article.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={article.wordpressDraft}
                      readOnly
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-4">
                    <button
                      onClick={() => navigate(`/article/${article.id}`)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Eye size={20} />
                    </button>
                    <button
                      onClick={() => deleteArticle(article.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ArticleLibrary;

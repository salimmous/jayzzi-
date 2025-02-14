import React, { useState } from 'react';
import { Search, ArrowUpDown, Star, Eye } from 'lucide-react';

interface KeywordResult {
  keyword: string;
  volume: number;
  followers: number;
  popularity: number;
}

type SortField = 'keyword' | 'volume' | 'followers' | 'popularity';

function KeywordResearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [groupBySeed, setGroupBySeed] = useState(false);
  const [sortField, setSortField] = useState<SortField>('volume');
  const [sortAsc, setSortAsc] = useState(false);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [results, setResults] = useState<KeywordResult[]>([]);

  const handleSearch = () => {
    // Implement keyword search
    console.log('Searching for:', searchTerm);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const handleTrack = () => {
    // Implement keyword tracking
    console.log('Tracking selected keywords:', selectedKeywords);
  };

  const handleViewTopPins = (keyword: string) => {
    // Navigate to top pins with keyword
    console.log('Viewing top pins for:', keyword);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Keyword Research</h1>
        
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter target keyword..."
              className="pl-10 pr-4 py-2 border rounded-md w-64"
            />
            <Search
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>
          
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Search
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={groupBySeed}
                onChange={(e) => setGroupBySeed(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-2"
              />
              Group by seed
            </label>
          </div>

          {selectedKeywords.length > 0 && (
            <div className="flex space-x-4">
              <button
                onClick={handleTrack}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              >
                <Star size={16} className="mr-2" />
                Track Selected
              </button>
            </div>
          )}
        </div>
      </div>

      {results.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedKeywords.length === results.length}
                    onChange={() => {
                      if (selectedKeywords.length === results.length) {
                        setSelectedKeywords([]);
                      } else {
                        setSelectedKeywords(results.map(r => r.keyword));
                      }
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </th>
                {(['keyword', 'volume', 'followers', 'popularity'] as SortField[]).map((field) => (
                  <th
                    key={field}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort(field)}
                  >
                    <div className="flex items-center">
                      {field}
                      {sortField === field && (
                        <ArrowUpDown size={16} className="ml-1" />
                      )}
                    </div>
                  </th>
                ))}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {results.map((result) => (
                <tr key={result.keyword}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedKeywords.includes(result.keyword)}
                      onChange={() => {
                        if (selectedKeywords.includes(result.keyword)) {
                          setSelectedKeywords(prev => prev.filter(k => k !== result.keyword));
                        } else {
                          setSelectedKeywords(prev => [...prev, result.keyword]);
                        }
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {result.keyword}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {result.volume.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {result.followers.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${result.popularity}%` }}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleViewTopPins(result.keyword)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Eye size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default KeywordResearch;

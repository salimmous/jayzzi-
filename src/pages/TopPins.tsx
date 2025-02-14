import React, { useState } from 'react';
import { Search, ArrowUpDown, Star } from 'lucide-react';

interface PinResult {
  id: string;
  title: string;
  score: number;
  saves: number;
  position: number;
  createdAt: Date;
  repins: number;
  reactions: number;
  comments: number;
}

type SortField = 'score' | 'saves' | 'position' | 'createdAt' | 'repins' | 'reactions' | 'comments';

function TopPins() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('score');
  const [sortAsc, setSortAsc] = useState(false);
  const [selectedPins, setSelectedPins] = useState<string[]>([]);
  const [results, setResults] = useState<PinResult[]>([]);

  const handleSearch = () => {
    // Implement Pinterest API search
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
    console.log('Tracking selected pins:', selectedPins);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Top Pins</h1>
        
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search pins..."
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

      {results.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {selectedPins.length} selected
              </span>
              
              {selectedPins.length > 0 && (
                <button
                  onClick={handleTrack}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                >
                  <Star size={16} className="mr-2" />
                  Track Selected
                </button>
              )}
            </div>
          </div>

          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedPins.length === results.length}
                    onChange={() => {
                      if (selectedPins.length === results.length) {
                        setSelectedPins([]);
                      } else {
                        setSelectedPins(results.map(r => r.id));
                      }
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                {(['score', 'saves', 'position', 'repins', 'reactions', 'comments'] as SortField[]).map((field) => (
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
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {results.map((pin) => (
                <tr key={pin.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedPins.includes(pin.id)}
                      onChange={() => {
                        if (selectedPins.includes(pin.id)) {
                          setSelectedPins(prev => prev.filter(id => id !== pin.id));
                        } else {
                          setSelectedPins(prev => [...prev, pin.id]);
                        }
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {pin.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {pin.score}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {pin.saves}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {pin.position}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {pin.repins}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {pin.reactions}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {pin.comments}
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

export default TopPins;

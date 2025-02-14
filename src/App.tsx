import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import ArticleGenerator from './pages/ArticleGenerator';
import ArticleView from './pages/ArticleView';
import BulkGenerator from './pages/BulkGenerator';
import ImageGenerator from './pages/ImageGenerator';
import DescribeImage from './pages/DescribeImage';
import ArticleLibrary from './pages/ArticleLibrary';
import ImageLibrary from './pages/ImageLibrary';
import PinGenerator from './pages/PinGenerator';
import PinData from './pages/PinData';
import TopPins from './pages/TopPins';
import KeywordResearch from './pages/KeywordResearch';
import KeywordTracker from './pages/KeywordTracker';
import Settings from './pages/Settings';
import Login from './pages/Login';
import { initializeAuth } from './lib/supabase';
import { useAuthStore } from './lib/auth';

const queryClient = new QueryClient();

function App() {
  const { user, loading, checkAuth } = useAuthStore();

  useEffect(() => {
    const init = async () => {
      await initializeAuth();
      await checkAuth();
    };
    init();
  }, [checkAuth]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        {user ? (
          <Layout>
            <Routes>
              <Route path="/" element={<ArticleGenerator />} />
              <Route path="/article/:id" element={<ArticleView />} />
              <Route path="/bulk-generator" element={<BulkGenerator />} />
              <Route path="/image-generator" element={<ImageGenerator />} />
              <Route path="/describe-image" element={<DescribeImage />} />
              <Route path="/library/articles" element={<ArticleLibrary />} />
              <Route path="/library/images" element={<ImageLibrary />} />
              <Route path="/pins/generator" element={<PinGenerator />} />
              <Route path="/pins/data" element={<PinData />} />
              <Route path="/pins/top" element={<TopPins />} />
              <Route path="/keywords/research" element={<KeywordResearch />} />
              <Route path="/keywords/tracker" element={<KeywordTracker />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        ) : (
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        )}
      </Router>
    </QueryClientProvider>
  );
}

export default App;

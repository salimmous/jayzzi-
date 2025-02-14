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
import RecoverPassword from './pages/RecoverPassword';
import Analytics from './pages/Analytics.tsx'; // Corrected import path

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

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        {/* Always render the Layout, effectively disabling authentication */}
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
            <Route path="/login" element={<Login />} />
            <Route path="/recover-password" element={<RecoverPassword />} />
            <Route path="/analytics" element={<Analytics />} /> {/* Add the Analytics route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </QueryClientProvider>
  );
}

export default App;

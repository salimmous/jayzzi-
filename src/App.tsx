import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout.tsx'; // .tsx extension
import ArticleGenerator from './pages/ArticleGenerator.tsx'; // .tsx extension
import ArticleView from './pages/ArticleView.tsx'; // .tsx extension
import BulkGenerator from './pages/BulkGenerator.tsx'; // .tsx extension
import ImageGenerator from './pages/ImageGenerator.tsx'; // .tsx extension
import DescribeImage from './pages/DescribeImage.tsx'; // .tsx extension
import ArticleLibrary from './pages/ArticleLibrary.tsx'; // .tsx extension
import ImageLibrary from './pages/ImageLibrary.tsx'; // .tsx extension
import PinGenerator from './pages/PinGenerator.tsx'; // .tsx extension
import PinData from './pages/PinData.tsx'; // .tsx extension
import TopPins from './pages/TopPins.tsx'; // .tsx extension
import KeywordResearch from './pages/KeywordResearch.tsx'; // .tsx extension
import KeywordTracker from './pages/KeywordTracker.tsx'; // .tsx extension
import Settings from './pages/Settings.tsx'; // .tsx extension
import Login from './pages/Login.tsx'; // .tsx extension
import { initializeAuth } from './lib/supabase.ts'; // .ts extension
import { useAuthStore } from './lib/auth.ts'; // .ts extension
import RecoverPassword from './pages/RecoverPassword.tsx'; // .tsx extension
import AnalyticsComponent from './components/AnalyticsComponent.tsx'; // .tsx extension
import CalendarPage from './pages/CalendarPage.tsx'; // .tsx extension

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
            <Route path="/analytics" element={<AnalyticsComponent />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </QueryClientProvider>
  );
}

export default App;

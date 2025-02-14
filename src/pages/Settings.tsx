import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Save, Key, Globe, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { useSettingsStore } from '../lib/settings';

interface SettingsForm {
  openaiKey: string;
  midjourneyKey: string;
  wordpressUrl: string;
  wordpressToken: string;
  anthropicKey: string;
  stabilityKey: string;
  googleAiKey: string;
  replicateKey: string;
}

function Settings() {
  const { settings, loading, error, updateSettings, loadSettings } = useSettingsStore();
  const { register, handleSubmit, formState: { isDirty, isSubmitting }, reset } = useForm<SettingsForm>({
    defaultValues: settings
  });

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  useEffect(() => {
    reset(settings);
  }, [settings, reset]);

  const onSubmit = async (data: SettingsForm) => {
    try {
      await updateSettings(data);
    } catch (error) {
      console.error('Failed to update settings:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
          <AlertCircle className="mr-2" size={20} />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* API Keys */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center mb-4">
            <Key className="mr-2" size={20} />
            <h2 className="text-xl font-semibold">API Keys</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                OpenAI API Key
              </label>
              <input
                type="password"
                {...register('openaiKey')}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="sk-..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Midjourney API Key
              </label>
              <input
                type="password"
                {...register('midjourneyKey')}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Enter API key"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Anthropic API Key
              </label>
              <input
                type="password"
                {...register('anthropicKey')}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="sk-ant-..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stability AI API Key
              </label>
              <input
                type="password"
                {...register('stabilityKey')}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="sk-..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Google AI API Key
              </label>
              <input
                type="password"
                {...register('googleAiKey')}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Enter API key"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Replicate API Key
              </label>
              <input
                type="password"
                {...register('replicateKey')}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="r8_..."
              />
            </div>
          </div>
        </div>

        {/* WordPress Integration */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center mb-4">
            <Globe className="mr-2" size={20} />
            <h2 className="text-xl font-semibold">WordPress Integration</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                WordPress URL
              </label>
              <input
                type="url"
                {...register('wordpressUrl')}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="https://your-site.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                WordPress Application Password
              </label>
              <input
                type="password"
                {...register('wordpressToken')}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Enter application password"
              />
              <p className="mt-1 text-sm text-gray-500">
                Generate this in your WordPress dashboard under Users → Profile → Application Passwords
              </p>
            </div>
          </div>
        </div>

        {/* Test Connections */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center mb-4">
            <RefreshCw className="mr-2" size={20} />
            <h2 className="text-xl font-semibold">Test Connections</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center"
              onClick={() => {
                // Test OpenAI connection
              }}
            >
              <CheckCircle className="mr-2" size={16} />
              Test OpenAI
            </button>

            <button
              type="button"
              className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center"
              onClick={() => {
                // Test Midjourney connection
              }}
            >
              <CheckCircle className="mr-2" size={16} />
              Test Midjourney
            </button>

            <button
              type="button"
              className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center"
              onClick={() => {
                // Test Anthropic connection
              }}
            >
              <CheckCircle className="mr-2" size={16} />
              Test Anthropic
            </button>

            <button
              type="button"
              className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center"
              onClick={() => {
                // Test Stability connection
              }}
            >
              <CheckCircle className="mr-2" size={16} />
              Test Stability
            </button>

            <button
              type="button"
              className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center"
              onClick={() => {
                // Test Google AI connection
              }}
            >
              <CheckCircle className="mr-2" size={16} />
              Test Google AI
            </button>

            <button
              type="button"
              className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center"
              onClick={() => {
                // Test Replicate connection
              }}
            >
              <CheckCircle className="mr-2" size={16} />
              Test Replicate
            </button>

            <button
              type="button"
              className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center"
              onClick={() => {
                // Test WordPress connection
              }}
            >
              <CheckCircle className="mr-2" size={16} />
              Test WordPress
            </button>
          </div>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          disabled={!isDirty || isSubmitting}
          className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center disabled:opacity-50"
        >
          <Save className="mr-2" size={20} />
          {isSubmitting ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}

export default Settings

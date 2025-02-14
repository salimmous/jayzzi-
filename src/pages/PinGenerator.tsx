import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { PenTool, Loader2 } from 'lucide-react';
import { useArticleStore } from '../store/articleStore';
import { usePinStore } from '../store/pinStore';

interface PinFormData {
  title: string;
  interests: string;
}

function PinGenerator() {
  const location = useLocation();
  const navigate = useNavigate();
  const articleId = location.state?.articleId;
  const article = useArticleStore((state) => state.getArticle(articleId));
  const { generatePins, loading } = usePinStore();

  const { register, handleSubmit, formState: { errors } } = useForm<PinFormData>({
    defaultValues: {
      title: article?.title || '',
      interests: '',
    },
  });

  const onSubmit = async (data: PinFormData) => {
    if (!articleId) return;

    const interests = data.interests.split(',').map(i => i.trim());
    await generatePins(articleId, interests);
    navigate('/pins/data');
  };

  if (!article) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-700">Article not found</h2>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Pin Generator</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Title */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Pin Title</h2>
          <input
            type="text"
            {...register('title', { required: 'Title is required' })}
            className="w-full p-2 border rounded-md"
            placeholder="Enter pin title"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Interests */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Pinterest Interests</h2>
          <input
            type="text"
            {...register('interests', { required: 'At least one interest is required' })}
            className="w-full p-2 border rounded-md"
            placeholder="Enter interests separated by commas"
          />
          {errors.interests && (
            <p className="mt-1 text-sm text-red-600">{errors.interests.message}</p>
          )}
          <p className="mt-2 text-sm text-gray-500">
            Example: cooking, healthy recipes, meal planning
          </p>
        </div>

        {/* Preview */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Article Images</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {article.images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image}
                  alt={`Article image ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute top-2 right-2">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 animate-spin" size={20} />
              Generating Pins...
            </>
          ) : (
            <>
              <PenTool className="mr-2" size={20} />
              Generate Pins
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default PinGenerator

import React from 'react';
import { useForm } from 'react-hook-form';
import { Settings, FileText } from 'lucide-react';
import { AIModel, ImageSize } from '../types';

interface BulkFormData {
  titles: string;
  model: AIModel;
  sections: { title: string }[];
  imagePrompt: string;
  textPrompt: string;
  keywords: string;
  checkPlagiarism: boolean;
  imageCount: number;
  imageSize: ImageSize;
}

function BulkGenerator() {
  const { register, handleSubmit, watch, setValue } = useForm<BulkFormData>({
    defaultValues: {
      sections: [{ title: '' }],
      model: 'ideogram',
      imageCount: 1,
      imageSize: '3:4',
      checkPlagiarism: false,
    },
  });

  const onSubmit = (data: BulkFormData) => {
    const titles = data.titles.split('\n').filter(title => title.trim());
    console.log({ ...data, titles });
    // Placeholder: In a real application, you would send this data to an API
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Bulk Article Generator</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Model Selection */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">AI Model</h2>
          <select
            {...register('model')}
            className="w-full p-2 border rounded-md"
          >
            <option value="ideogram">Ideogram</option>
            <option value="flux-dev">Flux-dev</option>
            <option value="midjourney">Midjourney</option>
          </select>
        </div>

        {/* Titles */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Article Titles</h2>
          <textarea
            {...register('titles')}
            className="w-full p-2 border rounded-md"
            rows={10}
            placeholder="Enter one title per line..."
          />
        </div>

        {/* Sections */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Shared Sections</h2>
          <div className="space-y-4">
            {watch('sections').map((_, index) => (
              <input
                key={index}
                type="text"
                {...register(`sections.${index}.title`)}
                className="w-full p-2 border rounded-md"
                placeholder={`Section ${index + 1} title`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              const sections = watch('sections');
              sections.push({ title: '' });
              setValue('sections', sections);
            }}
            className="mt-4 px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Add Section
          </button>
        </div>

        {/* Advanced Options */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center mb-4">
            <Settings className="mr-2" size={20} />
            <h2 className="text-xl font-semibold">Shared Settings</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block mb-2 font-medium">Image Prompt</label>
              <textarea
                {...register('imagePrompt')}
                className="w-full p-2 border rounded-md"
                rows={3}
                placeholder="Enter image generation instructions..."
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Text Prompt</label>
              <textarea
                {...register('textPrompt')}
                className="w-full p-2 border rounded-md"
                rows={3}
                placeholder="Enter article style/tone guidance..."
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Keywords</label>
              <input
                type="text"
                {...register('keywords')}
                className="w-full p-2 border rounded-md"
                placeholder="Enter keywords separated by commas"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                {...register('checkPlagiarism')}
                className="mr-2"
              />
              <label>Enable Plagiarism Check</label>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block mb-2 font-medium">Images per Article</label>
                <input
                  type="range"
                  {...register('imageCount')}
                  min="1"
                  max="50"
                  className="w-full"
                />
                <div className="text-sm text-gray-500 mt-1">
                  {watch('imageCount')} images
                </div>
              </div>

              <div>
                <label className="block mb-2 font-medium">Image Size</label>
                <div className="flex space-x-4">
                  {(['3:4', '2:3', '3:2'] as ImageSize[]).map((size) => (
                    <label key={size} className="flex items-center">
                      <input
                        type="radio"
                        {...register('imageSize')}
                        value={size}
                        className="mr-2"
                      />
                      {size}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center"
        >
          <FileText className="mr-2" size={20} />
          Generate Articles
        </button>
      </form>
    </div>
  );
}

export default BulkGenerator;

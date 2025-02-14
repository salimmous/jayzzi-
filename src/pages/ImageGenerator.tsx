import React from 'react';
import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import { Image, Upload } from 'lucide-react';
import { AIModel, ImageSize } from '../types';

interface ImageFormData {
  model: AIModel;
  prompt: string;
  imageCount: number;
  imageSize: ImageSize;
}

function ImageGenerator() {
  const { register, handleSubmit, watch } = useForm<ImageFormData>({
    defaultValues: {
      model: 'ideogram',
      imageCount: 1,
      imageSize: '3:4',
    },
  });

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxFiles: 1,
  });

  const onSubmit = (data: ImageFormData) => {
    console.log({ ...data, referenceImage: acceptedFiles[0] });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Image Generator</h1>

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
            <option value="imagefx">Google ImageFX</option>
          </select>
          {watch('model') === 'imagefx' && (
            <p className="mt-2 text-sm text-gray-600">
              Google ImageFX uses advanced AI to generate high-quality images with enhanced artistic control
            </p>
          )}
        </div>

        {/* Reference Image Upload */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Reference Image (Optional)</h2>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
              ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto mb-4" size={32} />
            {acceptedFiles.length > 0 ? (
              <p className="text-sm text-gray-600">
                Selected: {acceptedFiles[0].name}
              </p>
            ) : (
              <p className="text-sm text-gray-600">
                Drag & drop an image here, or click to select
              </p>
            )}
          </div>
        </div>

        {/* Prompt */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Image Prompt</h2>
          <textarea
            {...register('prompt')}
            className="w-full p-2 border rounded-md"
            rows={4}
            placeholder="Describe the image you want to generate..."
          />
          {watch('model') === 'imagefx' && (
            <p className="mt-2 text-sm text-gray-600">
              For best results with ImageFX, be specific about artistic style, lighting, and composition
            </p>
          )}
        </div>

        {/* Generation Settings */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Generation Settings</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block mb-2 font-medium">Number of Images</label>
              <input
                type="range"
                {...register('imageCount')}
                min="1"
                max="6"
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

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center"
        >
          <Image className="mr-2" size={20} />
          Generate Images
        </button>
      </form>
    </div>
  );
}

export default ImageGenerator;

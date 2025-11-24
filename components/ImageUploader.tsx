import React, { useCallback, useState } from 'react';
import { Icons } from './Icon';

interface ImageUploaderProps {
  onImageSelected: (base64: string, mimeType: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected }) => {
  const [isDragging, setIsDragging] = useState(false);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      const [prefix, data] = result.split(',');
      const mimeType = prefix.match(/:(.*?);/)?.[1] || 'image/png';
      onImageSelected(data, mimeType);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div 
      className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 ease-in-out cursor-pointer flex flex-col items-center justify-center h-80 group
        ${isDragging 
          ? 'border-blue-500 bg-blue-500/10' 
          : 'border-gray-600 hover:border-blue-400 hover:bg-gray-800/50'
        }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <input 
        type="file" 
        accept="image/*" 
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        onChange={handleInputChange}
      />
      
      <div className="bg-gray-800 p-4 rounded-full mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
        <Icons.Upload className="w-8 h-8 text-blue-400" />
      </div>
      <h3 className="text-xl font-semibold mb-2 text-gray-200">Upload an image</h3>
      <p className="text-gray-400 text-center max-w-xs">
        Drag and drop your image here, or click to browse.
      </p>
      <div className="mt-4 px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-500 font-mono">
        Supports JPG, PNG, WEBP
      </div>
    </div>
  );
};

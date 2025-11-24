import React from 'react';
import { Icons } from './Icon';

interface ResultViewProps {
  originalImage: string; // Base64 data only
  originalMimeType: string;
  generatedImage: string | null; // Base64 data only
  isProcessing: boolean;
}

export const ResultView: React.FC<ResultViewProps> = ({ 
  originalImage, 
  originalMimeType,
  generatedImage, 
  isProcessing 
}) => {
  const originalSrc = `data:${originalMimeType};base64,${originalImage}`;
  const generatedSrc = generatedImage ? `data:image/png;base64,${generatedImage}` : null;

  const downloadImage = (src: string, filename: string) => {
    const link = document.createElement('a');
    link.href = src;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full animate-fade-in">
      {/* Original Image */}
      <div className="flex-1 bg-gray-800/40 rounded-xl p-4 border border-gray-700">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">Original</span>
        </div>
        <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-gray-900/50 flex items-center justify-center border border-gray-700/50">
          <img 
            src={originalSrc} 
            alt="Original" 
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Generated Image or Loading State */}
      <div className="flex-1 bg-gray-800/40 rounded-xl p-4 border border-gray-700 relative overflow-hidden">
        {isProcessing && (
           <div className="absolute inset-0 z-20 bg-gray-900/80 backdrop-blur-sm flex flex-col items-center justify-center">
             <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <Icons.Sparkles className="w-6 h-6 text-blue-400 animate-pulse" />
                </div>
             </div>
             <p className="mt-4 text-blue-200 font-medium animate-pulse">Consulting the AI models...</p>
           </div>
        )}

        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium text-blue-400 uppercase tracking-wider flex items-center gap-2">
            <Icons.Wand className="w-4 h-4" />
            Result
          </span>
          {generatedSrc && !isProcessing && (
            <button 
              onClick={() => downloadImage(generatedSrc, 'edited-image.png')}
              className="text-gray-400 hover:text-white transition-colors"
              title="Download"
            >
              <Icons.Download className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-gray-900/50 flex items-center justify-center border border-gray-700/50">
          {generatedSrc ? (
            <img 
              src={generatedSrc} 
              alt="Generated" 
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-600 p-6 text-center">
              {!isProcessing && (
                <>
                  <Icons.Image className="w-12 h-12 mb-2 opacity-20" />
                  <p className="text-sm">Your edited image will appear here</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { ResultView } from './components/ResultView';
import { Icons } from './components/Icon';
import { generateEditedImage } from './services/geminiService';
import { AppState } from './types';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/png');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleImageSelected = (base64: string, type: string) => {
    setOriginalImage(base64);
    setMimeType(type);
    setGeneratedImage(null);
    setError(null);
    setAppState(AppState.READY_TO_EDIT);
  };

  const handleReset = () => {
    setOriginalImage(null);
    setGeneratedImage(null);
    setPrompt('');
    setError(null);
    setAppState(AppState.IDLE);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!originalImage || !prompt.trim() || appState === AppState.PROCESSING) return;

    setAppState(AppState.PROCESSING);
    setError(null);

    try {
      const resultBase64 = await generateEditedImage(originalImage, mimeType, prompt);
      setGeneratedImage(resultBase64);
      setAppState(AppState.COMPLETE);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred while processing the image.');
      setAppState(AppState.ERROR);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-tr from-blue-500 to-purple-500 p-2 rounded-lg">
              <Icons.Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              PixelMagic AI
            </h1>
          </div>
          <div className="flex items-center gap-4">
             {originalImage && (
                <button 
                  onClick={handleReset}
                  className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                >
                  <Icons.Refresh className="w-4 h-4" />
                  New Image
                </button>
             )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-5xl mx-auto space-y-8">
          
          {/* Hero / Introduction (only when idle) */}
          {appState === AppState.IDLE && (
             <div className="text-center space-y-4 mb-12 animate-fade-in-up">
               <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                 Reimagine your images <br/> with <span className="text-blue-500">Gemini 2.5</span>
               </h2>
               <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                 Upload an image and simply describe how you want to change it. 
                 Remove objects, change backgrounds, or apply artistic styles using natural language.
               </p>
             </div>
          )}

          {/* Upload Area */}
          {!originalImage && (
            <div className="max-w-2xl mx-auto">
              <ImageUploader onImageSelected={handleImageSelected} />
              
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                 {[
                   "Remove the red mark",
                   "Make the background a futuristic city",
                   "Turn this into a sketch"
                 ].map((example, i) => (
                   <div key={i} className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50 text-sm text-gray-400 text-center">
                     "{example}"
                   </div>
                 ))}
              </div>
            </div>
          )}

          {/* Editor Interface */}
          {originalImage && (
            <div className="space-y-6">
              
              {/* Prompt Input */}
              <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 shadow-xl">
                 <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-grow relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icons.Wand className="h-5 w-5 text-gray-500" />
                      </div>
                      <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Describe your edit (e.g., 'Remove the red circle', 'Add sunglasses')"
                        className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg leading-5 bg-gray-900 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
                        disabled={appState === AppState.PROCESSING}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={!prompt.trim() || appState === AppState.PROCESSING}
                      className={`inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white transition-all
                        ${(!prompt.trim() || appState === AppState.PROCESSING)
                          ? 'bg-gray-700 cursor-not-allowed text-gray-400'
                          : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                        }`}
                    >
                      {appState === AppState.PROCESSING ? 'Generating...' : 'Generate Edit'}
                      <Icons.Sparkles className="ml-2 -mr-1 h-4 w-4" />
                    </button>
                 </form>
              </div>

              {/* Error Display */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-start gap-3 animate-fade-in">
                  <Icons.Alert className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-red-200">Generation Failed</h3>
                    <p className="text-sm text-red-300/80 mt-1">{error}</p>
                  </div>
                  <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300">
                    <Icons.X className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* Results */}
              <ResultView 
                originalImage={originalImage} 
                originalMimeType={mimeType}
                generatedImage={generatedImage}
                isProcessing={appState === AppState.PROCESSING}
              />
            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-6 mt-8">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>Powered by Google Gemini 2.5 Flash Image Model</p>
        </div>
      </footer>
    </div>
  );
};

export default App;

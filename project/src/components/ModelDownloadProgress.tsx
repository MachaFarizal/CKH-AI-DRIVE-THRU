import React, { useEffect, useState } from 'react';
import { Download, CheckCircle, AlertCircle } from 'lucide-react';

interface ModelDownloadProgressProps {
  onComplete: () => void;
}

const ModelDownloadProgress: React.FC<ModelDownloadProgressProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const handleModelProgress = (event: CustomEvent) => {
      const { modelName, progress } = event.detail;
      setProgress(prev => ({
        ...prev,
        [modelName]: progress
      }));
    };

    const handleModelError = (event: CustomEvent) => {
      setError(event.detail.error);
    };

    const handleModelComplete = () => {
      setCompleted(true);
      onComplete();
    };

    window.addEventListener('model-download-progress', handleModelProgress as EventListener);
    window.addEventListener('model-download-error', handleModelError as EventListener);
    window.addEventListener('model-download-complete', handleModelComplete as EventListener);

    return () => {
      window.removeEventListener('model-download-progress', handleModelProgress as EventListener);
      window.removeEventListener('model-download-error', handleModelError as EventListener);
      window.removeEventListener('model-download-complete', handleModelComplete as EventListener);
    };
  }, [onComplete]);

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <div className="flex items-center space-x-3 text-red-600 mb-4">
            <AlertCircle className="h-6 w-6" />
            <h3 className="text-lg font-medium">Download Error</h3>
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!completed) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Download className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-medium">Downloading Models</h3>
          </div>
          
          <div className="space-y-4">
            {Object.entries(progress).map(([modelName, value]) => (
              <div key={modelName}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{modelName}</span>
                  <span className="text-gray-900">{Math.round(value)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {Object.keys(progress).length === 0 && (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};
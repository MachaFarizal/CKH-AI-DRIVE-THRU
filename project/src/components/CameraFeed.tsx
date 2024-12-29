import React, { useEffect, useRef, useState } from 'react';
import { Camera, AlertCircle, Loader } from 'lucide-react';
import { useCameraStore } from '../stores/cameraStore';
import DetectionOverlay from './analytics/DetectionOverlay';
import { ModelManager } from '../lib/videoAnalytics/models/ModelManager';

interface CameraFeedProps {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'error';
  deviceId?: string;
  rtspUrl?: string;
}

const CameraFeed: React.FC<CameraFeedProps> = ({ id, name, status, deviceId, rtspUrl }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [modelState, setModelState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const toggleCamera = useCameraStore((state) => state.toggleCamera);

  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 3;
    const retryDelay = 2000;

    const initializeModels = async () => {
      try {
        setModelState('loading');
        const modelManager = ModelManager.getInstance();
        console.log('Attempting to initialize ModelManager...');
        await modelManager.initialize();
        console.log('ModelManager initialized successfully');
        setModelState('ready');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('Failed to initialize models:', {
          error,
          errorMessage,
          retryCount,
          maxRetries
        });
        
        if (retryCount < maxRetries) {
          retryCount++;
          setErrorMessage(`Initialization failed: ${errorMessage}. Retrying... (${retryCount}/${maxRetries})`);
          setTimeout(initializeModels, retryDelay);
        } else {
          setModelState('error');
          setErrorMessage(`Failed to initialize models: ${errorMessage}. Please refresh the page.`);
        }
      }
    };

    initializeModels();

    return () => {
      setModelState('loading');
      setErrorMessage('');
    };
  }, []);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startStream = async () => {
      if (status === 'active' && deviceId) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: { exact: deviceId } }
          });
          
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error('Error accessing camera:', error);
        }
      }
    };

    startStream();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [status, deviceId]);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="aspect-video bg-gray-900 relative">
        {modelState === 'loading' ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center space-y-2">
              <Loader className="h-8 w-8 text-blue-500 animate-spin" />
              <p className="text-sm text-gray-400">
                {errorMessage || 'Loading models...'}
              </p>
            </div>
          </div>
        ) : modelState === 'error' ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center space-y-2 text-red-500">
              <AlertCircle className="h-8 w-8" />
              <p className="text-sm text-center px-4">{errorMessage}</p>
            </div>
          </div>
        ) : status === 'active' ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            <DetectionOverlay videoRef={videoRef} />
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            {status === 'inactive' ? (
              <Camera className="h-16 w-16 text-gray-600" />
            ) : (
              <AlertCircle className="h-16 w-16 text-red-500" />
            )}
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium text-gray-900">{name}</h3>
            <p className="text-sm text-gray-500">Camera ID: {id}</p>
          </div>
          <button
            onClick={() => toggleCamera(id)}
            className={`px-4 py-2 rounded-lg ${
              status === 'active'
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {status === 'active' ? 'Stop' : 'Start'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CameraFeed;
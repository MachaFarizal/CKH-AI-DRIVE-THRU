import React, { useEffect, useState } from 'react';
import { Camera as CameraIcon, AlertCircle } from 'lucide-react';

interface CameraDevice {
  deviceId: string;
  label: string;
}

interface CameraSelectProps {
  onSelect: (deviceId: string) => void;
  selectedDeviceId?: string;
}

const CameraSelect: React.FC<CameraSelectProps> = ({ onSelect, selectedDeviceId }) => {
  const [cameras, setCameras] = useState<CameraDevice[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCameras = async () => {
      try {
        setLoading(true);
        setError('');

        // First, request permission
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop()); // Stop the stream after getting permission

        // Then enumerate devices
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');

        if (videoDevices.length === 0) {
          setError('No cameras detected. Please make sure a camera is connected.');
        }

        setCameras(videoDevices.map(device => ({
          deviceId: device.deviceId,
          label: device.label || `Camera ${devices.indexOf(device) + 1}`
        })));
      } catch (err: any) {
        console.error('Error accessing cameras:', err);
        if (err.name === 'NotAllowedError') {
          setError('Camera access denied. Please allow camera access in your browser settings.');
        } else if (err.name === 'NotFoundError') {
          setError('No camera detected. Please connect a camera and try again.');
        } else {
          setError(`Error accessing camera: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    getCameras();

    // Set up device change listener
    const handleDeviceChange = () => {
      getCameras();
    };

    navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange);

    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', handleDeviceChange);
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Select Camera
        </label>
        <div className="flex items-center text-sm text-gray-500">
          <div className="animate-spin mr-2">
            <CameraIcon className="h-5 w-5" />
          </div>
          Detecting cameras...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Select Camera
        </label>
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Camera Error</h3>
              <div className="mt-2 text-sm text-red-700">
                {error}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Select Camera
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <CameraIcon className="h-5 w-5 text-gray-400" />
        </div>
        <select
          className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={selectedDeviceId}
          onChange={(e) => onSelect(e.target.value)}
        >
          <option value="">Choose a camera...</option>
          {cameras.map((camera) => (
            <option key={camera.deviceId} value={camera.deviceId}>
              {camera.label}
            </option>
          ))}
        </select>
      </div>
      {cameras.length === 0 && (
        <p className="mt-2 text-sm text-gray-500">
          No cameras detected. Please connect a camera and refresh the page.
        </p>
      )}
    </div>
  );
};

export default CameraSelect;
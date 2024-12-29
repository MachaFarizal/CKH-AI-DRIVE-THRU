import React, { useState } from 'react';
import { Camera } from 'lucide-react';
import CameraSelect from './CameraSelect';
import CameraPreview from './CameraPreview';

interface CameraInputProps {
  id: string;
  name: string;
  rtspUrl: string;
  onUpdate: (id: string, data: { name: string; rtspUrl: string; deviceId?: string }) => void;
}

const CameraInput = ({ id, name, rtspUrl, onUpdate }: CameraInputProps) => {
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [cameraType, setCameraType] = useState<'webcam' | 'rtsp'>('webcam');

  const handleDeviceSelect = (deviceId: string) => {
    setSelectedDeviceId(deviceId);
    onUpdate(id, { name, rtspUrl, deviceId });
  };

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex items-center gap-3">
        <Camera className="h-5 w-5 text-blue-600" />
        <h4 className="font-medium text-gray-900">{name}</h4>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Camera Type</label>
          <div className="mt-2 space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name={`camera-type-${id}`}
                value="webcam"
                checked={cameraType === 'webcam'}
                onChange={(e) => setCameraType(e.target.value as 'webcam' | 'rtsp')}
              />
              <span className="ml-2">Webcam/Connected Camera</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name={`camera-type-${id}`}
                value="rtsp"
                checked={cameraType === 'rtsp'}
                onChange={(e) => setCameraType(e.target.value as 'webcam' | 'rtsp')}
              />
              <span className="ml-2">IP Camera (RTSP)</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Camera Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => onUpdate(id, { name: e.target.value, rtspUrl })}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        
        {cameraType === 'webcam' ? (
          <>
            <CameraSelect onSelect={handleDeviceSelect} selectedDeviceId={selectedDeviceId} />
            {selectedDeviceId && <CameraPreview deviceId={selectedDeviceId} />}
          </>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700">RTSP URL</label>
            <input
              type="text"
              value={rtspUrl}
              onChange={(e) => onUpdate(id, { name, rtspUrl: e.target.value })}
              placeholder="rtsp://username:password@camera-ip:554/stream"
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraInput;
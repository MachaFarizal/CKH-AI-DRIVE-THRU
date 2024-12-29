import React from 'react';
import { Plus } from 'lucide-react';
import CameraInput from './CameraInput';
import { useCameraStore } from '../../../stores/cameraStore';

interface CameraSettingsProps {}

const CameraSettings: React.FC<CameraSettingsProps> = () => {
  const { cameras, addCamera, updateCamera, removeCamera } = useCameraStore();

  const handleCameraUpdate = (id: string, data: { name: string; rtspUrl: string; deviceId?: string }) => {
    updateCamera(id, data);
  };

  const handleAddCamera = () => {
    addCamera({
      name: `Camera ${cameras.length + 1}`,
      type: 'webcam',
      rtspUrl: '',
    });
  };

  const handleSaveChanges = () => {
    // Changes are automatically persisted through Zustand
    alert('Camera settings saved successfully!');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Camera Inputs</h3>
        <button
          onClick={handleAddCamera}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Camera
        </button>
      </div>

      <div className="space-y-4">
        {cameras.map(camera => (
          <CameraInput
            key={camera.id}
            id={camera.id}
            name={camera.name}
            rtspUrl={camera.rtspUrl || ''}
            onUpdate={handleCameraUpdate}
          />
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSaveChanges}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default CameraSettings;
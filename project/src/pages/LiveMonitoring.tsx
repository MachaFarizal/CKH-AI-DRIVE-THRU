import React from 'react';
import { Plus } from 'lucide-react';
import CameraFeed from '../components/CameraFeed';
import CustomerAlert from '../components/CustomerAlert';
import { useCameraStore } from '../stores/cameraStore';
import { useNavigate } from 'react-router-dom';

interface LiveMonitoringProps {}

const LiveMonitoring: React.FC<LiveMonitoringProps> = () => {
  const navigate = useNavigate();
  const cameras = useCameraStore((state) => state.cameras);
  
  const handleConfigureCameras = () => {
    navigate('/settings');
  };

  const mockCustomer = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    license_plate: 'ABC123',
    visit_count: 15,
    last_visit: new Date(),
    created_at: new Date(),
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Live Monitoring</h1>
        <button 
          onClick={handleConfigureCameras}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Configure Cameras
        </button>
      </div>

      {cameras.length === 0 ? (
        <div className="text-center py-12">
          <Plus className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No cameras configured</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding a camera in settings.</p>
          <div className="mt-6">
            <button
              onClick={handleConfigureCameras}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Camera
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {cameras.map((camera) => (
            <CameraFeed
              key={camera.id}
              id={camera.id}
              name={camera.name}
              status={camera.isActive ? 'active' : 'inactive'}
              deviceId={camera.deviceId}
              rtspUrl={camera.rtspUrl}
            />
          ))}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Customer Alerts</h2>
        <div className="space-y-4">
          <CustomerAlert customer={mockCustomer} />
        </div>
      </div>
    </div>
  );
};

export default LiveMonitoring;
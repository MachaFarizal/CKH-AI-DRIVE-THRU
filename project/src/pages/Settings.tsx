import React from 'react';
import { Camera, Bell, Shield, Sliders } from 'lucide-react';
import SettingsCard from '../components/settings/SettingsCard';
import CameraSettings from '../components/settings/camera/CameraSettings';

const Settings = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <SettingsCard
          title="Camera Configuration"
          description="Manage your camera settings, positions, and detection zones"
          icon={Camera}
        >
          <CameraSettings />
        </SettingsCard>

        {/* Other settings cards remain unchanged */}
      </div>
    </div>
  );
};

export default Settings;
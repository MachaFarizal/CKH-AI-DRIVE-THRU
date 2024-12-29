import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SettingsCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  children: React.ReactNode;
}

const SettingsCard = ({ title, description, icon: Icon, children }: SettingsCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-start gap-4">
        <Icon className="h-6 w-6 text-blue-600 mt-1" />
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
          <div className="mt-4">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default SettingsCard;
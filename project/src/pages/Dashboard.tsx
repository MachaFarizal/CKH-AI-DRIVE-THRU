import React from 'react';
import { Clock, Users, AlertTriangle, Car } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Drive-Thru Analytics Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Clock className="h-8 w-8 text-blue-600" />}
          title="Avg. Service Time"
          value="2m 45s"
          delta="-15s"
          deltaType="positive"
        />
        <StatCard
          icon={<Users className="h-8 w-8 text-green-600" />}
          title="Customers Today"
          value="247"
          delta="+12%"
          deltaType="positive"
        />
        <StatCard
          icon={<AlertTriangle className="h-8 w-8 text-yellow-600" />}
          title="Delayed Orders"
          value="3"
          delta="+1"
          deltaType="negative"
        />
        <StatCard
          icon={<Car className="h-8 w-8 text-purple-600" />}
          title="Current Queue"
          value="4"
          delta="Normal"
          deltaType="neutral"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Customers</h2>
          {/* Customer list component will go here */}
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Today's Performance</h2>
          {/* Performance chart component will go here */}
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  delta: string;
  deltaType: 'positive' | 'negative' | 'neutral';
}

const StatCard = ({ icon, title, value, delta, deltaType }: StatCardProps) => {
  const deltaColors = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600',
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        {icon}
        <span className={`text-sm font-medium ${deltaColors[deltaType]}`}>
          {delta}
        </span>
      </div>
      <h3 className="mt-4 text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
    </div>
  );
};

export default Dashboard;
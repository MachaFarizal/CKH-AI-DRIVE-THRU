import React from 'react';
import { Clock, Users, AlertTriangle, TrendingUp } from 'lucide-react';
import MetricsCard from '../components/analytics/MetricsCard';
import ServiceTimeChart from '../components/charts/ServiceTimeChart';
import PerformanceTable from '../components/analytics/PerformanceTable';

const Analytics = () => {
  const mockServiceTimeData = [
    { hour: '9AM', avgTime: 145 },
    { hour: '10AM', avgTime: 165 },
    { hour: '11AM', avgTime: 185 },
    { hour: '12PM', avgTime: 220 },
    { hour: '1PM', avgTime: 195 },
    { hour: '2PM', avgTime: 160 },
  ];

  const mockPerformanceData = [
    { time: '9:00 AM', customers: 12, avgServiceTime: '2m 15s', status: 'good' },
    { time: '10:00 AM', customers: 15, avgServiceTime: '2m 45s', status: 'warning' },
    { time: '11:00 AM', customers: 20, avgServiceTime: '3m 10s', status: 'critical' },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <div className="flex space-x-4">
          <select className="rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            <option>Today</option>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricsCard
          title="Average Service Time"
          value="2m 45s"
          icon={Clock}
          trend={{ value: '-15s', positive: true }}
        />
        <MetricsCard
          title="Total Customers"
          value="247"
          icon={Users}
          trend={{ value: '+12%', positive: true }}
        />
        <MetricsCard
          title="Delayed Orders"
          value="3"
          icon={AlertTriangle}
          trend={{ value: '+1', positive: false }}
        />
        <MetricsCard
          title="Efficiency Rate"
          value="94%"
          icon={TrendingUp}
          trend={{ value: '+2%', positive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Service Time Trends</h2>
          <ServiceTimeChart data={mockServiceTimeData} />
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Hourly Performance</h2>
          <PerformanceTable data={mockPerformanceData} />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
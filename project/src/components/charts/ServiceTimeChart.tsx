import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ServiceTimeData {
  hour: string;
  avgTime: number;
}

interface ServiceTimeChartProps {
  data: ServiceTimeData[];
}

const ServiceTimeChart = ({ data }: ServiceTimeChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="hour" />
        <YAxis label={{ value: 'Average Time (seconds)', angle: -90, position: 'insideLeft' }} />
        <Tooltip />
        <Bar dataKey="avgTime" fill="#3B82F6" name="Average Service Time" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ServiceTimeChart;
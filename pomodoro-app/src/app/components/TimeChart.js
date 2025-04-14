'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../context/ThemeContext';

export default function TimeChart({ data, dataKey, xKey }) {
  const { theme } = useTheme();

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-md">
          <p className="text-sm text-gray-700 dark:text-gray-300">{`${label}: ${payload[0].value} minutes`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke={theme === 'dark' ? '#374151' : '#e5e7eb'}
        />
        <XAxis
          dataKey={xKey}
          tick={{ fill: theme === 'dark' ? '#9ca3af' : '#4b5563' }}
          axisLine={{ stroke: theme === 'dark' ? '#4b5563' : '#d1d5db' }}
          tickLine={false}
          fontSize={12}
        />
        <YAxis
          tick={{ fill: theme === 'dark' ? '#9ca3af' : '#4b5563' }}
          axisLine={{ stroke: theme === 'dark' ? '#4b5563' : '#d1d5db' }}
          tickLine={false}
          fontSize={12}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar
          dataKey={dataKey}
          fill={theme === 'dark' ? '#3b82f6' : '#60a5fa'}
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
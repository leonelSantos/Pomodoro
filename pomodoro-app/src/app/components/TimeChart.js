'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { theme } from 'antd';
import { useTheme } from '../context/ThemeContext';

export default function TimeChart({ data, dataKey, xKey }) {
  const { theme: currentTheme } = useTheme();
  const { token } = theme.useToken();

  // Custom tooltip component styled with Ant Design
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ 
          background: token.colorBgContainer,
          border: `1px solid ${token.colorBorderSecondary}`,
          padding: token.paddingXS,
          borderRadius: token.borderRadiusLG,
          boxShadow: token.boxShadowSecondary
        }}>
          <p style={{ 
            color: token.colorTextSecondary,
            margin: 0,
            fontSize: token.fontSizeSM
          }}>
            {`${label}: ${payload[0].value} minutes`}
          </p>
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
          stroke={currentTheme === 'dark' ? token.colorBorderSecondary : token.colorBorderSecondary}
        />
        <XAxis
          dataKey={xKey}
          tick={{ fill: token.colorTextSecondary }}
          axisLine={{ stroke: token.colorBorderSecondary }}
          tickLine={false}
          fontSize={token.fontSizeSM}
        />
        <YAxis
          tick={{ fill: token.colorTextSecondary }}
          axisLine={{ stroke: token.colorBorderSecondary }}
          tickLine={false}
          fontSize={token.fontSizeSM}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar
          dataKey={dataKey}
          fill={token.colorPrimary}
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
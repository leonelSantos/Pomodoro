'use client';

import { Button } from 'antd';
import { BulbOutlined, BulbFilled } from '@ant-design/icons';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button 
      type="text"
      icon={theme === 'dark' ? <BulbOutlined /> : <BulbFilled />}
      onClick={toggleTheme} 
      size="large"
      style={{
        color: theme === 'dark' ? '#fadb14' : '#1677ff',
      }}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    />
  );
}
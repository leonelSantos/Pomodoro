'use client';

import { Typography } from 'antd';
import PomodoroTimer from './components/PomodoroTimer';

const { Title } = Typography;

export default function Home() {
  return (
    <div style={{ maxWidth: '800px', width: '100%', margin: '0 auto' }}>
      <PomodoroTimer />
    </div>
  );
}
'use client';

import { Typography } from 'antd';
import TimeStats from '../components/TimeStats';

const { Title } = Typography;

export default function Stats() {
  return (
    <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto' }}>
      <TimeStats />
    </div>
  );
}
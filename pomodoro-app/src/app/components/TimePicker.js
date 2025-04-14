'use client';

import { useState } from 'react';
import { Card, InputNumber, Button, Row, Col, Typography, Space, Divider } from 'antd';
import { ClockCircleOutlined, CoffeeOutlined } from '@ant-design/icons';
import { usePomodoroContext } from '../context/PomodoroContext';

const { Title, Text } = Typography;

export default function TimePicker() {
  const { state, dispatch } = usePomodoroContext();
  const { workDuration, breakDuration } = state.settings;
  const { isRunning } = state.timer;
  
  const [workInput, setWorkInput] = useState(workDuration);
  const [breakInput, setBreakInput] = useState(breakDuration);

  const handleWorkChange = (value) => {
    if (value && value > 0) {
      setWorkInput(value);
    }
  };

  const handleBreakChange = (value) => {
    if (value && value > 0) {
      setBreakInput(value);
    }
  };

  const handleWorkSubmit = () => {
    dispatch({ type: 'SET_WORK_DURATION', payload: workInput });
  };

  const handleBreakSubmit = () => {
    dispatch({ type: 'SET_BREAK_DURATION', payload: breakInput });
  };

  return (
    <Card title={<Title level={4} style={{ margin: 0 }}>Timer Settings</Title>} bordered={false}>
      <Row gutter={24}>
        <Col span={12}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Text><ClockCircleOutlined /> Work Duration (min)</Text>
            <Space.Compact style={{ width: '100%' }}>
              <InputNumber
                min={1}
                value={workInput}
                onChange={handleWorkChange}
                disabled={isRunning}
                style={{ width: 'calc(100% - 60px)' }}
              />
              <Button 
                type="primary"
                onClick={handleWorkSubmit}
                disabled={isRunning}
                style={{ width: 60 }}
              >
                Set
              </Button>
            </Space.Compact>
          </Space>
        </Col>
        <Col span={12}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Text><CoffeeOutlined /> Break Duration (min)</Text>
            <Space.Compact style={{ width: '100%' }}>
              <InputNumber
                min={1}
                value={breakInput}
                onChange={handleBreakChange}
                disabled={isRunning}
                style={{ width: 'calc(100% - 60px)' }}
              />
              <Button 
                type="primary"
                onClick={handleBreakSubmit}
                disabled={isRunning}
                style={{ width: 60 }}
              >
                Set
              </Button>
            </Space.Compact>
          </Space>
        </Col>
      </Row>
    </Card>
  );
}
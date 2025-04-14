'use client';

import { useState } from 'react';
import { Card, Button, Progress, Input, Form, Typography, Space, Tag } from 'antd';
import { PlayCircleOutlined, PauseCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { usePomodoroContext } from '../context/PomodoroContext';
import TimePicker from './TimePicker';

const { Title, Text } = Typography;

export default function PomodoroTimer() {
  const { state, dispatch } = usePomodoroContext();
  const { currentTime, isRunning, mode, currentTask } = state.timer;
  const { workDuration, breakDuration } = state.settings;
  const [taskInput, setTaskInput] = useState('');

  // Format time as MM:SS
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const calculateProgress = () => {
    const totalTime = mode === 'work' ? workDuration * 60 : breakDuration * 60;
    return ((totalTime - currentTime) / totalTime) * 100;
  };

  const handleStart = () => {
    if (!currentTask) {
      // Use Ant Design message component instead of alert
      // Since we don't have the full app context, we'll use alert for now
      alert('Please enter a task before starting the timer.');
      return;
    }
    dispatch({ type: 'START_TIMER' });
  };

  const handlePause = () => {
    dispatch({ type: 'PAUSE_TIMER' });
  };

  const handleReset = () => {
    dispatch({ type: 'RESET_TIMER' });
  };

  const handleTaskSubmit = (values) => {
    if (values.task.trim()) {
      dispatch({ type: 'SET_CURRENT_TASK', payload: values.task.trim() });
      setTaskInput('');
    }
  };

  return (
    <Card 
      title={
        <Title level={3} style={{ margin: 0 }}>
          {mode === 'work' ? 'Work Session' : 'Break Time'}
        </Title>
      }
      bordered={false} 
      style={{ width: '100%', maxWidth: 500, margin: '0 auto' }}
    >
      {!currentTask && (
        <Form
          name="task-form"
          onFinish={handleTaskSubmit}
          layout="vertical"
          style={{ marginBottom: 24 }}
        >
          <Form.Item
            name="task"
            rules={[{ required: true, message: 'Please enter a task' }]}
          >
            <Input.Search
              placeholder="What are you working on?"
              enterButton="Set"
              size="large"
              onSearch={(value) => {
                if (value.trim()) {
                  dispatch({ type: 'SET_CURRENT_TASK', payload: value.trim() });
                }
              }}
            />
          </Form.Item>
        </Form>
      )}

      {currentTask && (
        <div style={{ marginBottom: 24, textAlign: 'center' }}>
          <Tag color={mode === 'work' ? 'processing' : 'success'} style={{ fontSize: 16, padding: '5px 10px' }}>
            {currentTask}
          </Tag>
        </div>
      )}

      <div style={{ textAlign: 'center', marginBottom: 30 }}>
        <Progress
          type="dashboard"
          percent={calculateProgress()}
          format={() => <span style={{ fontSize: 36 }}>{formatTime(currentTime)}</span>}
          status={mode === 'work' ? 'active' : 'success'}
          size={250}
          strokeColor={mode === 'work' ? { '0%': '#108ee9', '100%': '#87d068' } : '#52c41a'}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 30 }}>
        {!isRunning ? (
          <Button
            type="primary"
            icon={<PlayCircleOutlined />}
            size="large"
            onClick={handleStart}
            disabled={!currentTask}
            style={{ width: 110 }}
          >
            Start
          </Button>
        ) : (
          <Button
            type="primary"
            danger
            icon={<PauseCircleOutlined />}
            size="large"
            onClick={handlePause}
            style={{ width: 110 }}
          >
            Pause
          </Button>
        )}
        <Button
          icon={<ReloadOutlined />}
          size="large"
          onClick={handleReset}
          style={{ width: 110 }}
        >
          Reset
        </Button>
      </div>

      <TimePicker />
    </Card>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { Card, Typography, Row, Col, Progress, Statistic, Divider } from 'antd';
import { ClockCircleOutlined, AimOutlined } from '@ant-design/icons';
import { usePomodoroContext } from '../context/PomodoroContext';
import TimeChart from './TimeChart';

const { Title, Text } = Typography;

export default function TimeStats() {
  const { state } = usePomodoroContext();
  const { sessions } = state;
  const [dailyStats, setDailyStats] = useState([]);
  const [totalTime, setTotalTime] = useState(0);
  const [taskBreakdown, setTaskBreakdown] = useState([]);

  useEffect(() => {
    if (!sessions.length) return;

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    
    // Filter today's sessions
    const todaySessions = sessions.filter(session => session.date === today);
    
    // Calculate total time for today
    const totalMinutes = todaySessions.reduce((total, session) => {
      return total + (session.type === 'work' ? session.duration : 0);
    }, 0);
    
    setTotalTime(totalMinutes);
    
    // Group by task and calculate time for each
    const taskMap = {};
    todaySessions.forEach(session => {
      if (session.type === 'work') {
        if (!taskMap[session.task]) {
          taskMap[session.task] = 0;
        }
        taskMap[session.task] += session.duration;
      }
    });
    
    // Convert to array for the chart
    const taskData = Object.keys(taskMap).map(task => ({
      name: task,
      value: taskMap[task],
    }));
    
    setTaskBreakdown(taskData);
    
    // Calculate hourly stats for the day
    const hourlyData = Array(24).fill(0);
    
    todaySessions.forEach(session => {
      if (session.type === 'work') {
        const startTime = new Date(session.startTime);
        const hour = startTime.getHours();
        hourlyData[hour] += session.duration;
      }
    });
    
    const hourlyStats = hourlyData.map((minutes, hour) => ({
      hour: `${hour.toString().padStart(2, '0')}:00`,
      minutes,
    }));
    
    setDailyStats(hourlyStats);
  }, [sessions]);

  // Calculate percentage of 4-hour goal
  const goalPercentage = Math.min((totalTime / (4 * 60)) * 100, 100);

  return (
    <Card 
      title={<Title level={3} style={{ margin: 0 }}>Daily Progress</Title>}
      style={{ width: '100%' }}
    >
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card>
            <Statistic
              title="Today's Focus Time"
              value={`${Math.floor(totalTime / 60)}h ${totalTime % 60}m`}
              prefix={<ClockCircleOutlined />}
            />
            <div style={{ marginTop: 16 }}>
              <Progress 
                percent={goalPercentage} 
                status={goalPercentage >= 100 ? "success" : "active"}
                strokeColor={{
                  from: '#108ee9',
                  to: '#87d068',
                }}
              />
              <Text type="secondary">{totalTime} minutes / 4 hour goal</Text>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} md={12}>
          <Card title="Time by Hour">
            <div style={{ height: 300 }}>
              <TimeChart data={dailyStats} dataKey="minutes" xKey="hour" />
            </div>
          </Card>
        </Col>
        
        <Col xs={24} md={12}>
          <Card title="Time by Task">
            {taskBreakdown.length > 0 ? (
              <div>
                {taskBreakdown.map(task => (
                  <div key={task.name} style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <Text strong>{task.name}</Text>
                      <Text>{Math.floor(task.value / 60)}h {task.value % 60}m</Text>
                    </div>
                    <Progress 
                      percent={(task.value / totalTime) * 100} 
                      showInfo={false}
                      strokeColor="#52c41a"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <Text type="secondary">No tasks completed today</Text>
            )}
          </Card>
        </Col>
      </Row>
    </Card>
  );
}
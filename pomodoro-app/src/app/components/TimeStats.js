'use client';

import { useState, useEffect } from 'react';
import { usePomodoroContext } from '../context/PomodoroContext';
import TimeChart from './TimeChart';

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

  return (
    <div className="w-full max-w-4xl p-6 rounded-lg dark:bg-gray-800 bg-white transition-all">
      <h2 className="text-2xl font-bold mb-6 dark:text-white text-gray-800">Daily Progress</h2>
      
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium dark:text-gray-300 text-gray-700">Today's Focus Time</h3>
          <span className="text-2xl font-bold dark:text-white text-gray-800">
            {Math.floor(totalTime / 60)}h {totalTime % 60}m
          </span>
        </div>
        
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 rounded-full" 
            style={{ width: `${Math.min((totalTime / (8 * 60)) * 100, 100)}%` }}
          ></div>
        </div>
        <div className="text-xs text-right mt-1 dark:text-gray-400 text-gray-500">
          {totalTime} minutes / 8 hour goal
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-medium mb-4 dark:text-gray-300 text-gray-700">Time by Hour</h3>
          <div className="h-64">
            <TimeChart data={dailyStats} dataKey="minutes" xKey="hour" />
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4 dark:text-gray-300 text-gray-700">Time by Task</h3>
          {taskBreakdown.length > 0 ? (
            <div className="space-y-4">
              {taskBreakdown.map(task => (
                <div key={task.name}>
                  <div className="flex justify-between mb-1">
                    <span className="dark:text-gray-300 text-gray-700">{task.name}</span>
                    <span className="dark:text-gray-300 text-gray-700">
                      {Math.floor(task.value / 60)}h {task.value % 60}m
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 rounded-full" 
                      style={{ width: `${(task.value / totalTime) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="dark:text-gray-400 text-gray-500">No tasks completed today</p>
          )}
        </div>
      </div>
    </div>
  );
}
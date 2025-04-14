'use client';

import { useState } from 'react';
import { usePomodoroContext } from '../context/PomodoroContext';
import TimePicker from './TimePicker';

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

  const handleTaskSubmit = (e) => {
    e.preventDefault();
    if (taskInput.trim()) {
      dispatch({ type: 'SET_CURRENT_TASK', payload: taskInput.trim() });
      setTaskInput('');
    }
  };

  // Circle progress styling
  const circumference = 2 * Math.PI * 45; // 45 is the radius
  const strokeDashoffset = circumference - (calculateProgress() / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-6 rounded-lg transition-all">
      <h2 className="text-2xl font-bold mb-6 dark:text-white text-gray-800">
        {mode === 'work' ? 'Work Session' : 'Break Time'}
      </h2>

      {!currentTask && (
        <form onSubmit={handleTaskSubmit} className="w-full max-w-md mb-6">
          <div className="flex items-center">
            <input
              type="text"
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              placeholder="What are you working on?"
              className="w-full p-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Set
            </button>
          </div>
        </form>
      )}

      {currentTask && (
        <div className="mb-4 text-xl dark:text-gray-300 text-gray-700">
          Task: {currentTask}
        </div>
      )}

      <div className="relative w-64 h-64 mb-6">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={mode === 'work' ? '#4b5563' : '#9ca3af'}
            strokeWidth="2"
            className="dark:opacity-20 opacity-10"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={mode === 'work' ? '#ef4444' : '#10b981'}
            strokeWidth="2"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
            className="transition-all duration-1000 ease-linear"
          />
          {/* Timer text */}
          <text
            x="50"
            y="55"
            textAnchor="middle"
            fontSize="16"
            fontWeight="bold"
            fill="currentColor"
            className="dark:text-white text-gray-800"
          >
            {formatTime(currentTime)}
          </text>
        </svg>
      </div>

      <div className="flex space-x-4 mb-8">
        {!isRunning ? (
          <button
            onClick={handleStart}
            className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            disabled={!currentTask}
          >
            Start
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="px-6 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
          >
            Pause
          </button>
        )}
        <button
          onClick={handleReset}
          className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
        >
          Reset
        </button>
      </div>

      <TimePicker />
    </div>
  );
}
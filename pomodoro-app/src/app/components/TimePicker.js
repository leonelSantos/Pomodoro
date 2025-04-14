'use client';

import { useState } from 'react';
import { usePomodoroContext } from '../context/PomodoroContext';

export default function TimePicker() {
  const { state, dispatch } = usePomodoroContext();
  const { workDuration, breakDuration } = state.settings;
  const { isRunning } = state.timer;
  
  const [workInput, setWorkInput] = useState(workDuration);
  const [breakInput, setBreakInput] = useState(breakDuration);

  const handleWorkChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setWorkInput(value);
    }
  };

  const handleBreakChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
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
    <div className="w-full max-w-md grid grid-cols-2 gap-4 p-4 rounded-lg border dark:border-gray-700 border-gray-200 dark:bg-gray-800 bg-gray-50">
      <h3 className="col-span-2 text-lg font-medium mb-2 dark:text-white text-gray-800">Timer Settings</h3>
      
      <div>
        <label className="block text-sm font-medium mb-1 dark:text-gray-300 text-gray-700">
          Work Duration (min)
        </label>
        <div className="flex">
          <input
            type="number"
            min="1"
            value={workInput}
            onChange={handleWorkChange}
            disabled={isRunning}
            className="w-full p-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
          <button
            onClick={handleWorkSubmit}
            disabled={isRunning}
            className="px-3 py-1 bg-blue-500 text-white rounded-r hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Set
          </button>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1 dark:text-gray-300 text-gray-700">
          Break Duration (min)
        </label>
        <div className="flex">
          <input
            type="number"
            min="1"
            value={breakInput}
            onChange={handleBreakChange}
            disabled={isRunning}
            className="w-full p-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
          <button
            onClick={handleBreakSubmit}
            disabled={isRunning}
            className="px-3 py-1 bg-blue-500 text-white rounded-r hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Set
          </button>
        </div>
      </div>
    </div>
  );
}
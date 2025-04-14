'use client';

import { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state
const initialState = {
  settings: {
    workDuration: 25, // in minutes
    breakDuration: 5, // in minutes
    theme: 'dark',
  },
  timer: {
    currentTime: 25 * 60, // in seconds
    isRunning: false,
    mode: 'work', // 'work' or 'break'
    currentTask: '',
  },
  sessions: [],
  currentSession: null,
};

// Reducer function
function pomodoroReducer(state, action) {
  switch (action.type) {
    case 'SET_WORK_DURATION':
      return {
        ...state,
        settings: {
          ...state.settings,
          workDuration: action.payload,
        },
        timer: {
          ...state.timer,
          currentTime: action.payload * 60,
        },
      };
    case 'SET_BREAK_DURATION':
      return {
        ...state,
        settings: {
          ...state.settings,
          breakDuration: action.payload,
        },
      };
    case 'TOGGLE_THEME':
      return {
        ...state,
        settings: {
          ...state.settings,
          theme: state.settings.theme === 'dark' ? 'light' : 'dark',
        },
      };
    case 'SET_CURRENT_TASK':
      return {
        ...state,
        timer: {
          ...state.timer,
          currentTask: action.payload,
        },
      };
    case 'START_TIMER':
      const startSession = {
        task: state.timer.currentTask,
        type: state.timer.mode,
        startTime: new Date().toISOString(),
        duration: state.timer.mode === 'work' 
          ? state.settings.workDuration 
          : state.settings.breakDuration,
        completed: false,
      };
      
      return {
        ...state,
        timer: {
          ...state.timer,
          isRunning: true,
        },
        currentSession: startSession,
      };
    case 'PAUSE_TIMER':
      return {
        ...state,
        timer: {
          ...state.timer,
          isRunning: false,
        },
      };
    case 'RESET_TIMER':
      return {
        ...state,
        timer: {
          ...state.timer,
          isRunning: false,
          currentTime: state.timer.mode === 'work' 
            ? state.settings.workDuration * 60 
            : state.settings.breakDuration * 60,
        },
        currentSession: null,
      };
    case 'TICK_TIMER':
      return {
        ...state,
        timer: {
          ...state.timer,
          currentTime: state.timer.currentTime - 1,
        },
      };
    case 'COMPLETE_SESSION':
      const completedSession = {
        ...state.currentSession,
        endTime: new Date().toISOString(),
        completed: true,
        date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
      };
      
      return {
        ...state,
        sessions: [...state.sessions, completedSession],
        currentSession: null,
        timer: {
          ...state.timer,
          isRunning: false,
          mode: state.timer.mode === 'work' ? 'break' : 'work',
          currentTime: state.timer.mode === 'work' 
            ? state.settings.breakDuration * 60 
            : state.settings.workDuration * 60,
        },
      };
    case 'LOAD_STATE':
      return {
        ...action.payload,
      };
    default:
      return state;
  }
}

// Create context
const PomodoroContext = createContext();

// Provider component
export function PomodoroProvider({ children }) {
  const [state, dispatch] = useReducer(pomodoroReducer, initialState);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('pomodoroState');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        dispatch({ type: 'LOAD_STATE', payload: parsedState });
      } catch (error) {
        console.error('Failed to parse saved state', error);
      }
    }
  }, []);

  // Save state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('pomodoroState', JSON.stringify(state));
  }, [state]);

  // Timer logic
  useEffect(() => {
    let timerId;

    if (state.timer.isRunning && state.timer.currentTime > 0) {
      timerId = setTimeout(() => {
        dispatch({ type: 'TICK_TIMER' });
      }, 1000);
    } else if (state.timer.isRunning && state.timer.currentTime === 0) {
      // Timer has reached zero
      dispatch({ type: 'COMPLETE_SESSION' });
      
      // Play notification sound
      try {
        const audio = new Audio('/notification.mp3');
        audio.play();
      } catch (error) {
        console.error('Failed to play notification sound', error);
      }
    }

    return () => clearTimeout(timerId);
  }, [state.timer.isRunning, state.timer.currentTime]);

  return (
    <PomodoroContext.Provider value={{ state, dispatch }}>
      {children}
    </PomodoroContext.Provider>
  );
}

// Custom hook for using the context
export function usePomodoroContext() {
  const context = useContext(PomodoroContext);
  if (!context) {
    throw new Error('usePomodoroContext must be used within a PomodoroProvider');
  }
  return context;
}
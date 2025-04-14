'use client';

import { createContext, useContext, useEffect } from 'react';
import { usePomodoroContext } from './PomodoroContext';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const { state, dispatch } = usePomodoroContext();
  const { theme } = state.settings;

  useEffect(() => {
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }
    
    // Set Ant Design's preferred color scheme
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  const toggleTheme = () => {
    dispatch({ type: 'TOGGLE_THEME' });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
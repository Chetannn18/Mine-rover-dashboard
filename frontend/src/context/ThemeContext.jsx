import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Always enforce clean, high-contrast Day/Light theme
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark');
    root.classList.add('light');
    localStorage.setItem('mine_rover_theme', 'light');
  }, []);

  const toggleTheme = () => {
    // Kept for interface compatibility, always remains light
    setTheme('light');
  };

  return (
    <ThemeContext.Provider value={{ theme: 'light', setTheme, toggleTheme, isDark: false }}>
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

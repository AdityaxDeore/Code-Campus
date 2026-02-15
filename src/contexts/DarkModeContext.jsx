import React, { createContext, useContext, useState, useEffect } from 'react';

const DarkModeContext = createContext();

export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error('useDarkMode must be used within a DarkModeProvider');
  }
  return context;
};

export const DarkModeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load dark mode preference from localStorage on mount
  useEffect(() => {
    try {
      const savedDarkMode = localStorage.getItem('darkMode');
      if (savedDarkMode !== null) {
        const parsed = JSON.parse(savedDarkMode);
        setIsDarkMode(typeof parsed === 'boolean' ? parsed : false);
      }
    } catch {
      // Corrupted localStorage value — fall back to light mode
      setIsDarkMode(false);
    }
  }, []);

  // Update localStorage and apply theme when dark mode changes
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    
    // Apply dark mode classes to document
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.add('oled-dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.remove('oled-dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

'use client';

import { useState, useEffect } from 'react';

export function useTheme() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check user preference
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    setIsDarkMode(storedTheme === 'dark' || (!storedTheme && prefersDark));

    // Add theme class to document
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const toggleTheme = () => {
    const newTheme = !isDarkMode ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    setIsDarkMode(!isDarkMode);
  };

  return { isDarkMode, toggleTheme };
} 
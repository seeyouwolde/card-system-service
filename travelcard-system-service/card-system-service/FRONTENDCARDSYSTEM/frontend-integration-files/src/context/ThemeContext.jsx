import React, { createContext, useContext, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { lightTheme, darkTheme } from '../theme/theme';

const ThemeModeContext = createContext({
  mode: 'light',
  toggleMode: () => {},
});

/**
 * Wraps the app in the correct MUI ThemeProvider and exposes a toggle function.
 * Mode is persisted to localStorage so it survives page refresh.
 */
export function ThemeModeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    return localStorage.getItem('uaetc-theme') || 'light';
  });

  const toggleMode = () => {
    setMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('uaetc-theme', next);
      return next;
    });
  };

  const theme = mode === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeModeContext.Provider value={{ mode, toggleMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}

/** Hook to access the current theme mode and toggle function. */
export const useThemeMode = () => useContext(ThemeModeContext);

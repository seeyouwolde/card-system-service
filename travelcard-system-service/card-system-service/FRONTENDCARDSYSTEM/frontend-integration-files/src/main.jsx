import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ThemeModeProvider } from './context/ThemeContext';
import { HistoryProvider } from './context/HistoryContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* ThemeModeProvider wraps everything — it injects the MUI ThemeProvider + CssBaseline */}
    <ThemeModeProvider>
      {/* HistoryProvider gives every page access to the client-side activity log */}
      <HistoryProvider>
        <App />
      </HistoryProvider>
    </ThemeModeProvider>
  </StrictMode>
);

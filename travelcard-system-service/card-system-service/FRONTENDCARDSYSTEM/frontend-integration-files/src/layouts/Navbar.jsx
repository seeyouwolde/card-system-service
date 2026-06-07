import React from 'react';
import { useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import { useThemeMode } from '../context/ThemeContext';
import { SIDEBAR_WIDTH } from './Sidebar';

/** Maps route paths to human-readable page titles */
const PAGE_TITLES = {
  '/':              { title: 'Control Center', subtitle: 'Live overview and essential card operations' },
  '/register':      { title: 'New Card',       subtitle: 'Create and activate a commuter card' },
  '/topup':         { title: 'Recharge',       subtitle: 'Add balance to an existing card' },
  '/start-journey': { title: 'Tap In',         subtitle: 'Begin a journey at a station' },
  '/end-journey':   { title: 'Tap Out',        subtitle: 'Complete the trip and calculate fare' },
  '/card-details':  { title: 'Card Details',   subtitle: 'Look up a card by its number' },
  '/history':       { title: 'Activity Log',    subtitle: 'Recent card and journey operations' },
};

/**
 * Top application bar.
 *
 * @param {object}   props
 * @param {Function} [props.onMenuClick]  - Called when the hamburger icon is clicked (mobile)
 * @param {boolean}  [props.isMobile]     - Whether the sidebar is hidden (mobile view)
 */
export default function Navbar({ onMenuClick, isMobile = false }) {
  const { mode, toggleMode } = useThemeMode();
  const location = useLocation();

  const page = PAGE_TITLES[location.pathname] ?? { title: 'UAE Travel Card', subtitle: '' };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
          left: 0,
          width: '100%',
        backgroundColor: (theme) => theme.palette.mode === 'light' ? 'rgba(255,255,255,0.82)' : 'rgba(11,47,44,0.86)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid',
        borderColor: 'divider',
        color: 'text.primary',
        zIndex: (theme) => theme.zIndex.appBar,
      }}
    >
        <Toolbar sx={{ minHeight: '72px !important', px: { xs: 2, sm: 3 }, pl: { xs: 8, sm: 9 } }}>
        {/* Mobile hamburger */}
        {isMobile && (
          <IconButton edge="start" onClick={onMenuClick} sx={{ mr: 1.5 }}>
            <MenuRoundedIcon />
          </IconButton>
        )}

        {/* Page title */}
        <Box flex={1}>
          <Typography variant="h6" fontWeight={700} color="text.primary" lineHeight={1.2}>
            {page.title}
          </Typography>
          {page.subtitle && (
            <Typography variant="caption" color="text.secondary">
              {page.subtitle}
            </Typography>
          )}
        </Box>

        {/* Status pill */}
        <Chip
          label="Connected"
          size="small"
          color="primary"
          variant="outlined"
          sx={{ mr: 1.5, fontWeight: 700, fontSize: '0.7rem' }}
        />

        {/* Dark / Light toggle */}
        <Tooltip title={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
          <IconButton onClick={toggleMode} size="medium" color="inherit">
            {mode === 'light' ? (
              <DarkModeRoundedIcon fontSize="small" />
            ) : (
              <LightModeRoundedIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}

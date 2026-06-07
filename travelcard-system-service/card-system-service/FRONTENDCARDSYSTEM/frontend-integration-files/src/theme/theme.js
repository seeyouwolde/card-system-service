import { createTheme } from '@mui/material/styles';

const commonSettings = {
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 900, letterSpacing: '-0.04em' },
    h5: { fontWeight: 900, letterSpacing: '-0.035em' },
    h6: { fontWeight: 800, letterSpacing: '-0.02em' },
  },
  shape: {
    borderRadius: 20,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid rgba(30, 64, 175, 0.10)',
          boxShadow: 'rgba(15, 23, 42, 0.10) 0px 18px 46px',
          backdropFilter: 'blur(10px)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 850,
          borderRadius: 16,
          paddingLeft: 24,
          paddingRight: 24,
          boxShadow: 'none',
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 52%, #f59e0b 100%)',
          color: '#ffffff',
          '&:hover': {
            boxShadow: 'rgba(30, 64, 175, 0.26) 0px 12px 26px',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
          color: '#ffffff',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 800,
          fontSize: '0.75rem',
        },
      },
    },
  },
};

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1d4ed8',
      light: '#dbeafe',
      dark: '#1e3a8a',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f59e0b',
      light: '#fef3c7',
      dark: '#b45309',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#111827',
      secondary: '#64748b',
    },
    success: {
      main: '#16a34a',
      light: '#dcfce7',
    },
    error: {
      main: '#dc2626',
      light: '#fee2e2',
    },
    warning: {
      main: '#f59e0b',
      light: '#fef3c7',
    },
    info: {
      main: '#0284c7',
      light: '#e0f2fe',
    },
    divider: 'rgba(30, 64, 175, 0.12)',
  },
  ...commonSettings,
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#60a5fa',
      light: '#172554',
      dark: '#bfdbfe',
      contrastText: '#020617',
    },
    secondary: {
      main: '#fbbf24',
      light: '#422006',
      dark: '#fde68a',
      contrastText: '#111827',
    },
    background: {
      default: '#020617',
      paper: '#111827',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#cbd5e1',
    },
    success: {
      main: '#22c55e',
      light: '#052e16',
    },
    error: {
      main: '#f87171',
      light: '#3f1111',
    },
    warning: {
      main: '#fbbf24',
      light: '#422006',
    },
    info: {
      main: '#38bdf8',
      light: '#082f49',
    },
    divider: 'rgba(148, 163, 184, 0.18)',
  },
  ...commonSettings,
});
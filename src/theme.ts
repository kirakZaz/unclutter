import { createTheme, alpha } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    terracotta: Palette['primary'];
  }
  interface PaletteOptions {
    terracotta?: PaletteOptions['primary'];
  }
}

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2D6A4F',
      light: '#52B788',
      dark: '#1B4332',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#D4896A',
      light: '#E8B49B',
      dark: '#A05A3F',
      contrastText: '#ffffff',
    },
    terracotta: {
      main: '#D4896A',
      light: '#E8B49B',
      dark: '#A05A3F',
      contrastText: '#ffffff',
    },
    background: {
      default: '#F5F0E8',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A2E1A',
      secondary: '#4A6741',
    },
    success: {
      main: '#52B788',
    },
    warning: {
      main: '#E8C84E',
    },
    error: {
      main: '#C44B4B',
    },
    divider: alpha('#2D6A4F', 0.12),
  },
  typography: {
    fontFamily: '"DM Sans", "Helvetica Neue", sans-serif',
    h1: {
      fontFamily: '"Playfair Display", Georgia, serif',
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontFamily: '"Playfair Display", Georgia, serif',
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontFamily: '"Playfair Display", Georgia, serif',
      fontWeight: 600,
    },
    h4: {
      fontFamily: '"DM Sans", sans-serif',
      fontWeight: 700,
    },
    h5: {
      fontFamily: '"DM Sans", sans-serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"DM Sans", sans-serif',
      fontWeight: 600,
    },
    body1: {
      lineHeight: 1.7,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.01em',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 50,
          padding: '10px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(45, 106, 79, 0.25)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0 4px 16px rgba(45, 106, 79, 0.35)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 2px 12px rgba(26, 46, 26, 0.08)',
          border: '1px solid rgba(45, 106, 79, 0.08)',
          transition: 'box-shadow 0.2s ease, transform 0.2s ease',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(26, 46, 26, 0.12)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
          },
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
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: '0 1px 0 rgba(45, 106, 79, 0.1)',
        },
      },
    },
  },
});

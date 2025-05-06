import { createTheme } from '@mui/material/styles';
import '@fontsource/plus-jakarta-sans';

export const theme = createTheme({
  palette: {
    primary: { main: '#6D28D9' },
    secondary: { main: '#FF2D55' },
    background: { default: '#F3F4F6' }
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    h1: { fontWeight: 800 },
    h2: { fontWeight: 700 }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          textTransform: 'none',
          fontWeight: 600
        }
      }
    }
  }
});
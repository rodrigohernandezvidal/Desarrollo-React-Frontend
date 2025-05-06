export const colors = {
    primary: '#6D28D9',     // Violeta profesional
    secondary: '#3A86FF',   // Azul confianza
    accent: '#FFBE0B',      // Amarillo atención
    dark: '#1F2937',        // Textos principales
    light: '#F8F9FA',       // Fondos claros
    white: '#FFFFFF',
    gray: '#6B7280',
    success: '#10B981',
    error: '#EF4444'
  };
  
  export const typography = {
    h1: {
      fontSize: { xs: '2.5rem', md: '3.5rem' },
      fontWeight: 800,
      lineHeight: 1.2,
      letterSpacing: '-0.02em'
    },
    h2: {
      fontSize: { xs: '2rem', md: '2.75rem' },
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: '-0.015em'
    },
    h3: {
      fontSize: { xs: '1.75rem', md: '2.25rem' },
      fontWeight: 600,
      lineHeight: 1.4
    },
    h4: {
      fontSize: { xs: '1.5rem', md: '1.75rem' },
      fontWeight: 600,
      lineHeight: 1.5
    },
    subtitle1: {
      fontSize: { xs: '1.1rem', md: '1.25rem' },
      fontWeight: 400,
      lineHeight: 1.6,
      color: 'colors.gray'
    },
    subtitle2: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.6,
      color: 'colors.gray'
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.7,
      color: 'colors.dark'
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      color: 'colors.gray'
    }
  };
  
  export const spacing = {
    section: { xs: 8, md: 12 },
    component: { xs: 3, md: 4 },
    small: 2,
    medium: 4,
    large: 6
  };
  
  export const breakpoints = {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536
    }
  };
  
  export const shadows = {
    small: '0 2px 8px rgba(0,0,0,0.1)',
    medium: '0 4px 12px rgba(0,0,0,0.15)',
    large: '0 8px 24px rgba(0,0,0,0.2)',
    accent: `0 4px 20px ${colors.primary}40`
  };
  
  export const borderRadius = {
    small: '8px',
    medium: '12px',
    large: '16px',
    xlarge: '24px'
  };
import React from 'react';
import { Button } from '@mui/material';
import { colors, typography, shadows, borderRadius } from '../../config/theme';

export const CustomButton = ({ 
  variant = 'contained', 
  children, 
  fullWidth = false,
  size = 'medium',
  startIcon,
  endIcon,
  sx,
  ...props 
}) => {
  const baseStyles = {
    px: size === 'large' ? 5 : 4,
    py: size === 'large' ? 1.75 : size === 'small' ? 1 : 1.5,
    borderRadius: borderRadius.medium,
    fontWeight: 700,
    fontSize: size === 'large' ? '1.1rem' : '1rem',
    textTransform: 'none',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)'
    },
    ...(fullWidth && { width: '100%' })
  };

  const variantStyles = {
    contained: {
      background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
      color: colors.white,
      boxShadow: shadows.small,
      '&:hover': {
        boxShadow: shadows.accent,
        background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`
      }
    },
    outlined: {
      border: `2px solid ${colors.primary}`,
      color: colors.primary,
      backgroundColor: 'transparent',
      '&:hover': {
        backgroundColor: `${colors.primary}08`,
        borderColor: colors.primary
      }
    },
    text: {
      color: colors.primary,
      '&:hover': {
        backgroundColor: `${colors.primary}08`
      }
    }
  };

  const sizeStyles = {
    small: {
      fontSize: '0.875rem',
      px: 3,
      py: 0.75
    },
    medium: {
      fontSize: '1rem'
    },
    large: {
      fontSize: '1.1rem',
      px: 5,
      py: 1.75
    }
  };

  return (
    <Button
      variant={variant}
      startIcon={startIcon}
      endIcon={endIcon}
      sx={{ 
        ...baseStyles, 
        ...variantStyles[variant], 
        ...sizeStyles[size],
        ...sx 
      }}
      {...props}
    >
      {children}
    </Button>
  );
};
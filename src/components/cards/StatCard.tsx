// src/components/cards/StatCard.tsx
import React from 'react';
import { Paper, Typography } from '@mui/material';

interface StatCardProps {
  value: string;
  label: string;
}

export const StatCard = ({ value, label }: StatCardProps) => {
  return (
    <Paper elevation={0} sx={{ p: 3, textAlign: 'center' }}>
      <Typography variant="h3" gutterBottom>
        {value}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary">
        {label}
      </Typography>
    </Paper>
  );
};
// src/components/cards/FeatureCard.tsx
import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  index: number;
}

export const FeatureCard = ({ title, description, icon, index }: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Box sx={{ fontSize: '2.5rem', mb: 2 }}>{icon}</Box>
          <Typography variant="h5" gutterBottom>
            {title}
          </Typography>
          <Typography color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );
};
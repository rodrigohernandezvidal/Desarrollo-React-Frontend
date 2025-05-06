import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { motion } from 'framer-motion';
import { ParticlesBackground } from '../../ParticlesBackground';

export const Hero = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        bgcolor: 'background.default',
        overflow: 'hidden',
      }}
    >
      <ParticlesBackground />
      
      <Container maxWidth="lg">
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          sx={{
            position: 'relative',
            zIndex: 2,
            maxWidth: { xs: '100%', md: '60%' },
          }}
        >
          <Typography
            variant="h1"
            component="h1"
            gutterBottom
            sx={{
              color: 'text.primary',
              mb: 3,
            }}
          >
            Soluciones digitales para negocios inteligentes
          </Typography>
          
          <Typography
            variant="h5"
            component="p"
            sx={{
              color: 'text.secondary',
              mb: 4,
              maxWidth: '600px',
            }}
          >
            Tecnología de vanguardia diseñada para escalar tu negocio y optimizar operaciones
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              component={motion.button}
              whileHover={{ y: -2 }}
            >
              Comenzar ahora
            </Button>
            
            <Button
              variant="outlined"
              color="primary"
              size="large"
              component={motion.button}
              whileHover={{ y: -2 }}
            >
              Ver demo
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
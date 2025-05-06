// src/components/sections/cta/CtaSection.tsx
import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { motion } from 'framer-motion';

export const CtaSection = () => {
  return (
    <Box sx={{ py: 12, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Typography variant="h2" align="center" gutterBottom>
            ¿Listo para comenzar?
          </Typography>
          <Typography variant="h5" align="center" gutterBottom sx={{ mb: 4 }}>
            Contáctanos hoy mismo para una demostración personalizada
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              component={motion.button}
              whileHover={{ scale: 1.05 }}
            >
              Solicitar Demo
            </Button>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};
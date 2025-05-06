// src/components/sections/testimonials/TestimonialsSection.tsx
import { Container, Typography, Grid, Avatar, Box } from '@mui/material';
import { motion } from 'framer-motion';

const testimonials = [
  {
    name: 'Carlos Méndez',
    role: 'CEO, RetailTech',
    comment: 'Increíble producto que transformó nuestro negocio.',
    avatar: 'CM',
  },
  // ... otros testimonios
];

export const TestimonialsSection = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 12 }}>
      <Typography variant="h2" align="center" gutterBottom sx={{ mb: 8 }}>
        Lo que dicen nuestros clientes
      </Typography>
      
      <Grid container spacing={4}>
        {testimonials.map((testimonial, index) => (
          <Grid >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Box sx={{ p: 3, height: '100%' }}>
                <Typography paragraph sx={{ fontStyle: 'italic' }}>
                  "{testimonial.comment}"
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 3 }}>
                  <Avatar sx={{ mr: 2 }}>{testimonial.avatar}</Avatar>
                  <Box>
                    <Typography fontWeight="bold">{testimonial.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {testimonial.role}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};
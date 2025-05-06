// src/pages/home.tsx
import { Box } from '@mui/material';
import { Hero } from '../components/sections/hero/Hero';
import { StatsSection } from '../components/sections/stats/stats';
import { FeaturesSection } from '../components/sections/features/features';
import { TestimonialsSection } from '../components/sections/testimonial/testimonial';
import { CtaSection } from '../components/sections/cta/CtaSection';

// Cambia esto:
// export const Home = () => {
// Por esto:
const Home = () => {
  return (
    <Box sx={{ overflowX: 'hidden' }}>
      <Hero />
      <StatsSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CtaSection />
    </Box>
  );
};

export default Home; // Añade esta línea
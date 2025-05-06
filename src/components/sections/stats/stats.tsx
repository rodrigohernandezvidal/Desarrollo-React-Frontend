
import { Grid, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { StatCard } from '../../cards/StatCard';

const stats = [
  { value: '500+', label: 'Clientes satisfechos' },
  { value: '99.9%', label: 'Disponibilidad' },
  { value: '40%', label: 'Ahorro en costos' },
  { value: '24/7', label: 'Soporte técnico' },
];

export const StatsSection = () => {
  return (
    <Box sx={{ py: 12, bgcolor: 'background.paper' }}>
      <Grid container spacing={4} justifyContent="center">
        {stats.map((stat, index) => (
          <Grid >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <StatCard value={stat.value} label={stat.label} />
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
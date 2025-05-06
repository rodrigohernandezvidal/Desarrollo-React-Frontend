import { Container, Typography, Grid } from '@mui/material';
import { FeatureCard } from '../../cards/FeatureCard';

const features = [
  {
    title: 'Automatización Inteligente',
    description: 'Flujos de trabajo optimizados con IA para máxima eficiencia',
    icon: '⚡',
  },
  {
    title: 'Análisis en Tiempo Real',
    description: 'Dashboards interactivos con datos actualizados al instante',
    icon: '📊',
  },
  {
    title: 'Seguridad de Clase Empresarial',
    description: 'Protección de datos con cifrado de última generación',
    icon: '🔒',
  },
];

export const FeaturesSection = () => {
    return (
      <Container maxWidth="lg" sx={{ py: 12 }}>
        <Typography variant="h2" align="center" gutterBottom sx={{ mb: 8 }}>
          Nuestras Soluciones
        </Typography>
        
        <Grid container spacing={6}>
          {features.map((feature, index) => (
            <Grid >
              <FeatureCard 
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                index={index}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  };
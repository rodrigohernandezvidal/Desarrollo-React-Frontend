import React from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, Divider,Button } from '@mui/material';
import { 
  Code, 
  Receipt, 
  Fingerprint, 
  Business, 
  HeadsetMic 
} from '@mui/icons-material';
import './Services.css';

const services = [
  {
    icon: <Code sx={{ fontSize: 50, color: '#FF2D55' }} />,
    title: 'Desarrollo de Software a Medida',
    description: 'Soluciones personalizadas para tus necesidades específicas, desde aplicaciones web hasta sistemas empresariales complejos.'
  },
  {
    icon: <Fingerprint sx={{ fontSize: 50, color: '#3A86FF' }} />,
    title: 'Firma Electrónica',
    description: 'Implementación de sistemas de firma electrónica avanzada con validez legal y máxima seguridad.'
  },
  {
    icon: <Receipt sx={{ fontSize: 50, color: '#FFBE0B' }} />,
    title: 'Facturación Electrónica',
    description: 'Sistemas de facturación electrónica integrados con el SII y adaptados a tus procesos contables.'
  },
  {
    icon: <Business sx={{ fontSize: 50, color: '#8338EC' }} />,
    title: 'Automatización Empresarial',
    description: 'Automatización de procesos para aumentar la eficiencia y reducir errores en tus operaciones.'
  },
  {
    icon: <HeadsetMic sx={{ fontSize: 50, color: '#06D6A0' }} />,
    title: 'Consultoría y Soporte',
    description: 'Asesoría experta y soporte técnico especializado para garantizar el éxito de tus proyectos tecnológicos.'
  }
];

const Services = () => {
  return (
    <div className="services-page">
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', my: 8 }}>
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#1A1A2E' }}>
            Nuestros Servicios
          </Typography>
          <Typography variant="h5" sx={{ color: '#555', maxWidth: '800px', mx: 'auto' }}>
            Soluciones tecnológicas diseñadas para impulsar tu productividad y crecimiento empresarial
          </Typography>
        </Box>
        
        <Grid container spacing={4} sx={{ my: 4 }}>
          {services.map((service, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-10px)',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                }
              }}>
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 4 }}>
                  <Box sx={{ mb: 3 }}>
                    {service.icon}
                  </Box>
                  <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
                    {service.title}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="body1" sx={{ color: '#555' }}>
                    {service.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        
        <Box sx={{ 
          backgroundColor: '#F8F9FA', 
          borderRadius: '8px', 
          p: 6, 
          my: 8,
          textAlign: 'center'
        }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1A1A2E' }}>
            ¿No encuentras lo que necesitas?
          </Typography>
          <Typography variant="body1" sx={{ color: '#555', mb: 4, maxWidth: '700px', mx: 'auto' }}>
            Contáctanos y desarrollaremos una solución personalizada para tu negocio.
          </Typography>
          <Button 
            variant="contained" 
            size="large" 
            sx={{ 
              backgroundColor: '#FF2D55',
              color: '#fff',
              fontWeight: 'bold',
              px: 6,
              py: 2,
              '&:hover': {
                backgroundColor: '#d82548',
                transform: 'translateY(-2px)'
              }
            }}
          >
            Hablar con un Asesor
          </Button>
        </Box>
      </Container>
    </div>
  );
};

export default Services;
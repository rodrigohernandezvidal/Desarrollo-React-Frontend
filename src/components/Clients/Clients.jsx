import React from 'react';
import { Container, Typography, Box, Grid, Avatar, Card, CardContent, Button} from '@mui/material';
import { Star } from '@mui/icons-material';
import './Clients.css';

const testimonials = [
  {
    name: 'Carlos Méndez',
    company: 'RetailTech',
    position: 'CEO',
    avatar: 'CM',
    comment: 'Implementamos su software y en 3 meses aumentamos nuestra productividad en un 40%.',
    rating: 5
  },
  {
    name: 'Ana Rodríguez',
    company: 'Logística Global',
    position: 'Directora de Operaciones',
    avatar: 'AR',
    comment: 'El soporte técnico es excepcional. Siempre están disponibles cuando los necesitamos.',
    rating: 5
  },
  {
    name: 'Luis Fernández',
    company: 'Finanzas Seguras',
    position: 'Gerente TI',
    avatar: 'LF',
    comment: 'La solución más completa que hemos encontrado en el mercado a un precio competitivo.',
    rating: 4
  },
  {
    name: 'María González',
    company: 'Consultora Estratégica',
    position: 'Socia Directora',
    avatar: 'MG',
    comment: 'La implementación fue impecable y el equipo de capacitación muy profesional.',
    rating: 5
  },
  {
    name: 'Jorge Silva',
    company: 'Manufactura Avanzada',
    position: 'Gerente de Procesos',
    avatar: 'JS',
    comment: 'La automatización de nuestros procesos nos ha permitido reducir costos significativamente.',
    rating: 4
  },
  {
    name: 'Daniela Pérez',
    company: 'Servicios Legales',
    position: 'Abogada Senior',
    avatar: 'DP',
    comment: 'El sistema de firma electrónica ha agilizado nuestros procesos legales de manera notable.',
    rating: 5
  }
];

const Clients = () => {
  return (
    <div className="clients-page">
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', my: 8 }}>
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#1A1A2E' }}>
            Nuestros Clientes
          </Typography>
          <Typography variant="h5" sx={{ color: '#555', maxWidth: '800px', mx: 'auto' }}>
            Descubre lo que dicen las empresas que ya confían en nuestras soluciones
          </Typography>
        </Box>
        
        <Grid container spacing={4} sx={{ my: 4 }}>
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                }
              }}>
                <CardContent sx={{ flexGrow: 1, p: 4 }}>
                  <Box sx={{ display: 'flex', mb: 2 }}>
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        sx={{ 
                          color: i < testimonial.rating ? '#FFBE0B' : '#ddd',
                          fontSize: '1.2rem'
                        }} 
                      />
                    ))}
                  </Box>
                  <Typography variant="body1" sx={{ 
                    mb: 3, 
                    fontStyle: 'italic',
                    color: '#555',
                    fontSize: '1.1rem'
                  }}>
                    "{testimonial.comment}"
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
                    <Avatar sx={{ 
                      bgcolor: '#FF2D55', 
                      mr: 2,
                      color: '#fff',
                      fontWeight: 'bold'
                    }}>
                      {testimonial.avatar}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1A1A2E' }}>
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#555' }}>
                        {testimonial.position}, {testimonial.company}
                      </Typography>
                    </Box>
                  </Box>
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
            ¿Listo para unirte a nuestros clientes satisfechos?
          </Typography>
          <Typography variant="body1" sx={{ color: '#555', mb: 4, maxWidth: '700px', mx: 'auto' }}>
            Contáctanos hoy mismo y descubre cómo podemos ayudarte a transformar tu negocio.
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
            Contactar Ahora
          </Button>
        </Box>
      </Container>
    </div>
  );
};

export default Clients;
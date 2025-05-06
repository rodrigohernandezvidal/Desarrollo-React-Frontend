import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import ReactPlayer from 'react-player';
import './Demo.css';

const Demo = () => {
  return (
    <div className="demo-page">
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', my: 6 }}>
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#1A1A2E' }}>
            Demostración de Nuestros Sistemas
          </Typography>
          <Typography variant="h5" sx={{ color: '#555', mb: 4 }}>
            Descubre cómo nuestras soluciones pueden transformar tu negocio
          </Typography>
        </Box>
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          my: 6,
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          <ReactPlayer 
            url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" 
            controls 
            width="100%"
            height="500px"
          />
        </Box>
        
        <Box sx={{ textAlign: 'center', my: 6 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1A1A2E', mb: 3 }}>
            ¿Quieres probarlo por ti mismo?
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
            Solicitar Demo Personalizada
          </Button>
        </Box>
        
        <Box sx={{ my: 6 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1A1A2E', mb: 3 }}>
            Características Principales
          </Typography>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, 
            gap: 4,
            my: 4
          }}>
            {[
              { title: 'Interfaz Intuitiva', desc: 'Diseño pensado para la facilidad de uso' },
              { title: 'Integraciones', desc: 'Conecta con tus herramientas favoritas' },
              { title: 'Reportes en Tiempo Real', desc: 'Toma decisiones basadas en datos actualizados' },
              { title: 'Seguridad', desc: 'Protección de datos de nivel empresarial' },
              { title: 'Escalable', desc: 'Crece junto con tu negocio' },
              { title: 'Soporte 24/7', desc: 'Asistencia cuando la necesites' }
            ].map((feature, index) => (
              <Box 
                key={index} 
                sx={{ 
                  p: 3, 
                  borderRadius: '8px', 
                  backgroundColor: '#F8F9FA',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 5px 15px rgba(255, 45, 85, 0.1)'
                  }
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1A1A2E', mb: 1 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body1" sx={{ color: '#555' }}>
                  {feature.desc}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default Demo;
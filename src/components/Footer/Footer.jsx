import React from 'react';
import { Container, Grid, Typography, Link, Divider, IconButton, Box } from '@mui/material';
import { 
  Email, 
  Phone, 
  LocationOn,
  Facebook,
  Twitter,
  LinkedIn,
  Instagram,
  GitHub
} from '@mui/icons-material';

const Footer = () => {
  return (
    <Box component="footer" sx={{
      background: "linear-gradient(135deg, #111827 0%, #1F2937 100%)",
      position: "relative",
      overflow: "hidden",
      "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "4px",
        background: "linear-gradient(90deg, #FF2D55 0%, #6D28D9 100%)",
        animation: "gradientShift 8s ease infinite",
        backgroundSize: "200% 200%"
      }
    }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#fff' }}>
              Foog Technology
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
              Soluciones tecnológicas para impulsar tu negocio al siguiente nivel.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              <IconButton sx={{ color: 'rgba(255,255,255,0.7)' }}>
                <Facebook />
              </IconButton>
              <IconButton sx={{ color: 'rgba(255,255,255,0.7)' }}>
                <Twitter />
              </IconButton>
              <IconButton sx={{ color: 'rgba(255,255,255,0.7)' }}>
                <LinkedIn />
              </IconButton>
              <IconButton sx={{ color: 'rgba(255,255,255,0.7)' }}>
                <Instagram />
              </IconButton>
              <IconButton sx={{ color: 'rgba(255,255,255,0.7)' }}>
                <GitHub />
              </IconButton>
            </Box>
          </Grid>
          
          <Grid item xs={6} md={2}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', color: '#fff' }}>
              Producto
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              {['Características', 'Precios', 'Demo', 'Integraciones'].map((item) => (
                <li key={item}>
                  <Link 
                    href="#" 
                    variant="body2" 
                    sx={{ 
                      color: 'rgba(255,255,255,0.7)',
                      '&:hover': {
                        color: '#FF2D55',
                        textDecoration: 'none'
                      }
                    }}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </Box>
          </Grid>
          
          <Grid item xs={6} md={2}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', color: '#fff' }}>
              Empresa
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              {['Nosotros', 'Blog', 'Carreras', 'Contacto'].map((item) => (
                <li key={item}>
                  <Link 
                    href="#" 
                    variant="body2" 
                    sx={{ 
                      color: 'rgba(255,255,255,0.7)',
                      '&:hover': {
                        color: '#FF2D55',
                        textDecoration: 'none'
                      }
                    }}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', color: '#fff' }}>
              Contacto
            </Typography>
            <Box sx={{ mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Email sx={{ mr: 1, fontSize: '1rem', color: '#FF2D55' }} />
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  contacto@foog.cl
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Phone sx={{ mr: 1, fontSize: '1rem', color: '#FF2D55' }} />
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  +56 (9) 3357-1879
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <LocationOn sx={{ mr: 1, fontSize: '1rem', color: '#FF2D55', mt: 0.5 }} />
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Las Dedaleras #3622, Santiago, Chile
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 3, backgroundColor: 'rgba(255,255,255,0.1)' }} />
        
        <Box sx={{ textAlign: 'center', pt: 1 }}>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            © {new Date().getFullYear()} Foog Technology. Todos los derechos reservados.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
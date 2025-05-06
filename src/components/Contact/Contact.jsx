import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Alert
} from '@mui/material';
import { 
  Email, 
  Phone, 
  LocationOn,
  Send
} from '@mui/icons-material';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: ''
  });
  
  const [submitStatus, setSubmitStatus] = useState(null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar el formulario
    console.log('Formulario enviado:', formData);
    setSubmitStatus('success');
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      subject: '',
      message: ''
    });
    
    // Simular envío
    setTimeout(() => {
      setSubmitStatus(null);
    }, 5000);
  };

  return (
    <div className="contact-page">
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', my: 8 }}>
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#1A1A2E' }}>
            Contáctanos
          </Typography>
          <Typography variant="h5" sx={{ color: '#555', maxWidth: '800px', mx: 'auto' }}>
            Estamos aquí para ayudarte. Envíanos un mensaje y te responderemos lo antes posible.
          </Typography>
        </Box>
        
        <Grid container spacing={6} sx={{ my: 4 }}>
          <Grid item xs={12} md={6}>
            <Box 
              component="form" 
              onSubmit={handleSubmit}
              sx={{ 
                p: 4, 
                borderRadius: '8px', 
                backgroundColor: '#F8F9FA',
                boxShadow: '0 5px 15px rgba(0,0,0,0.05)'
              }}
            >
              {submitStatus === 'success' && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  ¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.
                </Alert>
              )}
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nombre Completo"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Correo Electrónico"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Teléfono"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Empresa"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Asunto</InputLabel>
                    <Select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      label="Asunto"
                      required
                    >
                      <MenuItem value="Consulta General">Consulta General</MenuItem>
                      <MenuItem value="Soporte Técnico">Soporte Técnico</MenuItem>
                      <MenuItem value="Ventas">Ventas</MenuItem>
                      <MenuItem value="Cotización">Cotización</MenuItem>
                      <MenuItem value="Otro">Otro</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Mensaje"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    multiline
                    rows={4}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    endIcon={<Send />}
                    fullWidth
                    sx={{
                      backgroundColor: '#FF2D55',
                      color: '#fff',
                      fontWeight: 'bold',
                      py: 2,
                      '&:hover': {
                        backgroundColor: '#d82548',
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    Enviar Mensaje
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ 
              p: 4, 
              height: '100%',
              borderRadius: '8px', 
              backgroundColor: '#1A1A2E',
              color: '#fff'
            }}>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
                Información de Contacto
              </Typography>
              
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Email sx={{ mr: 2, color: '#FF2D55' }} />
                  <Typography variant="body1">
                    contacto@foog.cl
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Phone sx={{ mr: 2, color: '#FF2D55' }} />
                  <Typography variant="body1">
                    +56 (9) 3357-1879
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <LocationOn sx={{ mr: 2, color: '#FF2D55', mt: 0.5 }} />
                  <Typography variant="body1">
                    Las Dedaleras #3622, Santiago, Chile
                  </Typography>
                </Box>
              </Box>
              
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mt: 4, mb: 2 }}>
                Horario de Atención
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Lunes a Viernes: 9:00 - 18:00 hrs
              </Typography>
              <Typography variant="body1">
                Sábado: 10:00 - 14:00 hrs
              </Typography>
              
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mt: 4, mb: 2 }}>
                Soporte Técnico 24/7
              </Typography>
              <Typography variant="body1">
                Para emergencias técnicas, contamos con soporte disponible las 24 horas.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Contact;
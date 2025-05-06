import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  TextField, 
  Button, 
  Grid, 
  Link, 
  Divider,
  IconButton,
  InputAdornment,
  Alert
} from '@mui/material';
import { 
  Email, 
  Lock, 
  Visibility, 
  VisibilityOff,
  GitHub,
  Google,
  Facebook
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Correo electrónico no válido';
    }
    
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    if (!isLogin && !formData.name) {
      newErrors.name = 'El nombre es requerido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Simular autenticación
      console.log(isLogin ? 'Iniciando sesión' : 'Registrando', formData);
      setSubmitStatus('success');
      
      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    }
  };

  return (
    <div className="auth-page">
      <Container maxWidth="sm">
        <Box sx={{ 
          my: 8,
          p: 6,
          borderRadius: '8px',
          backgroundColor: '#fff',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
        }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="h3" component="h1" sx={{ 
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #FF2D55 0%, #3A86FF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2
              }}>
                {isLogin ? 'Inicia Sesión' : 'Regístrate'}
              </Typography>
              <Typography variant="body1" sx={{ color: '#555' }}>
                {isLogin ? 'Ingresa tus credenciales para acceder' : 'Crea una cuenta para comenzar'}
              </Typography>
            </Box>

            {submitStatus === 'success' && (
              <Alert severity="success" sx={{ mb: 3 }}>
                {isLogin ? 'Inicio de sesión exitoso. Redirigiendo...' : 'Registro exitoso. Redirigiendo...'}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
              {!isLogin && (
                <TextField
                  fullWidth
                  label="Nombre Completo"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  margin="normal"
                  error={!!errors.name}
                  helperText={errors.name}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: '#555' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
              
              <TextField
                fullWidth
                label="Correo Electrónico"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
                error={!!errors.email}
                helperText={errors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: '#555' }} />
                    </InputAdornment>
                  ),
                }}
              />
              
              <TextField
                fullWidth
                label="Contraseña"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                margin="normal"
                error={!!errors.password}
                helperText={errors.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: '#555' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              
              {isLogin && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                  <Link href="#" variant="body2" sx={{ color: '#555' }}>
                    ¿Olvidaste tu contraseña?
                  </Link>
                </Box>
              )}
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.5,
                  background: 'linear-gradient(135deg, #FF2D55 0%, #3A86FF 100%)',
                  color: '#fff',
                  fontWeight: 'bold',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(255, 45, 85, 0.3)'
                  }
                }}
              >
                {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
              </Button>
              
              <Grid container justifyContent="center" sx={{ mt: 2 }}>
                <Grid item>
                  <Typography variant="body2" sx={{ color: '#555' }}>
                    {isLogin ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
                  </Typography>
                </Grid>
                <Grid item>
                  <Link 
                    href="#" 
                    variant="body2" 
                    sx={{ ml: 1, fontWeight: 'bold', color: '#FF2D55' }}
                    onClick={() => setIsLogin(!isLogin)}
                  >
                    {isLogin ? 'Regístrate' : 'Inicia Sesión'}
                  </Link>
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 3 }}>o</Divider>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                <IconButton
                  sx={{
                    backgroundColor: '#f5f5f5',
                    '&:hover': {
                      backgroundColor: '#e0e0e0'
                    }
                  }}
                >
                  <Google sx={{ color: '#DB4437' }} />
                </IconButton>
                <IconButton
                  sx={{
                    backgroundColor: '#f5f5f5',
                    '&:hover': {
                      backgroundColor: '#e0e0e0'
                    }
                  }}
                >
                  <Facebook sx={{ color: '#4267B2' }} />
                </IconButton>
                <IconButton
                  sx={{
                    backgroundColor: '#f5f5f5',
                    '&:hover': {
                      backgroundColor: '#e0e0e0'
                    }
                  }}
                >
                  <GitHub sx={{ color: '#333' }} />
                </IconButton>
              </Box>
            </Box>
          </motion.div>
        </Box>
      </Container>
    </div>
  );
};

export default Auth;
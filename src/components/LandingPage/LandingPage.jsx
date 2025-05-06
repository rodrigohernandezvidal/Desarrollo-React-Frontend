import React from "react";
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Box,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Paper,
  Fab,
  IconButton
} from "@mui/material";
import { 
  Business, 
  Code, 
  ContactMail,
  PlayCircle,
  CheckCircle,
  Star,
  ArrowForward,
  Email,
  Phone,
  LocationOn,
  GitHub,
  LinkedIn,
  Twitter
} from "@mui/icons-material";
import { Particles } from 'react-tsparticles';
import { loadFull } from 'tsparticles';
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

// Paleta de colores personalizada
const colors = {
  primary: '#FF2D55',    // Rosa vibrante
  secondary: '#3A86FF',  // Azul brillante
  accent: '#FFBE0B',     // Amarillo dorado
  dark: '#1F2937',       // Azul oscuro
  light: '#F8F9FA',      // Fondo claro
  white: '#FFFFFF',      // Blanco puro
};
const LandingPage = () => {
    const particlesInit = async (engine) => {
        await loadFull(engine);
      };
    return (
        <Box sx={{ minHeight: "100vh", overflowX: "hidden", backgroundColor: colors.light }}>
            {/* Hero Section - Versión optimizada */}
<Box sx={{
  minHeight: { xs: "90vh", sm: "80vh", md: "70vh" }, // Altura responsiva
  width: "100%",
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: `
    linear-gradient(112deg, rgba(109,40,217,0.9) 0%, rgba(76,29,149,0.9) 100%),
    url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80')`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundAttachment: { xs: "scroll", md: "fixed" }, // Fixed solo en desktop
  overflow: "hidden"
}}>
  <Particles
    id="tsparticles"
    init={particlesInit}
    options={{
      particles: {
        number: { value: 80 },
        move: { enable: true, speed: 2 },
        size: { value: 3 },
        opacity: { value: 0.5 },
        links: { enable: true, distance: 150 }
      }
    }}
  />
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    style={{ 
      position: 'relative', 
      zIndex: 1,
      width: '100%',
      maxWidth: '1200px'
    }}
  >
    <Box sx={{ 
      p: { xs: 3, sm: 4 }, // Padding responsivo
      borderRadius: 2, 
      width: '100%',
      mx: 'auto', // Centrado horizontal
      textAlign: 'center' // Texto centrado
    }}>
      <Chip 
        label="Nueva Versión Disponible" 
        sx={{ 
          mb: 2, 
          backgroundColor: colors.accent,
          color: colors.dark,
          fontWeight: 'bold',
          fontSize: { xs: '0.8rem', sm: '0.9rem' } // Tamaño responsivo
        }} 
      />
      <Typography variant="h2" gutterBottom sx={{ 
        fontWeight: 'bold', 
        textShadow: '0 2px 4px rgba(0,0,0,0.3)',
        fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } // Tamaño responsivo
      }}>
        Transforma tu negocio con nuestro software
      </Typography>
      <Typography variant="h5" gutterBottom sx={{ 
        mb: 4, 
        textShadow: '0 1px 2px rgba(0,0,0,0.2)',
        fontSize: { xs: '1.1rem', md: '1.25rem' } // Tamaño responsivo
      }}>
        Soluciones tecnológicas diseñadas para impulsar tu productividad y crecimiento
      </Typography>
      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        justifyContent: 'center',
        flexWrap: { xs: 'wrap', sm: 'nowrap' } // Wrap en móviles
      }}>
        <Button 
          variant="contained" 
          sx={{ 
            px: 4, 
            py: 1.5,
            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
            color: colors.white,
            fontWeight: 'bold',
            minWidth: { xs: '100%', sm: 'auto' }, // Ancho completo en móviles
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: `0 4px 8px ${colors.primary}`
            }
          }}
          size="large"
          endIcon={<PlayCircle />}
        >
          Ver Demo
        </Button>
        <Button 
          variant="outlined" 
          color="inherit" 
          size="large"
          endIcon={<ArrowForward />}
          sx={{ 
            px: 4, 
            py: 1.5,
            color: colors.white,
            borderColor: colors.white,
            fontWeight: 'bold',
            minWidth: { xs: '100%', sm: 'auto' }, // Ancho completo en móviles
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderColor: colors.white
            }
          }}
        >
          Conoce más
        </Button>
      </Box>
    </Box>
  </motion.div>

  <Fab 
    color="primary" 
    sx={{ 
      position: 'absolute', 
      bottom: 40,
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: colors.white,
      color: colors.primary,
      '&:hover': {
        backgroundColor: colors.white,
        transform: 'translateX(-50%) scale(1.1)'
      }
    }}
    aria-label="scroll-down"
  >
    <ArrowForward sx={{ transform: 'rotate(90deg)' }} />
  </Fab>
</Box>

            {/* Stats Section */}
            <Box sx={{ py: 8, backgroundColor: colors.white, width: '100vw', position: 'relative', left: '50%', transform: 'translateX(-50%)' }}>
                <Container maxWidth="lg">
                    <Typography variant="h3" align="center" gutterBottom sx={{ 
                        fontWeight: 'bold',
                        color: colors.dark,
                        mb: 6,
                        position: 'relative',
                        '&:after': {
                            content: '""',
                            display: 'block',
                            width: '80px',
                            height: '4px',
                            backgroundColor: colors.primary,
                            margin: '20px auto 0'
                        }
                    }}>
                        Nuestro Impacto
                    </Typography>
                    <Grid container spacing={4} justifyContent="center">
                        {[
                            { value: '500+', label: 'Clientes satisfechos' },
                            { value: '99%', label: 'Uptime garantizado' },
                            { value: '24/7', label: 'Soporte técnico' },
                            { value: '10x', label: 'Aumento productividad' }
                        ].map((stat, index) => (
                            <Grid item xs={6} sm={3} key={index}>
                                <motion.div whileHover={{ scale: 1.05 }}>
                                    <Paper elevation={3} sx={{ 
                                        p: 3, 
                                        textAlign: 'center',
                                        borderRadius: '16px',
                                        background: colors.white,
                                        border: `2px solid ${colors.light}`,
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            borderColor: colors.primary,
                                            boxShadow: `0 10px 20px rgba(255, 45, 85, 0.1)`
                                        }
                                    }}>
                                        <Typography variant="h3" sx={{ 
                                            fontWeight: 'bold',
                                            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent'
                                        }}>
                                            {stat.value}
                                        </Typography>
                                        <Typography variant="subtitle1" sx={{ color: colors.dark }}>
                                            {stat.label}
                                        </Typography>
                                    </Paper>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>
            {/* Services Section - Card 3D */}
<Grid container spacing={4} justifyContent="center" sx={{ mt: 4 }}>
  {[
    { 
      icon: <Business sx={{ fontSize: 60 }} />, 
      title: "Automatización Empresarial", 
      features: ["Flujos de trabajo automatizados", "Integración con sistemas existentes", "Reducción de errores humanos"] 
    },
    { 
      icon: <Code sx={{ fontSize: 60 }} />, 
      title: "Desarrollo de Software", 
      features: ["Aplicaciones web y móviles", "Sistemas a medida", "Tecnologías modernas"] 
    },
    { 
      icon: <ContactMail sx={{ fontSize: 60 }} />, 
      title: "Soporte y Consultoría", 
      features: ["Implementación guiada", "Capacitación de equipos", "Soporte prioritario"] 
    }
  ].map((service, index) => (
    <Grid item xs={12} md={4} key={index}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -10 }}
        transition={{ duration: 0.5 }}
      >
        <Card sx={{ 
          textAlign: "center", 
          p: 4,
          minHeight: "100%",
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          borderRadius: "16px",
          transformStyle: "preserve-3d",
          transition: "all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
            animation: "gradientShift 8s ease infinite"
          },
          "&:hover": {
            transform: "translateY(-10px) rotateX(5deg)",
            boxShadow: "0 15px 30px rgba(109, 40, 217, 0.3)",
            "&::after": {
              opacity: 1
            }
          },
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 70%)",
            opacity: 0,
            transition: "opacity 0.5s ease"
          }
        }}>
          <CardContent sx={{ position: "relative", zIndex: 1 }}>
            <Box sx={{ 
              color: index === 0 ? colors.primary : 
                    index === 1 ? colors.secondary : 
                    colors.accent,
              mb: 3,
              transition: "transform 0.5s ease",
              "&:hover": {
                transform: "scale(1.1)"
              }
            }}>
              {service.icon}
            </Box>
            
            <Typography variant="h5" sx={{ 
              mb: 3, 
              fontWeight: 700,
              color: colors.dark,
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>
              {service.title}
            </Typography>
            
            <Divider sx={{ 
              my: 2, 
              background: `linear-gradient(90deg, transparent 0%, ${colors.primary} 50%, transparent 100%)`,
              height: "2px"
            }}/>
            
            <List>
              {service.features.map((feature, i) => (
                <motion.div
                  key={i}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <CheckCircle sx={{ 
                        color: index === 0 ? colors.primary : 
                              index === 1 ? colors.secondary : 
                              colors.accent 
                      }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={feature} 
                      sx={{ 
                        color: colors.dark,
                        "& .MuiTypography-root": {
                          fontWeight: 500
                        }
                      }}
                    />
                  </ListItem>
                </motion.div>
              ))}
            </List>
          </CardContent>
        </Card>
      </motion.div>
    </Grid>
  ))}
</Grid>

            {/* Demo Section */}
            <Box sx={{ 
                py: 8, 
                backgroundColor: colors.white,
                backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(255, 45, 85, 0.05) 0%, rgba(255, 45, 85, 0) 20%)'
            }}>
                <Container maxWidth="lg">
                    <Grid container spacing={6} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Typography variant="h3" gutterBottom sx={{ 
                                fontWeight: 'bold',
                                color: colors.dark
                            }}>
                                Descubre cómo funciona
                            </Typography>
                            <Typography variant="h5" sx={{ 
                                color: colors.dark,
                                opacity: 0.8,
                                mb: 4
                            }}>
                                Nuestra plataforma en acción
                            </Typography>
                            <List sx={{ mt: 3 }}>
                                {[
                                    "Interfaz intuitiva y fácil de usar",
                                    "Configuración en minutos",
                                    "Escalable según tus necesidades",
                                    "Reportes en tiempo real"
                                ].map((item, index) => (
                                    <ListItem key={index} sx={{ px: 0 }}>
                                        <ListItemIcon>
                                            <Star sx={{ color: colors.accent }} />
                                        </ListItemIcon>
                                        <ListItemText 
                                            primary={item} 
                                            sx={{ color: colors.dark }}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                            <Button 
                                variant="contained" 
                                size="large" 
                                endIcon={<PlayCircle />}
                                sx={{ 
                                    mt: 3,
                                    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                                    color: colors.white,
                                    fontWeight: 'bold',
                                    px: 4,
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: `0 4px 12px ${colors.primary}`
                                    }
                                }}
                            >
                                Ver video demo
                            </Button>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <motion.div whileHover={{ scale: 1.02 }}>
                                <Paper elevation={6} sx={{ 
                                    borderRadius: 2, 
                                    overflow: 'hidden',
                                    border: `1px solid ${colors.light}`,
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                                }}>
                                    <CardMedia 
                                        component="img" 
                                        height="400" 
                                        image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600&q=80"
                                        alt="Demo" 
                                        sx={{
                                            transition: 'transform 0.5s ease',
                                            '&:hover': {
                                                transform: 'scale(1.03)'
                                            }
                                        }}
                                    />
                                </Paper>
                            </motion.div>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Testimonios */}
            <Box sx={{ 
                py: 8, 
                backgroundColor: colors.light
            }}>
                <Container maxWidth="lg">
                    <Typography variant="h3" align="center" gutterBottom sx={{ 
                        fontWeight: 'bold',
                        color: colors.dark,
                        mb: 6,
                        position: 'relative',
                        '&:after': {
                            content: '""',
                            display: 'block',
                            width: '80px',
                            height: '4px',
                            backgroundColor: colors.primary,
                            margin: '20px auto 0'
                        }
                    }}>
                        Lo que dicen nuestros clientes
                    </Typography>
                    <Grid container spacing={4}>
                        {[
                            {
                                name: "Carlos Méndez",
                                role: "CEO, RetailTech",
                                avatar: "C",
                                comment: "Implementamos su software y en 3 meses aumentamos nuestra productividad en un 40%.",
                                rating: 5
                            },
                            {
                                name: "Ana Rodríguez",
                                role: "Directora de Operaciones",
                                avatar: "A",
                                comment: "El soporte técnico es excepcional. Siempre están disponibles cuando los necesitamos.",
                                rating: 5
                            },
                            {
                                name: "Luis Fernández",
                                role: "Gerente TI",
                                avatar: "L",
                                comment: "La solución más completa que hemos encontrado en el mercado a un precio competitivo.",
                                rating: 4
                            }
                        ].map((testimonial, index) => (
                            <Grid item xs={12} md={4} key={index}>
                                <motion.div whileHover={{ y: -5 }}>
                                    <Paper elevation={3} sx={{ 
                                        p: 3, 
                                        height: '100%',
                                        backgroundColor: colors.white,
                                        borderRadius: '12px',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            boxShadow: `0 10px 25px rgba(255, 45, 85, 0.1)`
                                        }
                                    }}>
                                        <Box sx={{ display: 'flex', mb: 2 }}>
                                            {[...Array(5)].map((_, i) => (
                                                <Star 
                                                    key={i} 
                                                    sx={{ 
                                                        color: i < testimonial.rating ? colors.accent : colors.light,
                                                        fontSize: '1.2rem'
                                                    }} 
                                                />
                                            ))}
                                        </Box>
                                        <Typography variant="body1" sx={{ 
                                            mb: 3, 
                                            fontStyle: 'italic',
                                            color: colors.dark,
                                            fontSize: '1.1rem'
                                        }}>
                                            "{testimonial.comment}"
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Avatar sx={{ 
                                                bgcolor: colors.primary, 
                                                mr: 2,
                                                color: colors.white,
                                                fontWeight: 'bold'
                                            }}>
                                                {testimonial.avatar}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="subtitle1" sx={{ 
                                                    fontWeight: 'bold',
                                                    color: colors.dark
                                                }}>
                                                    {testimonial.name}
                                                </Typography>
                                                <Typography variant="body2" sx={{ 
                                                    color: colors.dark,
                                                    opacity: 0.7
                                                }}>
                                                    {testimonial.role}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Paper>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* CTA Section */}
            <Box sx={{ 
                py: 10,
                background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                color: colors.white,
                textAlign: "center",
                position: 'relative',
                overflow: 'hidden',
                '&:before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                    zIndex: 1
                }
            }}>
                <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <Typography variant="h3" gutterBottom sx={{ 
                            fontWeight: 'bold',
                            textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                        }}>
                            ¿Listo para transformar tu negocio?
                        </Typography>
                        <Typography variant="h5" gutterBottom sx={{ 
                            mb: 4,
                            textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                        }}>
                            Contáctanos hoy mismo y descubre cómo podemos ayudarte
                        </Typography>
                        <Button 
                            variant="contained" 
                            size="large"
                            endIcon={<Email />}
                            sx={{ 
                                px: 6, 
                                py: 1.5, 
                                fontSize: '1.1rem',
                                backgroundColor: colors.accent,
                                color: colors.dark,
                                fontWeight: 'bold',
                                '&:hover': {
                                    backgroundColor: colors.accent,
                                    transform: 'translateY(-2px)',
                                    boxShadow: `0 4px 12px ${colors.accent}`
                                }
                            }}
                        >
                            Solicitar Demo
                        </Button>
                    </motion.div>
                </Container>
            </Box>
        </Box>
    );
};

export default LandingPage;
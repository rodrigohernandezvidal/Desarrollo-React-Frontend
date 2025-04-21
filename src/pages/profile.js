import React, { useState } from 'react';
import { Box, Button, Card, CardContent, Grid, Typography, Avatar, Modal} from '@mui/material';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import WorkIcon from '@mui/icons-material/Work';
import PersonIcon from '@mui/icons-material/Person';
import HelpIcon from '@mui/icons-material/Help';
import LogoutIcon from '@mui/icons-material/Logout';
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Importamos los estilos de react-calendar
import { Bar } from 'react-chartjs-2';  // Para el gráfico de asistencia
import './profile.css';  // Este archivo de estilos es necesario

const ProfilePage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [openModal, setOpenModal] = useState(false);
  const [newPhoto, setNewPhoto] = useState(null);
  const [userInfo, setUserInfo] = useState({
    email: 'rodrigo.hernandez@lbo.cl',
    phone: '123-456-7890',
    office: 'Oficina 12B',
  });
  
  // Función para manejar el cambio de fecha
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // Función para aplicar clase a los domingos
  const tileClassName = ({ date, view }) => {
   // Verificar si el día es domingo (date.getDay() === 0)
   if (view === "month" && date.getDay() === 0) {
        return "sunday"; // Añadimos la clase 'sunday' a los domingos
        }
        return null;
    };

  // Formatear la fecha al español
  const formattedDate = selectedDate.toLocaleDateString("es-ES", {
        weekday: "long",  // Día de la semana completo (lunes, martes, etc.)
        year: "numeric",  // Año en formato completo (2025)
        month: "long",    // Mes completo (enero, febrero, etc.)
        day: "numeric"    // Día del mes (1, 2, 3, etc.)
  });

  // Gráfico de Asistencia (simple ejemplo de barra)
  const chartData = {
    labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
    datasets: [
      {
        label: 'Horas trabajadas',
        data: [8, 8, 7, 8, 6],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Función para manejar el cambio de foto
  const handleChangePhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPhoto(URL.createObjectURL(file));
      setOpenModal(false);
    }
  };

  // Función para abrir el modal de foto
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    // Aquí iría la lógica para cerrar sesión, como eliminar el token
    alert('Sesión cerrada');
  };

  return (
    <Box sx={{ padding: 4 ,overflowY: 'auto', maxHeight: 'calc(100vh - 64px)'  }}>
      <Grid container spacing={4}>
        {/* Columna izquierda (Foto de perfil, nombre y puesto) */}
        <Grid item xs={12} sm={4}>
          <Card sx={{ padding: 2, textAlign: 'center' }}>
            <Avatar
              alt="Usuario"
              src={newPhoto || "/static/images/avatar/1.jpg"} // Cambia la ruta según sea necesario
              sx={{ width: 120, height: 120, margin: '0 auto' }}
            />
            <Typography variant="h5" sx={{ marginTop: 2 }}>
              Rodrigo Hernandez Vidal
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Ingeniero Civil en Informatica
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1 }}>
              Email: {userInfo.email}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Teléfono: {userInfo.phone}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Oficina: {userInfo.office}
            </Typography>
            <Button variant="contained" color="primary" onClick={handleOpenModal}>
              Cambiar Foto
            </Button>
          </Card>
        </Grid>

        {/* Columna derecha (Calendario, botones y gráfico de asistencia) */}
        <Grid item xs={12} sm={8}>
          <Grid container spacing={2}>
            {/* Calendario */}
            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" align='center' sx={{ marginBottom: 2 }}>
                    Calendario de Asistencia
                  </Typography>
                  <Calendar
                    onChange={handleDateChange}
                    value={selectedDate}
                    tileClassName={tileClassName} 
                  />
                  <Typography variant="body2" color="textSecondary" sx={{ marginTop: 2 }}>
                    Fecha seleccionada: {formattedDate}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Horarios: Entrada - 08:00 AM | Salida - 17:00 PM
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Gráfico de Asistencia */}
            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" align='center' sx={{ marginBottom: 2 }}>
                    Gráfico de Asistencia
                  </Typography>
                  <Bar data={chartData} options={{ responsive: true }} />
                </CardContent>
              </Card>
            </Grid>

            {/* Botones */}
            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {/* Botón de asistencia */}
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<PersonIcon />}
                      sx={{ textAlign: 'center' }}
                    >
                      Ingreso / Salida de Oficina
                    </Button>

                    {/* Botón de cambio de contraseña */}
                    <Button
                      variant="contained"
                      color="secondary"
                      startIcon={<VpnKeyIcon />}
                      sx={{ textAlign: 'center' }}
                    >
                      Cambio de Contraseña
                    </Button>

                    {/* Botón de solicitud a Recursos Humanos */}
                    <Button
                      variant="contained"
                      color="warning"
                      startIcon={<WorkIcon />}
                      sx={{ textAlign: 'center' }}
                    >
                      Solicitud Recursos Humanos
                    </Button>

                    {/* Botón de solicitud de soporte */}
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<HelpIcon />}
                      sx={{ textAlign: 'center' }}
                    >
                      Solicitud de Soporte
                    </Button>

                    {/* Botón de cerrar sesión */}
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<LogoutIcon />}
                      sx={{ textAlign: 'center' }}
                      onClick={handleLogout}
                    >
                      Cerrar sesión
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Modal para cambiar foto de perfil */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box sx={{ padding: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="h6">Cambiar Foto de Perfil</Typography>
          <input
            type="file"
            accept="image/*"
            onChange={handleChangePhoto}
          />
          <Button variant="contained" color="primary" onClick={() => setOpenModal(false)}>
            Cerrar
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default ProfilePage;

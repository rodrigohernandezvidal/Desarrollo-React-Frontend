import React from 'react';
import { Modal, Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import { useNotifications } from "../../context/notificationContext";


const NotificationsModal = ({ open, onClose }) => {
  const { notifications, setNotifications } = useNotifications();
  // Función para reiniciar el contador al cerrar el modal
  const handleClose = () => {
  // Marcar todas las notificaciones como leídas
  const updatedNotifications = notifications.map((notif) => ({
    ...notif,
    isRead: true,
  }));
  console.log(updatedNotifications)
  setNotifications(updatedNotifications); // Actualizar el estado
  onClose(); // Cerrar el modal
};
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="notifications-modal"
      aria-describedby="notifications-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          borderRadius: 2,
          p: 2,
          maxHeight: '80vh', // Altura máxima del modal
          minHeight: '200px', // Altura mínima del modal
          overflowY: 'auto', // Hacer el contenido desplazable
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Notificaciones
        </Typography>
        <List sx={{ width: '100%', backgroundColor: '#f0f0f0' }}>
          {notifications.map((notif) => (
            <ListItem key={notif.id}>
              <ListItemText
                primary={notif.message.mensaje} // Acceder a la propiedad "mensaje"
                secondary={`Enviado el: ${notif.timestamp}`} // Acceder a la propiedad "timestamp"
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Modal>
  );
};

export default NotificationsModal;
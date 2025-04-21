import React, { useState, useEffect } from "react";
import { Fab, Modal, Box, IconButton, Tabs, Tab, Typography, Paper } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import NotificationsIcon from "@mui/icons-material/Notifications";

const ChatBubble = ({ children, nuevoMensajeRecibido, setNuevoMensajeRecibido }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [tabIndex, setTabIndex] = useState(0); // Estado para manejar las pestañas

  // Efecto para manejar el parpadeo cuando llega un mensaje nuevo
  useEffect(() => {
    if (nuevoMensajeRecibido) {
      setIsBlinking(true); // Activar el parpadeo
      const timeout = setTimeout(() => {
        setIsBlinking(false); // Desactivar el parpadeo después de un tiempo
      }, 3000); // Parpadea durante 3 segundos

      return () => clearTimeout(timeout); // Limpiar el timeout
    }
  }, [nuevoMensajeRecibido]);

  const handleChatClick = () => {
    setIsModalOpen(true);
    setIsBlinking(false); // Detener el parpadeo
    setNuevoMensajeRecibido(false); // Restablecer el estado de mensaje nuevo
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex); // Cambiar la pestaña activa
  };

  return (
    <>
      {/* Botón flotante con animación de parpadeo */}
      <Fab
        size="small"
        color={isBlinking ? "secondary" : "primary"} // Cambiar el color cuando hay un mensaje nuevo
        aria-label="chat"
        sx={{
          position: "fixed",
          bottom: 35,
          right: 50,
          boxShadow: 3,
          borderRadius: "50%",
          zIndex: 1000,
          transition: "transform 0.3s ease, background-color 0.3s ease",
          "&:hover": {
            transform: "scale(1.1)",
          },
          animation: isBlinking ? "blink 1s infinite" : "none", // Animación de parpadeo
        }}
        onClick={handleChatClick}
      >
        <ChatIcon />
      </Fab>

      {/* Modal */}
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="chat-modal"
        aria-describedby="chat-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 2,
            p: 2,
          }}
        >
          {/* Botón para cerrar el modal */}
          <IconButton
            onClick={handleCloseModal}
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>

          {/* Pestañas */}
          <Tabs value={tabIndex} onChange={handleTabChange} centered variant="fullWidth"
            sx={{ minHeight: 40 }}>
            <Tab label="Chat" icon={<ChatIcon />} />
            <Tab label="Notificaciones" icon={<NotificationsIcon />} />
          </Tabs>

          {/* Contenido de las pestañas */}
          {tabIndex === 0 && (
            <Box sx={{ mt: 2 }}>
              {/* Contenido del chat */}
              {children}
            </Box>
          )}

          {tabIndex === 1 && (
            <Box sx={{ mt: 2 }}>
              {/* Contenido de las notificaciones */}
              <Typography variant="h6" sx={{ mb: 2 }}>
                Notificaciones
              </Typography>
              <Paper sx={{ p: 2, bgcolor: "#F5F5F5", borderRadius: 2 }}>
                <Typography variant="body1">
                  No tienes notificaciones nuevas.
                </Typography>
              </Paper>
            </Box>
          )}
        </Box>
      </Modal>

      {/* Estilos para la animación de parpadeo */}
      <style>
        {`
          @keyframes blink {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
        `}
      </style>
    </>
  );
};

export default ChatBubble;
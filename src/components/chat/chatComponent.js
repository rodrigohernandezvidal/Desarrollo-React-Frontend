import React from "react";
import { Box, Typography, TextField, Button, Paper } from "@mui/material";
import { ULMensajes, LiMensajes } from "../../styles/ULMensajes";

const ChatComponent = ({
  mensajes = [],
  nuevoMensaje,
  setNuevoMensaje,
  enviarMensaje,
  enviarMensajePrivado,
  isPrivate = false,
}) => {
  const handleSendMessage = () => {
    if (nuevoMensaje.trim()) {
      if (isPrivate) {
        // Si es un chat privado, usar la función de enviar mensaje privado
        enviarMensajePrivado(nuevoMensaje);
      } else {
        // Si es un chat grupal, usar la función de enviar mensaje grupal
        enviarMensaje(nuevoMensaje);
      }
    }
  };

  return (
    <Box mt={2}>
      <Paper elevation={3} sx={{ padding: 2 }}>
        <Typography variant="h6">Chat {isPrivate ? "Privado" : "Grupal"}</Typography>

        {/* Mostrar mensajes */}
        <Box
          sx={{
            maxHeight: 300,
            overflowY: "auto",
            borderBottom: "1px solid #ccc",
            paddingBottom: 2,
            marginBottom: 2,
          }}
        >
          <ULMensajes>
            {mensajes.map((mensaje, index) => (
              <Box key={`${mensaje.usuario}-${mensaje.mensaje}-${index}`} mb={1}>
                <Typography variant="body2" color="textSecondary">
                  <LiMensajes>
                    <strong>{mensaje.usuario}:</strong> {mensaje.mensaje}
                  </LiMensajes>
                </Typography>
              </Box>
            ))}
          </ULMensajes>
        </Box>

        {/* Campo de texto para escribir mensajes */}
        <TextField
          label="Escribe un mensaje"
          variant="outlined"
          fullWidth
          value={nuevoMensaje}
          onChange={(e) => setNuevoMensaje(e.target.value)}
          sx={{ marginBottom: 2 }}
        />

        {/* Botón de enviar mensaje */}
        <Button variant="contained" onClick={handleSendMessage} fullWidth>
          Enviar
        </Button>
      </Paper>
    </Box>
  );
};

export default ChatComponent;
import React, { useState } from "react";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import socket from '../../service/socket';

const SendNotificationModal = ({ open, onClose, onSend }) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    console.log(message);
    if (message.trim()) {
      socket.emit('send_notification',{
        mensaje: message,
      });
      setMessage("");
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Enviar Notificación
        </Typography>
        <TextField
          label="Mensaje"
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" onClick={handleSend}>
          Enviar
        </Button>
      </Box>
    </Modal>
  );
};

export default SendNotificationModal;
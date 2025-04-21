// components/BotAsistente.jsx
import React, { useState, useContext } from 'react';
import { Box, IconButton, TextField, Button, Typography, Paper, Collapse } from '@mui/material';
import BotIcon from '../../components/bot/botIcon';
import { AppContext } from '../../App'; // Asegúrate de que el contexto esté correctamente importado

const BotAsistente = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const { currentPageBot } = useContext(AppContext); // Obtener la página actual desde el contexto

  const handleSend = async () => {
    if (!input.trim()) return;
    
    setMessages((prev) => [...prev, { text: input, isBot: false }]);
    
    try {
        console.log("Enviando solicitud al backend:", { message: input, page: currentPageBot });
        
        const response = await fetch(`${process.env.REACT_APP_API_URL_D}/api/bot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, page: currentPageBot }),
      });
  
      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
      }
  
      const data = await response.json();
      setMessages((prev) => [...prev, { text: data.response, isBot: true }]);
    } catch (error) {
      console.error("Error en la comunicación con el backend:", error.message);
      setMessages((prev) => [...prev, { text: "Error en el servidor. Intenta nuevamente.", isBot: true }]);
    } 
    setInput('');
  };

  return (
    <Box sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1000 }}>
      <IconButton onClick={() => setIsOpen(!isOpen)} sx={{color: 'green',transition: 'background-color 0.3s ease, transform 0.3s ease',
          '&:hover': {
            bgcolor: isOpen ? '#FFFFF' : '#FFFFF', // Efecto hover
            transform: 'scale(1.1)', // Aumenta ligeramente el tamaño
          },right: 10,left: 50, }}>
        <BotIcon fontSize="large" />
      </IconButton>

      <Collapse in={isOpen}>
        <Paper sx={{ width: 350, height: 500, p: 2, mt: 2, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2 }}>
            {messages.map((msg, index) => (
              <Box key={index} sx={{ textAlign: msg.isBot ? 'left' : 'right', mb: 1 }}>
                <Paper sx={{ p: 1, display: 'inline-block', bgcolor: msg.isBot ? '#f5f5f5' : '#42A5F5', color: msg.isBot ? 'black' : 'white' }}>
                  <Typography variant="body1">{msg.text}</Typography>
                </Paper>
              </Box>
            ))}
          </Box>
          
          <TextField
            fullWidth
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu pregunta..."
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <Button variant="contained" onClick={handleSend} sx={{ mt: 1 }}>
            Enviar
          </Button>
        </Paper>
      </Collapse>
    </Box>
  );
};

export default BotAsistente;
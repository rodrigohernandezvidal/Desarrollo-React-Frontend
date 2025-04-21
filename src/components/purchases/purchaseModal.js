import React, { useState } from "react";
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField,
  Grid,
  Typography,
  IconButton
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// Tema consistente con billing.js
const theme = createTheme({
  palette: {
    primary: { main: '#E8BA1E' },
    secondary: { main: '#f50057' },
  },
});

const PurchaseModal = ({ open, handleClose, setNotification }) => {
  const [formData, setFormData] = useState({
    razonSocial: '',
    tipoDocumento: '',
    numeroDocumento: '',
    estado: 'PENDIENTE',
    neto: 0,
    iva: 0,
    total: 0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    // Validación básica
    if (!formData.razonSocial || !formData.numeroDocumento) {
      setNotification({ type: 'error', message: 'Razón Social y Número de Documento son requeridos' });
      return;
    }

    // Aquí iría la llamada a la API para guardar
    console.log('Datos a guardar:', formData);
    setNotification({ type: 'success', message: 'Compra registrada correctamente' });
    handleClose();
  };

  return (
    <ThemeProvider theme={theme}>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>
          <Typography variant="h2" component="div" sx={{ fontSize: '1.25rem', fontWeight: 500 }}>Ingresar Documento de Compra</Typography>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Razón Social"
                name="razonSocial"
                value={formData.razonSocial}
                onChange={handleChange}
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tipo de Documento"
                name="tipoDocumento"
                value={formData.tipoDocumento}
                onChange={handleChange}
                margin="normal"
                select
                SelectProps={{ native: true }}
              >
                <option value="">Seleccione...</option>
                <option value="Factura Afecta">Factura Afecta</option>
                <option value="Boleta">Boleta</option>
                <option value="Factura Exenta">Factura Exenta</option>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Número de Documento"
                name="numeroDocumento"
                value={formData.numeroDocumento}
                onChange={handleChange}
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Estado"
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                margin="normal"
                select
                SelectProps={{ native: true }}
              >
                <option value="PENDIENTE">Pendiente</option>
                <option value="INGRESADO">Ingresado</option>
                <option value="RECHAZADO">Rechazado</option>
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Neto"
                name="neto"
                value={formData.neto}
                onChange={handleChange}
                margin="normal"
                type="number"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="IVA"
                name="iva"
                value={formData.iva}
                onChange={handleChange}
                margin="normal"
                type="number"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Total"
                name="total"
                value={formData.total}
                onChange={handleChange}
                margin="normal"
                type="number"
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary" variant="outlined">
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            color="primary" 
            variant="contained"
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default PurchaseModal;
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField,
  Typography,
  CircularProgress,
  IconButton, Box
} from '@mui/material';
import { Close, CloudUpload } from '@mui/icons-material';

const ImportSIIModal = ({ open, onClose, onImport }) => {
  const [rut, setRut] = useState('');
  const [period, setPeriod] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImport = async () => {
    setLoading(true);
    // Simular llamada a API
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    onImport([
      // Datos simulados importados del SII
      {
        id: 100,
        razonSocial: "Proveedor SII S.A.",
        tipoDocumento: "Factura Afecta",
        numeroDocumento: "F-SII-001",
        fecha: "2023-10-01",
        neto: 500000,
        iva: 95000,
        total: 595000
      }
    ]);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" component="div">
          Importar desde SII
          <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <Close />
          </IconButton>
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        <TextField
          fullWidth
          label="RUT Proveedor"
          value={rut}
          onChange={(e) => setRut(e.target.value)}
          margin="normal"
          placeholder="Ej: 76.123.456-7"
        />
        <TextField
          fullWidth
          label="Período"
          type="month"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          py: 4,
          border: '2px dashed #ccc',
          borderRadius: 1,
          mt: 2
        }}>
          <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
          <Typography variant="body1">O arrastre archivos XML del SII</Typography>
          <Typography variant="body2" color="textSecondary">(Formato soportado: XML SII)</Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button 
          onClick={handleImport} 
          color="primary" 
          variant="contained"
          disabled={!rut || !period || loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Importando...' : 'Importar Documentos'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImportSIIModal;
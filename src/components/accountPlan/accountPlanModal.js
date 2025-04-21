import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Modal,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

const ModalPlanCuenta = ({ open, handleClose, initialData, onSave }) => {
  const [formData, setFormData] = useState({
    codigo: '',
    descripcion: '',
    habilitada: true
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        codigo: '',
        descripcion: '',
        habilitada: true
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-plan-cuenta"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        maxWidth: 600,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2
      }}>
        <Typography variant="h6" gutterBottom>
          {initialData ? 'Editar Cuenta' : 'Nueva Cuenta'}
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Código de Cuenta"
            name="codigo"
            value={formData.codigo}
            onChange={handleChange}
            required
            placeholder="Ej: 1.1.1010.10.01"
          />
          
          <TextField
            fullWidth
            margin="normal"
            label="Descripción"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            required
            multiline
            rows={3}
          />
          
          <FormControl fullWidth margin="normal">
            <InputLabel>Estado</InputLabel>
            <Select
              name="habilitada"
              value={formData.habilitada}
              onChange={(e) => setFormData({...formData, habilitada: e.target.value})}
              label="Estado"
            >
              <MenuItem value={true}>Habilitada</MenuItem>
              <MenuItem value={false}>Deshabilitada</MenuItem>
            </Select>
          </FormControl>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
            <Button
              variant="outlined"
              onClick={handleClose}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
            >
              Guardar
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default ModalPlanCuenta;
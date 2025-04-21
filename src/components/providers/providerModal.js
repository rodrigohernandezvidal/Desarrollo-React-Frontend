import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid
} from '@mui/material';
import { validateRut } from '../../functions/utils';

const ProviderModal = ({ open, handleClose, provider, onSave }) => {
  const [formData, setFormData] = useState(provider || {
    businessName: '',
    rut: '',
    address: '',
    email: '',
    phone: '',
    website: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validación en tiempo real para RUT
    if (name === 'rut') {
      setErrors(prev => ({
        ...prev,
        rut: value && !validateRut(value) ? 'RUT inválido' : null
      }));
    }
  };

  const handleSubmit = () => {
    // Validación final antes de guardar
    const newErrors = {};
    if (!formData.businessName) newErrors.businessName = 'Requerido';
    if (!formData.rut) newErrors.rut = 'Requerido';
    if (!validateRut(formData.rut)) newErrors.rut = 'RUT inválido';
    if (!formData.address) newErrors.address = 'Requerido';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(formData);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {provider ? 'Editar Proveedor' : 'Nuevo Proveedor'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="RUT"
              name="rut"
              value={formData.rut}
              onChange={handleChange}
              error={!!errors.rut}
              helperText={errors.rut}
              placeholder="12345678-9"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Razón Social"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              error={!!errors.businessName}
              helperText={errors.businessName}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Dirección"
              name="address"
              value={formData.address}
              onChange={handleChange}
              error={!!errors.address}
              helperText={errors.address}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Teléfono"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Página Web"
              name="website"
              value={formData.website}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancelar
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProviderModal;
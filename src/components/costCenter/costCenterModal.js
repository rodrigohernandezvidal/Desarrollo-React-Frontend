import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  FormHelperText
} from '@mui/material';

const ModalCentroCosto = ({ open, handleClose, initialData, onSave }) => {
  const [centro, setCentro] = useState({
    codigo: '',
    nombre: '',
    departamento: '',
    responsable: '',
    presupuesto: '',
    activo: true
  });
  const [errors, setErrors] = useState({});

  // Cargar datos iniciales al abrir el modal
  useEffect(() => {
    if (initialData) {
      setCentro(initialData);
    } else {
      setCentro({
        codigo: '',
        nombre: '',
        departamento: '',
        responsable: '',
        presupuesto: '',
        activo: true
      });
    }
    setErrors({});
  }, [initialData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCentro(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!centro.codigo) newErrors.codigo = 'Código es requerido';
    if (!centro.nombre) newErrors.nombre = 'Nombre es requerido';
    if (!centro.departamento) newErrors.departamento = 'Departamento es requerido';
    if (!centro.responsable) newErrors.responsable = 'Responsable es requerido';
    if (!centro.presupuesto || isNaN(centro.presupuesto)) {
      newErrors.presupuesto = 'Presupuesto debe ser un número válido';
    }
    return newErrors;
  };

  const handleSubmit = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Formatear datos antes de guardar
    const dataToSave = {
      ...centro,
      presupuesto: Number(centro.presupuesto),
      creado: initialData ? initialData.creado : new Date().toISOString().split('T')[0],
      actualizado: new Date().toISOString().split('T')[0]
    };

    onSave(dataToSave);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialData ? 'Editar Centro de Costos' : 'Nuevo Centro de Costos'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Código"
              name="codigo"
              value={centro.codigo}
              onChange={handleChange}
              error={!!errors.codigo}
              helperText={errors.codigo}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nombre"
              name="nombre"
              value={centro.nombre}
              onChange={handleChange}
              error={!!errors.nombre}
              helperText={errors.nombre}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.departamento}>
              <InputLabel>Departamento</InputLabel>
              <Select
                name="departamento"
                value={centro.departamento}
                onChange={handleChange}
                label="Departamento"
              >
                <MenuItem value="Marketing">Marketing</MenuItem>
                <MenuItem value="Ventas">Ventas</MenuItem>
                <MenuItem value="Tecnología">Tecnología</MenuItem>
                <MenuItem value="Operaciones">Operaciones</MenuItem>
                <MenuItem value="Finanzas">Finanzas</MenuItem>
              </Select>
              {errors.departamento && <FormHelperText>{errors.departamento}</FormHelperText>}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Responsable"
              name="responsable"
              value={centro.responsable}
              onChange={handleChange}
              error={!!errors.responsable}
              helperText={errors.responsable}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Presupuesto ($)"
              name="presupuesto"
              type="number"
              value={centro.presupuesto}
              onChange={handleChange}
              error={!!errors.presupuesto}
              helperText={errors.presupuesto}
              InputProps={{
                inputProps: { min: 0 }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select
                name="activo"
                value={centro.activo}
                onChange={(e) => setCentro(prev => ({ ...prev, activo: e.target.value === 'true' }))}
                label="Estado"
              >
                <MenuItem value={true}>Activo</MenuItem>
                <MenuItem value={false}>Inactivo</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">Cancelar</Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalCentroCosto;
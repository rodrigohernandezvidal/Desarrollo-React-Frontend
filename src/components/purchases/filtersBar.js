import React from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  MenuItem, 
  Grid,
  IconButton,
  Tooltip
} from '@mui/material';
import { FilterList, Clear } from '@mui/icons-material';

const FiltersBar = ({ filters, setFilters }) => {
  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      tipoDocumento: '',
      estado: '',
      fechaDesde: '',
      fechaHasta: ''
    });
  };

  return (
    <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, mb: 2 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="Buscar"
            name="search"
            value={filters.search}
            onChange={handleChange}
            size="small"
          />
        </Grid>
        <Grid item xs={6} sm={3} md={2}>
          <TextField
            select
            fullWidth
            label="Tipo Documento"
            name="tipoDocumento"
            value={filters.tipoDocumento}
            onChange={handleChange}
            size="small"
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="Factura Afecta">Factura Afecta</MenuItem>
            <MenuItem value="Factura Exenta">Factura Exenta</MenuItem>
            <MenuItem value="Boleta">Boleta</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={6} sm={3} md={2}>
          <TextField
            select
            fullWidth
            label="Estado"
            name="estado"
            value={filters.estado}
            onChange={handleChange}
            size="small"
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="INGRESADO">Ingresado</MenuItem>
            <MenuItem value="PENDIENTE">Pendiente</MenuItem>
            <MenuItem value="SEPARADO">Separado</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <TextField
            fullWidth
            label="Desde"
            type="date"
            name="fechaDesde"
            value={filters.fechaDesde}
            onChange={handleChange}
            size="small"
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <TextField
            fullWidth
            label="Hasta"
            type="date"
            name="fechaHasta"
            value={filters.fechaHasta}
            onChange={handleChange}
            size="small"
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={1}>
          <Box display="flex" justifyContent="flex-end">
            <Tooltip title="Limpiar filtros">
              <IconButton onClick={resetFilters}>
                <Clear />
              </IconButton>
            </Tooltip>
            <Button 
              variant="contained" 
              startIcon={<FilterList />}
              onClick={() => console.log('Aplicar filtros')}
            >
              Filtrar
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FiltersBar;
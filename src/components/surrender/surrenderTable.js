import React, { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  IconButton,
  Tooltip,
  Checkbox,
  Box,
  Typography
} from "@mui/material";
import { Edit, Visibility } from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// Tema consistente con el proyecto
const theme = createTheme({
  palette: {
    primary: { main: '#E8BA1E' },
    secondary: { main: '#f50057' },
    background: { default: '#f4f6f9' },
    text: { primary: '#212121' }
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h6: { fontWeight: 600 },
  },
});

const TablaRendiciones = ({ rendiciones, onEdit, searchTerm = '' }) => {
  const [selected, setSelected] = useState([]);
  
  const formatCurrency = (value) => new Intl.NumberFormat('es-CL', { 
    style: 'currency', 
    currency: 'CLP' 
  }).format(value);

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(rendiciones.map(rendicion => rendicion.id));
    } else {
      setSelected([]);
    }
  };

  const handleSelect = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(item => item !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const filteredRendiciones = rendiciones.filter(rendicion => {
    if (!rendicion) return false;
    
    const searchLower = (searchTerm || '').toLowerCase();
    const categoria = rendicion.categoria?.toLowerCase() || '';
    const estado = rendicion.estado?.toLowerCase() || '';
    
    return (
      categoria.includes(searchLower) ||
      estado.includes(searchLower)
    );
  });

  return (
    <ThemeProvider theme={theme}>
      <TableContainer component={Paper} sx={{ maxHeight: 400, overflowY: 'auto', marginBottom: 2 }}>
        <Table stickyHeader>
          <TableHead sx={{ 
            backgroundColor: '#f0f0f0',
            '& .MuiTableCell-root': {
              backgroundColor: '#f0f0f0',
              fontWeight: 'bold'
            } 
          }}>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selected.length > 0 && selected.length < rendiciones.length}
                  checked={selected.length === rendiciones.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell sx={{ width: '10%' }}>ID</TableCell>
              <TableCell sx={{ width: '15%' }}>Fecha</TableCell>
              <TableCell sx={{ width: '15%' }}>Monto</TableCell>
              <TableCell sx={{ width: '20%' }}>Categoría</TableCell>
              <TableCell sx={{ width: '15%' }}>Estado</TableCell>
              <TableCell sx={{ width: '15%' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRendiciones.map((rendicion) => (
              <TableRow key={rendicion.id} hover>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selected.includes(rendicion.id)}
                    onChange={() => handleSelect(rendicion.id)}
                  />
                </TableCell>
                <TableCell>{rendicion.id}</TableCell>
                <TableCell>{rendicion.fecha}</TableCell>
                <TableCell>{formatCurrency(rendicion.monto)}</TableCell>
                <TableCell>{rendicion.categoria}</TableCell>
                <TableCell>
                  <Typography 
                    color={
                      rendicion.estado === 'aprobada' ? 'success.main' :
                      rendicion.estado === 'pendiente' ? 'warning.main' :
                      'error.main'
                    }
                  >
                    {rendicion.estado.toUpperCase()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 1,
                  }}>
                    <Tooltip title="Ver detalle">
                      <IconButton 
                        color="primary" 
                        sx={{ width: 30, height: 30 }}
                        onClick={() => onEdit(rendicion)}
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar">
                      <IconButton 
                        color="success" 
                        sx={{ width: 30, height: 30 }}
                        onClick={() => onEdit(rendicion)}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </ThemeProvider>
  );
};

export default TablaRendiciones;
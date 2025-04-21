import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Tooltip,
  Box
} from '@mui/material';
import {
  Visibility,
  ToggleOff,
  ToggleOn
} from '@mui/icons-material';

const ProvidersTable = ({ providers, onView, onEdit, onToggleStatus }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead sx={{ 
                backgroundColor: '#f0f0f0',
                '& .MuiTableCell-root': {
                    backgroundColor: '#f0f0f0',
                    fontWeight: 'bold'
                }
                }}>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Razón Social</TableCell>
            <TableCell>RUT</TableCell>
            <TableCell>Dirección</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell align="center">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {providers.map((provider) => (
            <TableRow key={provider.id} hover>
              <TableCell>{provider.id}</TableCell>
              <TableCell>{provider.businessName}</TableCell>
              <TableCell>{provider.rut}</TableCell>
              <TableCell>{provider.address}</TableCell>
              <TableCell>
                <Chip 
                  label={provider.active ? 'Activo' : 'Inactivo'} 
                  color={provider.active ? 'success' : 'error'} 
                  size="small"
                />
              </TableCell>
              <TableCell align="center">
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 1,
                    }}>              
                    <Tooltip title="Ver detalle">
                        <IconButton onClick={() => onView(provider)} color="primary" sx={{ width: 30, height: 30 }}>
                            <Visibility fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar">
                        <IconButton onClick={() => onEdit(provider)}  sx={{ width: 30, height: 30 }}>
                            <Visibility color="info" fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={provider.active ? 'Desactivar' : 'Activar'}>
                        <IconButton onClick={() => onToggleStatus(provider)} sx={{ width: 30, height: 30 }} aria-label={provider.active ? 'Desactivar' : 'Activar'}>
                            {provider.active ? 
                                <ToggleOff color="warning" fontSize="small" /> : 
                                <ToggleOn color="success" fontSize="small" />
                            }
                        </IconButton>
                    </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProvidersTable;
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
  Tooltip,
  Switch,
  Box
} from '@mui/material';
import { Edit } from '@mui/icons-material';

const TablaPlanCuentas = ({ cuentas, onEdit, onToggleHabilitada }) => {
  if (!cuentas || cuentas.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        No hay cuentas para mostrar
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Código</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Descripción</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Estado</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cuentas.map((cuenta) => (
            <TableRow key={cuenta.id} hover>
              <TableCell>{cuenta.id}</TableCell>
              <TableCell>{cuenta.codigo}</TableCell>
              <TableCell>{cuenta.descripcion}</TableCell>
              <TableCell>
                <Switch
                  checked={cuenta.habilitada}
                  onChange={() => onToggleHabilitada(cuenta.id)}
                  color="primary"
                />
              </TableCell>
              <TableCell>
                <Tooltip title="Editar cuenta">
                  <IconButton 
                    onClick={() => onEdit(cuenta)}
                    color="primary"
                  >
                    <Edit />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TablaPlanCuentas;
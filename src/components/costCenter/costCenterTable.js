import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Switch, IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const TablaCentroCostos = ({ centros, onEdit }) => {
  return (
    <TableContainer component={Paper} sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>Código</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Nombre</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Departamento</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Presupuesto</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Estado</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {centros.map((centro) => (
            <TableRow key={centro.id}>
              <TableCell>{centro.codigo}</TableCell>
              <TableCell>{centro.nombre}</TableCell>
              <TableCell>{centro.departamento}</TableCell>
              <TableCell>${centro.presupuesto.toLocaleString('es-CL')}</TableCell>
              <TableCell>
                <Switch 
                  checked={centro.activo} 
                  color="primary"
                  onChange={() => console.log('Cambiar estado')}
                />
              </TableCell>
              <TableCell>
                <IconButton onClick={() => onEdit(centro)}>
                  <Edit color="primary" />
                </IconButton>
                <IconButton>
                  <Delete color="secondary" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TablaCentroCostos;
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
import { Edit, Delete, Visibility } from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: '#E8BA1E' },
    secondary: { main: '#f50057' },
  },
});

const PurchasesTable = ({ purchases = [], onEdit, onDelete, searchTerm = '' }) => {
  const [selected, setSelected] = useState([]);
  
  const formatCurrency = (value) => new Intl.NumberFormat('es-CL', { 
    style: 'currency', 
    currency: 'CLP' 
  }).format(value);

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(purchases.map(purchase => purchase.id));
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

  const filteredPurchases = purchases.filter(purchase => {
    const search = searchTerm?.toLowerCase() || '';
    return (
      purchase.provider?.toLowerCase().includes(search) ||
      purchase.documentType?.toLowerCase().includes(search) ||
      purchase.id?.toString().includes(searchTerm)
    );
  });

  return (
    <ThemeProvider theme={theme}>
      <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
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
                  indeterminate={selected.length > 0 && selected.length < purchases.length}
                  checked={selected.length === purchases.length && purchases.length > 0}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell sx={{ width: '20%' }}>Razón Social</TableCell>
              <TableCell sx={{ width: '15%' }}>Tipo Documento</TableCell>
              <TableCell sx={{ width: '15%' }}>Número</TableCell>
              <TableCell sx={{ width: '10%' }}>Estado</TableCell>
              <TableCell align="right" sx={{ width: '10%' }}>Neto</TableCell>
              <TableCell align="right" sx={{ width: '10%' }}>IVA</TableCell>
             <TableCell align="right" sx={{ width: '10%' }}>Total</TableCell>
             <TableCell sx={{ width: '10%' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPurchases.map((purchase) => (
              <TableRow key={purchase.id} hover>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selected.includes(purchase.id)}
                    onChange={() => handleSelect(purchase.id)}
                  />
                </TableCell>
                <TableCell>{purchase.provider}</TableCell>
                <TableCell>{purchase.documentType}</TableCell>
                <TableCell>{purchase.date}</TableCell>
                <TableCell>
                  <Typography 
                    color={
                      purchase.status === 'Pagado' ? 'success.main' :
                      purchase.status === 'Pendiente' ? 'warning.main' :
                      'error.main'
                    }
                  >
                    {purchase.status}
                  </Typography>
                </TableCell>
                <TableCell align="right">{purchase.neto}</TableCell>
                <TableCell align="right">{purchase.iva}</TableCell>
                <TableCell align="right">{formatCurrency(purchase.amount)}</TableCell>
                <TableCell>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 1,
                    }}>
                    <Tooltip title="Ver detalle">
                        <IconButton color="primary" sx={{ width: 30, height: 30 }}>
                        <Visibility fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar">
                        <IconButton color="secondary" sx={{ width: 30, height: 30 }}>
                        <Edit fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                        <IconButton color="error" sx={{ width: 30, height: 30 }}>
                        <Delete fontSize="small" />
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

export default PurchasesTable;
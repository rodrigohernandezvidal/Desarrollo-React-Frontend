import React, { useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  TextField,
  Modal,
  Typography,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  Checkbox,
} from '@mui/material';
import {
  Add,
  Delete ,
  Edit ,
} from '@mui/icons-material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { createTheme, ThemeProvider  } from '@mui/material/styles';

// Tema para personalizar colores y fuentes
const theme = createTheme({
  palette: {
    primary: { main: '#3f51b5' },//#007bff
    secondary: { main: '#f50057' },
    background: { default: '#f4f6f9' },
    text: { primary: '#212121' }
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h6: { fontWeight: 600 },
  },
});

const initialItems = [
  { id: 1, name: 'Monitor Dell U2719D', location: 'OF/Sala Reuniones', quantity: 25, available: 10, price: 399.99 },
  { id: 2, name: 'Mouse Logitech MX Master 3', location: 'OF/Sala Reuniones', quantity: 50, available: 10, price: 99.99 },
  { id: 3, name: 'Teclado Mecánico Razer BlackWidow', location: 'OF/Oficina Central', quantity: 15, available: 10, price: 129.99 },
  { id: 4, name: 'Auriculares Sony WH-1000XM4', location: 'OF/Oficina Central', quantity: 30, available: 10, price: 349.99 },
  { id: 5, name: 'Laptop HP Spectre x360', location: 'OF/Hall Central', quantity: 20, available: 10, price: 1499.99 },
  { id: 6, name: 'Cargador Anker PowerPort', location: 'OF/Hall Central', quantity: 100, available: 10, price: 24.99 },
  { id: 7, name: 'USB Kingston DataTraveler 64GB', location: 'OF/Sala Espera', quantity: 200, available: 10, price: 19.99 },
  { id: 8, name: 'Disco Duro Externo Seagate 1TB', location: 'OF/Sala Espera', quantity: 35, available: 10, price: 69.99 },
];

const Income = () => {
  const [items, setItems] = useState(initialItems);
  const [openModal, setOpenModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [notification, setNotification] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const itemsPerPage = 5;
  const uniqueLocations = [...new Set(initialItems.map((item) => item.location))];

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = selectedLocation ? item.location === selectedLocation : true;
    return matchesSearch && matchesLocation;
  });

  const displayedItems = filteredItems.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleOpenModal = (item = null) => {
    setCurrentItem(item || { name: '', quantity: '', available: '', price: '' });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setCurrentItem(null);
  };

  const handleSaveItem = () => {
    if (currentItem.id) {
      setItems(items.map((item) => (item.id === currentItem.id ? currentItem : item)));
      setNotification({ type: 'success', message: 'Artículo actualizado' });
    } else {
      const newItem = { ...currentItem, id: items.length + 1 };
      setItems([...items, newItem]);
      setNotification({ type: 'success', message: 'Artículo agregado' });
    }
    handleCloseModal();
  };

  const handleDeleteItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
    setNotification({ type: 'error', message: 'Artículo eliminado' });
  };

  const handleDeleteSelected = () => {
    setItems(items.filter((item) => !selectedItems.includes(item.id)));
    setSelectedItems([]);
    setNotification({ type: 'error', message: 'Artículos seleccionados eliminados' });
  };

  const handlePageChange = (_, value) => {
    setPage(value);
  };

  const handleCheckboxChange = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleLocationFilter = (location) => {
    setSelectedLocation(location);
    setPage(1); // Reinicia a la primera página al cambiar el filtro
  };

  return (
    <ThemeProvider theme={theme}>
    <Box sx={{ display: 'flex', height: '100vh' ,overflowY: 'auto' }}>
      <Box
        sx={{
          width: '250px',
          backgroundColor: '#f0f0f0',
          padding: 2,
          borderRight: '1px solid #ccc',
        }}
      >
        <Typography variant="h6" gutterBottom>
          Ubicaciones
        </Typography>
        <Button
          fullWidth
          variant={selectedLocation === null ? 'contained' : 'outlined'}
          onClick={() => handleLocationFilter(null)}
          sx={{ marginBottom: 1 }}
        >
          Todas
        </Button>
        {uniqueLocations.map((location) => (
          <Button
            key={location}
            fullWidth
            variant={selectedLocation === location ? 'contained' : 'outlined'}
            onClick={() => handleLocationFilter(location)}
            sx={{ marginBottom: 1 }}
          >
            {location}
          </Button>
        ))}
      </Box>

      <Box sx={{ flex: 1, padding: 3 }}>
        <Typography variant="h4" gutterBottom align="center">
          Gestión de Inventario
        </Typography>
        <TextField
          variant="outlined"
          label="Buscar artículo"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ marginBottom: 2 }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, marginBottom: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => handleOpenModal()}
          >
            Nuevo
          </Button>
          <Button variant="contained" color="warning" startIcon={<AssessmentIcon />}>
            Reportes
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<Delete />}
            disabled={selectedItems.length === 0}
            onClick={handleDeleteSelected}
          >
            Eliminar seleccionados
          </Button>
        </Box>

        <TableContainer component={Paper} sx={{ maxHeight: 500, overflowY: 'auto', marginBottom: 2 }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f0f0f0' }}>
              <TableRow>
                <TableCell>
                  <Checkbox
                    indeterminate={
                      selectedItems.length > 0 && selectedItems.length < displayedItems.length
                    }
                    checked={
                      displayedItems.length > 0 &&
                      selectedItems.length === displayedItems.length
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedItems(displayedItems.map((item) => item.id));
                      } else {
                        setSelectedItems([]);
                      }
                    }}
                  />
                </TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Ubicación</TableCell>
                <TableCell>Cantidad</TableCell>
                <TableCell>Disponibles</TableCell>
                <TableCell>Precio</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleCheckboxChange(item.id)}
                    />
                  </TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.available}</TableCell>
                  <TableCell>${item.price.toFixed(2)}</TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                      <Tooltip title="Editar">
                        <IconButton color="primary" onClick={() => handleOpenModal(item)}>
                          <Edit />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Pagination
          count={Math.ceil(filteredItems.length / itemsPerPage)}
          page={page}
          onChange={handlePageChange}
          color="primary"
          sx={{ display: 'flex', justifyContent: 'center' }}
        />
      </Box>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            {currentItem?.id ? 'Editar Artículo' : 'Nuevo Artículo'}
          </Typography>
          <TextField
            fullWidth
            label="Nombre"
            value={currentItem?.name || ''}
            onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            fullWidth
            label="Cantidad"
            type="number"
            value={currentItem?.quantity || ''}
            onChange={(e) => setCurrentItem({ ...currentItem, quantity: e.target.value })}
            sx={{ marginBottom: 2 }}
          />
          <Button variant="contained" onClick={handleSaveItem} fullWidth>
            Guardar
          </Button>
        </Box>
      </Modal>
    </Box>
  </ThemeProvider>
  );
};

export default Income;

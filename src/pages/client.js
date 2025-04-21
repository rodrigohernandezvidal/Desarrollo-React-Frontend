import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  IconButton,
  TextField,
  Checkbox,
  Pagination,
  Tooltip,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ToggleOffIcon from '@mui/icons-material/ToggleOff'
import CreateClient from './modal/modalClients/createClient';

const theme = createTheme({
  palette: {
    primary: { main: '#E8BA1E' },  // Amarillo de tu empresa
    secondary: { main: '#f50057' },
    background: { default: '#f4f6f9' },
    text: { primary: '#212121' }
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h6: { fontWeight: 600 },
  },
});

const Client = () => {

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [ setOpenEditModal] = useState(false);
  const [ setCurrentClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState([]);
  
  const itemsPerPage = 5;

  const handlePageChange = (event, value) => {
    setPage(value);
  };

   // Crear los datos
   function createData(id, name, rut, email,address,commune, phone) {
    return { id, name, rut, email, address,commune,phone };
  }

  useEffect(() => {
    // Simulación de datos de clientes; reemplazar con la llamada a la API real
    const fetchClients = async () => {
      try {
        const routeMenu = process.env.REACT_APP_API_URL_D;
        const response = await fetch(routeMenu+'/api/data/client');
        if (!response.ok) {
          throw new Error('Error en la respuesta de la API');
        }

        const result = await response.json();
        if (Array.isArray(result) && result.every(item => item.id && item.name && item.rut && item.email && item.address && item.commune && item.phone)) {
          const formattedData = result.map((item) => 
            createData(item.id, item.name, item.rut, item.email, item.address, item.commune, item.phone)
          );
          setRows(formattedData);
        } else {
          console.error('La respuesta no tiene la estructura esperada:', result);
        }
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
     
    };
  
    fetchClients();
  }, []);
  
  // Filtros y búsqueda
  const filteredItems = rows.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Determinar qué artículos mostrar según la página actual
  const displayedItems = filteredItems.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  

    // Manejar el cambio de estado de los checkboxes
  const handleCheckboxChange = (id) => {
    setSelectedItems(prevSelectedItems => 
      prevSelectedItems.includes(id)
        ? prevSelectedItems.filter(item => item !== id)
        : [...prevSelectedItems, id]
    );
  };

  const handleOpenCreateModal = () => {
    setOpenCreateModal(true);
  
  
  
  };

  const handleCloseCreateModal = () => {
    setOpenCreateModal(false);





  };









  const handleOpenEditModal = (client) => {
    setCurrentClient(client);
    setOpenEditModal(true);
  };

  //esta  const handleCloseEditModal = () => {
   /// setCurrentClient(null);
   // setOpenEditModal(false);
  //};

  //const handleCreateClient = () => {
    // Lógica para crear un cliente
    //handleCloseCreateModal();
 // };

  //const handleEditClient = () => {
    // Lógica para editar un cliente
    //handleCloseEditModal();
 // };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ padding: 3 ,overflowY: 'auto', maxHeight: 'calc(100vh - 64px)'  }}>
        <Typography variant="h4" gutterBottom align="center">Mantenedor de Clientes</Typography>

        {/* Búsqueda de artículos */}
        <TextField
          variant="outlined"
          label="Buscar Cliente"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ marginBottom: 2 }}
        />

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, marginBottom: 2 }}>
        <Button sx={{ display: 'flex', justifyContent: 'center', gap: 2, marginBottom: 2 }}
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleOpenCreateModal}
          size="medium"
        >
          Nuevo Cliente
        </Button>          
        <Button sx={{ display: 'flex', justifyContent: 'center', gap: 2, marginBottom: 2 }}
          variant="contained"
          color="error"
          startIcon={<Delete />}
          onClick={handleOpenCreateModal}
          size="medium"
        >
          Eliminar Cliente
        </Button>
        <Button sx={{ display: 'flex', justifyContent: 'center', gap: 2, marginBottom: 2 }}
          variant="contained"
          color="success"
          startIcon={<ToggleOffIcon />}
          onClick={handleOpenCreateModal}
          size="medium"
        >
          Activar/Deactivar
        </Button>
     </Box>     

      <TableContainer component={Paper}>
        <Table>
          <TableHead style={{ backgroundColor: '#f0f0f0'  }}>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedItems.length === filteredItems.length}
                  indeterminate={selectedItems.length > 0 && selectedItems.length < filteredItems.length}
                  onChange={() => {
                    if (selectedItems.length === filteredItems.length) {
                         setSelectedItems([]); // Deselect all
                    } else {
                         setSelectedItems(filteredItems.map(item => item.id)); // Select all
                    }
                  }}
              />
              </TableCell>
              <TableCell sx={{ width: '30%' }}>Razon Social</TableCell>
              <TableCell sx={{ width: '20%' }}>Rut</TableCell>
              <TableCell sx={{ width: '20%' }}>Direccion</TableCell>
              <TableCell sx={{ width: '20%' }}>Comuna</TableCell>
              <TableCell sx={{ width: '20%' }}>Email</TableCell>
              <TableCell sx={{ width: '20%' }}>Telefono</TableCell>
              <TableCell sx={{ width: '20%' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedItems.map((client) => (
            <TableRow key={client.id}>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedItems.includes(client.id)}
                  onChange={() => handleCheckboxChange(client.id)}
                />
              </TableCell>
              <TableCell>{client.name}</TableCell>
              <TableCell>{client.rut}</TableCell>
              <TableCell>{client.address}</TableCell>
              <TableCell>{client.commune}</TableCell>
              <TableCell>{client.email}</TableCell>
              <TableCell>{client.phone}</TableCell>
              <TableCell align="center">
                <Box sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      gap: 1, // Espacio entre los botones
                }}>
                    <Tooltip title="Editar">
                      <IconButton color="success" sx={{ width: 30, height: 30 }} onClick={() => handleOpenEditModal(client)}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Borrar">
                      <IconButton color="warning" sx={{ width: 30, height: 30 }} onClick={() => handleOpenEditModal(client.id)}>
                        <Delete />
                      </IconButton>
                    </Tooltip>
                </Box>    
              </TableCell>
            </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Paginación */}
      <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={Math.ceil(filteredItems.length / itemsPerPage)}
          page={page}
          onChange={handlePageChange}
          color="primary"
          sx={{ display: 'flex', justifyContent: 'center' }}
        />
      </Box>
      {/* Modal para crear cliente */}
      {/*<Dialog open={openCreateModal} onClose={handleCloseCreateModal} fullWidth maxWidth="sm">
        <DialogTitle>Nuevo Cliente</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre / Razon Social"
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Telefono"
            fullWidth
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreateModal} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleCreateClient} color="primary">
            Añadir
          </Button>
        </DialogActions>
      </Dialog>*/}

      {/* Modal para editar cliente */}
      {/*<Dialog open={openEditModal} onClose={handleCloseEditModal} fullWidth maxWidth="sm">
        <DialogTitle>Editar Cliente</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre / Razon Social"
            fullWidth
            variant="outlined"
            defaultValue={currentClient?.name}
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            variant="outlined"
            defaultValue={currentClient?.email}
          />
          <TextField
            margin="dense"
            label="Telefono"
            fullWidth
            variant="outlined"
            defaultValue={currentClient?.phone}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditModal} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleEditClient} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>*/}







      <CreateClient 
  open={openCreateModal} 
  onClose={handleCloseCreateModal} 
/>        






      </Box>
    </ThemeProvider>
  );
};





export default Client;
 
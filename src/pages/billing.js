import React, { useState, useEffect } from 'react';
import { Box, Button, IconButton, TextField, Typography, Snackbar, Alert, Pagination, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tooltip, Checkbox, Grid,Card,CardContent } from '@mui/material';
import { Add } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AssessmentIcon from '@mui/icons-material/Assessment';
import {  Visibility as VisibilityIcon } from '@mui/icons-material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CreateBillingModal from './modal/modalBilling/CreateBilling';
import EditBillingModal from './modal/modalBilling/SeeBilling';
import CreditNoteModal from './modal/modalBilling/CreditNote';


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
/***********************************************************************************/
const Billing = () => {
  const [items, setItems] = useState([]);
  const setOpenModal = useState()[1];
  const [currentItem, setCurrentItem] = useState(null);
  const [notification, setNotification] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openCreditNoteModal, setopenCreditNoteModal] = useState(false);
  const [totalSum, setTotalSum] = useState(0);
  const itemsPerPage = 5;
  /***********************************************************************************/
  const handleOpenCreateModal = () => setOpenCreateModal(true);
  /***********************************************************************************/
  const handleOpenEditModal = async (item) => {
    setCurrentItem(item);
    setOpenEditModal(true);
    try {
      const routeMenu = process.env.REACT_APP_API_URL_D;
      const response = await fetch(`${routeMenu}/api/data/billId/${item.id}`);
      const result = await response.json();
      setCurrentItem(prevState => ({
        ...prevState,
        ...result, // Debería incluir 'giro'
      }));
    } catch (error) {
      console.error('Error al obtener los datos de la factura:', error);
    }
  };
  /***********************************************************************************/
  const handleOpenCreditnoteModal = async (item) => {
    setCurrentItem(item);
    setopenCreditNoteModal(true);
    console.log(item);
    //console.log(item.id);
    try {
      const routeMenu = process.env.REACT_APP_API_URL_D;
      const response = await fetch(`${routeMenu}/api/data/billId/${item.id}`);
      const result = await response.json();
      setCurrentItem(prevState => ({
        ...prevState,
        ...result, // Debería incluir 'giro'
      }));
    } catch (error) {
      console.error('Error al obtener los datos de la factura:', error);
    }
  };
  /***********************************************************************************/
  const handleCloseModal = () => {
    setOpenCreateModal(false);
    setOpenEditModal(false);
    setopenCreditNoteModal(false);
    setCurrentItem(null);
  };
  /***********************************************************************************/
  const handleOpenModal = (item = null) => {
    setCurrentItem(item);
    setOpenModal(true);
  };
  /***********************************************************************************/
  const handleSaveItem = () => {
    if (currentItem) {
      setItems(items.map(item => (item.id === currentItem.id ? currentItem : item)));
      setNotification({ type: 'success', message: 'Artículo actualizado' });
    } else {
      const newItem = { ...currentItem, id: items.length + 1 };
      setItems([...items, newItem]);
      setNotification({ type: 'success', message: 'Artículo agregado' });
    }
    handleCloseModal();
  };
  /***********************************************************************************/
  const handleDeleteSelected = () => {
    setItems(items.filter(item => !selectedItems.includes(item.id)));
    setNotification({ type: 'error', message: 'Artículos seleccionados eliminados' });
    setSelectedItems([]); 
  };
  /***********************************************************************************/
  const handlePageChange = (event, value) => {
    setPage(value);
  };
  /***********************************************************************************/
  const handleCheckboxChange = (id) => {
    setSelectedItems(prevSelectedItems => 
      prevSelectedItems.includes(id)
        ? prevSelectedItems.filter(item => item !== id)
        : [...prevSelectedItems, id]
    );
  };
  /***********************************************************************************/
  function createData(id, name, documento,tipo, neto, iva, total) {
    return { id, name, documento, tipo,neto, iva, total };
  }
  /***********************************************************************************/
  const formatCurrency = (value) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value);
  /***********************************************************************************/  
  const [rows, setRows] = useState([]);
  /***********************************************************************************/ 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const routeMenu = process.env.REACT_APP_API_URL_D;
        const response = await fetch(routeMenu+'/api/data/billing');
        if (!response.ok) {
          throw new Error('Error en la respuesta de la API');
        }
        const result = await response.json();
        if (Array.isArray(result) && result.every(item => item.id && item.name && item.documento && item.tipo && item.neto && item.iva && item.total)) {
          const formattedData = result.map((item) => 
            createData(item.id, item.name, item.documento, item.tipo, formatCurrency(item.neto), formatCurrency(item.iva), formatCurrency(item.total))
          );
          setRows(formattedData);
          // Sumar todos los valores totales
          const totalSum = result.reduce((acc, item) => {
            let totalValue = item.total;
            // Si es un número, lo usamos directamente
            if (typeof totalValue === 'number') {
              return acc + totalValue;
            }
            // Si es una cadena, limpiamos el formato y lo convertimos a número
            else if (typeof totalValue === 'string') {
              totalValue = parseFloat(totalValue.replace(/[^0-9.-]+/g, ""));
              return acc + (isNaN(totalValue) ? 0 : totalValue);
            }
            // Si no es ni un número ni una cadena válida, lo ignoramos
            else {
              return acc; // No sumamos nada si el valor no es válido
            }
          }, 0);
          setTotalSum(totalSum);
        } else {
          console.error('La respuesta no tiene la estructura esperada:', result);
        }
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    fetchData();
  }, []);
  /***********************************************************************************/
  const filteredItems = rows.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  /***********************************************************************************/
  const displayedItems = filteredItems.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  /***********************************************************************************/
  return (
    <ThemeProvider theme={theme}>
     
       
     
      <Box sx={{ padding: 3 ,overflowY: 'auto', maxHeight: 'calc(100vh - 64px)'  }}>
        <Typography variant="h4" gutterBottom align="center">Generacion de Facturas</Typography>

        {/* Búsqueda de artículos */} 
        <TextField
          variant="outlined"
          label="Buscar factura"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ marginBottom: 2 }}
        />

        {/* Botón para agregar un nueva factura */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, marginBottom: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => handleOpenCreateModal()}
            size="medium"
          >
            NUEVA
          </Button>
          <Button
            variant="contained"
            color="warning"
            startIcon={<AssessmentIcon />}
            onClick={() => handleOpenModal()}
            size="medium"
          >
            REPORTE
          </Button>
          {/* Botón para eliminar los artículos seleccionados */}
          <Button
            variant="contained"
            color="info"
            onClick={handleDeleteSelected}
            size="medium"
            disabled={selectedItems.length === 0}
          >
            HISTORIAL FACTURA
          </Button>
        </Box>
        {/* Nueva sección de tarjetas */}
        <Grid container spacing={2} sx={{ marginBottom: 2 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6">Resumen de Facturación</Typography>
                <Typography variant="body2" color="textSecondary">
                  Total Facturado: {formatCurrency(totalSum)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6">Facturas Pendientes</Typography>
                <Typography variant="body2" color="textSecondary">
                  {filteredItems.length} Facturas
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tabla de artículos con scroll y tamaño fijo */}
        <TableContainer component={Paper} sx={{ maxHeight: 400, overflowY: 'auto', marginBottom: 2 }}>
          <Table>
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
                <TableCell sx={{ width: '20%' }}>Documento</TableCell>
                <TableCell sx={{ width: '20%' }}>Tipo</TableCell>
                <TableCell sx={{ width: '10%' }}>Neto/Exento</TableCell>
                <TableCell sx={{ width: '10%' }}>Iva</TableCell>
                <TableCell sx={{ width: '20%' }}>Total</TableCell>
                <TableCell sx={{ width: '20%' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedItems.map(item => (
                <TableRow key={item.id}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleCheckboxChange(item.id)}
                    />
                  </TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.documento}</TableCell>
                  <TableCell>{item.tipo}</TableCell>
                  <TableCell>{item.neto}</TableCell>
                  <TableCell>{item.iva}</TableCell>
                  <TableCell>{item.total}</TableCell>
                  <TableCell align="center">
                    <Box sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      gap: 1, // Espacio entre los botones
                    }}>
                      <Tooltip title="Ver">
                        <IconButton color="success" sx={{ width: 30, height: 30 }} onClick={() => handleOpenEditModal(item)}>
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Nota de Credito">
                        <IconButton color="warning" sx={{ width: 30, height: 30 }} onClick={() => handleOpenCreditnoteModal(item)}>
                          <InsertDriveFileIcon />
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
        <Pagination
          count={Math.ceil(filteredItems.length / itemsPerPage)}
          page={page}
          onChange={handlePageChange}
          color="primary"
          sx={{ display: 'flex', justifyContent: 'center' }}
        />

        {/* Snackbar para notificaciones */}
        <Snackbar open={notification !== null} autoHideDuration={3000} onClose={() => setNotification(null)}>
          <Alert severity={notification?.type} onClose={() => setNotification(null)}>
            {notification?.message}
          </Alert>
        </Snackbar>

        {/* Modal para agregar o editar */}
        <CreateBillingModal
        open={openCreateModal}
        onClose={handleCloseModal}
        onSave={handleSaveItem}
      />

      <EditBillingModal
        open={openEditModal}
        onClose={handleCloseModal}
        currentItem={currentItem}
        onSave={handleSaveItem}
      />

<CreditNoteModal
        open={openCreditNoteModal}
        onClose={handleCloseModal}
        currentItem={currentItem}
        onSave={handleSaveItem}
      />


      </Box>
    </ThemeProvider>
  );
};

export default Billing;
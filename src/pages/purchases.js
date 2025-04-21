import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Snackbar, 
  Alert, 
  Pagination, 
  Grid, 
  Card, 
  CardContent,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { 
  Add, 
  Assessment, 
  Settings, 
  FilterAlt, 
  SaveAlt, 
  ExpandMore 
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import PurchasesTable from '../components/purchases/purchasesTable';
import PurchaseModal from '../components/purchases/purchaseModal';

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

const Purchases = () => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [notification, setNotification] = useState(null);
  const [totalSum, setTotalSum] = useState(0);
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [purchases, setPurchases] = useState([]);
  const [currentPurchase, setCurrentPurchase] = useState(null);
  const [filters, setFilters] = useState({
    provider: '',
    documentType: '',
    status: ''
  });
  
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchPurchases = async () => {
      setIsLoading(true);
      try {
        // Simulación de llamada a API
        const mockData = [
          { id: 1, provider: 'Proveedor A', date: '2023-05-15',neto:10000, iva:19600, amount: 250000, documentType: 'Factura', status: 'Pagado' },
          { id: 2, provider: 'Proveedor B', date: '2023-05-18',neto:10000, iva:19600, amount: 180000, documentType: 'Boleta', status: 'Pendiente' },
          // ... más datos de ejemplo
        ];
        
        setPurchases(mockData);
        calculateTotals(mockData);
      } catch (error) {
        setNotification({ type: 'error', message: 'Error al cargar las compras' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPurchases();
  }, []);

  const calculateTotals = (data) => {
    const sum = data.reduce((acc, purchase) => acc + purchase.amount, 0);
    setTotalSum(sum);
    
    // Calcular total mensual (ejemplo)
    const currentMonth = new Date().getMonth();
    const monthlySum = data
      .filter(p => new Date(p.date).getMonth() === currentMonth)
      .reduce((acc, purchase) => acc + purchase.amount, 0);
    setMonthlyTotal(monthlySum);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleFilter = () => {
    // Lógica de filtrado aquí
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setNotification({ type: 'success', message: 'Filtros aplicados correctamente' });
    }, 500);
  };

  const handleEditPurchase = (purchase) => {
    setCurrentPurchase(purchase);
    setOpen(true);
  };

  const handleDeletePurchase = (id) => {
    // Lógica para eliminar compra
    setNotification({ type: 'success', message: 'Compra eliminada correctamente' });
  };

  const handleSavePurchase = (purchase) => {
    // Lógica para guardar/actualizar compra
    setNotification({ type: 'success', message: 'Compra guardada correctamente' });
    setOpen(false);
    setCurrentPurchase(null);
  };

  const handleExport = () => {
    // Lógica para exportar a Excel
    setNotification({ type: 'success', message: 'Datos exportados exitosamente' });
  };

  const formatCurrency = (value) => new Intl.NumberFormat('es-CL', { 
    style: 'currency', 
    currency: 'CLP' 
  }).format(value);

  // Filtrar compras basado en búsqueda y filtros
  const filteredPurchases = purchases.filter(purchase => {
    const matchesSearch = purchase.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         purchase.documentType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilters = (
      (!filters.provider || purchase.provider === filters.provider) &&
      (!filters.documentType || purchase.documentType === filters.documentType) &&
      (!filters.status || purchase.status === filters.status)
    );
    
    return matchesSearch && matchesFilters;
  });

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ padding: 3, overflowY: 'auto', maxHeight: 'calc(100vh - 64px)' }}>
        <Typography variant="h4" gutterBottom align="center">Gestión de Compras</Typography>

        {/* Búsqueda y Filtros */}
        <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
          <TextField
            variant="outlined"
            label="Buscar compras"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <TextField
            label="Desde"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
          />
          <TextField
            label="Hasta"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
          />
          <Button
            variant="outlined"
            startIcon={<FilterAlt />}
            onClick={handleFilter}
          >
            Filtrar
          </Button>
        </Box>

        {/* Filtros avanzados */}
        <Accordion sx={{ mb: 2 }}>
          <AccordionSummary>
            <ExpandMore/><Typography>Filtros avanzados</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  select
                  label="Proveedor"
                  value={filters.provider}
                  onChange={(e) => setFilters({...filters, provider: e.target.value})}
                  fullWidth
                >
                  <option value="">Todos</option>
                  <option value="Proveedor A">Proveedor A</option>
                  <option value="Proveedor B">Proveedor B</option>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  select
                  label="Tipo Documento"
                  value={filters.documentType}
                  onChange={(e) => setFilters({...filters, documentType: e.target.value})}
                  fullWidth
                >
                  <option value="">Todos</option>
                  <option value="Factura">Factura</option>
                  <option value="Boleta">Boleta</option>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  select
                  label="Estado"
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                  fullWidth
                >
                  <option value="">Todos</option>
                  <option value="Pagado">Pagado</option>
                  <option value="Pendiente">Pendiente</option>
                </TextField>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Botones de acción */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, marginBottom: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => setOpen(true)}
            size="medium"
          >
            Ingresar Documento
          </Button>
          <Button
            variant="contained"
            color="warning"
            startIcon={<Assessment />}
            onClick={() => {}}
            size="medium"
          >
            REPORTE
          </Button>
          <Button
            variant="contained"
            color="info"
            startIcon={<Settings />}
            size="medium"
          >
            Importar desde SII
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<SaveAlt />}
            onClick={handleExport}
            size="medium"
          >
            Exportar Excel
          </Button>
        </Box>

        {/* Sección de tarjetas */}
        <Grid container spacing={2} sx={{ marginBottom: 2 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6">Resumen de Compras</Typography>
                <Typography variant="body2" color="textSecondary">
                  Total Gastado: {formatCurrency(totalSum)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6">Documentos Pendientes</Typography>
                <Typography variant="body2" color="textSecondary">
                  {purchases.filter(p => p.status === 'Pendiente').length} Documentos
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6">IVA Reclamable</Typography>
                <Typography variant="body2" color="textSecondary">
                  {formatCurrency(totalSum * 0.19)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6">Compras este mes</Typography>
                <Typography variant="body2" color="textSecondary">
                  {formatCurrency(monthlyTotal)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Feedback de carga */}
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Mensaje cuando no hay datos */}
        {!isLoading && filteredPurchases.length === 0 && (
          <Typography variant="body1" align="center" sx={{ my: 4 }}>
            No se encontraron compras con los filtros aplicados
          </Typography>
        )}

        {/* Tabla de compras */}
        {!isLoading && filteredPurchases.length > 0 && (
          <>
            <PurchasesTable 
              purchases={filteredPurchases.slice((page - 1) * itemsPerPage, page * itemsPerPage)}
              onEdit={handleEditPurchase}
              onDelete={handleDeletePurchase}
            />

            {/* Paginación */}
            <Pagination
              count={Math.ceil(filteredPurchases.length / itemsPerPage)}
              page={page}
              onChange={handlePageChange}
              color="primary"
              sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}
            />
          </>
        )}

        {/* Snackbar para notificaciones */}
        <Snackbar 
          open={notification !== null} 
          autoHideDuration={3000} 
          onClose={() => setNotification(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert severity={notification?.type} onClose={() => setNotification(null)}>
            {notification?.message}
          </Alert>
        </Snackbar>

        {/* Modal */}
        <PurchaseModal 
          open={open} 
          handleClose={() => {
            setOpen(false);
            setCurrentPurchase(null);
          }}
          purchase={currentPurchase}
          onSave={handleSavePurchase}
        />
      </Box>
    </ThemeProvider>
  );
};

export default Purchases;
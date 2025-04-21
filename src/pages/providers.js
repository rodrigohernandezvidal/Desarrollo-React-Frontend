import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Snackbar, 
  Alert, 
  Pagination, 
  CircularProgress
} from '@mui/material';
import { 
  Add,
  Search,
  FilterAlt
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ProvidersTable from '../components/providers/providerTable';
import ProviderModal from '../components/providers/providerModal';

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

const Providers = () => {
  const [openModal, setOpenModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [providers, setProviders] = useState([]);
  const [currentProvider, setCurrentProvider] = useState(null);
  
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchProviders = async () => {
      setIsLoading(true);
      try {
        // Simulación de llamada a API
        const mockData = [
          { id: 1, businessName: 'Proveedor A', rut: '12345678-9', address: 'Av. Principal 123', email: 'contacto@proveedora.cl', phone: '+56912345678', website: 'www.proveedora.cl', active: true },
          { id: 2, businessName: 'Proveedor B', rut: '9876543-2', address: 'Calle Secundaria 456', email: 'contacto@proveedorb.cl', phone: '+56987654321', website: 'www.proveedorb.cl', active: false },
          // ... más datos de ejemplo
        ];
        
        setProviders(mockData);
      } catch (error) {
        setNotification({ type: 'error', message: 'Error al cargar los proveedores' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProviders();
  }, []);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleViewProvider = (provider) => {
    setCurrentProvider(provider);
    setOpenModal(true);
  };

  const handleEditProvider = (provider) => {
    setCurrentProvider(provider);
    setOpenModal(true);
  };

  const handleToggleStatus = (provider) => {
    setProviders(prev => prev.map(p => 
      p.id === provider.id ? { ...p, active: !p.active } : p
    ));
    setNotification({ 
      type: 'success', 
      message: `Proveedor ${!provider.active ? 'activado' : 'desactivado'} correctamente` 
    });
  };

  const handleSaveProvider = (providerData) => {
    if (currentProvider) {
      // Editar proveedor existente
      setProviders(prev => prev.map(p => 
        p.id === currentProvider.id ? { ...p, ...providerData } : p
      ));
      setNotification({ type: 'success', message: 'Proveedor actualizado correctamente' });
    } else {
      // Agregar nuevo proveedor
      const newProvider = {
        ...providerData,
        id: providers.length + 1,
        active: true
      };
      setProviders(prev => [...prev, newProvider]);
      setNotification({ type: 'success', message: 'Proveedor creado correctamente' });
    }
    setOpenModal(false);
    setCurrentProvider(null);
  };

  const filteredProviders = providers.filter(provider => 
    provider.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.rut.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ padding: 3, overflowY: 'auto', maxHeight: 'calc(100vh - 64px)' }}>
        <Typography variant="h4" gutterBottom align="center">Gestión de Proveedores</Typography>

        {/* Búsqueda y Filtros */}
        <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
          <TextField
            variant="outlined"
            label="Buscar proveedores"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1 }} />
            }}
          />
          <Button
            variant="outlined"
            startIcon={<FilterAlt />}
          >
            Filtros
          </Button>
        </Box>

        {/* Botón Nuevo Proveedor */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => {
              setCurrentProvider(null);
              setOpenModal(true);
            }}
          >
            Nuevo Proveedor
          </Button>
        </Box>

        {/* Feedback de carga */}
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Mensaje cuando no hay datos */}
        {!isLoading && filteredProviders.length === 0 && (
          <Typography variant="body1" align="center" sx={{ my: 4 }}>
            No se encontraron proveedores
          </Typography>
        )}

        {/* Tabla de proveedores */}
        {!isLoading && filteredProviders.length > 0 && (
          <>
            <ProvidersTable 
              providers={filteredProviders.slice((page - 1) * itemsPerPage, page * itemsPerPage)}
              onView={handleViewProvider}
              onEdit={handleEditProvider}
              onToggleStatus={handleToggleStatus}
            />

            {/* Paginación */}
            <Pagination
              count={Math.ceil(filteredProviders.length / itemsPerPage)}
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

        {/* Modal para nuevo/editar proveedor */}
        <ProviderModal 
          open={openModal}
          handleClose={() => {
            setOpenModal(false);
            setCurrentProvider(null);
          }}
          provider={currentProvider}
          onSave={handleSaveProvider}
        />
      </Box>
    </ThemeProvider>
  );
};

export default Providers;
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Snackbar, 
  Alert, 
  Pagination, 
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { 
  Add, 
  Assessment,  
  FilterAlt, 
  SaveAlt, 
  ExpandMore 
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TablaPlanCuentas from '../components/accountPlan/accountPlanTable';
import ModalPlanCuenta from '../components/accountPlan/accountPlanModal';
import { planCuentasData } from '../data/planCuentasData';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

const PlanCuentasPage = () => {
  const [cuentas, setCuentas] = useState([]);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentCuenta, setCurrentCuenta] = useState(null);
  const [filters, setFilters] = useState({
    habilitada: '',
    nivel: ''
  });
  
  const itemsPerPage = 10;

  useEffect(() => {
    // Simulación de carga desde API
    const loadData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simula delay de red
        setCuentas(planCuentasData.cuentas);
      } catch (error) {
        setNotification({ type: 'error', message: 'Error al cargar las cuentas' });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleFilter = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setNotification({ type: 'success', message: 'Filtros aplicados' });
    }, 300);
  };

  const handleSave = (cuenta) => {
    setIsLoading(true);
    setTimeout(() => {
      if (cuenta.id) {
        // Actualizar
        setCuentas(cuentas.map(c => c.id === cuenta.id ? cuenta : c));
        setNotification({ type: 'success', message: 'Cuenta actualizada' });
      } else {
        // Crear nueva
        const newId = Math.max(...cuentas.map(c => c.id)) + 1;
        const newCuenta = {
          ...cuenta,
          id: newId,
          creado: new Date().toISOString().split('T')[0],
          actualizado: new Date().toISOString().split('T')[0]
        };
        setCuentas([...cuentas, newCuenta]);
        setNotification({ type: 'success', message: 'Cuenta creada' });
      }
      setIsLoading(false);
      setOpen(false);
    }, 500);
  };

  const toggleHabilitada = (id) => {
    setCuentas(cuentas.map(c => 
      c.id === id ? { 
        ...c, 
        habilitada: !c.habilitada,
        actualizado: new Date().toISOString().split('T')[0]
      } : c
    ));
  };

  const handleExportExcel = () => {
    setNotification({ type: 'info', message: 'Exportando a Excel...' });
    try {
        // Preparar los datos filtrados para exportar
        const dataToExport = filteredCuentas.map(cuenta => ({
          'Código': cuenta.codigo,
          'Descripción': cuenta.descripcion,
          'Estado': cuenta.habilitada ? 'Habilitada' : 'Deshabilitada',
          'Creado': cuenta.creado,
          'Actualizado': cuenta.actualizado
        }));
    
        // Crear libro de Excel
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(dataToExport);
        
        // Ajustar el ancho de las columnas
        const wscols = [
          {wch: 15}, // Código
          {wch: 50}, // Descripción
          {wch: 15}, // Estado
          {wch: 12}, // Creado
          {wch: 12}  // Actualizado
        ];
        ws['!cols'] = wscols;
        
        XLSX.utils.book_append_sheet(wb, ws, 'Plan de Cuentas');
        
        // Generar archivo y descargar
        const fileName = `Plan_de_Cuentas_${new Date().toISOString().slice(0, 10)}.xlsx`;
        XLSX.writeFile(wb, fileName);
        
        setNotification({ type: 'success', message: 'Archivo Excel generado correctamente' });
      } catch (error) {
        console.error('Error al exportar a Excel:', error);
        setNotification({ type: 'error', message: 'Error al generar Excel' });
      }
  };

  const handleExportPDF = () => {
    setNotification({ type: 'info', message: 'Generando PDF...' });
    try {
        // Crear documento PDF
        const doc = new jsPDF({
          orientation: 'landscape',
          unit: 'mm'
        });
        
        // Título del documento
        doc.setFontSize(16);
        doc.text('Plan de Cuentas Contables', 14, 10);
        
        // Fecha y filtros aplicados
        doc.setFontSize(10);
        doc.text(`Generado el: ${new Date().toLocaleString()}`, 14, 16);
        
        if (searchTerm) {
          doc.text(`Filtro de búsqueda: "${searchTerm}"`, 14, 20);
        }
        
        if (filters.habilitada) {
          doc.text(`Estado: ${filters.habilitada === 'true' ? 'Habilitadas' : 'Deshabilitadas'}`, 14, 24);
        }
        
        if (filters.nivel) {
          doc.text(`Nivel: ${filters.nivel}`, 14, 28);
        }
        
        // Preparar datos para la tabla
        const data = filteredCuentas.map(cuenta => [
          cuenta.codigo,
          cuenta.descripcion,
          cuenta.habilitada ? 'Habilitada' : 'Deshabilitada',
          cuenta.creado,
          cuenta.actualizado
        ]);
        
        // Usar autoTable como función independiente
        autoTable(doc, {
          startY: 32,
          head: [['Código', 'Descripción', 'Estado', 'Creado', 'Actualizado']],
          body: data,
          styles: {
            fontSize: 8,
            cellPadding: 2,
            overflow: 'linebreak'
          },
          columnStyles: {
            0: { cellWidth: 25 },
            1: { cellWidth: 100 },
            2: { cellWidth: 20 },
            3: { cellWidth: 20 },
            4: { cellWidth: 20 }
          },
          margin: { left: 14 }
        });
        
        // Guardar el PDF
        const fileName = `Plan_de_Cuentas_${new Date().toISOString().slice(0, 10)}.pdf`;
        doc.save(fileName);
        
        setNotification({ type: 'success', message: 'Archivo PDF generado correctamente' });
      } catch (error) {
        console.error('Error al exportar a PDF:', error);
        setNotification({ type: 'error', message: 'Error al generar PDF' });
      }
  };

  const filteredCuentas = cuentas.filter(cuenta => {
    const matchesSearch = cuenta.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cuenta.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilters = (
      (filters.habilitada === '' || cuenta.habilitada === (filters.habilitada === 'true')) &&
      (filters.nivel === '' || cuenta.codigo.split('.').length === parseInt(filters.nivel) + 1
    ));
    
    return matchesSearch && matchesFilters;
  });

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ padding: 3, maxHeight: 'calc(100vh - 64px)', overflowY: 'auto' }}>
        <Typography variant="h4" gutterBottom align="center">
          Plan de Cuentas Contables
        </Typography>

        {isLoading ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '300px'
          }}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ ml: 2 }}>Cargando cuentas...</Typography>
          </Box>
        ) : (
          <>
            {/* Búsqueda y Filtros */}
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                variant="outlined"
                label="Buscar cuentas"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
                <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography>Filtros avanzados</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                            select
                            label="Estado"
                            value={filters.habilitada}
                            onChange={(e) => setFilters({...filters, habilitada: e.target.value})}
                            fullWidth
                            InputLabelProps={{
                                style: {
                                backgroundColor: 'white', // Fondo blanco para el label
                                padding: '0 5px' // Espacio alrededor del texto
                                }
                            }}
                            SelectProps={{
                                native: true
                            }}
                            >
                            <option value="*">Todos</option>
                            <option value="true">Habilitadas</option>
                            <option value="false">Deshabilitadas</option>
                        </TextField>
                    <TextField 
                        select
                        label="Nivel"
                        value={filters.nivel}
                        onChange={(e) => setFilters({...filters, nivel: e.target.value})}
                        fullWidth
                        SelectProps={{
                        native: true
                        }}
                    >
                        <option value="*">Todos</option>
                        <option value="1">Nivel 1</option>
                        <option value="2">Nivel 2</option>
                        <option value="3">Nivel 3</option>
                        <option value="4">Nivel 4</option>
                        <option value="5">Nivel 5</option>
                    </TextField>
                    </Box>
                </AccordionDetails>
            </Accordion>

            {/* Botones de acción */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => {
                  setCurrentCuenta(null);
                  setOpen(true);
                }}
              >
                Nueva Cuenta
              </Button>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<Assessment />}
                onClick={handleExportPDF}
              >
                Exportar PDF
              </Button>
              <Button
                variant="contained"
                color="success"
                startIcon={<SaveAlt />}
                onClick={handleExportExcel}
              >
                Exportar Excel
              </Button>
            </Box>

            {/* Tabla de cuentas */}
            {filteredCuentas.length > 0 ? (
              <>
                <TablaPlanCuentas 
                  cuentas={filteredCuentas.slice(
                    (page - 1) * itemsPerPage, 
                    page * itemsPerPage
                  )}
                  onEdit={(cuenta) => {
                    setCurrentCuenta(cuenta);
                    setOpen(true);
                  }}
                  onToggleHabilitada={toggleHabilitada}
                />
                <Pagination
                  count={Math.ceil(filteredCuentas.length / itemsPerPage)}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}
                />
              </>
            ) : (
              <Typography variant="body1" align="center" sx={{ my: 4 }}>
                No se encontraron cuentas con los filtros aplicados
              </Typography>
            )}
          </>
        )}

        {/* Modal */}
        <ModalPlanCuenta
          open={open}
          handleClose={() => {
            setOpen(false);
            setCurrentCuenta(null);
          }}
          initialData={currentCuenta}
          onSave={handleSave}
        />

        {/* Notificaciones */}
        <Snackbar
          open={notification !== null}
          autoHideDuration={6000}
          onClose={() => setNotification(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert 
            severity={notification?.type} 
            onClose={() => setNotification(null)}
            sx={{ width: '100%' }}
          >
            {notification?.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default PlanCuentasPage;
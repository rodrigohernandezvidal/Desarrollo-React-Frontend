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
  AccordionDetails,
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from '@mui/material';
import { 
  Add, 
  Assessment,  
  FilterAlt, 
  SaveAlt, 
  ExpandMore 
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TablaCentroCostos from '../components/costCenter/costCenterTable';
import ModalCentroCosto from '../components/costCenter/costCenterModal';
import { centroCostosData } from '../data/centroCostosData';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Mismo tema de accountPlanPage.js
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

const CentroCostosPage = () => {
  const [centros, setCentros] = useState([]);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentCentro, setCurrentCentro] = useState(null);
  const [filters, setFilters] = useState({
    departamento: '',
    activo: ''
  });
  
  const itemsPerPage = 5;

  // Cargar datos simulados
  useEffect(() => {
    const loadData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simular delay de API
        setCentros(centroCostosData.centros);
      } catch (error) {
        setNotification({ type: 'error', message: 'Error al cargar centros de costos' });
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Funciones de filtrado (similar a accountPlanPage.js)
  const filteredCentros = centros.filter(centro => {
    const matchesSearch = centro.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         centro.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilters = (
      (filters.departamento === '' || centro.departamento === filters.departamento) &&
      (filters.activo === '' || centro.activo === (filters.activo === 'true'))
    );
    
    return matchesSearch && matchesFilters;
  });

  const handleExportPDF = () => {
    setNotification({ type: 'info', message: 'Generando PDF...' });
    try {
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm'
      });
      
      // Título
      doc.setFontSize(16);
      doc.text('Reporte de Centros de Costo', 105, 10, { align: 'center' });
      
      // Filtros aplicados
      doc.setFontSize(10);
      doc.text(`Generado el: ${new Date().toLocaleString()}`, 14, 20);
      if (searchTerm) doc.text(`Búsqueda: "${searchTerm}"`, 14, 25);
      if (filters.departamento) doc.text(`Departamento: ${filters.departamento}`, 14, 30);
      if (filters.activo) doc.text(`Estado: ${filters.activo === 'true' ? 'Activos' : 'Inactivos'}`, 14, 35);
      
      // Datos de la tabla
      const data = filteredCentros.map(centro => [
        centro.codigo,
        centro.nombre,
        centro.departamento,
        `$${centro.presupuesto.toLocaleString('es-CL')}`,
        centro.activo ? 'Activo' : 'Inactivo',
        centro.responsable
      ]);
      
      // Tabla con autoTable
      autoTable(doc, {
        startY: 40,
        head: [['Código', 'Nombre', 'Departamento', 'Presupuesto', 'Estado', 'Responsable']],
        body: data,
        styles: {
          fontSize: 8,
          cellPadding: 2,
          overflow: 'linebreak'
        },
        columnStyles: {
          0: { cellWidth: 20 },
          1: { cellWidth: 40 },
          2: { cellWidth: 30 },
          3: { cellWidth: 25 },
          4: { cellWidth: 20 },
          5: { cellWidth: 35 }
        }
      });
      
      doc.save(`centros_costo_${new Date().toISOString().slice(0, 10)}.pdf`);
      setNotification({ type: 'success', message: 'PDF exportado correctamente' });
    } catch (error) {
      console.error('Error al generar PDF:', error);
      setNotification({ type: 'error', message: 'Error al exportar PDF' });
    }
  };
  
  const handleExportExcel = () => {
    setNotification({ type: 'info', message: 'Generando Excel...' });
    try {
      const dataToExport = filteredCentros.map(centro => ({
        'Código': centro.codigo,
        'Nombre': centro.nombre,
        'Departamento': centro.departamento,
        'Responsable': centro.responsable,
        'Presupuesto': centro.presupuesto,
        'Gasto Actual': centro.gastoActual || 0,
        'Estado': centro.activo ? 'Activo' : 'Inactivo',
        'Creado': centro.creado,
        'Actualizado': centro.actualizado
      }));
      
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(dataToExport);
      
      // Ajustar anchos de columnas
      const wscols = [
        { wch: 15 }, // Código
        { wch: 30 }, // Nombre
        { wch: 20 }, // Departamento
        { wch: 20 }, // Responsable
        { wch: 15 }, // Presupuesto
        { wch: 15 }, // Gasto Actual
        { wch: 10 }, // Estado
        { wch: 12 }, // Creado
        { wch: 12 }  // Actualizado
      ];
      ws['!cols'] = wscols;
      
      XLSX.utils.book_append_sheet(wb, ws, 'Centros de Costo');
      XLSX.writeFile(wb, `centros_costo_${new Date().toISOString().slice(0, 10)}.xlsx`);
      
      setNotification({ type: 'success', message: 'Excel exportado correctamente' });
    } catch (error) {
      console.error('Error al exportar Excel:', error);
      setNotification({ type: 'error', message: 'Error al exportar Excel' });
    }
  };
  
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ padding: 3, maxHeight: 'calc(100vh - 64px)', overflowY: 'auto' }}>
        <Typography variant="h4" gutterBottom align="center">
          Centros de Costos
        </Typography>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
            <CircularProgress size={60} />
          </Box>
        ) : (
          <>
            {/* Barra de búsqueda y filtros */}
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                variant="outlined"
                label="Buscar centros"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button variant="outlined" startIcon={<FilterAlt />}>
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
                  <FormControl fullWidth>
                    <InputLabel>Departamento</InputLabel>
                    <Select
                      value={filters.departamento}
                      onChange={(e) => setFilters({...filters, departamento: e.target.value})}
                      label="Departamento"
                    >
                      <MenuItem value="">Todos</MenuItem>
                      <MenuItem value="Marketing">Marketing</MenuItem>
                      <MenuItem value="Ventas">Ventas</MenuItem>
                      <MenuItem value="Tecnología">Tecnología</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel>Estado</InputLabel>
                    <Select
                      value={filters.activo}
                      onChange={(e) => setFilters({...filters, activo: e.target.value})}
                      label="Estado"
                    >
                      <MenuItem value="">Todos</MenuItem>
                      <MenuItem value="true">Activo</MenuItem>
                      <MenuItem value="false">Inactivo</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </AccordionDetails>
            </Accordion>

            {/* Botones de acción */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => {
                    setCurrentCentro(null);
                    setOpen(true);
                    }}
                >
                    Nuevo Centro
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

            {/* Tabla de resultados */}
            {filteredCentros.length > 0 ? (
              <>
                <TablaCentroCostos 
                  centros={filteredCentros.slice((page - 1) * itemsPerPage, page * itemsPerPage)} 
                  onEdit={(centro) => {
                    setCurrentCentro(centro);
                    setOpen(true);
                  }}
                />
                <Pagination
                  count={Math.ceil(filteredCentros.length / itemsPerPage)}
                  page={page}
                  onChange={(e, value) => setPage(value)}
                  sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}
                />
              </>
            ) : (
              <Typography variant="body1" align="center" sx={{ my: 4 }}>
                No se encontraron centros de costos
              </Typography>
            )}
          </>
        )}

        {/* Modal (similar a accountPlanPage.js) */}
        <ModalCentroCosto
          open={open}
          handleClose={() => {
            setOpen(false);
            setCurrentCentro(null);
          }}
          initialData={currentCentro}
          onSave={(data) => {
            // Implementar lógica para guardar
            console.log('Guardar:', data);
            setNotification({ type: 'success', message: 'Centro de costos guardado' });
            setOpen(false);
          }}
        />

        {/* Notificaciones */}
        <Snackbar
          open={notification !== null}
          autoHideDuration={6000}
          onClose={() => setNotification(null)}
        >
          <Alert severity={notification?.type}>
            {notification?.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default CentroCostosPage;
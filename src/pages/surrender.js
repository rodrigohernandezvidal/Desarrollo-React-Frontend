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
  AccordionDetails,
  MenuItem
} from '@mui/material';
import { 
  Add, 
  Assessment,  
  FilterAlt, 
  SaveAlt, 
  ExpandMore
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TablaRendiciones from '../components/surrender/surrenderTable';
import ModalRendicion from '../components/surrender/surrenderModal';
import * as XLSX from 'xlsx';
// Importamos jsPDF y autoTable de manera correcta
import { jsPDF } from 'jspdf';
// Importamos el plugin autoTable directamente
import autoTable from 'jspdf-autotable';

// Configuración global para jsPDF
if (typeof window !== 'undefined') {
  window.jsPDF = window.jsPDF || { autoTable: () => {} };
}

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

const RendicionesPage = () => {
  const [rendiciones, setRendiciones] = useState([
    { id: 1, fecha: '2023-10-01', monto: 1500, categoria: 'Viaje', estado: 'aprobada', comprobantes: [] },
    { id: 2, fecha: '2023-10-05', monto: 750, categoria: 'Oficina', estado: 'pendiente', comprobantes: [] },
  ]);

  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [notification, setNotification] = useState(null);
  const [totalSum, setTotalSum] = useState(0);
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentRendicion, setCurrentRendicion] = useState(null);
  const [filters, setFilters] = useState({
    categoria: '',
    estado: ''
  });
  
  const itemsPerPage = 5;

  useEffect(() => {
    calculateTotals(rendiciones);
  }, [rendiciones]);

  const calculateTotals = (data) => {
    const sum = data.reduce((acc, rendicion) => acc + rendicion.monto, 0);
    setTotalSum(sum);
    
    const currentMonth = new Date().getMonth();
    const monthlySum = data
      .filter(r => new Date(r.fecha).getMonth() === currentMonth)
      .reduce((acc, rendicion) => acc + rendicion.monto, 0);
    setMonthlyTotal(monthlySum);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleFilter = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setNotification({ type: 'success', message: 'Filtros aplicados correctamente' });
    }, 500);
  };

  const handleSave = (rendicion) => {
    if (rendicion.id) {
      setRendiciones(rendiciones.map(r => r.id === rendicion.id ? rendicion : r));
      setNotification({ type: 'success', message: 'Rendición actualizada correctamente' });
    } else {
      const newRendicion = {
        ...rendicion,
        id: rendiciones.length + 1,
        estado: 'pendiente'
      };
      setRendiciones([...rendiciones, newRendicion]);
      setNotification({ type: 'success', message: 'Rendición creada correctamente' });
    }
    setOpen(false);
    setCurrentRendicion(null);
  };

  const formatCurrency = (value) => new Intl.NumberFormat('es-CL', { 
    style: 'currency', 
    currency: 'CLP' 
  }).format(value);

  const filteredRendiciones = rendiciones.filter(rendicion => {
    const matchesSearch = rendicion.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rendicion.estado.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilters = (
      (!filters.categoria || rendicion.categoria === filters.categoria) &&
      (!filters.estado || rendicion.estado === filters.estado)
    );
    
    return matchesSearch && matchesFilters;
  });

  const generatePDFReport = () => {
    try {
      const doc = new jsPDF();
      
      // Título del reporte
      doc.setFontSize(18);
      doc.text('Reporte de Rendiciones', 105, 15, { align: 'center' });
      
      // Fecha de generación
      doc.setFontSize(10);
      doc.text(`Generado el: ${new Date().toLocaleDateString()}`, 105, 22, { align: 'center' });
      
      // Filtros aplicados
      doc.setFontSize(12);
      doc.text('Filtros aplicados:', 14, 30);
      doc.text(`Categoría: ${filters.categoria || 'Todas'}`, 14, 37);
      doc.text(`Estado: ${filters.estado || 'Todos'}`, 14, 44);
      doc.text(`Fecha desde: ${startDate || 'No especificado'}`, 14, 51);
      doc.text(`Fecha hasta: ${endDate || 'No especificado'}`, 14, 58);
      
      // Datos de las rendiciones
      const tableData = filteredRendiciones.map(rendicion => [
        rendicion.id,
        rendicion.fecha,
        rendicion.categoria,
        formatCurrency(rendicion.monto),
        rendicion.estado
      ]);
      
      // Usamos autoTable directamente
      autoTable(doc, {
        head: [['ID', 'Fecha', 'Categoría', 'Monto', 'Estado']],
        body: tableData,
        startY: 65,
        styles: {
          fontSize: 10,
          cellPadding: 2,
          halign: 'center'
        },
        headStyles: {
          fillColor: [232, 186, 30],
          textColor: [0, 0, 0]
        }
      });
      
      // Totales
      const finalY = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(12);
      doc.text(`Total rendido: ${formatCurrency(filteredRendiciones.reduce((acc, r) => acc + r.monto, 0))}`, 14, finalY);
      
      // Guardar el PDF
      doc.save('reporte_rendiciones.pdf');
      setNotification({ type: 'success', message: 'Reporte PDF generado correctamente' });
    } catch (error) {
      console.error('Error al generar PDF:', error);
      setNotification({ type: 'error', message: 'Error al generar el reporte PDF' });
    }
  };

  const exportToExcel = () => {
    try {
      const dataForExport = filteredRendiciones.map(rendicion => ({
        ID: rendicion.id,
        Fecha: rendicion.fecha,
        Categoría: rendicion.categoria,
        Monto: rendicion.monto,
        Estado: rendicion.estado
      }));
      
      const worksheet = XLSX.utils.json_to_sheet(dataForExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Rendiciones');
      
      const wscols = [
        { wch: 5 },
        { wch: 15 },
        { wch: 20 },
        { wch: 15 },
        { wch: 15 }
      ];
      worksheet['!cols'] = wscols;
      
      XLSX.writeFile(workbook, 'rendiciones.xlsx');
      setNotification({ type: 'success', message: 'Datos exportados a Excel correctamente' });
    } catch (error) {
      console.error('Error al exportar a Excel:', error);
      setNotification({ type: 'error', message: 'Error al exportar a Excel' });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ padding: 3, overflowY: 'auto', maxHeight: 'calc(100vh - 64px)' }}>
        <Typography variant="h4" gutterBottom align="center">Gestión de Rendiciones</Typography>

        <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
          <TextField
            variant="outlined"
            label="Buscar rendiciones"
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

        <Accordion sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography>Filtros avanzados</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Categoría"
                  value={filters.categoria}
                  onChange={(e) => setFilters({...filters, categoria: e.target.value})}
                  fullWidth
                >
                  <MenuItem value="">Todas</MenuItem>
                  <MenuItem value="Viaje">Viaje</MenuItem>
                  <MenuItem value="Oficina">Oficina</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Estado"
                  value={filters.estado}
                  onChange={(e) => setFilters({...filters, estado: e.target.value})}
                  fullWidth
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="aprobada">Aprobada</MenuItem>
                  <MenuItem value="pendiente">Pendiente</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, marginBottom: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => {
              setCurrentRendicion(null);
              setOpen(true);
            }}
            size="medium"
          >
            Nueva Rendición
          </Button>
          <Button
            variant="contained"
            color="warning"
            startIcon={<Assessment />}
            onClick={generatePDFReport}
            size="medium"
          >
            REPORTE
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<SaveAlt />}
            onClick={exportToExcel}
            size="medium"
          >
            Exportar Excel
          </Button>
        </Box>

        <Grid container spacing={2} sx={{ marginBottom: 2 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6">Total Rendido</Typography>
                <Typography variant="body2" color="textSecondary">
                  {formatCurrency(totalSum)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6">Rendiciones Pendientes</Typography>
                <Typography variant="body2" color="textSecondary">
                  {rendiciones.filter(r => r.estado === 'pendiente').length} Documentos
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6">Rendiciones Aprobadas</Typography>
                <Typography variant="body2" color="textSecondary">
                  {rendiciones.filter(r => r.estado === 'aprobada').length} Documentos
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6">Rendiciones este mes</Typography>
                <Typography variant="body2" color="textSecondary">
                  {formatCurrency(monthlyTotal)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {!isLoading && filteredRendiciones.length === 0 && (
          <Typography variant="body1" align="center" sx={{ my: 4 }}>
            No se encontraron rendiciones con los filtros aplicados
          </Typography>
        )}

        {!isLoading && filteredRendiciones.length > 0 && (
          <>
            <TablaRendiciones 
              rendiciones={filteredRendiciones.slice((page - 1) * itemsPerPage, page * itemsPerPage)}
              onEdit={(rendicion) => {
                setCurrentRendicion(rendicion);
                setOpen(true);
              }} 
            />

            <Pagination
              count={Math.ceil(filteredRendiciones.length / itemsPerPage)}
              page={page}
              onChange={handlePageChange}
              color="primary"
              sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}
            />
          </>
        )}

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

        <ModalRendicion
          open={open}
          handleClose={() => {
            setOpen(false);
            setCurrentRendicion(null);
          }}
          initialData={currentRendicion}
          onSave={handleSave}
        />
      </Box>
    </ThemeProvider>
  );
};

export default RendicionesPage;
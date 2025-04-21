import React, { useState, useContext, useCallback, useMemo } from 'react';
import { formatDate } from '../../../functions/utils';
import {
  Dialog,
  DialogActions,
  DialogContent,
  Box,
  Button,
  Typography,
  Grid,
  CircularProgress,
  Divider,
} from '@mui/material';
import axios from 'axios';
import { AppContext } from '../../../App';
import { buttonCircular ,gridButton, headerStyles } from '../../../styles/modalSeeBillingStyle'

const ModalSeeBilling = ({ open, onClose, currentItem, onSave }) => {
  const { templateId, companyInfo } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const routePdf = process.env.REACT_APP_API_URL_D + '/generate-pdf';

  /****************************************************************/
  const formatCurrency = useCallback((value = 0) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(value);
  }, []);
  /****************************************************************/
  const handleDownloadPdf = useCallback(async () => {
    setLoading(true);
    const payload = {
      template_id: templateId.billing,
      export_type: 'json',
      expiration: 10,
      output_file: 'my_new.pdf',
      data: JSON.stringify({
        A1: companyInfo.rutEmisor || '',
        A2: companyInfo.razonsocialEmpresa || '',
        A3: companyInfo.giroEmpresa || '',
        A4: companyInfo.address || '',
        C1: companyInfo.phone || '',
        A5: companyInfo.web || '',
        TITULO_DOCIMENTO: currentItem.tipo || '',
        E1: currentItem.femision || '',
        E2: currentItem.vencimiento || '',
        E3: currentItem.fepagos || '',
        A10: currentItem.terpagos || '',
        A11: currentItem.formaspago || '',
        A6: currentItem.codinterno || '',
        A7: currentItem.ordencompra || '',
        A8: currentItem.ordenventa || '',
        A9: currentItem.numeroenvio || '',
        A12: currentItem.rut || '',
        A13: currentItem.name || '',
        A14: currentItem.giro || '',
        A15: currentItem.address || '',
        A16: currentItem.comuna || '',
        A17: currentItem.ciudad || '',
        A18: currentItem.nrocliente || '',
        A19: currentItem.contacto || '',
        A20: currentItem.telefono || '',
        A21: currentItem.email || '',
        A22: currentItem.despachar || '',
        A23: currentItem.diredespacho || '',
        A24: currentItem.comunadestino || '',
        A25: currentItem.cuidaddespacho || '',
        C2: currentItem.documento || '',
        H3: currentItem.son || '',
        K3: formatCurrency(currentItem.neto) || '',
        K4: formatCurrency(currentItem.exento) || '',
        K5: formatCurrency(currentItem.iva) || '',
        K6: formatCurrency(currentItem.total) || '',
      }),
    };
    try {
      const response = await axios.post(routePdf, payload);
      const pdfLink = response.data.pdfInfo.pdfLink;
      window.open(pdfLink, '_blank');
    } catch (error) {
      console.error('Error generando el PDF', error);
    } finally {
      setLoading(false);
    }
  }, [templateId, companyInfo, currentItem, formatCurrency, routePdf]);
/****************************************************************/
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // Estilos reutilizables
  const memoHearderStyles = useMemo(() => headerStyles, []);
  const detailsStyles = useMemo(() => ({
    marginBottom: 2,
    color: '#3f51b5',
    fontWeight: 500,
    borderBottom: '2px solid #3f51b5',
    paddingBottom: 1,
  }), []);
  /****************************************************************/
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <Typography variant="h5" sx={memoHearderStyles}>
        Emision Nota de Credito
      </Typography>
      <DialogContent sx={{ padding: '24px' }}>
        {currentItem ? (
          <Box>
            <Grid container spacing={3} sx={{ marginBottom: 3 }}>
              <Grid item xs={12} sm={6}>
                <Typography><strong>Razon Social : </strong> {currentItem.name}</Typography>
                <Typography><strong>RUT : </strong> {currentItem.rut}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography><strong>{currentItem.tipo} : </strong> {currentItem.documento}</Typography>
              < Typography><strong>Fecha Emision : </strong> { formatDate(currentItem.femision)}</Typography>
              </Grid>
            </Grid>
            <Divider sx={{ marginBottom: 3 }} />
            <Typography variant="h6" sx={detailsStyles}>
              Detalles de la Factura
            </Typography>
            <Grid container spacing={2} sx={{ marginBottom: 3 }}>
              <Grid item xs={12} sm={6}>
                <Grid container spacing={1}>
                  <Grid item xs={6}><Typography variant="body1" sx={{ fontWeight: "bold" }}>Neto:</Typography></Grid>
                  <Grid item xs={6}><Typography variant="body1">{formatCurrency(currentItem.neto)}</Typography></Grid>
                  <Grid item xs={6}><Typography variant="body1" sx={{ fontWeight: "bold" }}>Exento:</Typography></Grid>
                  <Grid item xs={6}><Typography variant="body1">{formatCurrency(currentItem.exento)}</Typography></Grid>
                  <Grid item xs={6}><Typography variant="body1" sx={{ fontWeight: "bold" }}>IVA:</Typography></Grid>
                  <Grid item xs={6}><Typography variant="body1">{formatCurrency(currentItem.iva)}</Typography></Grid>
                  <Grid item xs={6}><Typography variant="body1" sx={{ fontWeight: "bold" }}>Total:</Typography></Grid>
                  <Grid item xs={6}><Typography variant="body1">{formatCurrency(currentItem.total)}</Typography></Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={6} sx={gridButton}>
                <Button onClick={handleDownloadPdf} variant="contained" color="primary" disabled={loading} sx={buttonCircular}>
                  {loading ? ( <>
                      <CircularProgress size={24} sx={{ color: "#fff", marginRight: 1 }} />
                      <Typography variant="body2" sx={{ opacity: 0 }}>Generar Nota de Credito</Typography>
                      </>
                    ) : ( "Generar Nota de Credito"
                  )}
                </Button>
                
              </Grid>


              <Grid item xs={12} sm={6} sx={gridButton}>   
              <Button
                              variant="contained"
                              color="primary"
                              
                              sx={{ marginRight: 2 }}
                              
                            >
                              Anular
                            </Button>
                            <Button
                              variant="contained"
                              color="secondary"
                              onClick={handleClose}
                            >
                              Corrige Montos
                            </Button>
             </Grid>               
            </Grid>
          </Box>
          ) : (
          <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
            <CircularProgress size={50} sx={{ marginBottom: 2 }} />
            <Typography variant="h6">Cargando información de la factura...</Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', padding: '16px 24px' }}>
        <Button onClick={handleClose} variant="outlined" color="secondary" x={{ width: '100px', fontWeight: 500 }}>Cerrar </Button>
      </DialogActions>
    </Dialog>
  );
};
export default ModalSeeBilling;
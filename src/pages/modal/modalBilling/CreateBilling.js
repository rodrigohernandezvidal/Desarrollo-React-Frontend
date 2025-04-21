import React, { useState, useEffect, useCallback, useContext, useMemo } from 'react';
import { Box, Button, TextField, Switch, FormControlLabel, Typography, Modal, Autocomplete, Grid, FormControl,Table, TableBody, TableCell,InputLabel, Select,MenuItem, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';
import { dataNow, dataNowAddMonth, validateNumber, formatDate } from '../../../functions/utils';
import CheckCircleSharpIcon from '@mui/icons-material/CheckCircleSharp';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import EditSharpIcon from '@mui/icons-material/EditSharp'
import axios from 'axios';
import { AppContext } from '../../../App';
import { NumerosALetras } from "numero-a-letras";
import { headerStyles,boxCenter, tableEncabezada } from '../../../styles/modalCreateBillingStyle';
import CreateClient from '../modalClients/createClient';

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
/****************************************************************/
const InvoiceModal = ({ open, onClose, currentItem, onSave }) => {
    const routePdf = process.env.REACT_APP_API_URL_D + '/generate-pdf';  
    const routeFolio = process.env.REACT_APP_API_URL_D + '/api/generar-folio';
    const routeCodInt = process.env.REACT_APP_API_URL_D + '/api/codigo/generar-codigo';
    const routeSendcod = process.env.REACT_APP_API_URL_D + '/api/codes';
    const routeXml = process.env.REACT_APP_API_URL_D + '/generate-dte';
    const { templateId, companyInfo } = useContext(AppContext);
    const [loading, setLoading] = useState(false);
    const [formaPago, setFormaPago] = useState('');
    const [clients, setClients] = useState([]);
    const [types, setTypes] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [selectedType, setSelectedType] = useState(null);
    const [netValue, setNetValue] = useState('');
    const [ivaValue, setIvaValue] = useState('');
    const [totalValue, setTotalValue] = useState('');
    const [ordenCompra, setOrdenCompra] = useState('');
    const [isCreatingClient, setIsCreatingClient] = useState(false);
    const [isIvaDisabled, setIsIvaDisabled] = useState(false);
    const [products, setProducts] = useState([]);
    const [isDespachar, setIsDespachar] = useState(false);
    const [newProduct, setNewProduct] = useState({ productName: "", unitPrice: "",quantity : '', total: 0 });
    const [editIndex, setEditIndex] = useState(null);
    const [dateEmision] = useState(dataNow()); 
    const [datePago, setDatePago] = useState(dataNowAddMonth());
    const [dateVenci, setDateVenci] = useState(dataNowAddMonth());
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [city, setCity] = useState([]);
    const [comunas, setComunas] = useState([]);
    const [newClient, setNewClient] = useState({
        name: '',
        rut: '',
        address: '',
        commune: '',
        email: '',
        phone: '',
        giro:'',
        ciudad: '',
    });
    const [isTypeDisabled, setIsTypeDisabled] = useState(true);
    const [showFields, setShowFields] = useState(false);
    const [formData, setFormData] = useState({
        campo1: '',
        campo2: '',
        campo3: '',
        campo4: '',
        campo5: '',
    });
/********************************************************************************/
    const fetchClients = useCallback(async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL_D}/api/data/client`);
        if (!response.ok) throw new Error('Error al obtener los datos de los clientes');
            const data = await response.json();
            setClients(data);
      } catch (error) {
          console.error(error);
          alert('No se pudo cargar la lista de clientes');
      }
    }, []);
/********************************************************************************/
const fetchCity = useCallback(async () => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL_D}/api/data/city`);
    if (!response.ok) throw new Error('Error al obtener los datos de las ciudades');
        const data = await response.json();
        setCity(data);
  } catch (error) {
      console.error(error);
      alert('No se pudo cargar la lista de ciudades');
  }
}, []);    
/********************************************************************************/
const fetchComunas = useCallback(async () => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL_D}/api/data/comunas`);
    if (!response.ok) throw new Error('Error al obtener los datos de las comunas');
        const data = await response.json();
        setComunas(data);
  } catch (error) {
      console.error(error);
      alert('No se pudo cargar la lista de comunas');
  }
}, []);
/********************************************************************************/
    const fetchTypes = useCallback(async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL_D}/api/data/typeBilling`);
        if (!response.ok) throw new Error('Error al obtener los tipos de documentos');
        const data = await response.json();
        setTypes(data);
      } catch (error) {
        console.error(error);
        alert('No se pudo cargar los tipos de documentos');
      }
    }, []);
/********************************************************************************/
    useEffect(() => {
      if (open) {
        fetchClients();
        fetchTypes();
        fetchCity();
        fetchComunas();
      }
    }, [open, fetchClients, fetchTypes, fetchCity, fetchComunas]);
/********************************************************************************/
    const handleClientChange = useCallback((event, value) => {
      setSelectedClient(value);
      setIsCreatingClient(false);
      if (value) {
        setNewClient({
            name: value.name,
            rut: value.rut,
            address: value.address,
            commune: value.commune,
            email: value.email,
            phone: value.phone,
            giro: value.giro,
            ciudad: value.ciudad,
        });
        setIsTypeDisabled(false);
      }
    }, []);
/********************************************************************************/
    const handleTypeChange = useCallback((event, value) => {
      setSelectedType(value);
      if (value?.name !== 'Factura Electronica Exenta'){ setIsIvaDisabled(true); }
      setNetValue('');
      setIvaValue('');
      setTotalValue('');
      setNewProduct({ productName: "", unitPrice: "",quantity : '', total: 0 });
      setProducts([]);
    }, []);
/********************************************************************************/
    const handleInputChangeAndAddProduct = (e) => {
      const { name, value } = e?.target || {}; 
      let parsedValue = name !== 'productName' ? validateNumber(value) || 0 : value;
      console.log(`name: ${name}, value: ${value}, parsedValue: ${parsedValue}`); // Debugging para ver los valores
      if (name === 'quantity') {
          setNewProduct((prevProduct) => {
          const newTotal = parsedValue * (prevProduct.unitPrice || 0);
            return {
                ...prevProduct,
                quantity: parsedValue,
                total: newTotal, 
            };
          });
      } else if (name === 'unitPrice') {
          setNewProduct((prevProduct) => {
              const newTotal = parsedValue * (prevProduct.quantity || 1); 
              return {
                ...prevProduct,
                unitPrice: parsedValue,
                total: newTotal, 
              };
          });
      } else if (name === 'productName') {
          setNewProduct((prevProduct) => ({
              ...prevProduct,
              productName: value, 
          }));
      }
      if (!e) {
        if (!newProduct.productName || !newProduct.quantity ||isNaN(parseFloat(newProduct.unitPrice))) {
            alert("Por favor, ingresa un nombre de Producto / Servicio o una cantidad o un valor unitario válido.");
            return;
        }
        if (editIndex === null) {
          const updatedProducts = [
            ...products,
            { 
              ...newProduct, 
              value: parseFloat(newProduct.unitPrice), 
              total: parseFloat(newProduct.unitPrice) * (newProduct.quantity || 1) 
            },
          ];
          setProducts(updatedProducts); 
        } else {
          const updatedProducts = products.map((product, index) =>
            index === editIndex
            ? { 
                ...newProduct, 
                value: parseFloat(newProduct.unitPrice) || 0,
                total: parseFloat(newProduct.unitPrice) * (newProduct.quantity || 1),  
              }
              : product
          );
          setProducts(updatedProducts);
          setEditIndex(null); 
        }
        setNewProduct({ productName: "", unitPrice: "", quantity: '', total: 0 });
      }
      const updatedProducts = e
      ? products.map((product) =>
          product.productName === newProduct.productName
          ? { 
              ...product, 
              value: parsedValue,
              total: parsedValue * (product.quantity || 1)
            }
            : product
        )
        : editIndex === null
        ? [
            ...products, 
            { 
              ...newProduct, 
              value: parseFloat(newProduct.unitPrice), 
              total: (parseFloat(newProduct.unitPrice) || 0) * (newProduct.quantity || 1)
            }
          ] 
          : products.map((product, index) =>
              index === editIndex
              ? { 
                  ...newProduct, 
                  value: parseFloat(newProduct.unitPrice), 
                  total: (parseFloat(newProduct.unitPrice) || 0) * (newProduct.quantity || 1) 
                }
                : product
            );
            const newNeto = updatedProducts.reduce((acc, product) => acc + (product.total || 0), 0); 
            const formattedNeto = formatCurrency(newNeto); 
            setNetValue(formattedNeto);
            const mockEvent = { target: { value: String(newNeto) } };
            handleNetValueChange(mockEvent);
    };
/********************************************************************************/
    const formatCurrency = useCallback((value) => {
      if (!value) return '';
      return new Intl.NumberFormat('es-CL').format(value);
    }, []);
/********************************************************************************/
    const handleNetValueChange = useCallback((e) => {
        const rawValue = e.target.value.replace(/[^\d]/g, ''); 
        if (rawValue) {
            const parsedValue = parseFloat(rawValue); 
            const formattedValue = formatCurrency(parsedValue); 
            setNetValue(formattedValue);  
            if (selectedType?.name !== 'Factura Electronica Exenta') {
                const iva = (parsedValue * 0.19).toFixed(0); 
                const formattedIva = formatCurrency(iva);
                const total = (parsedValue + parseFloat(iva)).toFixed(0);
                const formattedTotal = formatCurrency(total);
                setIvaValue(formattedIva);
                setTotalValue(formattedTotal);
            } else {
                const iva = 0;
                const formattedIva = formatCurrency(iva);
                const total = (parsedValue + parseFloat(iva)).toFixed(0);
                const formattedTotal = formatCurrency(total); 
                setIvaValue(formattedIva);
                setTotalValue(formattedTotal);
            }
        } else {
          setNetValue('');
          setIvaValue('');
          setTotalValue('');
        }
    }, [formatCurrency, selectedType]);
/********************************************************************************/
    const handleSave = async() => {
      const amontStringInt = totalValue.replace(/\./g, "");
      let amountinWords = NumerosALetras(amontStringInt);
      amountinWords = amountinWords.replace("00/100 M.N.","Chilenos");
      setLoading(true);
      const items = products.map((product) => ({
          H1: product.productName,
          J1: product.quantity,
          H2: product.productName,
          K1: formatCurrency(product.unitPrice),
          K2: formatCurrency(product.total)
      }));
/*****************************************************************************/
      const detalleXML = products.map((product, index) => ({
        NroLinDet: index + 1, // Número de línea del detalle
        NmbItem: product.productName, // Nombre del producto
        QtyItem: product.quantity, // Cantidad
        PrcItem: formatCurrency(product.unitPrice), // Precio unitario
        MontoItem: formatCurrency(product.total) // Monto total del ítem
    }));
      const tiposFacturacion = {
        'Factura Electronica': { value: 'factura_electronica', label: 'Factura Electronica' },
        'Factura Electronica Exenta': { value: 'factura_exenta', label: 'Factura Electronica Exenta' },
        'Boleta Electrónica': { value: 'boleta_electronica', label: 'Boleta Electrónica' },
      };
      //Validaciones
      /**************************************************************/
      if (!selectedType?.name || !tiposFacturacion[selectedType.name]) {
        Error('Por favor selecciona un tipo de facturación válido.');
        setLoading(false);
        return;
      }
      if(!formaPago){
        alert('Debe ingresar una forma de pago');
        setLoading(false);
        return;
      }
      if(isDespachar){
          if(!formData.campo1){
            alert('Error al genera, el numero de envio, contactese con el administrador');
            setLoading(false);
            return;
          }
          if(!formData.campo2){
            alert('Debe ingresar un nombre a quien va dirigido el despacho');
            setLoading(false);
            return;
          }
          if(!formData.campo3){
            alert('Debe ingresar la direccion del despacho');
            setLoading(false);
            return;
          }
          if(!formData.campo4){
            alert('Debe ingresar la comuna del despacho');
            setLoading(false);
            return;
          }
          if(!formData.campo5){
            alert('Debe ingresar la ciudad del despacho');
            setLoading(false);
            return;
          }
      }
      /**************************************************************/
      const tipoSeleccionado = tiposFacturacion[selectedType.name];
      console.log('Forma de pago seleccionada:', selectedClient.name);
      let exento = '0'; 
      let neto = '0';
      let iva = '0';
      let template_id_v = '';
      
      if (selectedType.name === 'Factura Electronica Exenta') {
        exento = netValue; 
        template_id_v= templateId.exenta;
      } else{
        neto = netValue;
        iva = ivaValue;
        template_id_v = templateId.billing;
      }
      const folioResponse = await axios.post(routeFolio, {
        tipo: tipoSeleccionado.value,
      });
      const folio = folioResponse.data?.folio;
      console.log('Folio generado correctamente:', folio);
      if (!folio) {
        throw new Error('No se pudo recuperar el folio.');
      }
      let codigoInterno;
      try {
        const response = await axios.get(routeCodInt);
        codigoInterno = response.data.codigo;
        console.log('Código interno generado:', codigoInterno);
        // Aquí sigues con el resto de la lógica para guardar la factura
      } catch (error) {
        console.error('Error al generar el código interno:', error);
      }
      const billingData = {
        template_id: template_id_v,
        export_type: 'json',
        expiration: 10,
        output_file:'Factura_LBO.pdf',
        data: {
          A1: companyInfo.rutEmisor || '',
          A2: companyInfo.razonsocialEmpresa || '',
          A3: companyInfo.giroEmpresa || '',
          A4: companyInfo.address || '',
          C1: companyInfo.phone || '',
          A5: companyInfo.web || '',
          TITULO_DOCIMENTO: selectedType.name,
          E1: dateEmision,
          E2: formatDate(dateVenci),
          E3: formatDate(datePago),
          A10: '', // pagos terceros
          A11: formaPago, // forma de pago
          A6: codigoInterno, // codigo interno
          A7: ordenCompra, // orden de compra
          A8: '', //orden de venta
          A9: formData.campo1 || '',//numero de envio
          A12: selectedClient.rut,
          A13: selectedClient.name,
          A14: selectedClient.giro,//giro
          A15: selectedClient.address,
          A16: selectedClient.commune,
          A17: selectedClient.ciudad, // ciudad
          A18: selectedClient.id,// numero de cliente
          A19: selectedClient.contacto, //contacto
          A20: selectedClient.phone,
          A21: selectedClient.email,
          A22: formData.campo2 || '', // Despachar A:
          A23: formData.campo3 || '', //direccion de despacho
          A24: formData.campo4 || '', // commune de destino
          A25: formData.campo5 || '', //ciudad de despacho
          C2: folio, //folio documento
          H3: amountinWords,
          K3: neto || '',
          K4: exento || '',
          K5: iva || '',
          K6: totalValue || '', 
          items:items
        },
      };
      try {
        const saveResponse = await axios.post(`${process.env.REACT_APP_API_URL_D}/api/data/save-billing`, { billingData });
        console.log(saveResponse)
        console.log(saveResponse.data)
        console.log('Factura guardada en el backend:', saveResponse.data);

        const response = await axios.post(routePdf, billingData);
        const pdfLink = response.data.pdfInfo.pdfLink;
        window.open(pdfLink, '_blank');
      } catch (error) {
        console.error('Error generando el PDF', error);
      } finally {
        setLoading(false);
      }
    
      const dteData = {
        // Ejemplo de datos que podrías enviar, ajusta según tu estructura
        rutEmisor: companyInfo.rutEmisor,
        rutEnvia:'88.888.888-8',// Rut del Representante legal o habilitado para enviar DTE frente al SII
        rutReceptor: selectedClient.rut,
        fchResol:'2022-07-10',//Fecha de resolución del SII que autoriza a la empresa a emitir DTEs. Se obtiene del certificado digital de facturación electrónica.
        nroResol:'777',// Número de la resolución del SII que autoriza a la empresa a emitir facturas electrónicas.Ejemplo: 0 (puede variar según la empresa).
        tipoDte:  '33',
        folio: folio,
        fchEmis: dataNowAddMonth(dateEmision),
        razonSocial:companyInfo.razonsocialEmpresa,
        nroDTE:'1',//Número de documentos de este tipo en el envío. Ejemplo: 1 (Solo se envía una factura en este caso).
        /******Datos Emisor**********/
        rznSoc: companyInfo.razonsocialEmpresa ,
        giroEmis:companyInfo.giroEmpresa ,
        acteco: '22334', //Codigo Actividad economica
        cdgSIISucur: '33333',//Codigo Sucursal SII
        dirOrigen:companyInfo.address,
        cmnaOrigen: 'Las Condes', //se debe separar de la direccion de empresa
        ciudadOrigen: 'Santiago', //se debe separar de la direccion de empresa
        /******Datos Receptor**********/
        rutRecep: selectedClient.rut,
				rznSocRecep: selectedClient.name,
				giroRecep: selectedClient.giro,
				dirRecep: selectedClient.address,
				cmnaRecep: selectedClient.commune,
				ciudadRecep: selectedClient.ciudad,
         /******Totales**********/
        mntNeto: neto,
				tasaIVA: '19',
				iva:iva,
				mntTotal: totalValue,
        /**********************/
        detalles:detalleXML,
        /**********************/
        re:companyInfo.rutEmisor,
        td: '33',
        f:  folio,
        fe: dataNowAddMonth(dateEmision),
        rr: selectedClient.rut,
        rsr:selectedClient.name,
        mnt: totalValue,
        it1: 'Servicio',
        rs:companyInfo.razonsocialEmpresa ,
        d: '1', //Rango de Folios desde
        h: '2000' ,//Rango de Folios hasta
        fa:'2006-08-25',//fecha en que el SII autorizó el uso del CAF (Código de Autorización de Folios) para la emisión de documentos electrónicos.
        
      };
     /***************************/
      console.log(billingData);
      setOrdenCompra('');
      setFormaPago('');
      setIsDespachar(false);
      handXml(dteData);
      handleClose();
    };
/********************************************************************************/
const handXml = async(dteData) => {
  try {
    // Envía la solicitud POST al backend
    const response = await axios.post(routeXml, dteData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    // Extraer el enlace del XML desde la respuesta
    const xmlLink = response.data.xmlLink;
    console.log('XML disponible en:', xmlLink);

    // Abrir el XML en una nueva pestaña
    if (xmlLink) {
      window.open(xmlLink, '_blank');
    } else {
      console.error('No se recibió el enlace del XML');
    }
    console.log('Respuesta del backend:', response.data);
  } catch (error) {
    console.error('Error al enviar datos al backend:', error.message);
  }

}
/********************************************************************************/
    const isGenerateDisabled = useCallback(() => {
      return !(netValue && totalValue) || loading;
    }, [netValue, totalValue, loading]);
/********************************************************************************/
const handleDeleteProduct = (index) => {
    const productToDelete = products[index];
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
    const newNeto = updatedProducts.reduce((acc, product) => acc + product.total, 0);
    const formattedNeto = formatCurrency(newNeto);
    setNetValue(formattedNeto);
    const mockEvent = { target: { value: String(newNeto) } };
    handleNetValueChange(mockEvent);
    console.log("Producto eliminado:", productToDelete);
    console.log("Productos actualizados:", updatedProducts);
    console.log("Nuevo valor neto:", newNeto);
  };
/********************************************************************************/
  const handleEditProduct = (index) => {
    setNewProduct(products[index]); 
    setEditIndex(index);
  };
/********************************************************************************/
  const handleClose = useCallback(() => {
    setIsCreatingClient(false);
    setSelectedClient(null);
    setSelectedType(null);
    setNetValue('');
    setIvaValue('');
    setTotalValue('');
    setNewProduct({ productName: "", unitPrice: "",quantity : '', total: 0 });
    setNewClient({
      name: '',
      rut: '',
      address: '',
      commune: '',
      email: '',
      phone: '',
      giro: '',
      ciudad:'',
    });
    setFormData({campo1: "", campo2: "", campo3: "", campo4: "", campo5: "" });
    setIsTypeDisabled(true); 
    setIsDespachar(false);
    setShowFields(false);
    onClose();
  }, [onClose]);
/********************************************************************************/
  const handleInputChange = (e) => {
    const { name, value } = e.target; 
    setFormData({
      ...formData, 
      [name]: value, 
    }); 
  };
/********************************************************************************/
const handleSelectChange = (event, newValue, field) => {
  setFormData({ ...formData, [field]: newValue ? newValue.nombre : "" });
};
/********************************************************************************/
  const handleSubmit = () => {
    console.log('Datos ingresados:', formData);
    setShowFields(false);
  };
/********************************************************************************/
  const handleChange = async (event) => {
    const isChecked = event?.target?.checked !== undefined ? event.target.checked : event;
    setIsDespachar(isChecked); 
    if (isChecked) {
        setShowFields(true);
        let sendCodig;
      try {
        const responseSend = await axios.get(`${routeSendcod}/add`);
        sendCodig = responseSend.data.code;
        setFormData((prevFormData) => ({
          ...prevFormData,
          campo1: sendCodig 
        }));
      } catch (error) {
        console.error('Error al generar el código interno:', error);
      }
    } else {
      try {
        const responseDelete = await axios.delete(`${routeSendcod}/last`);
        console.log('Código revertido:', responseDelete.data.code);
        setFormData((prevFormData) => ({
          ...prevFormData,
          campo1: '', 
        }));
      } catch (error) {
        console.error('Error al revertir el código interno:', error);
      }
      handleSubmit();
    }
  };
  /********************************************************************************/
  //Estilos Reutilizables
  const memoHearderStyles = useMemo(() => headerStyles, []);
/*****************************************************************************/
  const handleChangePago = (event) => {
    setFormaPago(event.target.value);
  };
  /*****************************************************************************/
  const handleOpenCreateModal = () => {
    setOpenCreateModal(true);
  };
  /*****************************************************************************/
  const handleCloseCreateModal = () => {
    setOpenCreateModal(false);
  };
return (
<ThemeProvider theme={theme}>
      <Modal open={open} onClose={handleClose}>
          <Box sx={boxCenter}>
              <Typography variant="h6" sx={ memoHearderStyles}> Nueva Factura</Typography>
                    <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                                <Autocomplete options={clients} getOptionLabel={(option) => option.name} onChange={handleClientChange} renderInput={(params) => (
                                    <TextField {...params} label="Razón Social" variant="outlined" fullWidth margin="normal"/>
                                )}/>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                                <Autocomplete options={types} getOptionLabel={(option) => option.name} onChange={handleTypeChange} disabled={isTypeDisabled} renderInput={(params) => (
                                    <TextField {...params} label="Tipo de Documento" variant="outlined" fullWidth margin="normal" />
                                )}/>
                          </Grid>
                    </Grid>
                    {!selectedClient && !isCreatingClient && (
                        <Button variant="outlined" color="text" onClick={handleOpenCreateModal} sx={{ marginTop: 2 }}>Crear Cliente</Button>
                    )}
                    {(selectedClient) && (
                        <Box sx={{ width: '100%', marginTop: 2, padding: 2, border: '1px solid #ccc', borderRadius: 1 }}>
                           <Grid container spacing={3} sx={{ marginBottom: 3 }}>
                              <Grid item xs={12}><Typography><strong>Razón Social: </strong> {newClient.name}</Typography></Grid>
                              <Grid item xs={12} sm={6}><Typography><strong>RUT: </strong> {newClient.rut}</Typography></Grid>
                              <Grid item xs={12} sm={6}><Typography><strong>Giro: </strong> {newClient.giro}</Typography></Grid>
                              <Grid item xs={12}><Typography><strong>Dirección: </strong> {newClient.address}</Typography></Grid>
                              <Grid item xs={12} sm={6}><Typography><strong>Comuna: </strong> {newClient.commune}</Typography></Grid>
                              <Grid item xs={12} sm={6}><Typography><strong>Ciudad: </strong> {newClient.ciudad}</Typography></Grid>
                              <Grid item xs={12} sm={6}><Typography><strong>Email: </strong> {newClient.email}</Typography></Grid>
                              <Grid item xs={12} sm={6}><Typography><strong>Teléfono: </strong> {newClient.phone}</Typography></Grid>
                            </Grid>
                        </Box>
                    )}
                    {(selectedType) && (
                        <Box sx={{ width: '100%', marginTop: 2, padding: 1, border: '1px solid #ccc', borderRadius: 1, }}>
                            <TableContainer component={Paper} sx={{ marginBottom: 2 }}>
                                <Table>
                                    <TableHead>
                                          <TableRow>
                                                <TableCell align="left" sx={ tableEncabezada }> Producto / Servicio</TableCell>
                                                <TableCell align="left" sx={ tableEncabezada }> Cantidad</TableCell>
                                                <TableCell align="left" sx={ tableEncabezada }> Valor Unitario</TableCell>
                                                <TableCell align="left" sx={ tableEncabezada }> Valor</TableCell>
                                                <TableCell align="left" sx={ tableEncabezada }></TableCell>
                                          </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {products.map((product, index) => (
                                            <TableRow key={index}>
                                                  <TableCell align="left" sx={{ fontSize: '0.875rem' }}>{product.productName}</TableCell>
                                                  <TableCell align="left" sx={{ fontSize: '0.875rem' }}>{product.quantity}</TableCell>
                                                  <TableCell align="left" sx={{ fontSize: '0.875rem' }}>{formatCurrency(product.unitPrice)}</TableCell>
                                                  <TableCell align="left" sx={{ fontSize: '0.875rem' }}>{formatCurrency(product.total)}</TableCell>
                                                  <TableCell align="center" sx={{ display: 'flex', justifyContent: 'center' }}>
                                                      <DeleteTwoToneIcon style={{ color: '#dc3545', fontSize: '2rem' }} onClick={() => handleDeleteProduct(index)} />
                                                      <EditSharpIcon style={{ color: '#3f51b5', fontSize: '2rem' }} onClick={() => handleEditProduct(index)}/>
                                                  </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <br></br> 
                            <Grid container spacing={2} alignItems="center" justifyContent="space-between" >
                                <Grid item xs={12} sm={5}><TextField label="Producto / Servicio" variant="outlined" fullWidth name="productName" value={newProduct.productName || ""} onChange={handleInputChangeAndAddProduct}/></Grid>
                                <Grid item xs={6} sm={3}><TextField label="Cantidad" variant="outlined" fullWidth name="quantity" value={newProduct.quantity || ""} onChange={handleInputChangeAndAddProduct}/></Grid>
                                <Grid item xs={6} sm={3}><TextField label="Valor Unitario" variant="outlined" fullWidth name="unitPrice" value={newProduct.unitPrice || ""} onChange={handleInputChangeAndAddProduct}/></Grid>
                                <Grid item xs="auto"><CheckCircleSharpIcon style={{ color: '#28a745', fontSize: '2rem', cursor:'pointer' }} onClick={() => handleInputChangeAndAddProduct()}/></Grid>
                            </Grid>
                        </Box>    
                   )}
                  {(selectedType) && (
                        <Box sx={{ width: '100%', marginTop: 2, padding: 1, border: '1px solid #ccc', borderRadius: 1, }}> 
                            <Grid container spacing={2} alignItems="center" justifyContent="space-between">          
                                    <Grid item xs={5} sm={4}><TextField label="Fecha Emision" type="date" name="DateEmision"value={dateEmision}  fullWidth disabled InputLabelProps={{ shrink: true }}/></Grid>
                                    <Grid item xs={5} sm={4}><TextField label="Fecha Pago" type="date" name="DatePago" value={datePago} onChange={(e) => setDatePago(e.target.value)} fullWidth /></Grid>
                                    <Grid item xs={5} sm={4}><TextField label="Fecha Vencimiento"  type="date" name="DateVenci" value={dateVenci} onChange={(e) => setDateVenci(e.target.value)} fullWidth/></Grid>
                                <Grid item xs={5} sm={4}>
                                 <TextField label="Orden de Compra" variant="outlined" fullWidth name="OrdenCompra" value={ordenCompra} onChange={(e) => setOrdenCompra(e.target.value)}/>
                                </Grid>
                                <Grid item xs={5} sm={4}> 
                                  <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Formas Pago</InputLabel>
                                    <Select labelId="demo-simple-select-label" id="demo-simple-select" value={formaPago}  label="Formas de pago" onChange={handleChangePago}>
                                        <MenuItem value="Efectivo">Efectivo</MenuItem>
                                        <MenuItem value="Debito">Debito</MenuItem>
                                        <MenuItem value="Credito">Credito</MenuItem>
                                    </Select>
                                  </FormControl>
                                </Grid>
                            </Grid>
                            <Grid container alignItems="center">
                              <Grid item xs="auto">
                                  <FormControlLabel control={ <Switch checked={isDespachar} onChange={handleChange} color="warning"/> } label={isDespachar ? 'Despachar' : 'Despachar'} sx={{ marginRight: 2 }}/>
                              </Grid>
                            </Grid>
                            {showFields && (
                                <Box sx={{ marginTop: 2 }}>     
                                    <fieldset style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '16px' }}>
                                      <legend style={{ padding: '0 10px', fontFamily: 'Arial, sans-serif', fontWeight: 'normal', color: '#555' }}>Datos para el despacho</legend>
                                      <Grid container spacing={3}>
                                          <Grid item xs={4}><TextField label="Nro Envio" name="shippingNumber" value={formData.campo1} onChange={handleInputChange} fullWidth disabled/></Grid>
                                          <Grid item xs={8}><TextField label="Despachar A" name="campo2" value={formData.campo2} onChange={handleInputChange} fullWidth /></Grid>
                                          <Grid item xs={12}><TextField label="Direccion Envio" name="campo3" value={formData.campo3} onChange={handleInputChange} fullWidth/></Grid>
                                          <Grid item xs={6}><Autocomplete options={comunas} getOptionLabel={(option) => option.nombre} onChange={(event, newValue) => handleSelectChange(event, newValue, "campo4")} renderInput={(params) => (
                                              <TextField {...params} label="Seleccione Comuna" variant="outlined" fullWidth margin="normal" value={formData.campo4}/>)}/>
                                          </Grid>
                                          <Grid item xs={6}><Autocomplete options={city} getOptionLabel={(option) => option.nombre} onChange={(event, newValue) => handleSelectChange(event, newValue, "campo5")} renderInput={(params) => (
                                              <TextField {...params} label="Seleccione Ciudad" variant="outlined" fullWidth margin="normal" value={formData.campo5}/>)}/>
                                          </Grid>
                                      </Grid>
                                    </fieldset>
                                </Box> 
                            )}
                        </Box>
                  )}
                  {(selectedType) && (
                    <>
                    <TextField label="Neto" variant="outlined" fullWidth margin="normal" value={netValue} disabled={!!isIvaDisabled} onChange={handleNetValueChange}/>
                    <TextField label="IVA (19%)" variant="outlined" fullWidth margin="normal" value={ivaValue} InputProps={{ readOnly: true }} disabled={!!isIvaDisabled}/>
                    <TextField label="Total" variant="outlined" fullWidth margin="normal" value={totalValue} disabled={!!isIvaDisabled} InputProps={{ readOnly: true }}/>
                    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                      <Button variant="contained" color="primary" onClick={handleSave} sx={{ cursor:'pointer' }}disabled={isGenerateDisabled()} startIcon={loading ? <CircularProgress size={24} color="inherit" /> : null}>Generar</Button>
                      <Button variant="outlined" color="secondary" onClick={handleClose} sx={{ marginLeft: 2,  cursor:'pointer'  }}>Cancelar</Button>
                    </Box>
                    </>
                  )}
          </Box>
      </Modal>
      <CreateClient 
  open={openCreateModal} 
  onClose={handleCloseCreateModal} 
/>    
</ThemeProvider>
);
};
export default InvoiceModal;
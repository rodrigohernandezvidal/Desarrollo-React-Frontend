import React, { useState, useCallback, useMemo } from 'react';
import { Modal, Box, Grid, TextField, Typography, Button } from '@mui/material';
import { headerStyles, boxCenter } from '../../../styles/modalCreateBillingStyle';
import { formatAndValidateRUT } from '../../../functions/utils'

const CreateClientModal = ({ open,onClose }) => {
    const [newClient, setNewClient] = useState({ name: '', rut: '', giro: '', commune: '', email: '', phone: '' });
    const [rutError, setRutError] = useState(false);
    const [isCreateDisabled, setIsCreateDisabled] = useState(true);

    /********************************/
    const handleClose = useCallback(() => {
        setNewClient({
            name: '',
            rut: '',
            giro: '',
            address: '',
            commune: '',
            email:'',
            phone:''
        });
        onClose();
    },[onClose]);
    /********************************/
    const handleNewClientChange = (event) =>{
        
        const { name, value } = event.target;
        if (name === "rut") {
            // Llamar a la función para formatear y validar el RUT
            const { formattedRUT, isValid } = formatAndValidateRUT(value);
        
            // Actualizar el estado del cliente
            setNewClient((prev) => ({
              ...prev,
              [name]: formattedRUT, // Guardamos el RUT formateado en el estado
            }));
        
            // Actualizar estado del error
            setRutError(!isValid);
            setIsCreateDisabled(!isValid);
          } else {
            setNewClient((prev) => ({
              ...prev,
              [name]: value,
            }));
          }

    };
  //Estilos Reutilizables
   const memoHearderStyles = useMemo(() => headerStyles, []);
    return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-create-client"
      aria-describedby="modal-form-to-create-new-client"
    >
      <Box sx={boxCenter}>
        <Typography variant="h6" sx={ memoHearderStyles}>
          Crear Nuevo Cliente
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Razón Social"
              variant="outlined"
              fullWidth
              margin="normal"
              name="name"
              value={newClient.name}
              onChange={handleNewClientChange}
              
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="RUT"
              variant="outlined"
              fullWidth
              margin="normal"
              name="rut"
              value={newClient.rut}
              onChange={handleNewClientChange}
              
            />
            {rutError && (
              <Typography color="error" variant="body2" sx={{ marginTop: 1, fontSize: '0.75rem' }}>
                RUT inválido
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Giro"
              variant="outlined"
              fullWidth
              margin="normal"
              name="giro"
              value={newClient.giro}
              onChange={handleNewClientChange}
              
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Dirección"
              variant="outlined"
              fullWidth
              margin="normal"
              name="address"
              value={newClient.address}
              onChange={handleNewClientChange}
              
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Ciudad"
              variant="outlined"
              fullWidth
              margin="normal"
              name="city"
              value={newClient.cuidad}
              onChange={handleNewClientChange}
              
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Comuna"
              variant="outlined"
              fullWidth
              margin="normal"
              name="commune"
              value={newClient.commune}
              onChange={handleNewClientChange}
             
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              name="email"
              value={newClient.email}
              onChange={handleNewClientChange}
              
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Teléfono"
              variant="outlined"
              fullWidth
              margin="normal"
              name="phone"
              value={newClient.phone}
              onChange={handleNewClientChange}
            
            />
          </Grid>
        </Grid>
        {/* Botones para crear o cancelar */}
        
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
            <Button
              variant="contained"
              color="primary"
              
              sx={{ marginRight: 2 }}
              disabled={isCreateDisabled}
            >
              Crear
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleClose}
            >
              Cancelar
            </Button>
          </Box>
        
      </Box>
    </Modal>
  );
};

export default CreateClientModal;

/********************************************************************************/
   /* const handleSaveClient = useCallback(() => {
      if (!selectedClient && !isCreatingClient) {
       alert('Selecciona o crea un cliente antes de generar la factura');
        return;
      }
    },[selectedClient, isCreatingClient]);*/
/********************************************************************************/
   /* const handleCreateClient = useCallback(() => {
      setIsCreatingClient(true);
      setSelectedClient(null);
      setNewClient({
        name: '',
        rut: '',
        address: '',
        commune: '',
        email: '',
        phone: '',
        giro:'',
        ciudad: '',
      });
      //setRutError(false);
      setIsTypeDisabled(false);
    }, []);*/
/********************************************************************************/
    /*const handleNewClientChange = useCallback((e) => {
        const { name, value } = e.target;
        if (name === 'rut') {
          const cleanValue = value.replace(/[^\dKk]/g, ''); 
          let formattedRUT = cleanValue;
          if (cleanValue.length > 1) {
            formattedRUT = cleanValue.slice(0, -1).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '-' + cleanValue.charAt(cleanValue.length - 1);
          }
          setNewClient((prev) => ({
            ...prev,
            [name]: formattedRUT,
          }));
          const { isValid } = formatAndValidateRUT(cleanValue); 
          //setRutError(!isValid); 
        } else {
          setNewClient((prev) => ({
            ...prev,
            [name]: value,
          }));
        }
    }, []);*/
/********************************************************************************/
   /* const handleCancelCreateClient = useCallback(() => {
      setIsCreatingClient(false);
      setNewClient({
          name: '',
          rut: '',
          address: '',
          commune: '',
          email: '',
          phone: '',
          giro: '',
          ciudad: '',
      });
    }, []);*/
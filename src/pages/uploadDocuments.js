import { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  Box,
  Grid,
  Autocomplete,
  LinearProgress,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  ListItemButton,
  Chip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UploadDocuments = () => {
  const [files, setFiles] = useState([]);
  const [clients, setClients] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [relatedClients, setRelatedClients] = useState([]);
  const [predefinedDocuments, setPredefinedDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [attachedDocs, setAttachedDocs] = useState([]);
  const [selectedFirmantes, setSelectedFirmantes] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [primarySigner, setPrimarySigner] = useState(null);
  const [secondarySigner, setSecondarySigner] = useState(null);
  const [showRelatedSelector, setShowRelatedSelector] = useState(false);

  useEffect(() => {
    if (selectedType === 'multiple' && selectedFirmantes.length === 0) {
      setPrimarySigner(null);
      setSecondarySigner(null);
      setShowRelatedSelector(false);
    }
  }, [selectedFirmantes, selectedType]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL_D}/api/data/signatories`);
        if (!response.ok) throw new Error("Error al obtener los datos de los clientes");

        const data = await response.json();
        const filteredData = data.filter(client => 
          (client.firmante === "S" && client.isEmpresa === "N" && client.idEmpRel === "N") ||
          (client.firmante === "N" && client.isEmpresa === "S" && client.idEmpRel === "S")
        );
        setClients(filteredData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchClients();
  }, []);

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const newFiles = Array.from(event.dataTransfer.files);
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleRemoveFile = (index) => {
    const removedFile = files[index];
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    if (removedFile.url) {
      const docId = predefinedDocuments.find((doc) => doc.url === removedFile.url)?.id;
      if (docId) {
        setAttachedDocs((prevAttached) => prevAttached.filter((id) => id !== docId));
      }
    }
  };

  const base64ToBlob = (base64, mimeType) => {
    const byteCharacters = atob(base64.split(",")[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  };

  const handleUpload = async () => {
    // ... código anterior ...

    try {
        const formData = new FormData();
        
        // Validar archivos
        if (files.some(file => !file.name.match(/\.(pdf|doc|docx)$/i))) {
            throw new Error('Solo se permiten archivos PDF, DOC o DOCX');
        }

        // Preparar firmantes
        const firmantes = selectedFirmantes.map(client => ({
            email: client.email,
            name: client.name
        }));

        if (firmantes.length === 0) {
            throw new Error('Debe seleccionar al menos un firmante');
        }

        // Agregar archivos al formData
        files.forEach(file => {
            if (file.url) {
                const blob = base64ToBlob(file.url, "application/pdf");
                formData.append("documents", blob, file.name);
            } else {
                formData.append("documents", file);
            }
        });

        formData.append("firmantes", JSON.stringify(firmantes));

        const response = await axios.post(`${process.env.REACT_APP_API_URL_D}/api/upload`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
            timeout: 30000, // 30 segundos de timeout
            onUploadProgress: (progressEvent) => {
                const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                setUploadProgress(progress);
            },
        });

        toast.success('¡Documentos subidos correctamente!');
        resetUploadState();
    } catch (error) {
        console.error("Error al subir documentos:", error);
        toast.error(error.response?.data?.error || error.message || 'Error al subir documentos');
    } finally {
        setIsUploading(false);
    }
};
  
  const resetUploadState = () => {
    setFiles([]);
    setSelectedFirmantes([]);
    setSelectedClient(null);
    setPrimarySigner(null);
    setSecondarySigner(null);
    setRelatedClients([]);
    setShowRelatedSelector(false);
    setPredefinedDocuments([]);
    setSelectedDoc(null);
    setAttachedDocs([]);
  };

  const generateFileName = (docName, clientName) => {
    const date = new Date();
    const formattedDate = `${date.getDate()}${date.getMonth() + 1}${date.getFullYear().toString().slice(-2)}`;
    const formattedClientName = clientName
      .replace(/\s+/g, "_")
      .replace(/-/g, "_")
      .replace(/[^a-zA-Z0-9_]/g, "");
    const formattedDocName = docName
      .replace(/\s+/g, "_")
      .replace(/-/g, "_")
      .replace(/[^a-zA-Z0-9_]/g, "");
    return `${formattedDocName.slice(0, 5)}_${formattedClientName}_${formattedDate}.pdf`;
  };

  const handleAttachDocument = () => {
    if (selectedDoc) {
      const doc = predefinedDocuments.find((doc) => doc.url === selectedDoc);
      if (doc) {
        const fileName = generateFileName(doc.name, selectedClient?.name || primarySigner?.name);
        const file = { name: fileName, url: selectedDoc };
        setFiles((prevFiles) => [...prevFiles, file]);
        setAttachedDocs((prevAttached) => [...prevAttached, doc.id]);
        setSelectedDoc(null);
        toast.success('Documento adjuntado correctamente.');
      }
    } else {
      toast.warning('No se ha seleccionado ningún documento para adjuntar.');
    }
  };

  const isDocumentAttached = (docId) => {
    return attachedDocs.includes(docId);
  };

  const handleSelectDocument = (doc) => {
    setSelectedDoc(doc.url);
  };

  const handleSimpleClientSelection = async (value) => {
    if (value.firmante === "N") {
      toast.warning('Debe seleccionar una persona natural');
      return;
    }

    setSelectedClient(value);
    setPredefinedDocuments([]);
    
    const documents = await fetchPredefinedDocuments(value);
    if (documents) {
      setPredefinedDocuments([
        { id: 1, name: "Mandato", url: `data:application/pdf;base64,${documents.mandato}` },
        { id: 2, name: "Contrato", url: `data:application/pdf;base64,${documents.contrato}` },
        { id: 3, name: "Cotización", url: `data:application/pdf;base64,${documents.cotizacion}` },
      ]);
    }
    
    setSelectedFirmantes([value]);
  };

  const fetchRelatedClients = async (companyId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL_D}/api/data/signatoriesId/${companyId}`);
      if (response.ok) {
        const result = await response.json();
        return Array.isArray(result) ? result : [result];
      }
      return [];
    } catch (error) {
      console.error("Error al obtener firmantes relacionados:", error);
      return [];
    }
  };

  const handleMultipleSelection = async (value, isSecondary = false) => {
    if (!isSecondary) {
      // Primer firmante seleccionado
      setPrimarySigner(value);
      
      if (value.isEmpresa === "S") {
        const related = await fetchRelatedClients(value.id);
        setRelatedClients(related);
        setShowRelatedSelector(true);
        
        // Si es empresa, mantenemos los firmantes existentes
        // y esperamos a que seleccione el firmante relacionado
      } else {
        // Para persona natural, la agregamos directamente
        setSelectedFirmantes(prev => [...prev, value]);
        setPredefinedDocuments([]);
      }
      
      setSecondarySigner(null);
    } else {
      // Segundo firmante seleccionado
      if (value.isEmpresa === "S") {
        const related = await fetchRelatedClients(value.id);
        setRelatedClients(related);
        setSecondarySigner(value);
        setShowRelatedSelector(true);
        return; // Esperamos selección de firmante relacionado
      }
      
      // Agregar firmante (persona natural) manteniendo los existentes
      setSelectedFirmantes(prev => {
        // Evitamos duplicados
        if (!prev.some(f => f.id === value.id)) {
          return [...prev, value];
        }
        return prev;
      });
      
      // Cargar documentos del último firmante agregado
      const documents = await fetchPredefinedDocuments(value);
      if (documents) {
        setPredefinedDocuments([
          { id: 1, name: "Mandato", url: `data:application/pdf;base64,${documents.mandato}` },
          { id: 2, name: "Contrato", url: `data:application/pdf;base64,${documents.contrato}` },
          { id: 3, name: "Cotización", url: `data:application/pdf;base64,${documents.cotizacion}` },
        ]);
      }
      
      setSecondarySigner(null);
    }
  };

  const handleAddRelatedSigner = (relatedSigner) => {
    if (!relatedSigner) return;
    
    // Agrega el firmante relacionado manteniendo los existentes
    setSelectedFirmantes(prev => {
      if (!prev.some(f => f.id === relatedSigner.id)) {
        return [...prev, relatedSigner];
      }
      return prev;
    });
    
    // Cargar documentos del firmante relacionado
    fetchPredefinedDocuments(relatedSigner).then(documents => {
      if (documents) {
        setPredefinedDocuments([
          { id: 1, name: "Mandato", url: `data:application/pdf;base64,${documents.mandato}` },
          { id: 2, name: "Contrato", url: `data:application/pdf;base64,${documents.contrato}` },
          { id: 3, name: "Cotización", url: `data:application/pdf;base64,${documents.cotizacion}` },
        ]);
      }
    });
    
    // Resetear estados de selección
    setRelatedClients([]);
    setShowRelatedSelector(false);
    setSecondarySigner(null);
  };

  const fetchPredefinedDocuments = async (firmante) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL_D}/api/documents/generate-documents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firmante }),
      });
      if (!response.ok) throw new Error("Error al generar los documentos");
      return await response.json();
    } catch (error) {
      console.error("Error al obtener los documentos predefinidos:", error);
      return null;
    }
  };

  const handleRemoveFirmante = (firmanteToRemove) => {
    const newSigners = selectedFirmantes.filter(f => f.id !== firmanteToRemove.id);
    setSelectedFirmantes(newSigners);
    
    if (secondarySigner?.id === firmanteToRemove.id) {
      setSecondarySigner(null);
      setPredefinedDocuments([]);
    }
    
    if (newSigners.length === 0) {
      setPrimarySigner(null);
      setShowRelatedSelector(false);
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "flex-start", alignItems: "flex-start", minHeight: "100vh", backgroundColor: "#ffffff", padding: 3 }}>
      <ToastContainer />
      <Grid container spacing={3}>
        {/* Card de Subir Documentos (izquierda) */}
        <Grid item xs={12} md={4}>
          <Card sx={{ width: "100%", boxShadow: 3, height: "100%", backgroundColor: "#F5F5F5" }}>
            <CardContent>
              <Typography variant="h5" sx={{ textAlign: "center", fontWeight: "bold", mb: 2, color: "#E8BA1E" }}>
                Subir Documentos para Firma
              </Typography>

              {/* Área de drag and drop */}
              <Box sx={{ 
                border: "2px dashed #E8BA1E",
                borderRadius: 2,
                p: 3,
                textAlign: "center",
                backgroundColor: "rgba(232, 186, 30, 0.1)",
                cursor: "pointer",
                mb: 2,
                transition: "all 0.3s",
                "&:hover": {
                  backgroundColor: "rgba(232, 186, 30, 0.2)"
                }
              }} 
              onDrop={handleDrop} 
              onDragOver={handleDragOver}
            >
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                Arrastra y suelta archivos aquí
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Formatos aceptados: PDF, DOC, DOCX
              </Typography>
              <input 
                type="file" 
                onChange={handleFileChange} 
                accept=".pdf,.doc,.docx" 
                multiple 
                style={{ display: "none" }} 
                id="file-input" 
              />
              <label htmlFor="file-input">
                <Button 
                  variant="outlined" 
                  component="span" 
                  sx={{ 
                    mt: 2,
                    borderColor: "#E8BA1E",
                    color: "#E8BA1E",
                    "&:hover": {
                      borderColor: "#C99E14"
                    }
                  }}
                >
                  Seleccionar Archivos
                </Button>
              </label>
            </Box>

            {/* Lista de archivos seleccionados */}
            <List sx={{ 
              maxHeight: 300,
              overflowY: "auto",
              border: "1px solid #eee",
              borderRadius: 1,
              mt: 2
            }}>
              {files.map((file, index) => (
                <ListItem 
                  key={index}
                  sx={{
                    borderBottom: "1px solid #f0f0f0",
                    "&:last-child": {
                      borderBottom: "none"
                    }
                  }}
                >
                  <ListItemText 
                    primary={file.name} 
                    primaryTypographyProps={{ 
                      sx: { 
                        fontWeight: 500,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                      } 
                    }}
                  />
                  <ListItemSecondaryAction>
                    <IconButton 
                      edge="end" 
                      onClick={() => handleRemoveFile(index)}
                      sx={{ color: "#ff4444" }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>

            <Typography variant="body1" sx={{ fontWeight: "bold", mb: 1 }}> 
              Seleccione tipo de firma: 
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Button
                variant={selectedType === 'simple' ? 'contained' : 'outlined'}
                onClick={() => {
                  setSelectedType('simple');
                  resetUploadState();
                }}
                sx={{
                  flex: 1,
                  backgroundColor: selectedType === 'simple' ? '#E8BA1E' : 'transparent',
                  color: selectedType === 'simple' ? '#000' : '#E8BA1E',
                  borderColor: '#E8BA1E',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: selectedType === 'simple' ? '#C99E14' : 'rgba(232, 186, 30, 0.1)',
                    borderColor: '#C99E14'
                  }
                }}
              >
                Firma Simple
              </Button>
              <Button
                variant={selectedType === 'multiple' ? 'contained' : 'outlined'}
                onClick={() => {
                  setSelectedType('multiple');
                  resetUploadState();
                }}
                sx={{
                  flex: 1,
                  backgroundColor: selectedType === 'multiple' ? '#E8BA1E' : 'transparent',
                  color: selectedType === 'multiple' ? '#000' : '#E8BA1E',
                  borderColor: '#E8BA1E',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: selectedType === 'multiple' ? '#C99E14' : 'rgba(232, 186, 30, 0.1)',
                    borderColor: '#C99E14'
                  }
                }}
              >
                Firma Múltiple
              </Button>
            </Box>

            {selectedType && (
              <>
                {selectedType === 'simple' ? (
                  <Autocomplete
                    options={clients}
                    getOptionLabel={(option) => option.name}
                    value={selectedClient}
                    onChange={(event, value) => {
                      if (value) handleSimpleClientSelection(value);
                      else setSelectedClient(null);
                    }}
                    renderInput={(params) => (
                      <TextField 
                        {...params} 
                        label="Seleccionar firmante" 
                        variant="outlined" 
                        fullWidth 
                        margin="normal" 
                      />
                    )}
                  />
                ) : (
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Autocomplete
                        options={clients}
                        getOptionLabel={(option) => option.name}
                        value={primarySigner}
                        onChange={(event, value) => {
                          if (value) handleMultipleSelection(value);
                          else {
                            setPrimarySigner(null);
                            setShowRelatedSelector(false);
                          }
                        }}
                        renderInput={(params) => (
                          <TextField 
                            {...params} 
                            label="Seleccionar primer firmante" 
                            variant="outlined" 
                            fullWidth 
                            margin="normal" 
                          />
                        )}
                      />
                    </Grid>

                    {/* Selector para siguiente firmante (solo si no hay empresa pendiente) */}
                    {!showRelatedSelector && selectedFirmantes.length < 2 && (
                      <Grid item xs={12}>
                        <Autocomplete
                          options={clients.filter(c => !selectedFirmantes.some(f => f.id === c.id))}
                          getOptionLabel={(option) => option.name}
                          value={secondarySigner}
                          onChange={(event, value) => {
                            if (value) handleMultipleSelection(value, true);
                            else setSecondarySigner(null);
                          }}
                          renderInput={(params) => (
                            <TextField 
                              {...params} 
                              label="Seleccionar siguiente firmante" 
                              variant="outlined" 
                              fullWidth 
                              margin="normal" 
                            />
                          )}
                        />
                      </Grid>
                    )}

                    {/* Selector especial para firmantes relacionados (aparece cuando se selecciona empresa) */}
                    {showRelatedSelector && (
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
                          Seleccione el firmante relacionado con la empresa
                        </Typography>
                        <Autocomplete
                          options={relatedClients}
                          getOptionLabel={(option) => option.name}
                          onChange={(event, value) => handleAddRelatedSigner(value)}
                          renderInput={(params) => (
                            <TextField 
                              {...params} 
                              label="Firmante relacionado" 
                              variant="outlined" 
                              fullWidth 
                              margin="normal" 
                            />
                          )}
                        />
                      </Grid>
                    )}
                  </Grid>
                )}

                {/* Firmantes seleccionados */}
                {selectedFirmantes.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body1" sx={{ fontWeight: "bold", mb: 1 }}>
                      Firmantes seleccionados:
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {selectedFirmantes.map((firmante) => (
                        <Chip
                          key={firmante.email}
                          label={firmante.name}
                          onDelete={() => handleRemoveFirmante(firmante)}
                          sx={{ backgroundColor: "#E8BA1E", color: "#000" }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}

                {/* Barra de progreso */}
                {isUploading && (
                  <Box sx={{ width: "100%", mt: 2 }}>
                    <LinearProgress variant="determinate" value={uploadProgress} />
                  </Box>
                )}

                {/* Botón para subir documentos */}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleUpload}
                  disabled={
                    files.length === 0 || isUploading || 
                    (selectedType === 'simple' && !selectedClient) ||
                    (selectedType === 'multiple' && selectedFirmantes.length < 2)
                  }
                  sx={{ 
                    backgroundColor: "#E8BA1E", 
                    color: "#000", 
                    fontWeight: 600,
                    "&:hover": { 
                      backgroundColor: "#C99E14",
                      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)"
                    }, 
                    mt: 2,
                    px: 4,
                    py: 1,
                    width: "100%"
                  }}
                >
                  Subir Documentos
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Lista de Documentos Predefinidos (centro) */}
      {(selectedType === 'simple' && selectedClient) || 
      (selectedType === 'multiple' && selectedFirmantes.length > 0) ? (
        <Grid item xs={12} md={4}>
          <Card sx={{ width: "100%", boxShadow: 3, height: "100%" }}>
            <CardContent>
              <Typography variant="h6" sx={{ textAlign: "center", fontWeight: "bold", mb: 2, color: "#E8BA1E" }}>
                Documentos Predefinidos
              </Typography>
              <List>
                {predefinedDocuments.map((doc) => (
                  <ListItemButton
                    key={`${doc.id}-${doc.name}`}
                    onClick={() => handleSelectDocument(doc)}
                    disabled={isDocumentAttached(doc.id)}
                    sx={{ 
                      backgroundColor: selectedDoc === doc.url ? "#f0f0f0" : "inherit", 
                      opacity: isDocumentAttached(doc.id) ? 0.5 : 1 
                    }}
                  >
                    <ListItemText primary={doc.name} />
                  </ListItemButton>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      ) : null}

      {/* Vista Previa del Documento (derecha) */}
      {selectedDoc && (
        <Grid item xs={12} md={4}>
          <Card sx={{ width: "100%", boxShadow: 3, height: "100%" }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" sx={{ textAlign: "center", fontWeight: "bold", mb: 2, color: "#E8BA1E" }}>
                Vista Previa del Documento
              </Typography>
              <iframe 
                src={selectedDoc} 
                title="Vista previa" 
                width="100%" 
                height="500px" 
                style={{ borderRadius: "5px", border: "1px solid #ccc" }} 
              />
            </CardContent>
            <Box sx={{ padding: 2, display: "flex", justifyContent: "center" }}>
              <Button
                variant="contained"
                color="primary"
                sx={{ 
                  backgroundColor: "#E8BA1E", 
                  width: "50%", 
                  color: "#000", 
                  "&:hover": { 
                    backgroundColor: "#C99E14" 
                  } 
                }}
                onClick={handleAttachDocument}
              >
                Adjuntar
              </Button>
            </Box>
          </Card>
        </Grid>
      )}
    </Grid>
  </Box>
  );
};

export default UploadDocuments;
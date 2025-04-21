import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Card, CardContent, Typography, Box, Divider, CircularProgress } from "@mui/material";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
/****************************************************************************/
const ClientSign = () => {
  const [pendingDocuments, setPendingDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [isSigning, setIsSigning] = useState(false);
  const [signedDocuments, setSignedDocuments] = useState([]);
  const [waitingCounterpart, setWaitingCounterpart] = useState(false);
  const userEmail = localStorage.getItem('email');
  const userName = localStorage.getItem('name');
  /****************************************************************************/
  useEffect(() => {
    const originalConsoleError = console.error;
    console.error = (...args) => {
      if (args[0]?.includes('WebSocket connection to') && args[0]?.includes('socket.io')) {
        return;
      }
      originalConsoleError.apply(console, args);
    };
    return () => {
      console.error = originalConsoleError;
    };
  }, []);
  /****************************************************************************/
  const fetchPendingDocuments = async (email) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL_D}/api/pending-documents`, {
        params: { email },
      });
      const validDocuments = await Promise.all(
        response.data.pendingDocuments.map(async (doc) => {
          try {
            const fileExists = await axios.head(
              `${process.env.REACT_APP_API_URL_D}/uploads/${encodeURIComponent(doc.filename)}`
            );
            if (fileExists.status === 200) {
              const isFirmante = doc.firmantes.some(firmante => firmante.email.includes(email));
              return isFirmante ? doc : null;
            }
            return null;
          } catch (error) {
            await axios.post(`${process.env.REACT_APP_API_URL_D}/api/remove-document`, {
              filename: doc.filename,
            });
            return null;
          }
        })
      );
      const filteredDocs = validDocuments.filter((doc) => doc !== null);
      setPendingDocuments(filteredDocs);
      const hasWaiting = filteredDocs.some(doc => 
        doc.firmantes.some(f => f.signed) && 
        !doc.firmantes.every(f => f.signed)
      );
      setWaitingCounterpart(hasWaiting);
    } catch (error) {
      console.error("Error al obtener documentos pendientes", error);
    }
  };
  /****************************************************************************/
  useEffect(() => {
    if (userEmail) {
      fetchPendingDocuments(userEmail);
    }
  }, [userEmail]);
  /****************************************************************************/
  const handleSignDocument = async (filename) => {
    if (!userEmail) {
      toast.warning('Por favor ingrese su correo');
      return;
    }
    /****************************************************************************/
    const doc = pendingDocuments.find(d => d.filename === filename);
    /****************************************************************************/
    if (!doc) {
      toast.error('Documento no encontrado');
      return;
    }
    /****************************************************************************/
    if (signedDocuments.some(d => d.filename === filename)) {
      toast.warning('Ya has firmado este documento');
      return;
    }
    /****************************************************************************/
    setIsSigning(true);
    setSelectedDoc(null); // Deshabilitar inmediatamente
    /****************************************************************************/
    try {
      await axios.head(`${process.env.REACT_APP_API_URL_D}/uploads/${encodeURIComponent(filename)}`);
      const response = await axios.post(`${process.env.REACT_APP_API_URL_D}/api/sign`, {
        filename,
        email: userEmail,
        nombre: userName,
        isSimpleSignature: doc.firmantes.length === 1
      });
      setSignedDocuments([...signedDocuments, { filename, isMulti: doc.firmantes.length > 1 }]);
      if (response.data.allSigned === false) {
        setWaitingCounterpart(true);
        toast.info('Firma registrada. Esperando otras firmas.', {
          onClose: () => window.location.reload()
        });
      } else {
        setWaitingCounterpart(false);
        toast.success('Documento completamente firmado', {
          onClose: () => window.location.reload()
        });
        const pdfUrl = `${process.env.REACT_APP_API_URL_D}/signed/final_${encodeURIComponent(filename)}`;
        window.open(pdfUrl, '_blank');
      }
      await fetchPendingDocuments(userEmail);
    } catch (error) {
      console.error('Error en firma:', error);
      const errorMsg = error.response?.data?.error || 'Error al firmar documento';
      toast.error(`Error: ${errorMsg}`, {
        onClose: () => window.location.reload()
      });
    } finally {
      setIsSigning(false);
    }
  };
  /****************************************************************************/
  return (
    <Box sx={{
      display: "flex",
      flexDirection: { xs: "column", md: "row" },
      justifyContent: "center",
      alignItems: "flex-start",
      gap: 4,
      width: "100%",
      mt: 4,
      p: 2
    }}>
      <ToastContainer autoClose={3000} />
      
      <Card sx={{
        width: { xs: "100%", md: "40%" },
        p: 3,
        boxShadow: 3,
        borderRadius: 3,
        backgroundColor: "#ffffff",
        transition: "all 0.3s ease"
      }}>
        <CardContent>
          <Typography variant="h5" sx={{ 
            textAlign: "center", 
            fontWeight: "bold", 
            mb: 2, 
            color: "#E8BA1E",
            fontSize: "1.5rem"
          }}>
            Documentos Pendientes
          </Typography>
          
          <Typography variant="body1" sx={{ 
            mb: 2, 
            fontSize: 16,
            textAlign: "center",
            color: "#555"
          }}>
            Bienvenido, <strong style={{color: "#E8BA1E"}}>{userName}</strong> ({userEmail})
          </Typography>
          
          <Box sx={{ 
            maxHeight: "400px", 
            overflowY: "auto",
            borderRadius: 2,
            border: "1px solid #eee",
            p: 1
          }}>
            {pendingDocuments.length > 0 ? (
              pendingDocuments.map((doc, index) => (
                <Card key={index} sx={{ 
                  mb: 2, 
                  boxShadow: 2, 
                  borderRadius: 2,
                  backgroundColor: "#fff",
                }}>
                  <CardContent>
                    <Typography variant="body1" sx={{ 
                      fontWeight: "bold", 
                      color: "#333",
                      overflow: "hidden",
                      textOverflow: "ellipsis"
                    }}>
                      {doc.filename}
                    </Typography>
                    <Divider sx={{ my: 1, borderColor: "#eee" }} />
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography variant="caption" sx={{ color: "#666" }}>
                        {doc.firmantes.length > 1 ? "Multifirma" : "Firma simple"}
                      </Typography>
                      <Button 
                        variant="contained" 
                        sx={{ 
                          backgroundColor: "#E8BA1E", 
                          color: "#000", 
                          "&:hover": { backgroundColor: "#C99E14" },
                          "&:disabled": { opacity: 0.7 }
                        }} 
                        onClick={() => setSelectedDoc(doc.filename)}
                        disabled={
                          doc.firmantes.some(f => f.email === userEmail && f.signed) ||
                          isSigning
                        }
                      >
                        {doc.firmantes.some(f => f.email === userEmail && f.signed) ? "Ya firmado" : "Ver"}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Box sx={{ 
                textAlign: "center", 
                p: 3,
                backgroundColor: "#f9f9f9",
                borderRadius: 2
              }}>
                <Typography variant="body1" sx={{ 
                  color: "#666",
                  fontStyle: "italic"
                }}>
                  {waitingCounterpart 
                    ? "Pendiente de firma por la contraparte" 
                    : "No hay documentos pendientes"}
                </Typography>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>

      {selectedDoc && (
        <Card sx={{
          width: { xs: "100%", md: "55%" },
          boxShadow: 3,
          borderRadius: 3,
          backgroundColor: "#ffffff",
          transition: "all 0.3s ease"
        }}>
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography variant="h6" sx={{ 
              textAlign: "center", 
              fontWeight: "bold", 
              mb: 2, 
              color: "#E8BA1E",
              fontSize: "1.3rem"
            }}>
              Vista Previa del Documento
            </Typography>
            <iframe
              src={`${process.env.REACT_APP_API_URL_D}/uploads/${encodeURIComponent(selectedDoc)}`}
              title="Vista previa"
              width="100%"
              height="500px"
              style={{ 
                borderRadius: "8px", 
                border: "1px solid #ddd",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
              }}
            />
          </CardContent>
          <Box sx={{ 
            p: 2, 
            display: "flex", 
            justifyContent: "center",
            borderTop: "1px solid #eee"
          }}>
            <Button 
              variant="contained" 
              sx={{ 
                backgroundColor: "#E8BA1E",
                color: "#000", 
                width: "50%",
                "&:hover": { backgroundColor: "#C99E14" },
                "&:disabled": { 
                  backgroundColor: "#eeeeee",
                  color: "#999"
                }
              }} 
              onClick={() => handleSignDocument(selectedDoc)} 
              disabled={
                isSigning || 
                pendingDocuments
                  .find(d => d.filename === selectedDoc)
                  ?.firmantes
                  ?.some(f => f.email === userEmail && f.signed)
              }
            >
              {isSigning ? (
                <>
                  <CircularProgress size={24} sx={{ color: "#000", mr: 1 }} />
                  Firmando...
                </>
              ) : (
                "Firmar Documento"
              )}
            </Button>
          </Box>
        </Card>
      )}
    </Box>
  );
};

export default ClientSign;
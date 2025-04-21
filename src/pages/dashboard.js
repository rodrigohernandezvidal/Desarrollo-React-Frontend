import React, { useState, useEffect } from 'react';
import { Grid, Card,IconButton, CardContent, TextField,Paper,Typography,Modal,Button ,Stack , List,Box,ListItem,Tabs, Tab,Drawer,ListItemText,ListItemAvatar} from '@mui/material';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import 'react-calendar/dist/Calendar.css';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import AttachMoneySharpIcon from '@mui/icons-material/AttachMoneySharp';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import Axios from 'axios';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import EditIcon from '@mui/icons-material/Edit'
import { ULMensajes } from '../styles/ULMensajes';
import { LiMensajes } from '../styles/ULMensajes';
import CloseIcon from "@mui/icons-material/Close";
import ChatComponent from "../components/chat/chatComponent";
import AvatarWithBadge from '../styles/avatarWithBadge';
import socket from "../service/socket";
import NotificationToast from '../components/notification/notificationToast';
import AvatarWithNotification from '../styles/avatarWithNotification';
import NotificationsModal from '../components/notification/notificationsModal';
import SendNotificationModal from '../components/notification/sendNotificationModal';
import { useNotifications } from '../context/notificationContext';

// Registrar los elementos de Chart.js necesarios
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,   // Para gráfico de líneas
    LineElement,    // Asegúrate de registrar el LineElement
    Title,
    Tooltip,
  Legend
);
/*******************************************************/
const Dashboard = () => {
    const [activeUsers, setActiveUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isConnected, setIsConnected] =  useState(true);
    const [nuevoMensaje, setNuevoMensaje] = useState('');
    const [mensajes, setMensajes] = useState([]);
    const [tabIndex, setTabIndex] = useState(0);
    const [weather, setWeather] = useState(null);
    const [time, setTime] = useState(new Date());
    const [currency, setCurrency] = useState(null);
    const [isChatModalOpen, setIsChatModalOpen] = useState(false);
    const [unreadMessages, setUnreadMessages] = useState(0);
    const [conversaciones, setConversaciones] = useState({}); 
    const {notifications, hasNotification, addNotification,setHasNotification,setNotifications} = useNotifications();
    const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
    const [isSendNotificationModalOpen, setIsSendNotificationModalOpen] = useState(false);

    //const userEmail = localStorage.getItem('email');
    const userName = localStorage.getItem('name');
    const userId = localStorage.getItem('id');
    const userAvatar = localStorage.getItem('avatar');
  
  
/*******************************************************/
    // Asegúrate de que el estado de las notificaciones no se reinicie
    useEffect(() => {
        console.log(unreadMessages)
    }, [notifications,unreadMessages]);
/*******************************************************/
    const handleSendNotification = (message) => {
        addNotification(message, userId); // Cambia "Admin" por el remitente real
        setHasNotification(true);
    };
/*******************************************************/
    // Escuchar notificaciones
    useEffect(() => {
      socket.on('receive_notification', (data) => {
          addNotification(data, data.sender);
      });
      return () => {
        socket.off('receive_notification'); // Limpiar el listener al desmontar
      };
    }, [addNotification]);
/*******************************************************/
    // Función para abrir el modal de chat privado
    const handleOpenChatModal = (user) => {
        setSelectedUser(user);
        setIsChatModalOpen(true);
        // Resetear el contador de mensajes no leídos para este usuario
        setConversaciones((prevConversaciones) => ({
          ...prevConversaciones,
          [user.id]: {
              ...prevConversaciones[user.id],
              unreadMessages: 0, // Resetear a 0
          },
        }));
    };
/*******************************************************/
    // Función para cerrar el modal de chat privado
    const handleCloseChatModal = () => {
        setIsChatModalOpen(false); // Cerrar el modal
      setSelectedUser(null); // Limpiar el usuario seleccionado
    };
/*******************************************************/  
    useEffect(() => {// Obtener los usuarios activos desde el backend
        const fetchActiveUsers = async () => {
        try {const response = await Axios.get(process.env.REACT_APP_API_URL_D+'/api/active-users', {
                headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
             });
             setActiveUsers(response.data); // Establecer los usuarios activos
            } catch (error) {
              console.error("Error al obtener los usuarios activos", error);
          }
        };
        fetchActiveUsers();
    }, []);
/*******************************************************/
    const fetchWeather = async () => {
        try { const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=-33.4489&longitude=-70.6693&current_weather=true');
            if (!response.ok) {
                throw new Error('Weather data fetch failed');
              }
              const data = await response.json();
              setWeather(data.current_weather.temperature); // Cambié temp_c por temperature
            } catch (error) {
              console.error('Error fetching weather:', error);
               setWeather(null); // Set to null in case of error
            }
    };
/*******************************************************/
    const fetchCurrency = async () => {
        try { const response = await fetch('https://cl.dolarapi.com/v1/cotizaciones/usd');
            if (!response.ok) {
                throw new Error('Currency data fetch failed');
            }
            const data = await response.json();
            const compra = parseFloat(data.compra);
            setCurrency(compra);  // Usamos el valor de compra del dólar en pesos chilenos
          } catch (error) {
            console.error('Error fetching currency:', error);
            setCurrency(null); // Set to null in case of error
          }
    };
/*******************************************************/
    useEffect(() => {
        fetchWeather();
        fetchCurrency();
        const interval = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);
/*******************************************************/
    const lineData = {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
        datasets: [{
                label: 'Ventas',
                data: [30, 40, 35, 50, 49],
                borderColor: '#42A5F5',
                backgroundColor: 'rgba(66, 165, 245, 0.2)',
        },{
          label: 'Usuarios Registrados',
          data: [20, 30, 25, 40, 50],
          borderColor: '#66BB6A',
          backgroundColor: 'rgba(102, 187, 106, 0.2)',
        },],
    };
/*******************************************************/
    const handleChange = (event, newIndex) => {
        setTabIndex(newIndex);
    };
/*******************************************************/
    useEffect(()=>{
        socket.on('connect', ()=> setIsConnected(false)); 
        //('Conectado al servidor de socket.io');    
        socket.on('chat_message', (data) =>{
            setMensajes(mensajes => [...mensajes, data]); 
        });
        return () => {
            socket.off('connect');
            socket.off('chat_message');
        }
    },[]);
/*******************************************************/
    const enviarMensaje = () =>{
        socket.emit('chat_message',{
            usuario: userName,
            mensaje: nuevoMensaje
        });
        setNuevoMensaje('');
    }
/*******************************************************/
    const enviarMensajePrivado = (mensaje) => {
      if (!selectedUser) {
        console.error("No hay un usuario seleccionado para enviar el mensaje.");
        return;
      }
      if (typeof mensaje !== "string" || !mensaje.trim()) {
        console.error("El mensaje no es válido:", mensaje);
        return;
      }
      const nuevoMensaje = {
        remitente: userId,
        destinatario: selectedUser.id,
        mensaje: mensaje,
        usuario: userName,
      };
      setConversaciones((prevConversaciones) => ({
        ...prevConversaciones,
        [selectedUser.id]: {
          mensajes: [...(prevConversaciones[selectedUser.id]?.mensajes || []), nuevoMensaje],
          unreadMessages: prevConversaciones[selectedUser.id]?.unreadMessages || 0,
        },
      }));
      socket.emit("private_message", nuevoMensaje);
      setNuevoMensaje("");
    };
/*******************************************************/
    useEffect(() => {
        if (userId) {
            socket.emit('register_user', userId); // Registrar el usuario en el servidor
        }
        socket.on("private_message", (data) => {
          setConversaciones((prevConversaciones) => {
             const updatedConversaciones = { ...prevConversaciones, [data.remitente]: { mensajes: [...(prevConversaciones[data.remitente]?.mensajes || []), data], unreadMessages: (prevConversaciones[data.remitente]?.unreadMessages || 0) + 1,},};
             return updatedConversaciones;
          });
          if (!isChatModalOpen) {
            setUnreadMessages((count) => count + 1);
          }
      });
      return () => {
        socket.off("private_message");
      };
    }, [userId, isChatModalOpen]);
/*******************************************************/
  return (
      <Box sx={{ flexGrow: 1, p: 2,  overflowY: 'auto', maxHeight: 'calc(100vh - 64px)'  }}>
          {/* Notificaciones emergentes */}
          {notifications.map((notif) => (
              <NotificationToast
                  key={notif.id}
                  message={notif}
                  onClose={() => {console.log("Notificación cerrada:", notif.id);}}
              />
            ))}
              <Box sx={{ display: 'flex' }}>
                  <Drawer
                      variant="permanent"
                      sx={{flexShrink: 0,'& .MuiDrawer-paper': { width: 300, boxSizing: 'border-box', p: 2, position: 'relative', maxHeight: 'calc(92vh - 64px)', overflowY: 'auto', },}}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <Box sx={{ display: "flex", alignItems: "center", backgroundColor: "white",  padding: 2, borderRadius: 2, boxShadow: 3, maxWidth: 300, }}>
                                  <IconButton onClick={() => setIsNotificationsModalOpen(true)} sx={{ padding: 0 }}>
                                            <AvatarWithNotification src={userAvatar} hasNotification={hasNotification}  notificationCount={notifications} sx={{ width: 50, height: 50 }}/>
                                  </IconButton>
                            </Box>  
                            <Box sx={{ ml: 2 }}>
                                  <Typography variant="subtitle1" align="center"sx={{ fontWeight: "bold", color: "#1E3A8A" }}>{userName}</Typography>
                            </Box>
                      </Box>
                      <Box sx={{ width: 250, backgroundColor: "white", padding: 2, borderRadius: 2,  boxShadow: 3,}}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", color: "#1E3A8A" }}>{isConnected ? "Usuarios Conectados" : "Usuarios No Conectados"}</Typography>
                            <List>  
                                {activeUsers.map((user, index) => (
                                    <ListItem key={index} sx={{ borderBottom: "1px solid #E0E0E0", "&:hover": { backgroundColor: "#F5F5F5", cursor: "pointer" }, padding: "10px", }} onClick={() => handleOpenChatModal(user)}>
                                        <ListItemAvatar sx={{ position: 'relative' }}>
                                            <AvatarWithBadge src={user.avatar} hasNewMessage={conversaciones[user.id]?.unreadMessages > 0} // Verifica si hay mensajes no leídos
                                            unreadCount={conversaciones[user.id]?.unreadMessages || 0}/>
                                        </ListItemAvatar>
                                        <ListItemText primary={user.name} sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontWeight: "bold", color: "#333",}} />
                                    </ListItem>
                                  ))}
                            </List>
                      </Box>
                      <div>
                        <Box mt={2}>
                            <Paper elevation={3} sx={{ padding: 2 }}>
                                <Typography variant="h6"sx={{ mb: 2, fontWeight: "bold", color: "#1E3A8A" }}>Chat Principal</Typography>
                                {/* Mostrar mensajes */}
                                <Box sx={{ maxHeight: 300, overflowY: "auto", borderBottom: "1px solid #ccc", paddingBottom: 2, marginBottom: 2, }}>
                                    <ULMensajes>  
                                        {Array.isArray(mensajes) && mensajes.map((mensaje, index) => ( // Aquí defines `index`
                                            <Box key={`${mensaje.usuario}-${mensaje.mensaje}-${index}`} mb={1}>
                                                  <Typography variant="body2" color="textSecondary">
                                                      <LiMensajes>
                                                          <strong>{mensaje.usuario}:</strong> {mensaje.mensaje}
                                                      </LiMensajes>
                                                  </Typography>
                                            </Box>
                                          ))}
                                    </ULMensajes>
                                </Box>
                                {/* Campo de texto para escribir mensajes */}
                                <TextField label="Escribe un mensaje" variant="outlined" fullWidth value={nuevoMensaje} onChange={e => setNuevoMensaje(e.target.value)} sx={{ marginBottom: 2 }} />
                                {/* Botón de enviar mensaje */}
                                <Button variant="contained" onClick={enviarMensaje} fullWidth> Enviar </Button>
                            </Paper>
                        </Box>
                      </div>
                  </Drawer>
                  <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto', maxHeight: 'calc(100vh - 64px)' }}>
                      <Grid container spacing={3}>
                          <Grid item xs={12} sm={6}>
                              <Card sx={{
                                        background: 'rgba(30, 136, 229, 0.8)',
                                        backdropFilter: 'blur(10px)',
                                        color: 'white',
                                        borderRadius: 3,
                                        boxShadow: 5,
                                        transition: 'transform 0.3s ease-in-out',
                                        '&:hover': { transform: 'scale(1.05)' }
                                      }}>
                                      <CardContent>
                                          <Typography variant="h6" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                              <AccessTimeIcon sx={{ fontSize: 24, mb: 1, opacity: 0.8 }} /> Control de acceso
                                          </Typography>
                                          <Typography variant="body1" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' ,opacity: 0.9 }}>
                                              {time.toLocaleDateString()} | {time.toLocaleTimeString()}
                                          </Typography>
                                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                                              <Button variant="contained" color="success" size="medium"> Entrada </Button>
                                              &nbsp;&nbsp;
                                              <Button variant="contained" color="error" size="medium"> Salida </Button>
                                         </Box>
                                      </CardContent>
                              </Card>
                          </Grid>
                          <Grid item xs={12} sm={3}>
                              <Card sx={{
                                      background: 'rgba(232, 186, 30, 0.8)',
                                      backdropFilter: 'blur(10px)',
                                      color: 'white',
                                      borderRadius: 3,
                                      boxShadow: 5,
                                      textAlign: 'center',
                                      transition: 'transform 0.3s ease-in-out',
                                      '&:hover': { transform: 'scale(1.05)' }
                                    }}>
                                    <CardContent>
                                        <Typography variant="h6" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            {weather <= 10 ? <AcUnitIcon sx={{ fontSize: 24, color: 'blue' }} />
                                              : weather <= 25 ? <WbSunnyIcon sx={{ fontSize: 24, color: 'orange' }} />
                                              : <WbSunnyIcon sx={{ fontSize: 24, color: 'red' }} />}
                                              &nbsp;Temperatura
                                        </Typography>
                                        <Typography variant="h4" sx={{ mt: 1, fontWeight: 'bold' }}>
                                            {weather !== null ? `${weather}°C` : 'Cargando...'}
                                        </Typography>
                                    </CardContent>
                              </Card>
                          </Grid>
                          <Grid item xs={12} sm={3}>
                              <Card sx={{
                                      background: 'rgba(11, 102, 35, 0.8)',
                                      backdropFilter: 'blur(10px)',
                                      color: 'white',
                                      borderRadius: 3,
                                      boxShadow: 5,
                                      textAlign: 'center',
                                      transition: 'transform 0.3s ease-in-out',
                                      '&:hover': { transform: 'scale(1.05)' }
                                    }}>
                                    <CardContent>
                                        <Typography variant="h6">
                                            <AttachMoneySharpIcon sx={{ fontSize: 24, color: 'lightgreen' }} /> USD
                                        </Typography>
                                        <Typography variant="h4" sx={{ mt: 1, fontWeight: 'bold' }}>
                                            ${currency}
                                        </Typography>
                                    </CardContent>
                              </Card>
                          </Grid>       
                      </Grid>
                      <br></br>
                      {/* Fila 2: Una tarjeta en una columna */}
                      <Grid item xs={12}>
                            <Card sx={{
                                      padding: 3,
                                      background: "rgba(30, 58, 138, 0.85)",
                                      borderRadius: 3,
                                      boxShadow: 10,
                                      backdropFilter: "blur(15px)",
                                      transition: "transform 0.3s ease-in-out",
                                      "&:hover": { transform: "scale(1.02)" },
                                    }}>
                                    <CardContent>
                                        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#FACC15" }}>📌 Información Importante</Typography>
                                        <Typography variant="body1" sx={{ mt: 1, color: "white", opacity: 0.8 }}>Aquí puedes colocar información adicional sobre el estado del sistema o cualquier otra cosa relevante.</Typography>
                                        <Tabs
                                            value={tabIndex}
                                            onChange={handleChange}
                                            centered
                                            sx={{
                                              mt: 2,
                                              "& .MuiTabs-indicator": { backgroundColor: "#FACC15" },
                                              "& .MuiTab-root": {
                                                    color: "white",
                                                    fontWeight: "bold",
                                                    fontSize: "1rem",
                                                    "&.Mui-selected": { color: "#FACC15" },
                                                    transition: "0.3s",
                                                    "&:hover": { color: "#FFF150" },
                                              },
                                            }}>
                                            <Tab label="Resumen" />
                                            <Tab label="Memorandos" />
                                            <Tab label="Bitácora" />
                                        </Tabs>
                                        <Box sx={{ p: 3, background: "rgba(255, 255, 255, 0.15)", borderRadius: 3, mt: 2 }}>
                                            {tabIndex === 0 && <Typography variant="body1" sx={{ color: "white" }}>📊 Contenido del Resumen</Typography>}
                                            {tabIndex === 1 && <Typography variant="body1" sx={{ color: "white" }}>📑 Contenido de Reportes</Typography>}
                                            {tabIndex === 2 && <Typography variant="body1" sx={{ color: "white" }}>⚙️ Configuración</Typography>}
                                        </Box>
                                    </CardContent>
                            </Card>
                      </Grid>
                      {/* Fila 3: Dos gráficos en dos columnas */}
                      <Grid container spacing={3} sx={{ marginTop: 3 }}>
                          <Grid item xs={12} sm={6}>
                              <Card>
                                <CardContent>
                                    <Typography variant="h6" color="textSecondary" gutterBottom> Comparativa de Ventas y Usuarios </Typography>
                                    <Line data={lineData} options={{ responsive: true }} />
                                </CardContent>
                              </Card>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                              <Card sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                  <CardContent>
                                      <Stack direction="row" spacing={2} justifyContent="center">
                                          <Button variant="contained" color="primary"> Solicitud Vacaciones </Button>
                                          <Button variant="contained" color="secondary"> Cambio de Contraseña </Button>
                                          <Button variant="contained" color="warning"> Solicitud RR.HH </Button>
                                      </Stack>
                                  </CardContent>
                              </Card>
                              <br></br>
                              <Card sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                  <CardContent>
                                      <Stack direction="row" spacing={2} justifyContent="center">
                                            <Button variant="contained" sx={{ backgroundColor: '#4CAF50', color: 'white' }}> Solicitud Soporte </Button>
                                            <Button variant="contained" sx={{ backgroundColor: '#1E88E5', borderColor: '#E8BA1E' }}> Rep. control acceso </Button>
                                            <Button variant="contained" sx={{ backgroundColor: "#E8BA1E", color: "black", '&:hover': { backgroundColor: "#D1A618" } }}>Liquidaciones sueldo</Button>
                                      </Stack>
                                  </CardContent>
                              </Card>
                          </Grid>
                      </Grid>
                      {/* <ul>
                      {notifications.map((notification, index) => (
                      <li key={index}>{notification.mensaje} - {notification.timestamp}</li>
                      ))}
                      </ul>*/}
                      <Button variant="contained" sx={{ backgroundColor: '#4CAF50', color: 'white' }}>Crear Factura</Button>
                      <Button onClick={() => setIsSendNotificationModalOpen(true)}>Enviar Notificación </Button>
                      <Button variant="outlined" sx={{ color: '#E8BA1E', borderColor: '#E8BA1E' }}> Reportes </Button>         
                      <Button variant="outlined" sx={{ color: 'gray', borderColor: 'gray' }}> Filtrar </Button>
                      <Button variant="outlined" endIcon={<ArrowDropDownIcon />} sx={{ color: '#E8BA1E' }}> Opciones </Button>
                      <IconButton sx={{ color: '#E8BA1E' }}><EditIcon /></IconButton>
                  </Box>             
      </Box>
      {/* Modal de chat privado */}
      <Modal
        open={isChatModalOpen}
        onClose={handleCloseChatModal}
        aria-labelledby="chat-privado-modal"
        aria-describedby="chat-privado-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 2,
            p: 2,
          }}>
          <IconButton onClick={handleCloseChatModal} sx={{ position: 'absolute', top: 8, right: 8 }}>
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" sx={{ mb: 2 }}> Chat con {selectedUser?.name} </Typography>
          {selectedUser && (
            <ChatComponent
              mensajes={Array.isArray(conversaciones[selectedUser.id]?.mensajes) ? conversaciones[selectedUser.id].mensajes : []}
              nuevoMensaje={nuevoMensaje}
              setNuevoMensaje={setNuevoMensaje}
              enviarMensajePrivado={enviarMensajePrivado}
              isPrivate={true}
            />
          )}
        </Box>
      </Modal>
      {/* Modal de notificaciones */}
      <NotificationsModal
        open={isNotificationsModalOpen}
        onClose={() => setIsNotificationsModalOpen(false)}
        notifications={notifications}
        setNotifications={setNotifications}
      />
      {/* Modal para enviar notificaciones */}
      <SendNotificationModal
        open={isSendNotificationModalOpen}
        onClose={() => setIsSendNotificationModalOpen(false)}
        onSend={handleSendNotification}
      />
    </Box>
  );
};
export default Dashboard;

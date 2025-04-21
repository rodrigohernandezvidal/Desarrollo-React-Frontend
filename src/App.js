import React, { createContext, useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import Layout from './layouts/layout';
import BillingComponent from './pages/billing';
import IncomeComponent from './pages/income';
import ProfileComponent from './pages/profile';
import AdvancedSignature from './pages/uploadDocuments';
import Signature from './pages/clientSign';
import ClientPage from './pages/client';
import Purchases from './pages/purchases';
import Providers from './pages/providers';
import Surrender from './pages/surrender';
import CostCenter from './pages/costCenterPage'
import AccountPlan from './pages/accountPlanPage';
import ChatBubble from './components/chat/chatBubble';
import ChatComponent from './components/chat/chatComponent';
import { io } from 'socket.io-client';
import { jwtDecode } from 'jwt-decode';
import BotAsistente from './components/bot/botAsistente';
import { NotificationProvider } from './context/notificationContext';
import NotificationToast from './components/notification/notificationToast';

export const AppContext = createContext();

const socket = io(process.env.REACT_APP_API_URL_D);

const App = () => {
    
    const [user, setUser] = useState(null);
    const [showChat, setShowChat] = useState(false);
    const [mensajes, setMensajes] = useState([]);
    const [nuevoMensaje, setNuevoMensaje] = useState(""); 
    const [nuevoMensajeRecibido, setNuevoMensajeRecibido] = useState(false);
    const [currentPage, setCurrentPage] = useState('');
    const [currentPageBot, setCurrentPageBot] = useState('');
    const location = useLocation();
    /***************************************************************************/
    const currentYear = new Date().getFullYear();
    const companyInfo = {
        name: 'LBO Abogados',
        address: 'Avenida Andres Bello 2777, Oficina 1001, Las Condes, Santiago Chile',
        phone: '+56 9 33884999',
        rutEmisor: '77.777.777-7',
        razonsocialEmpresa: 'LEGAL AND BUSINESS OPERATIONS LIMITADA',
        giroEmpresa: 'Asesoria Legal',
        web: 'www.lbo.cl'
    };
    /***************************************************************************/
    const templateId = {
        billing: '00877b23b9e4e7ca',
        exenta: 'b5577b23b6c836ca'
    };
    /***************************************************************************/
    // Decodificar el token y establecer el usuario
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode(token); // Decodificar el token
            console.log("Token decodificado:", decoded);
            setUser({
                name: decoded.name, // Nombre del usuario
                avatar: decoded.avatar, // Avatar del usuario
                id: decoded.id,
            });
        }
    }, []);
    /***************************************************************************/
    // Controlamos la visibilidad del chat en función de la ruta actual
    useEffect(() => {
        setCurrentPage(location.pathname);
        if (location.pathname === '/dashboard'|| location.pathname === '/') {
            setShowChat(false); // Ocultamos el chat en el dashboard
        } else {
            setShowChat(true); // Mostramos el chat en otras páginas
        }
    }, [location.pathname]);
    /***************************************************************************/
    // Controlamos el posicionamiento del bot en el portal
    useEffect(() => {
        setCurrentPageBot(location.pathname);
    }, [location.pathname]);
    /***************************************************************************/
    // Lógica del chat con socket.io
    useEffect(() => {
        const handleNewMessage = (data) => {
          setMensajes((mensajes) => [...mensajes, data]);
          setNuevoMensajeRecibido(true); // Activar el estado de mensaje nuevo
      
          // Restablecer el estado después de un tiempo
          const timeout = setTimeout(() => {
            setNuevoMensajeRecibido(false);
          }, 3000); // Restablecer después de 3 segundos
      
          return () => clearTimeout(timeout); // Limpiar el timeout
        };
      
        socket.on("chat_message", handleNewMessage);
      
        return () => {
          socket.off("chat_message", handleNewMessage);
        };
      }, []);
      /***************************************************************************/
    const enviarMensaje = () => {
        socket.emit("chat_message", {
            usuario: user?.name || "Usuario Anónimo", // Usa el nombre del usuario si está disponible
            mensaje: nuevoMensaje,
        });
        setNuevoMensaje("");
    };
    return (
      <NotificationProvider>
        <AppContext.Provider value={{ user, setUser, currentYear, companyInfo, templateId, currentPageBot,currentPage, setCurrentPageBot }}>
                {/*{location.pathname !== "/login" && <NotificationToast />}*/}
                <Routes>
                    <Route path="/" element={<Layout><Login /></Layout>} />
                    <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
                    <Route path="/billing" element={<Layout><NotificationToast/><BillingComponent /></Layout>} />
                    <Route path="/income" element={<Layout><IncomeComponent /></Layout>} />
                    <Route path="/profile" element={<Layout><ProfileComponent /></Layout>} />
                    <Route path="/client" element={<Layout><ClientPage /></Layout>} />
                    <Route path="/uploadDocuments" element={<Layout><AdvancedSignature /></Layout>} />
                    <Route path="/clientSign" element={<Layout><Signature /></Layout>} />
                    <Route path="/purchases" element={<Layout><Purchases /></Layout>} />
                    <Route path="/providers" element={<Layout><Providers /></Layout>} />
                    <Route path="/surrender" element={<Layout><Surrender /></Layout>} />
                    <Route path="/accountPlanPage" element={<Layout><AccountPlan /></Layout>} />
                    <Route path="/costCenterPage" element={<Layout><CostCenter /></Layout>} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
                <BotAsistente />
                {showChat && (
                    <ChatBubble nuevoMensajeRecibido={nuevoMensajeRecibido}>
                        <ChatComponent
                        mensajes={mensajes}
                        nuevoMensaje={nuevoMensaje}
                        setNuevoMensaje={setNuevoMensaje}
                        enviarMensaje={enviarMensaje}
                        isPrivate={false} // Añade esto si es necesario
                        />
                    </ChatBubble>
                    )}
        </AppContext.Provider>
     </NotificationProvider>        

    );
};

export default App;

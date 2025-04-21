/*import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const useSocket = () => {
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const socketInstance = io(process.env.REACT_APP_API_URL_D , {
            transports: ['websocket'],
            withCredentials: true, // Forzar el uso de WebSocket
        });

        setSocket(socketInstance);

        socketInstance.on('connect', () => {
            console.log('Socket connected');
            setIsConnected(true);
        });

        socketInstance.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
            setIsConnected(false);
        });

        socketInstance.on('disconnect', (reason) => {
            console.log('Socket disconnected:', reason);
            setIsConnected(false);
        });

        socketInstance.on('receive_message', (message) => {
            setMessages((prevMessages) => {
                return Array.isArray(prevMessages) ? [...prevMessages, message] : [message];
            });
        });

        return () => {
            socketInstance.disconnect();
            console.log('Socket disconnected on unmount');
        };
    }, []);

    const sendMessage = (message) => {
        if (socket && isConnected) {
            socket.emit('send_message', message);
        } else {
            console.error('Socket no está conectado');
        }
    };

    return { messages, sendMessage, isConnected };
};

export default useSocket;*/
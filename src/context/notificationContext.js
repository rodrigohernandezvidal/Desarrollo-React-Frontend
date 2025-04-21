import React, { createContext, useState, useContext, useEffect } from "react";
import socket from "../service/socket";
const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [newnotifications, setNewNotifications] = useState([]);
  const [notifications, setNotifications] = useState([]); 
  /****************************************************/
  const addNotification = (message, sender) => {
    console.log("Adding notification:", message);
    console.log(sender)
    const newNotification = {
      id: Date.now(),
      
      message,
      sender,
      timestamp: new Date().toLocaleDateString(),
    };
    /****************************************************/
    setNotifications((prev) => {
      const updatedNotifications = [...prev, newNotification];
      console.log("Updated notifications:", updatedNotifications); // Depuración
      return updatedNotifications;
    });
  };
  /****************************************************/
  const removeNotification = (id) => {
    console.log(newnotifications)// eliminar si no es necesario
    setNewNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };
  /****************************************************/
  useEffect(() => {
    // Escuchar notificaciones del backend
    socket.on("receive_notification", (data) => {
      console.log(data)
      addNotification(data);
    });
    return () => {
      socket.off("receive_notification");
    };
  }, []);
  /****************************************************/
  return (
    <NotificationContext.Provider 
      value={{
        notifications,
        addNotification,
        removeNotification,
        setNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  return useContext(NotificationContext);
};
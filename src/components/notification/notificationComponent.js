import { useEffect } from "react";
import socket from "../../service/socket";

const registerUser = (userId) => {
  if (userId) {
    socket.emit("register_user", userId); //  Registra el usuario en el backend
  }
};

const unregisterUser = (userId) => {
  if (userId) {
    socket.emit("unregister_user", userId);
  }
};

const NotificationComponent = ({ userId }) => {
  useEffect(() => {
    registerUser(userId);

    return () => {
      unregisterUser(userId);
    };
  }, [userId]); // Se ejecuta cuando userId cambia

  return null; // No necesita renderizar nada, solo registrar el usuario
};

export default NotificationComponent;

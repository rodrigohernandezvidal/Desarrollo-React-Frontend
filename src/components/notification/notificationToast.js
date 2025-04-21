import React, { useState, useEffect } from "react";
import { Snackbar, Alert } from "@mui/material";
import { useNotifications } from "../../context/notificationContext";

const NotificationToast = () => {
  const { notifications } = useNotifications();
  const [openAlerts, setOpenAlerts] = useState({});

  // Manejar nuevas notificaciones y asegurarse de que se abran correctamente
  useEffect(() => {
    const newAlerts = {};
    notifications.forEach((notif) => {
      if (!(notif.id in openAlerts)) {
        newAlerts[notif.id] = true;
      }
    });
    if (Object.keys(newAlerts).length > 0) {
      setOpenAlerts((prev) => ({ ...prev, ...newAlerts }));
    }
  }, [openAlerts,notifications]);

  const handleClose = (id) => {
    setOpenAlerts((prev) => ({ ...prev, [id]: false }));
  };

  return (
    <>
      {notifications.map((notif) => (
        <Snackbar
          key={notif.id}
          open={openAlerts[notif.id] || false}
          autoHideDuration={6000} // Cierra automáticamente en 6 segundos
          onClose={() => handleClose(notif.id)}
          anchorOrigin={{ vertical: "top", horizontal: "left" }}
        >
          <Alert
            onClose={() => handleClose(notif.id)}
            severity="info"
            sx={{
              backgroundColor: "#e8f5e9",
              color: "#2e7d32",
            }}
          >
            {notif.message.mensaje}
          </Alert>
        </Snackbar>
      ))}
    </>
  );
};

export default NotificationToast;

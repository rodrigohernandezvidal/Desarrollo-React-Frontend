import React from "react";
import { Badge, Avatar } from "@mui/material";

const AvatarWithNotification = ({ src, notificationCount }) => {
    const unreadCount = notificationCount.filter((notif) => !notif.isRead).length;
  return (
    <Badge
      color="secondary"
      badgeContent={unreadCount} // 🔹 Muestra el número de notificaciones no leídas
      overlap="circular"
      invisible={!unreadCount} // 🔹 Oculta el badge si no hay notificaciones
      sx={{
        "& .MuiBadge-badge": {
          backgroundColor: "#9c27b0", // Morado
          animation: "pulse 1.5s infinite", // 🔹 Agrega una animación de pulso
          top: 10, // 🔹 Ajusta la posición vertical del badge
          right: -15, // 🔹 Ajusta la posición horizontal del badge
          ml: 2 ,
        },
        "@keyframes pulse": {
          "0%": { transform: "scale(0.95)", boxShadow: "0 0 0 0 rgba(156, 39, 176, 0.7)" },
          "70%": { transform: "scale(1)", boxShadow: "0 0 0 10px rgba(156, 39, 176, 0)" },
          "100%": { transform: "scale(0.95)", boxShadow: "0 0 0 0 rgba(156, 39, 176, 0)" },
        },
      }}
    >
      <Avatar src={src} />
    </Badge>
  );
};

export default AvatarWithNotification;
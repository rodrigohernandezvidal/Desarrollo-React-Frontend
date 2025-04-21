import React from "react";
import { Badge } from "@mui/material";
import AnimatedAvatar from "./animatedAvatar";

const AvatarWithBadge = ({ src, hasNewMessage, unreadCount }) => {
  return (
    <Badge
      badgeContent={hasNewMessage ? unreadCount : null} // Número de mensajes no leídos
      color="primary" // Color del badge
      overlap="circular" // Asegura que el badge se superponga correctamente
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <AnimatedAvatar src={src} hasNewMessage={hasNewMessage} />
    </Badge>
  );
};

export default AvatarWithBadge;
import socket from "./socket";
export const sendNotification = (destinatario, mensaje) => {
    console.log("Enviando notificación a:", destinatario, "con mensaje:", mensaje); // 🔹 Corregido
    socket.emit("send_notification", { destinatario, mensaje });
  };
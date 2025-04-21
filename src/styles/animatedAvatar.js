import React from "react";
import { Avatar, CircularProgress} from "@mui/material";
import { keyframes } from "@emotion/react";

// Animación de palpitación
const pulse = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
`;

const AnimatedAvatar = ({ src, hasNewMessage }) => {
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {/* CircularProgress para el borde giratorio */}
      {hasNewMessage && (
        <CircularProgress
          size={60} // Tamaño del borde
          thickness={4} // Grosor del borde
          sx={{
            position: "absolute",
            top: -5,
            left: -5,
            color: "primary.main", // Color del borde
          }}
        />
      )}

      {/* Avatar con animación de palpitación */}
      <Avatar
        src={src}
        sx={{
          width: 50,
          height: 50,
          animation: hasNewMessage ? `${pulse} 1s infinite` : "none", // Animación de palpitación
        }}
      />
    </div>
  );
};

export default AnimatedAvatar;
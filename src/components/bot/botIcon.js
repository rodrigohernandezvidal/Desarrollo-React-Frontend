import { Box } from "@mui/material";

const BotIcon = () => {
  return (
    <Box
      component="img"
      src="/images/bot.png" // Ruta desde public/
      alt="Asistente Bot"
      sx={{
        width: 60,
        height: 60,
        transition: "transform 0.3s ease-in-out",
        cursor: "pointer", // Hace que se vea interactivo
        "&:hover": {
          transform: "scale(1.1)", // Efecto de zoom al pasar el mouse
        },
      }}
    />
  );
};

export default BotIcon;

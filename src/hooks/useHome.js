// ../hooks/useHome.js
import { useNavigate } from 'react-router-dom';

const useHome = () => {
  const navigate = useNavigate();
  const outhome = () => {
    console.log('Inicio realizado');
    navigate('/dashboard'); 
  };
  return outhome;  
};

export default useHome;  // Exportación por defecto

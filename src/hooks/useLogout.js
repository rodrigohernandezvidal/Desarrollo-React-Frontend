// ../hooks/useLogout.js
import { useNavigate } from 'react-router-dom';

const useLogout = () => {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem('token');
    console.log('Logout realizado');
    navigate('/login');  // Redirigir a la página de login después de cerrar sesión
  };
  return logout;  // Devolver la función de logout
};

export default useLogout;  // Exportación por defecto

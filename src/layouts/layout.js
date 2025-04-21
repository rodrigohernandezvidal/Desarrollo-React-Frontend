import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/navbar/navbar';
import Footer from '../components/footer/footer';

const Layout = ({ children }) => {
    const location = useLocation(); // Obtener la ubicación actual

    // Si la ruta es "/login", no mostramos el Navbar
    const isLoginPage = location.pathname === "/";

    return (
        <div className="layout">
            {!isLoginPage && <Navbar />} {/* Renderiza el Navbar solo si no estamos en el Login */}
            <main>{children}</main> {/* Rutas de la aplicación */}
            <Footer /> {/* Pie de página */}
        </div>
    );
};

export default Layout;

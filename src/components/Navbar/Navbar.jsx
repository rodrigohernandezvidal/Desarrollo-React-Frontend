import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IconButton } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import './Navbar.css';
import logo from '../../assets/foog.png';

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="navbar glass-navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img 
            src={logo} 
            alt="Logo" 
            className="logo-img" 
            style={{ height: '250px', width: 'auto' }} 
          />
          {/*<span>Foog Technology</span>*/}
        </Link>
        
        <div className="menu-icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <i className={isMenuOpen ? 'fas fa-times' : 'fas fa-bars'} />
        </div>
        
        <ul className={isMenuOpen ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <Link to="/demo" className="nav-links">Demo</Link>
          </li>
          <li className="nav-item">
            <Link to="/services" className="nav-links">Servicios</Link>
          </li>
          <li className="nav-item">
            <Link to="/store" className="nav-links">Store</Link>
          </li>
          <li className="nav-item">
            <Link to="/clients" className="nav-links">Clientes</Link>
          </li>
          <li className="nav-item">
            <Link to="/contact" className="nav-links">Contacto</Link>
          </li>
          <li className="nav-item">
            <Link to="/auth" className="nav-links">Ingresar</Link>
          </li>
          <li className="nav-item">
            <IconButton onClick={toggleDarkMode} sx={{ ml: 1, color: 'inherit' }}>
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </li>
        </ul>
        <IconButton 
        onClick={toggleDarkMode} 
        sx={{ ml: 1, color: 'inherit' }}
      >
        {darkMode ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
      </div>
    </nav>
  );
};

export default Navbar;
import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useLogout from '../../hooks/useLogout';
import useHome from '../../hooks/useHome';

// Importa todos los íconos posibles que usarás
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import ReceiptIcon from '@mui/icons-material/Receipt';
import InventoryIcon from '@mui/icons-material/Inventory';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import SettingsIcon from '@mui/icons-material/Settings';
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import DescriptionIcon from '@mui/icons-material/Description';

export default function Navbar() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [submenuAnchorEl, setSubmenuAnchorEl] = useState(null);
  const [nestedSubmenuAnchorEl, setNestedSubmenuAnchorEl] = useState(null);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [activeNestedSubmenu, setActiveNestedSubmenu] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [mobileOpenSubmenus, setMobileOpenSubmenus] = useState({});
  const [mobileOpenNestedSubmenus, setMobileOpenNestedSubmenus] = useState({});
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const logout = useLogout();
  const outhome = useHome();
 

  // Mapa de iconos
  const iconMap = {
    HomeIcon: <HomeIcon />,
    LogoutIcon: <LogoutIcon />,
    ReceiptIcon: <ReceiptIcon />,
    InventoryIcon: <InventoryIcon />,
    AssessmentIcon: <AssessmentIcon />,
    AccountBoxIcon: <AccountBoxIcon />,
    SettingsIcon: <SettingsIcon />,
    AssuredWorkloadIcon: <AssuredWorkloadIcon/>,
    Diversity3Icon: <Diversity3Icon/>,
    DescriptionIcon: <DescriptionIcon/>
  };

  const fetchMenuItems = async () => {
    try {
      const routeMenu = process.env.REACT_APP_API_URL_D;
      const userEmpresa = localStorage.getItem('IsEmpresa');
      
      if (!userEmpresa) {
        throw new Error('userEmpresa no está definido en localStorage');
      }

      const response = await fetch(`${routeMenu}/api/menu/${userEmpresa}`);
      if (!response.ok) {
        throw new Error('Failed to fetch menu items');
      }

      const data = await response.json();
      if (!data) {
        throw new Error('La respuesta no es un JSON válido');
      }

      setMenuItems(data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const handleHome = () => {
    outhome();
  };

  const handleLogout = () => {
    logout();
  };

  const handleMenuItemClick = (action) => {
    switch (action) {
      case 'handleHome':
        handleHome();
        break;
      case 'handleLogout':
        handleLogout();
        break;
      case 'handleBillingClickBilling':
        navigate('/billing');
        break;
      case 'handleBillingClickClient':
        navigate('/client');
        break;  
      case 'handleBillingClickIncome':
        navigate('/income');
        break;
      case 'handleClickProfile':
        navigate('/profile');
        break;
      case 'handleAdvancedSignatureClick':
        navigate('/uploadDocuments');
        break;
      case 'handleSignatureClick':
        navigate('/clientSign');
        break;
      case 'handleOrderCotizador':
        navigate('/order-cotizador');
        break;
      case 'handlePurchasesClick':
        navigate('/purchases');
        break;
      case 'handleProvidersClick':
        navigate('/providers');
        break;
      case 'handleSurrenderClick':
        navigate('/surrender'); 
        break;
      case 'handleAccountPlanClick':
        navigate('/accountPlanPage'); 
        break;  
      case 'handleCostCenterClick':
        navigate('/costCenterPage'); 
        break;    
      default:
        console.warn('Acción no encontrada:', action);
    }
    handleMenuClose();
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setActiveSubmenu(null);
    setActiveNestedSubmenu(null);
  };

  const handleSubMenuOpen = (index, event) => {
    if (isMobile) {
      setMobileOpenSubmenus((prev) => ({
        ...prev,
        [index]: !prev[index]
      }));
    } else {
      setActiveSubmenu(index);
      setSubmenuAnchorEl(event.currentTarget);
    }
  };

  const handleSubMenuClose = () => {
    setActiveSubmenu(null);
    setSubmenuAnchorEl(null);
  };

  const handleNestedSubMenuOpen = (index, event) => {
    if (isMobile) {
      setMobileOpenNestedSubmenus((prev) => ({
        ...prev,
        [index]: !prev[index]
      }));
    } else {
      setActiveNestedSubmenu(index);
      setNestedSubmenuAnchorEl(event.currentTarget);
    }
  };

  const handleNestedSubMenuClose = () => {
    setActiveNestedSubmenu(null);
    setNestedSubmenuAnchorEl(null);
  };

  // Función para renderizar submenús anidados
  const renderNestedSubmenu = (subItems, parentIndex, subIndex) => {
    return (
      <Menu
        anchorEl={nestedSubmenuAnchorEl}
        open={activeNestedSubmenu === `${parentIndex}-${subIndex}` && !isMobile}
        onClose={handleNestedSubMenuClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        PaperProps={{ style: { width: '200px' } }}
      >
        {subItems.map((nestedItem, nestedIndex) => (
          <MenuItem
            key={nestedIndex}
            onClick={() => {
              handleMenuItemClick(nestedItem.onClick);
              handleNestedSubMenuClose();
            }}
            sx={{
              '&:hover': { backgroundColor: '#e0e0e0', color: '#000000' },
            }}
          >
            {nestedItem.label}
          </MenuItem>
        ))}
      </Menu>
    );
  };

  // Función para renderizar elementos de menú con submenús
  const renderMenuItem = (item, index, isMobileView = false) => {
    if (item.submenu) {
      return (
        <Box key={index} sx={{ position: 'relative' }}>
          <Button
            color="inherit"
            onClick={(e) => isMobileView ? handleSubMenuOpen(index) : handleSubMenuOpen(index, e)}
            sx={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              color: '#333333',
              '&:hover': { backgroundColor: '#e0e0e0', color: '#000000' },
              backgroundColor: activeSubmenu === index && !isMobileView ? '#d9d9d9' : ''
            }}
          >
            {iconMap[item.icon]} {item.label}
          </Button>
          
          {!isMobileView && (
            <Menu
              anchorEl={submenuAnchorEl}
              open={activeSubmenu === index && !isMobileView}
              onClose={handleSubMenuClose}
              PaperProps={{ style: { width: '200px' } }}
            >
              {item.submenu.map((subItem, subIndex) => (
                <div key={subIndex}>
                  {subItem.submenu ? (
                    <MenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNestedSubMenuOpen(`${index}-${subIndex}`, e);
                      }}
                      sx={{
                        '&:hover': { backgroundColor: '#e0e0e0', color: '#000000' },
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      {subItem.label}
                      <span style={{ marginLeft: '8px' }}>›</span>
                    </MenuItem>
                  ) : (
                    <MenuItem
                      onClick={() => {
                        handleMenuItemClick(subItem.onClick);
                        handleSubMenuClose();
                      }}
                      sx={{
                        '&:hover': { backgroundColor: '#e0e0e0', color: '#000000' },
                      }}
                    >
                      {subItem.label}
                    </MenuItem>
                  )}
                  {subItem.submenu && renderNestedSubmenu(subItem.submenu, index, subIndex)}
                </div>
              ))}
            </Menu>
          )}
        </Box>
      );
    } else {
      return (
        <Button
          key={index}
          color="inherit"
          onClick={() => handleMenuItemClick(item.command || item.onClick)}
          startIcon={iconMap[item.icon] && iconMap[item.icon]}
          sx={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            color: '#333333',
            '&:hover': { backgroundColor: '#e0e0e0', color: '#000000' }
          }}
        >
          {item.label}
        </Button>
      );
    }
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#f4f4f4' }}>
      <Toolbar>
        {isMobile ? (
          <>
            <IconButton edge="start" color="inherit" onClick={handleMenuOpen}>
              <MenuIcon sx={{ color: '#333333' }} />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              {menuItems.map((item, index) => (
                <div key={index}>
                  <MenuItem
                    onClick={() => item.submenu ? handleSubMenuOpen(index) : handleMenuItemClick(item.command || item.onClick)}
                    sx={{
                      color: '#333333',
                      '&:hover': { backgroundColor: '#e0e0e0', color: '#000000' },
                    }}
                  >
                    {iconMap[item.icon]} {item.label}
                    {item.submenu && <span style={{ marginLeft: '8px' }}>›</span>}
                  </MenuItem>
                  <Collapse in={mobileOpenSubmenus[index]} timeout="auto" unmountOnExit>
                    {item.submenu && item.submenu.map((subItem, subIndex) => (
                      <div key={subIndex}>
                        <MenuItem
                          onClick={() => subItem.submenu ? 
                            setMobileOpenNestedSubmenus(prev => ({...prev, [`${index}-${subIndex}`]: !prev[`${index}-${subIndex}`]})) : 
                            () => {
                              handleMenuItemClick(subItem.onClick);
                              handleMenuClose();
                            }
                          }
                          sx={{
                            paddingLeft: '2rem',
                            color: '#333333',
                            '&:hover': { backgroundColor: '#e0e0e0', color: '#000000' },
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}
                        >
                          {subItem.label}
                          {subItem.submenu && <span>›</span>}
                        </MenuItem>
                        <Collapse in={mobileOpenNestedSubmenus[`${index}-${subIndex}`]} timeout="auto" unmountOnExit>
                          {subItem.submenu && subItem.submenu.map((nestedItem, nestedIndex) => (
                            <MenuItem
                              key={nestedIndex}
                              onClick={() => {
                                handleMenuItemClick(nestedItem.onClick);
                                handleMenuClose();
                              }}
                              sx={{
                                paddingLeft: '3rem',
                                color: '#333333',
                                '&:hover': { backgroundColor: '#e0e0e0', color: '#000000' },
                              }}
                            >
                              {nestedItem.label}
                            </MenuItem>
                          ))}
                        </Collapse>
                      </div>
                    ))}
                  </Collapse>
                </div>
              ))}
            </Menu>
          </>
        ) : (
          <Box sx={{ display: 'flex', flexGrow: 1 }}>
            {menuItems.map((item, index) => renderMenuItem(item, index))}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
import React, { useState } from 'react';
import './login.css'; 
import logo from '../assets/Logo.png'; 
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { TextField, Stack, Box, Button, Typography, Link, Modal } from "@mui/material";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [emailClient, setEmailclient] = useState('');
    const [tokenClient, setToken] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!email.match(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)) {
            toast.error('Por favor ingresa un correo válido');
            return;
        }

        try {
            const routeMenu = process.env.REACT_APP_API_URL_D;
            console.log("URL utilizada:", `${routeMenu}/api/data/login`);

            const response = await fetch(`${routeMenu}/api/data/login`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.token) {
                    const decoded = jwtDecode(data.token);
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('email', email);
                    localStorage.setItem('name', decoded.name);
                    localStorage.setItem('id', decoded.id);
                    localStorage.setItem('avatar', decoded.avatar);
                    localStorage.setItem('IsEmpresa', decoded.empresa);
                    toast.success('¡Bienvenido! Has iniciado sesión correctamente.');
                    navigate('/dashboard');
                } else {
                    toast.error(data.message || 'Error desconocido al iniciar sesión');
                }
            } else {
                const errorData = await response.json();
                response.log(errorData);
                if (response.status === 400) {
                    toast.error('Credenciales incorrectas. Por favor, verifica tu correo y contraseña.');
                } else if (response.status === 403) {
                    toast.warning('El usuario está deshabilitado.');
                } else {
                    toast.error('Error al conectar con el servidor. Inténtalo de nuevo más tarde.');
                }
            }
        } catch (error) {
            console.error("Error en la conexión con el servidor", error);
            toast.error('Error al conectar con el servidor');
        }
    };

    const handSubmitClients = async (e) => {
        if (!emailClient.match(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)) {
            toast.error('Por favor ingresa un correo válido');
            return;
        }

        try {
            const routeMenu = process.env.REACT_APP_API_URL_D;
            const response = await fetch(`${routeMenu}/api/data/loginClient`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ emailClient, tokenClient })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.token) {
                    const decoded = jwtDecode(data.token);
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('email', decoded.email);
                    localStorage.setItem('name', decoded.name);
                    localStorage.setItem('id', decoded.id);
                    localStorage.setItem('IsEmpresa', decoded.empresa);
                    toast.success('¡Bienvenido! Has iniciado sesión correctamente.');
                    navigate('/clientSign');
                } else {
                    toast.error(data.message || 'Error desconocido al iniciar sesión');
                }
            } else {
                const errorData = await response.json();
                response.log(errorData);
                if (response.status === 400) {
                    toast.error('Credenciales incorrectas. Por favor, verifica tu correo y contraseña.');
                } else if (response.status === 403) {
                    toast.warning('El usuario está deshabilitado.');
                } else {
                    toast.error('Error al conectar con el servidor. Inténtalo de nuevo más tarde.');
                }
            }
        } catch (error) {
            console.error("Error en la conexión con el servidor", error);
            toast.error('Error al conectar con el servidor');
        }
    };

    const handClients = (e) => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    return (
        <Box
            sx={{
                overflow: "hidden",
                display: "flex",
                boxSizing: "border-box",
                width: "100%",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                background: "radial-gradient(circle, #E8BA1E 1%, #3f3f3f 100%)",
                fontFamily: "Arial, sans-serif",
                margin: 0,
                padding: 0,
            }}
        >
            <ToastContainer />
            <Box
                sx={{
                    backgroundColor: "white",
                    padding: "40px",
                    borderRadius: "8px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    width: "300px",
                }}
            >
                <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
                    <img src={logo} alt="Logo de la empresa" style={{ width: "200px", height: "auto" }} />
                </Box>
                <Stack spacing={2}>
                    <TextField 
                        type="email" 
                        label="Email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        sx={{backgroundColor: "#FFFFFF", width: '100%'}}  
                    />
                    <TextField 
                        type="password"
                        label="Contraseña"
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        sx={{backgroundColor: "#FFFFFF", width: '100%'}}  
                    />
                    <Typography
                        variant="body2"
                        sx={{ mb: 3, pb: { lg: 2 }, color: "#E8BA1E", opacity: 0.5 }}
                    >
                        <Link href="#!" sx={{ color: "#E8BA1E", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>
                            ¿Olvidó su contraseña?
                        </Link>
                    </Typography>
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{
                            width: "100%",
                            padding: "10px",
                            backgroundColor: "#4CAF50",
                            color: "white",
                            borderRadius: "4px",
                            fontSize: "16px",
                            "&:hover": {
                                backgroundColor: "#45a049",
                            },
                        }}
                        onClick={handleSubmit}
                    >
                        Iniciar sesión
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{
                            width: "100%",
                            padding: "10px",
                            backgroundColor: "#0d6efd",
                            color: "white",
                            borderRadius: "4px",
                            fontSize: "16px",
                            "&:hover": {
                                backgroundColor: "#0d6efd",
                            },
                        }}
                        onClick={handClients}
                    >
                        Eres Clientes
                    </Button>
                </Stack>
            </Box>
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 300,
                        backgroundColor: "white",
                        padding: "40px",
                        borderRadius: "8px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
                        <img src={logo} alt="Logo de la empresa" style={{ width: "200px", height: "auto" }} />
                    </Box>
                    <Stack spacing={2}>
                        <TextField 
                            type="email" 
                            label="Email" 
                            value={emailClient} 
                            onChange={(e) => setEmailclient(e.target.value)}
                            required
                            sx={{backgroundColor: "#FFFFFF", width: '100%'}}  
                        />
                        <TextField 
                            type="password"
                            label="Token"
                            value={tokenClient} 
                            onChange={(e) => setToken(e.target.value)}
                            required
                            sx={{backgroundColor: "#FFFFFF", width: '100%'}}  
                        />
                        <Typography
                            variant="body2"
                            sx={{ mb: 3, pb: { lg: 2 }, color: "#E8BA1E", opacity: 0.5 }}
                        >
                            <Link href="#!" sx={{ color: "#E8BA1E", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>
                                ¿Necesita ayuda?
                            </Link>
                        </Typography>
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{
                                width: "100%",
                                padding: "10px",
                                backgroundColor: "#ffc107",
                                color: "white",
                                borderRadius: "4px",
                                fontSize: "16px",
                                "&:hover": {
                                    backgroundColor: "#45a049",
                                },
                            }}
                            onClick={handSubmitClients}
                        >
                            Ingreso Clientes
                        </Button>
                    </Stack>
                </Box>
            </Modal>
        </Box>
    );
};

export default Login;
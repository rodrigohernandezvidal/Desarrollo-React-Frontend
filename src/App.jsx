import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from './config/theme'; // Asegúrate de tener este archivo
import Home from './pages/Home'; // Ajusta la ruta según tu estructura

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Puedes agregar más rutas aquí */}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
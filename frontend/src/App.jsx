import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Portafolio from './pages/Portafolio';
import Proyecto from './pages/Proyecto';
import Cotizar from './pages/Cotizar';
import Servicios from './pages/Servicios';
import MisCotizaciones from './pages/MisCotizaciones';
import Registro from './pages/Registro';
import Login from './pages/Login';
import Admin from './pages/Admin';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar'; 


export default function App() {
  return (
    <Router>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/" element={<Home />} />
          <Route path="/portafolio" element={<Portafolio />} />
          <Route path="/proyecto/:id" element={<Proyecto />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/login" element={<Login />} />
          
          {/* Rutas Protegidas para Clientes */}
          <Route path="/cotizar" element={
            <ProtectedRoute>
              <Cotizar />
            </ProtectedRoute>
          } />
          
          <Route path="/mis-cotizaciones" element={
            <ProtectedRoute>
              <MisCotizaciones />
            </ProtectedRoute>
          } />

          {/* Ruta Protegida solo para Administradores */}
          <Route path="/admin" element={
            <ProtectedRoute roleRequired="admin">
              <Admin />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}
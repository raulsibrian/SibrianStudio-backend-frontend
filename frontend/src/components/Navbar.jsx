import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const [config, setConfig] = useState({
    empresa_nombre: 'Sibrian Studio',
    instagram_url: 'https://www.instagram.com/sibrianstudio/',
    linkedin_url: 'https://www.linkedin.com/in/raul-gonzalez-448a69157/'
  });
  const [menuAbierto, setMenuAbierto] = useState(false);

  useEffect(() => {
    const cargarConfig = async () => {
      const res = await fetch('http://127.0.0.1:5000/api/configuracion');
      if (res.ok) {
        const data = await res.json();
        setConfig(prev => ({
          ...prev,
          ...data
        }));
      }
    };
    cargarConfig();
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setMenuAbierto(false);
    navigate('/login');
  };

  const linkStyle = { 
    color: '#2d3748', 
    textDecoration: 'none', 
    fontSize: '0.95rem', 
    fontWeight: '600', 
    transition: 'color 0.2s ease',
    whiteSpace: 'nowrap' 
  };

  return (
    <nav style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      padding: '18px 50px', 
      background: '#f1f3f5', 
      color: '#1a1a1a', 
      alignItems: 'center', 
      fontFamily: 'sans-serif',
      borderBottom: '1px solid #d8dde3',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
    }}>
      
      {/* 1. Espacio de respeto para el nombre de la empresa */}
      <div style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '0.5px', whiteSpace: 'nowrap', marginRight: '40px' }}>
        <Link to="/" style={{ color: '#111111', textDecoration: 'none' }}>{config.empresa_nombre}</Link>
      </div>

      {/* 2. Menú de navegación principal central */}
      <div style={{ display: 'flex', gap: '35px', alignItems: 'center', flex: 1 }}>
        <Link to="/" style={linkStyle}>Inicio</Link>
        <a href="/#nosotros" style={linkStyle}>Nosotros</a>
        <Link to="/servicios" style={linkStyle}>Servicios</Link>
        <Link to="/portafolio" style={linkStyle}>Portafolio</Link>
        <a href="/#contacto" style={linkStyle}>Contacto</a>
      </div>

      {/* 3. Lado derecho: Redes sociales (con tus links reales) y Menú desplegable */}
      <div style={{ display: 'flex', gap: '25px', alignItems: 'center', position: 'relative' }}>
        <a href={config.instagram_url} target="_blank" rel="noreferrer" style={linkStyle}>Instagram</a>
        <a href={config.linkedin_url} target="_blank" rel="noreferrer" style={linkStyle}>LinkedIn</a>

        <div style={{ width: '1px', height: '18px', background: '#cbd5e0', margin: '0 5px' }}></div>

        {token ? (
          <div>
            <button 
              onClick={() => setMenuAbierto(!menuAbierto)} 
              style={{ 
                background: '#1a1a1a', 
                color: '#fff', 
                border: 'none', 
                padding: '8px 18px', 
                borderRadius: '6px', 
                cursor: 'pointer', 
                fontSize: '0.9rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
              }}
            >
              Mi Cuenta <span style={{ fontSize: '0.7rem' }}>▼</span>
            </button>

            {/* Menú Desplegable */}
            {menuAbierto && (
              <div style={{
                position: 'absolute',
                right: 0,
                top: '45px',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
                display: 'flex',
                flexDirection: 'column',
                width: '180px',
                overflow: 'hidden',
                zIndex: 1100
              }}>
                <Link to="/cotizar" onClick={() => setMenuAbierto(false)} style={{ padding: '12px 16px', color: '#222', textDecoration: 'none', fontSize: '0.9rem', borderBottom: '1px solid #edf2f7' }}>Cotizar</Link>
                <Link to="/mis-cotizaciones" onClick={() => setMenuAbierto(false)} style={{ padding: '12px 16px', color: '#222', textDecoration: 'none', fontSize: '0.9rem', borderBottom: '1px solid #edf2f7' }}>Mis Cotizaciones</Link>
                
                {role === 'admin' && (
                  <Link to="/admin" onClick={() => setMenuAbierto(false)} style={{ padding: '12px 16px', color: '#d97706', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 'bold', borderBottom: '1px solid #edf2f7' }}>Panel Admin</Link>
                )}
                
                <button onClick={cerrarSesion} style={{ background: 'transparent', color: '#dc2626', border: 'none', padding: '12px 16px', textAlign: 'left', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600' }}>
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <Link to="/login" style={{ color: '#1a1a1a', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600', whiteSpace: 'nowrap' }}>Iniciar Sesión</Link>
            <Link to="/registro" style={{ background: '#1a1a1a', color: '#ffffff', padding: '8px 16px', borderRadius: '6px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 'bold', whiteSpace: 'nowrap', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>Registrarse</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
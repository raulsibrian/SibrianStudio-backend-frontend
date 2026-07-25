import { useState, useEffect } from 'react';

export default function MisCotizaciones() {
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    const cargarCotizaciones = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('https://sibrianstudio-backend-frontend.onrender.com/api/cotizaciones', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          setHistorial(data);
        }
      } catch (error) {
        console.error("Error de conexión", error);
      }
    };

    cargarCotizaciones();
  }, []);

  const getColorEstado = (estado) => estado === 'Pendiente' ? 'orange' : (estado === 'Aprobada' ? 'green' : 'gray');

  return (
    <div style={{ padding: '40px 20px', fontFamily: 'sans-serif', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '20px' }}>Mis Cotizaciones</h1>
      
      {historial.length === 0 ? (
        <p>No tienes cotizaciones registradas.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#333', color: '#fff' }}>
              <th style={{ padding: '12px' }}>Fecha</th>
              <th style={{ padding: '12px' }}>Proyecto</th>
              <th style={{ padding: '12px' }}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {historial.map(cot => (
              <tr key={cot._id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '12px' }}>{cot.fecha.split(' ')[0]}</td>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>{cot.nombre_proyecto}</td>
                <td style={{ padding: '12px', color: getColorEstado(cot.estado), fontWeight: 'bold' }}>{cot.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
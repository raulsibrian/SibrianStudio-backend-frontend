import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function Proyecto() {
  const { id } = useParams();
  const [proyecto, setProyecto] = useState(null);

  useEffect(() => {
    const cargarProyecto = async () => {
      const res = await fetch(`http://127.0.0.1:5000/api/proyectos/${id}`);
      if (res.ok) setProyecto(await res.json());
    };
    cargarProyecto();
  }, [id]);

  if (!proyecto) return <p style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'sans-serif' }}>Cargando...</p>;

  // Soporte para proyectos nuevos (array) y antiguos (string único)
  const imagenes = proyecto.imagenes_urls && proyecto.imagenes_urls.length > 0 
    ? proyecto.imagenes_urls 
    : (proyecto.imagen_url ? [proyecto.imagen_url] : []);

  return (
    <div style={{ padding: '40px 20px', maxWidth: '900px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <Link to="/portafolio" style={{ color: '#007bff', textDecoration: 'none', marginBottom: '20px', display: 'inline-block' }}>&larr; Volver al Portafolio</Link>
      
      {/* Título y Descripción arriba */}
      <h1 style={{ marginBottom: '15px' }}>{proyecto.titulo}</h1>
      <p style={{ fontSize: '1.1rem', lineHeight: '1.6', whiteSpace: 'pre-wrap', marginBottom: '30px' }}>{proyecto.descripcion}</p>
      
      {/* Galería: 1 grande, 2 pequeñas, repetición */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {imagenes.map((img, idx) => {
          const esGrande = idx % 3 === 0;
          return (
            <img 
              key={idx} 
              src={img} 
              alt={`${proyecto.titulo} - vista ${idx + 1}`} 
              style={{ 
                width: '100%', 
                height: esGrande ? '500px' : '240px', 
                objectFit: 'cover', 
                gridColumn: esGrande ? '1 / -1' : 'auto',
                borderRadius: '8px'
              }} 
            />
          );
        })}
      </div>

      <p style={{ color: '#777', marginTop: '30px', fontSize: '0.9rem' }}>Publicado: {proyecto.fecha}</p>
      
      {/* Copyright */}
      <div style={{ marginTop: '50px', borderTop: '1px solid #ddd', paddingTop: '20px', textAlign: 'center', color: '#888', fontSize: '0.9rem' }}>
        &copy; {new Date().getFullYear()} Sibrian Studio. Todos los derechos reservados.
      </div>
    </div>
  );
}
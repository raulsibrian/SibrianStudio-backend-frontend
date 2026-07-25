import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CarruselImagenes = ({ imagenes, titulo }) => {
  const [indice, setIndice] = useState(0);
  useEffect(() => {
    if (!imagenes || imagenes.length <= 1) return;
    const intervalo = setInterval(() => {
      setIndice((prevIndice) => (prevIndice + 1) % imagenes.length);
    }, 5000);
    return () => clearInterval(intervalo);
  }, [imagenes]);
  if (!imagenes || imagenes.length === 0) return null;
  return (
    <img src={imagenes[indice]} alt={titulo} style={{ width: '100%', height: '220px', objectFit: 'cover', transition: 'opacity 0.5s ease-in-out' }} />
  );
};

export default function Home() {
  const [destacados, setDestacados] = useState([]);
  const [config, setConfig] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      const resConfig = await fetch('https://sibrianstudio-backend-frontend.onrender.com/api/configuracion');
      if (resConfig.ok) setConfig(await resConfig.json());

      const resProy = await fetch('https://sibrianstudio-backend-frontend.onrender.com/api/proyectos');
      if (resProy.ok) {
        const data = await resProy.json();
        setDestacados(data.filter(p => p.destacado).slice(0, 3));
      }
    };
    cargarDatos();
  }, []);

  if (!config) return null;

  return (
    <div style={{ fontFamily: 'sans-serif', textAlign: 'center' }}>
      {/* Hero Section */}
      <div style={{ 
        background: config.hero_image_url 
          ? `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${config.hero_image_url}) center/cover no-repeat` 
          : '#1a1a1a', 
        color: '#fff', 
        padding: '120px 20px' 
      }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '20px', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>{config.titulo_hero}</h1>
        <p style={{ fontSize: '1.2rem', color: '#eaeaea', marginBottom: '30px', textShadow: '1px 1px 3px rgba(0,0,0,0.8)' }}>{config.descripcion_hero}</p>
        <Link to="/cotizar" style={{ padding: '15px 30px', background: '#007bff', color: '#fff', textDecoration: 'none', borderRadius: '5px', fontSize: '1.1rem', fontWeight: 'bold' }}>Solicitar cotización</Link>
      </div>

      {/* Proyectos Destacados */}
      {destacados.length > 0 && (
        <div style={{ padding: '60px 20px', maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '10px', color: '#1a1a1a' }}>Proyectos Destacados</h2>
          <p style={{ color: '#666', marginBottom: '30px' }}>Una muestra selecta de nuestros trabajos más recientes en visualización 3D.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' }}>
            {destacados.map(proy => {
              const imagenesArray = proy.imagenes_urls?.length ? proy.imagenes_urls : (proy.imagen_url ? [proy.imagen_url] : []);
              return (
                <Link to={`/proyecto/${proy._id}`} key={proy._id} style={{ textDecoration: 'none', color: 'inherit', textAlign: 'left' }}>
                  <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden', background: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.04)', transition: 'transform 0.2s' }}>
                    <CarruselImagenes imagenes={imagenesArray} titulo={proy.titulo} />
                    <div style={{ padding: '18px' }}>
                      <h3 style={{ margin: '0', fontSize: '1.1rem', color: '#2d3748' }}>{proy.titulo}</h3>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          <div style={{ marginTop: '35px' }}>
            <Link to="/portafolio" style={{ color: '#2b6cb0', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.05rem' }}>Ver portafolio completo &rarr;</Link>
          </div>
        </div>
      )}
      
      {/* Sección Nosotros (Estilizada y mejor organizada) */}
      <div id="nosotros" style={{ padding: '80px 20px', maxWidth: '1050px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '2.2rem', marginBottom: '10px', color: '#1a1a1a' }}>¿Por qué elegir {config.empresa_nombre}?</h2>
        <p style={{ color: '#666', marginBottom: '40px', fontSize: '1.05rem' }}>Combinamos arte, técnica y tecnología para dar vida a tus proyectos arquitectónicos.</p>
        
        <div style={{ display: 'flex', gap: '30px', marginTop: '20px', flexWrap: 'wrap', justifyContent: 'center', textAlign: 'left' }}>
          
          <div style={{ flex: '1 1 300px', padding: '30px', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#fdfbf7', boxShadow: '0 6px 15px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: '1.8rem', marginBottom: '15px' }}>✨</div>
            <h3 style={{ color: '#2d3748', marginBottom: '12px', fontSize: '1.25rem' }}>Calidad Fotorrealista</h3>
            <p style={{ color: '#4a5568', lineHeight: '1.6', fontSize: '0.95rem' }}>Atención meticulosa al detalle, texturas hiperrealistas y configuraciones de iluminación avanzada para materializar cada espacio con realismo absoluto.</p>
          </div>

          <div style={{ flex: '1 1 300px', padding: '30px', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#fdfbf7', boxShadow: '0 6px 15px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: '1.8rem', marginBottom: '15px' }}>📐</div>
            <h3 style={{ color: '#2d3748', marginBottom: '12px', fontSize: '1.25rem' }}>Precisión Arquitectónica</h3>
            <p style={{ color: '#4a5568', lineHeight: '1.6', fontSize: '0.95rem' }}>Respeto estricto por la volumetría, las proporciones técnicas y las especificaciones descritas en los planos originales de tu diseño.</p>
          </div>

          <div style={{ flex: '1 1 300px', padding: '30px', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#fdfbf7', boxShadow: '0 6px 15px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: '1.8rem', marginBottom: '15px' }}>⚡</div>
            <h3 style={{ color: '#2d3748', marginBottom: '12px', fontSize: '1.25rem' }}>Flujo Optimizado</h3>
            <p style={{ color: '#4a5568', lineHeight: '1.6', fontSize: '0.95rem' }}>Gestión integral digitalizada para asegurar entregas puntuales y una comunicación directa y fluida durante todo el desarrollo.</p>
          </div>

        </div>
      </div>

      {/* Sección Contacto Única */}
      <div id="contacto" style={{ background: '#f1f3f5', padding: '60px 20px', marginTop: '40px', borderTop: '1px solid #d8dde3', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '10px', color: '#1a1a1a', fontWeight: '800' }}>Contacto</h2>
          <p style={{ color: '#4a5568', fontSize: '1.05rem', marginBottom: '25px' }}>¿Listo para empezar tu proyecto? Hablemos.</p>
          
          <div style={{ background: '#ffffff', padding: '30px', borderRadius: '12px', border: '1px solid #d8dde3', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
            <p style={{ margin: '0', color: '#2d3748', fontSize: '1rem' }}>
              Correo electrónico: <a href={`mailto:${config.email_contacto}`} style={{ color: '#2b6cb0', textDecoration: 'underline', fontWeight: 'bold' }}>{config.email_contacto}</a>
            </p>
            
            <a 
              href="https://wa.me/584120514757" 
              target="_blank" 
              rel="noreferrer" 
              style={{ 
                display: 'inline-block',
                marginTop: '10px',
                padding: '12px 24px', 
                background: '#2f855a', 
                color: '#ffffff', 
                borderRadius: '6px', 
                textDecoration: 'none', 
                fontWeight: 'bold', 
                fontSize: '1rem',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                transition: 'background 0.2s'
              }}
            >
              💬 Escríbenos por WhatsApp (+58 412-0514757)
            </a>
          </div>
        </div>
      </div>

     
    </div>
  );
}
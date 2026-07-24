import { Link } from 'react-router-dom';

export default function Servicios() {
  const serviciosLista = [
    {
      titulo: "Renders Fotorrealistas",
      icono: "✨",
      descripcion: "Visualización de espacios interiores y exteriores con un nivel hiperrealista de iluminación, texturas y materiales para impactar a tus clientes o inversores.",
      caracteristicas: [
        "Iluminación natural y artificial avanzada",
        "Postproducción profesional incluida",
        "Entregas en alta resolución 4K"
      ]
    },
    {
      titulo: "Recorridos 3D y Animaciones",
      icono: "🎥",
      descripcion: "Experiencias virtuales fluidas y recorridos animados que guían al espectador a través del proyecto arquitectónico antes de ser construido.",
      caracteristicas: [
        "Cámaras cinemáticas fluidas",
        "Ambientación con sonido y vegetación",
        "Ideal para presentaciones comerciales"
      ]
    },
    {
      titulo: "Modelado Arquitectónico 3D",
      icono: "📐",
      descripcion: "Transformación precisa de tus planos 2D, bocetos o memorias de diseño en modelos tridimensionales geométricamente exactos.",
      caracteristicas: [
        "Respeto estricto por la volumetría y cotas",
        "Compatible con múltiples flujos de trabajo",
        "Optimización de geometría"
      ]
    }
  ];

  return (
    <div style={{ padding: '60px 20px', background: '#f8f9fa', minHeight: '85vh', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
        
        <h1 style={{ fontSize: '2.5rem', marginBottom: '15px', color: '#1a1a1a', fontWeight: '800' }}>Nuestros Servicios</h1>
        <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '50px', maxWidth: '650px', marginInline: 'auto' }}>
          Soluciones integrales de visualización arquitectónica diseñadas para materializar y potenciar cada proyecto con la más alta precisión.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', textAlign: 'left', marginBottom: '50px' }}>
          {serviciosLista.map((serv, index) => (
            <div key={index} style={{ background: '#ffffff', padding: '35px 30px', borderRadius: '12px', border: '1px solid #d8dde3', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '2.2rem', marginBottom: '15px' }}>{serv.icono}</div>
                <h3 style={{ fontSize: '1.4rem', color: '#1a1a1a', marginBottom: '12px', fontWeight: '700' }}>{serv.titulo}</h3>
                <p style={{ fontSize: '0.95rem', color: '#4a5568', lineHeight: '1.6', marginBottom: '20px' }}>{serv.descripcion}</p>
                <ul style={{ paddingLeft: '20px', margin: '0 0 25px 0', color: '#2d3748', fontSize: '0.9rem', lineHeight: '1.7' }}>
                  {serv.caracteristicas.map((car, i) => (
                    <li key={i}>{car}</li>
                  ))}
                </ul>
              </div>
              <Link to="/cotizar" style={{ display: 'block', textAlign: 'center', padding: '12px', background: '#1a1a1a', color: '#fff', textDecoration: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.95rem', transition: 'background 0.2s' }}>
                Cotizar este servicio
              </Link>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
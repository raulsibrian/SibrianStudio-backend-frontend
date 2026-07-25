import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Portafolio() {
  const [proyectos, setProyectos] = useState([]);

  useEffect(() => {
    const cargarProyectos = async () => {
      const res = await fetch('https://sibrianstudio-backend-frontend.onrender.com/api/proyectos');
      if (res.ok) setProyectos(await res.json());
    };
    cargarProyectos();
  }, []);

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1 style={{ marginBottom: '30px' }}>Nuestro Portafolio</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {proyectos.map(proy => (
          <Link to={`/proyecto/${proy._id}`} key={proy._id} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer' }}>
              {proy.imagen_url && <img src={proy.imagen_url} alt={proy.titulo} style={{ width: '100%', height: '220px', objectFit: 'cover' }} />}
              <div style={{ padding: '15px' }}>
                <h3 style={{ margin: '0' }}>{proy.titulo}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
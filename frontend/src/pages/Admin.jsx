import { useState, useEffect } from 'react';

export default function Admin() {
  const [pestaña, setPestaña] = useState('cotizaciones');
  
  // Estados Cotizaciones, Proyectos, Usuarios y Configuración
  const [cotizaciones, setCotizaciones] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  
  // Proyectos Form
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagenes, setImagenes] = useState([]);
  const [proyectoEditando, setProyectoEditando] = useState(null);

  // Configuración Textos
  const [config, setConfig] = useState({
    titulo_hero: '',
    descripcion_hero: '',
    email_contacto: '',
    empresa_nombre: '',
    instagram_url: '',
    linkedin_url: ''
  });
  const [heroImage, setHeroImage] = useState(null);

  // Carga inicial obligatoria al montar el componente
  useEffect(() => {
    cargarCotizaciones();
    cargarProyectos();
    cargarConfiguracion();
    cargarUsuarios();
  }, []);

  // Carga según la pestaña activa
  useEffect(() => {
    if (pestaña === 'cotizaciones') cargarCotizaciones();
    if (pestaña === 'proyectos') cargarProyectos();
    if (pestaña === 'usuarios') cargarUsuarios();
    if (pestaña === 'textos') cargarConfiguracion();
  }, [pestaña]);

  // --- Funciones Cotizaciones ---
  const cargarCotizaciones = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://127.0.0.1:5000/api/admin/cotizaciones', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setCotizaciones(await res.json());
    } catch (error) {
      console.error("Error al cargar cotizaciones", error);
    }
  };

  const cambiarEstadoCotizacion = async (id, nuevoEstado) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://127.0.0.1:5000/api/admin/cotizaciones/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ estado: nuevoEstado })
    });
    if (res.ok) cargarCotizaciones();
  };

  // --- Funciones Proyectos ---
  const cargarProyectos = async () => {
    try {
      const res = await fetch('http://127.0.0.1:5000/api/proyectos');
      if (res.ok) setProyectos(await res.json());
    } catch (error) {
      console.error("Error al cargar proyectos", error);
    }
  };

  const manejarProyecto = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('descripcion', descripcion);
    
    for (let i = 0; i < imagenes.length; i++) {
      formData.append('imagenes', imagenes[i]);
    }

    const url = proyectoEditando ? `http://127.0.0.1:5000/api/proyectos/${proyectoEditando}` : 'http://127.0.0.1:5000/api/proyectos';
    const metodo = proyectoEditando ? 'PUT' : 'POST';

    const res = await fetch(url, { method: metodo, headers: { 'Authorization': `Bearer ${token}` }, body: formData });
    if (res.ok) {
      alert(proyectoEditando ? 'Proyecto actualizado' : 'Proyecto creado');
      cancelarEdicion();
      cargarProyectos();
    }
  };

  const iniciarEdicion = (proy) => {
    setProyectoEditando(proy._id);
    setTitulo(proy.titulo);
    setDescripcion(proy.descripcion);
    setImagenes([]); 
    window.scrollTo(0, 0);
  };

  const cancelarEdicion = () => {
    setProyectoEditando(null);
    setTitulo('');
    setDescripcion('');
    setImagenes([]);
  };

  const eliminarProyecto = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este proyecto?")) return;
    const token = localStorage.getItem('token');
    const res = await fetch(`http://127.0.0.1:5000/api/proyectos/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
    if (res.ok) cargarProyectos();
  };

  const toggleDestacado = async (id) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://127.0.0.1:5000/api/proyectos/${id}/destacar`, { method: 'PUT', headers: { 'Authorization': `Bearer ${token}` } });
    if (res.ok) cargarProyectos();
  };

  // --- Funciones Usuarios ---
  const cargarUsuarios = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://127.0.0.1:5000/api/admin/usuarios', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsuarios(data);
      } else {
        console.error("No se pudieron cargar los usuarios, respuesta no ok");
      }
    } catch (error) {
      console.error("Error de conexión al cargar usuarios:", error);
    }
  };

  const cambiarRol = async (id, nuevoRol) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://127.0.0.1:5000/api/admin/usuarios/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ role: nuevoRol })
    });
    if (res.ok) cargarUsuarios();
  };

  const eliminarUsuario = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este usuario?")) return;
    const token = localStorage.getItem('token');
    const res = await fetch(`http://127.0.0.1:5000/api/admin/usuarios/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) cargarUsuarios();
    else {
      const data = await res.json();
      alert(data.error || "No se pudo eliminar el usuario");
    }
  };

  // --- Funciones Configuración Textos ---
  const cargarConfiguracion = async () => {
    try {
      const res = await fetch('http://127.0.0.1:5000/api/configuracion');
      if (res.ok) {
        const data = await res.json();
        setConfig(data);
      }
    } catch (error) {
      console.error("Error al cargar configuración", error);
    }
  };

  const guardarConfiguracion = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('titulo_hero', config.titulo_hero);
    formData.append('descripcion_hero', config.descripcion_hero);
    formData.append('email_contacto', config.email_contacto);
    formData.append('empresa_nombre', config.empresa_nombre);
    formData.append('instagram_url', config.instagram_url);
    formData.append('linkedin_url', config.linkedin_url);
    
    if (heroImage) formData.append('hero_image', heroImage);

    const res = await fetch('http://127.0.0.1:5000/api/configuracion', {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });
    
    if (res.ok) {
      alert('Configuración actualizada correctamente');
      cargarConfiguracion();
    }
  };

  const handleConfigChange = (e) => {
    setConfig({ ...config, [e.target.name]: e.target.value });
  };

  const btnStyle = (activa) => ({
    padding: '10px 20px',
    background: activa ? '#1a1a1a' : '#f1f3f5',
    color: activa ? '#fff' : '#2d3748',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    borderRadius: '6px',
    transition: 'all 0.2s'
  });

  return (
    <div style={{ padding: '50px 20px', fontFamily: 'sans-serif', maxWidth: '1050px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '25px', color: '#1a1a1a' }}>Panel de Administración</h1>
      
      {/* Botones de Pestañas */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '35px', flexWrap: 'wrap' }}>
        <button style={btnStyle(pestaña === 'cotizaciones')} onClick={() => setPestaña('cotizaciones')}>Cotizaciones</button>
        <button style={btnStyle(pestaña === 'proyectos')} onClick={() => setPestaña('proyectos')}>Proyectos</button>
        <button style={btnStyle(pestaña === 'textos')} onClick={() => setPestaña('textos')}>Textos Web</button>
        <button style={btnStyle(pestaña === 'usuarios')} onClick={() => setPestaña('usuarios')}>Usuarios</button>
      </div>

      {/* --- Pestaña Usuarios --- */}
      {pestaña === 'usuarios' && (
        <div style={{ background: '#fff', padding: '25px', borderRadius: '10px', border: '1px solid #d8dde3' }}>
          <h2>Gestión de Usuarios Registrados</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f1f3f5', borderBottom: '2px solid #d8dde3' }}>
                <th style={{ padding: '12px' }}>Correo Electrónico</th>
                <th style={{ padding: '12px' }}>Rol Actual</th>
                <th style={{ padding: '12px' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map(u => {
                const esAdminActual = u.email === 'raul@gmail.com'; 

                return (
                  <tr key={u._id} style={{ borderBottom: '1px solid #e9ecef' }}>
                    <td style={{ padding: '12px', color: '#333' }}>
                      {u.email} {esAdminActual && <span style={{ fontSize: '0.8rem', color: '#d97706', fontWeight: 'bold' }}>(Tú)</span>}
                    </td>
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>
                      <span style={{ 
                        color: u.role === 'admin' ? '#d97706' : '#2b6cb0',
                        background: u.role === 'admin' ? '#fef3c7' : '#ebf8ff',
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '0.85rem'
                      }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: '12px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <select 
                        value={u.role} 
                        onChange={(e) => cambiarRol(u._id, e.target.value)}
                        disabled={esAdminActual}
                        style={{ padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e0', background: esAdminActual ? '#f1f3f5' : '#fff', cursor: esAdminActual ? 'not-allowed' : 'pointer' }}
                      >
                        <option value="cliente">Cliente</option>
                        <option value="admin">Admin</option>
                      </select>
                      
                      {!esAdminActual ? (
                        <button 
                          onClick={() => eliminarUsuario(u._id)} 
                          style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}
                        >
                          Eliminar
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: '#718096', fontStyle: 'italic' }}>Protegido</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* --- Pestaña Textos Web --- */}
      {pestaña === 'textos' && (
        <div style={{ background: '#fff', padding: '25px', borderRadius: '10px', border: '1px solid #d8dde3' }}>
          <h2>Textos de la Página Pública</h2>
          <form onSubmit={guardarConfiguracion} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
            <label style={{ fontWeight: 'bold' }}>Nombre de la Empresa:</label>
            <input type="text" name="empresa_nombre" value={config.empresa_nombre} onChange={handleConfigChange} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0' }} required />
            
            <label style={{ fontWeight: 'bold' }}>Título Principal (Inicio):</label>
            <input type="text" name="titulo_hero" value={config.titulo_hero} onChange={handleConfigChange} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0' }} required />

            <label style={{ fontWeight: 'bold' }}>Descripción Principal (Inicio):</label>
            <textarea name="descripcion_hero" value={config.descripcion_hero} onChange={handleConfigChange} rows="3" style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0' }} required></textarea>

            <label style={{ fontWeight: 'bold' }}>Email de Contacto:</label>
            <input type="email" name="email_contacto" value={config.email_contacto} onChange={handleConfigChange} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0' }} required />

            <label style={{ fontWeight: 'bold' }}>URL de Instagram:</label>
            <input type="text" name="instagram_url" value={config.instagram_url || ''} onChange={handleConfigChange} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0' }} />

            <label style={{ fontWeight: 'bold' }}>URL de LinkedIn:</label>
            <input type="text" name="linkedin_url" value={config.linkedin_url || ''} onChange={handleConfigChange} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0' }} />

            <label style={{ fontWeight: 'bold' }}>Imagen de Fondo (Hero):</label>
            <input type="file" onChange={(e) => setHeroImage(e.target.files[0])} style={{ padding: '10px' }} accept="image/*" />

            <button type="submit" style={{ padding: '12px', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
              Guardar Cambios
            </button>
          </form>
        </div>
      )}

      {/* --- Pestaña Cotizaciones --- */}
      {pestaña === 'cotizaciones' && (
        <div style={{ background: '#fff', padding: '25px', borderRadius: '10px', border: '1px solid #d8dde3' }}>
          <h2>Gestión de Cotizaciones</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f1f3f5', borderBottom: '2px solid #d8dde3' }}>
                <th style={{ padding: '12px' }}>Cliente</th>
                <th style={{ padding: '12px' }}>Proyecto</th>
                <th style={{ padding: '12px' }}>Estado</th>
                <th style={{ padding: '12px' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cotizaciones.map(cot => (
                <tr key={cot._id} style={{ borderBottom: '1px solid #e9ecef' }}>
                  <td style={{ padding: '12px' }}>{cot.email_cliente}</td>
                  <td style={{ padding: '12px', fontWeight: '600' }}>{cot.nombre_proyecto}</td>
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>{cot.estado}</td>
                  <td style={{ padding: '12px', display: 'flex', gap: '8px' }}>
                    <button onClick={() => cambiarEstadoCotizacion(cot._id, 'Aprobada')} style={{ background: '#2f855a', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Aprobar</button>
                    <button onClick={() => cambiarEstadoCotizacion(cot._id, 'Rechazada')} style={{ background: '#c53030', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Rechazar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --- Pestaña Proyectos --- */}
      {pestaña === 'proyectos' && (
        <div style={{ background: '#fff', padding: '25px', borderRadius: '10px', border: '1px solid #d8dde3' }}>
          <h2>{proyectoEditando ? 'Editar Proyecto' : 'Subir Nuevo Proyecto'}</h2>
          <form onSubmit={manejarProyecto} style={{ display: 'flex', flexDirection: 'column', gap: '15px', background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '30px', border: '1px solid #d8dde3' }}>
            <input type="text" placeholder="Título del render/proyecto" value={titulo} onChange={e => setTitulo(e.target.value)} required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0' }} />
            <textarea placeholder="Descripción técnica del trabajo" value={descripcion} onChange={e => setDescripcion(e.target.value)} required rows="3" style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0' }}></textarea>
            <label style={{ fontSize: '0.9rem', color: '#555' }}>
              {proyectoEditando ? 'Sube nuevas imágenes para reemplazar las actuales:' : 'Imágenes del proyecto:'}
            </label>
            <input type="file" onChange={e => setImagenes(e.target.files)} multiple required={!proyectoEditando} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', background: '#fff' }} accept="image/*" />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" style={{ flex: 1, padding: '10px', background: proyectoEditando ? '#2f855a' : '#1a1a1a', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                {proyectoEditando ? 'Guardar Cambios' : 'Subir Proyecto'}
              </button>
              {proyectoEditando && (
                <button type="button" onClick={cancelarEdicion} style={{ flex: 1, padding: '10px', background: '#718096', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Cancelar</button>
              )}
            </div>
          </form>

          <h3>Proyectos Publicados</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginTop: '15px' }}>
            {proyectos.map(proy => (
              <div key={proy._id} style={{ border: proy.destacado ? '2px solid #d97706' : '1px solid #d8dde3', padding: '12px', borderRadius: '8px', background: '#fff' }}>
                {proy.imagen_url && <img src={proy.imagen_url} alt={proy.titulo} style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '6px' }} />}
                <h4 style={{ margin: '10px 0 5px', color: '#1a1a1a' }}>{proy.titulo}</h4>
                <p style={{ fontSize: '0.9rem', color: '#555' }}>{proy.descripcion}</p>
                <button onClick={() => toggleDestacado(proy._id)} style={{ marginTop: '10px', padding: '8px', background: proy.destacado ? '#fef3c7' : '#f1f3f5', color: proy.destacado ? '#d97706' : '#333', border: 'none', borderRadius: '6px', cursor: 'pointer', width: '100%', fontWeight: 'bold' }}>
                  {proy.destacado ? '★ Destacado' : '☆ Destacar'}
                </button>
                <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                  <button onClick={() => iniciarEdicion(proy)} style={{ flex: 1, padding: '8px', background: '#3182ce', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Editar</button>
                  <button onClick={() => eliminarProyecto(proy._id)} style={{ flex: 1, padding: '8px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
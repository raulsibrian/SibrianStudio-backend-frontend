import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Cotizar() {
  const navigate = useNavigate();
  const [nombreProyecto, setNombreProyecto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [archivosReferencia, setArchivosReferencia] = useState([]);
  const [tienePlanos, setTienePlanos] = useState(false);
  const [archivosPlanos, setArchivosPlanos] = useState([]);
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert('Debes iniciar sesión para enviar una cotización.');
      navigate('/login');
      return;
    }

    const formData = new FormData();
    formData.append('nombre_proyecto', nombreProyecto);
    formData.append('descripcion', descripcion);

    for (let i = 0; i < archivosReferencia.length; i++) {
      formData.append('archivos', archivosReferencia[i]);
    }

    if (tienePlanos) {
      for (let i = 0; i < archivosPlanos.length; i++) {
        formData.append('planos', archivosPlanos[i]);
      }
    }

    try {
      const res = await fetch('http://127.0.0.1:5000/api/cotizaciones', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (res.ok) {
        alert('¡Solicitud de cotización enviada con éxito!');
        navigate('/mis-cotizaciones');
      } else {
        alert('Error al enviar la cotización.');
      }
    } catch (error) {
      console.error(error);
      alert('Error de conexión con el servidor.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div style={{ padding: '60px 20px', background: '#f8f9fa', minHeight: '85vh', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '650px', margin: '0 auto', background: '#ffffff', padding: '40px', borderRadius: '12px', border: '1px solid #d8dde3', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
        
        <h1 style={{ marginBottom: '25px', textAlign: 'center', color: '#1a1a1a', fontSize: '1.8rem', fontWeight: '800' }}>Solicitar Cotización</h1>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2d3748', fontSize: '0.95rem' }}>Nombre del proyecto *</label>
            <input 
              type="text" 
              value={nombreProyecto} 
              onChange={e => setNombreProyecto(e.target.value)} 
              required 
              placeholder="Ej. Remodelación Residencia Alta Vista"
              style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '1rem', boxSizing: 'border-box', outline: 'none' }} 
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2d3748', fontSize: '0.95rem' }}>Descripción detallada *</label>
            <textarea 
              value={descripcion} 
              onChange={e => setDescripcion(e.target.value)} 
              required 
              rows="4" 
              placeholder="Describe los espacios, dimensiones o requerimientos especiales..."
              style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '1rem', boxSizing: 'border-box', outline: 'none', resize: 'vertical' }}
            ></textarea>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2d3748', fontSize: '0.95rem' }}>Adjuntar archivos referenciales (opcional - múltiples)</label>
            <input 
              type="file" 
              multiple 
              onChange={e => setArchivosReferencia(e.target.files)} 
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', background: '#fdfdfd', fontSize: '0.95rem', boxSizing: 'border-box' }} 
              accept="image/*,.pdf"
            />
          </div>

          <div style={{ background: '#f1f3f5', padding: '15px', borderRadius: '8px', border: '1px solid #d8dde3' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: '600', color: '#2d3748' }}>
              <input 
                type="checkbox" 
                checked={tienePlanos} 
                onChange={e => setTienePlanos(e.target.checked)} 
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              ¿Tienes los planos 2D o modelos 3D?
            </label>

            {tienePlanos && (
              <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #d8dde3' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2d3748', fontSize: '0.95rem' }}>Adjuntar planos o modelos (PDF, Modelos 3D, Comprimidos .zip/.rar)</label>
                <input 
                  type="file" 
                  multiple 
                  onChange={e => setArchivosPlanos(e.target.files)} 
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', background: '#ffffff', fontSize: '0.95rem', boxSizing: 'border-box' }} 
                  accept=".pdf,.dwg,.zip,.rar,.obj,.fbx,.skp"
                />
              </div>
            )}
          </div>

          <button 
            type="submit" 
            disabled={enviando}
            style={{ 
              marginTop: '10px', 
              padding: '14px', 
              background: '#1a1a1a', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '6px', 
              fontWeight: 'bold', 
              fontSize: '1.05rem', 
              cursor: enviando ? 'not-allowed' : 'pointer', 
              transition: 'background 0.2s',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
            }}
          >
            {enviando ? 'Enviando solicitud...' : 'Enviar solicitud'}
          </button>

        </form>
      </div>
    </div>
  );
}
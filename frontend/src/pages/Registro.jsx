import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Registro() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const registrar = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      
      if (response.ok) {
        alert("Registro exitoso. Ahora inicia sesión.");
        navigate('/login');
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert("Error de conexión con el servidor");
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '60px auto', padding: '30px', fontFamily: 'sans-serif', background: '#f9f9f9', borderRadius: '8px', border: '1px solid #ddd', textAlign: 'center' }}>
      <h2 style={{ marginBottom: '20px' }}>Crear Cuenta</h2>
      <form onSubmit={registrar} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Correo electrónico" required style={{ padding: '12px', borderRadius: '4px', border: '1px solid #ccc' }} />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" required style={{ padding: '12px', borderRadius: '4px', border: '1px solid #ccc' }} />
        <button type="submit" style={{ padding: '12px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
          Registrarse
        </button>
      </form>
      <p style={{ marginTop: '20px', fontSize: '0.9rem' }}>
        ¿Ya tienes cuenta? <Link to="/login" style={{ color: '#007bff' }}>Inicia sesión aquí</Link>
      </p>
    </div>
  );
}
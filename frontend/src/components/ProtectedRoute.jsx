import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, roleRequired }) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  // Si no hay token, lo enviamos al login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Si la ruta exige un rol específico (como 'admin') y el usuario no lo tiene
  if (roleRequired && role !== roleRequired) {
    alert("No tienes permisos para acceder a esta página.");
    return <Navigate to="/" replace />;
  }

  return children;
}
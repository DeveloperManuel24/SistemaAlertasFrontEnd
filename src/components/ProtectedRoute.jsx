import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

export default function ProtectedRoute({ requireAdmin = false }) {
  const token = localStorage.getItem('AUTH_TOKEN');

  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  // Decodificar el token para verificar si tiene el rol de administrador
  const decodedToken = jwtDecode(token);
  const isAdmin = decodedToken.esadmin === 'true';

  if (requireAdmin && !isAdmin) {
    // Si se requiere ser administrador y el usuario no lo es, redirige a una página de acceso denegado
    return <Navigate to="/acceso-denegado" replace />;
  }

  return <Outlet />;
}

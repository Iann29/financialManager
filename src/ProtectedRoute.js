import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const { user } = useAuth();

  if (!user) {
    toast.error('Você precisa estar logado para acessar esta página.');
    return <Navigate to="/login" />;
  }

  return <Component {...rest} userId={user.id} />;
};

export default ProtectedRoute;

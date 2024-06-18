import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      toast.error('Você precisa estar logado para acessar esta página.');
    }
  }, [user, isLoading]);

  if (isLoading) {
    return <div>Loading...</div>; 
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <Component {...rest} userId={user.id} />;
};

export default ProtectedRoute;

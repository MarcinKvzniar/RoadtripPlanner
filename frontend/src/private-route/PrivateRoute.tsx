import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute: React.FC<{ element: JSX.Element }> = ({ element }) => {
  const { accessToken } = useAuth();

  return accessToken ? element : <Navigate to="/users/login" replace />;
};

export default PrivateRoute;

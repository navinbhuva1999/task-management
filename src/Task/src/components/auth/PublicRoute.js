import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../../utils/auth/authUtils';


const PublicRoute = ({ children, restricted = false }) => {
  const location = useLocation();
  const authenticated = isAuthenticated();
  const from = location.state?.from?.pathname || '/dashboard';

  if (authenticated && restricted) {
    return <Navigate to={from} replace />;
  }

  return children;
};

export default PublicRoute; 
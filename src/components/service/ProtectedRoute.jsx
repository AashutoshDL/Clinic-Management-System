import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, checkAuth } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Check authentication on mount
    checkAuth();
  }, []);

  // If no access token in cookies, redirect to homepage
  if (!Cookies.get('accessToken')) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If user is not logged in, redirect to homepage
  if (!isLoggedIn) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;

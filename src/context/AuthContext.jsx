import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios'; // To make API requests

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState(null);

  // Function to check if the user is authenticated
  const checkAuth = async () => {
    try {
      const response = await axios.get('http://localhost:3001/me', {
        withCredentials: true,
      });
      // If the request is successful, the user is authenticated
      setIsLoggedIn(true);
      setUserId(response.data.id);  // Set userId from the server response
      setRole(response.data.role);  // Set user role from the server response
    } catch (error) {
      console.error('Error checking authentication:', error);
      setIsLoggedIn(false);
      setUserId(null);
      setRole(null);
    }
  };
  // Check if the user is authenticated when the app loads
  useEffect(() => {
    checkAuth();
  }, []);

  // Login function
  const login = (userId, role) => {
    setIsLoggedIn(true);
    setUserId(userId);
    setRole(role);
  };

  // Logout function: send a request to clear cookies on the backend
  const logout = async () => {
    try {
      // Send a request to the backend to clear the session
      await axios.post('http://localhost:3001/auth/logout', {}, { withCredentials: true });

      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      setIsLoggedIn(false);
      setUserId(null);
      setRole(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userId, role, login, logout, checkAuth}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

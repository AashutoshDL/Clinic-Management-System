import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';



const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState(null);

  const checkAuth = async () => {
    try {
      const response = await axios.get('http:
        withCredentials: true,
      });

      setIsLoggedIn(true);
      setUserId(response.data.id);  
      setRole(response.data.role);  
    } catch (error) {

      setIsLoggedIn(false);
      setUserId(null);
      setRole(null);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = (userId, role) => {
    setIsLoggedIn(true);
    setUserId(userId);
    setRole(role);
  };

  const logout = async () => {
    try {

      await axios.post('http:

      Cookies.remove('accessToken');
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

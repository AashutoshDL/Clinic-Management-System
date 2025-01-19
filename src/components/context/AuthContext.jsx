import React, { createContext, useState, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Load user data from cookies on app initialization
    const storedUser = Cookies.get('user');
    if (storedUser) {
      try {
        setIsLoggedIn(true);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing user data from cookie:', error);
        // Handle error or reset user data
      }
    }
  }, []);

  const login = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    // Save user data in cookies
    Cookies.set('user', JSON.stringify(userData), { expires: 7, secure: true });
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    // Remove user data from cookies
    Cookies.remove('user');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
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

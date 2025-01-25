import React, { createContext, useState, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Load user ID from cookies on app initialization
    const storedUserId = Cookies.get('userId');
    if (storedUserId) {
      setIsLoggedIn(true);
      setUserId(storedUserId);
    }
  }, []);

  const login = (userId) => {
    setIsLoggedIn(true);
    setUserId(userId);
    // Save user ID and tokens in cookies
    Cookies.set('userId', userId, { expires: 7, secure: true });
    // Cookies.set('accessToken', accessToken, { expires: 7, secure: true });
    // Cookies.set('refreshToken', refreshToken, { expires: 7, secure: true });
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserId(null);

    // Remove user ID and tokens from cookies
    Cookies.remove('userId');
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userId, login, logout }}>
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

import { createContext, useState, useEffect } from 'react';
import axios from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [user, setUser] = useState(
    localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null
  );

  useEffect(() => {
    // Try to get user from localStorage first
    const storedUser = localStorage.getItem('user');
    if (localStorage.getItem('token') && !user) {
      let userId = null;
      if (storedUser) {
        try {
          userId = JSON.parse(storedUser).id;
        } catch {
          userId = null;
        }
      }
      if (userId) {
        axios.get(`/users/${userId}`)
          .then(res => setUser(res.data.user)) 
          .catch(() => setUser(null));
      }
    }
  }, [isLoggedIn]);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsLoggedIn(true);
    setUser(userData);
  };

  const logout = async () => {
    try {
      await axios.post('/logout');
    } catch {}
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
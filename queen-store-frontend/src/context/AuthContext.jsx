// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';  // ← CORRIGIDO: named import

export const AuthContext = createContext();

// Hook personalizado pra usar o contexto
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('queen_token');
    if (token) {
      try {
        const decoded = jwtDecode(token);  // ← agora funciona
        if (decoded.exp * 1000 > Date.now()) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          setCliente({ clienteId: decoded.clienteId });
        } else {
          logout();
        }
      } catch (err) {
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = (token) => {
    localStorage.setItem('queen_token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const decoded = jwtDecode(token);
    setCliente({ clienteId: decoded.clienteId });
  };

  const logout = () => {
    localStorage.removeItem('queen_token');
    delete axios.defaults.headers.common['Authorization'];
    setCliente(null);
  };

  return (
    <AuthContext.Provider value={{ cliente, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
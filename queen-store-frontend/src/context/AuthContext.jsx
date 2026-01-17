// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('queen_token');
    delete axios.defaults.headers.common['Authorization'];
    setCliente(null);
    // navigate('/') → removido daqui, quem chama logout já redireciona
  }, []); // ← sem dependência de navigate aqui (já que não redireciona mais)

  useEffect(() => {
    const token = localStorage.getItem('queen_token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
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
  }, [logout]);  // ← ADICIONE logout AQUI (resolve o warning)

  const login = useCallback((token, clienteData) => {
    localStorage.setItem('queen_token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setCliente(clienteData);
    // quem chama login faz o navigate
  }, []);

  return (
    <AuthContext.Provider value={{ cliente, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
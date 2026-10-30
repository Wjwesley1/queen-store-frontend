// src/hooks/useInactivityLogout.js
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutos

export default function useInactivityLogout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let timeoutId;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        logout();
        navigate('/'); // ou '/login'
        alert('Sua sessão expirou por inatividade. Faça login novamente.');
      }, INACTIVITY_TIMEOUT);
    };

    const events = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetTimer));

    resetTimer();

    return () => {
      clearTimeout(timeoutId);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [logout, navigate]);
}
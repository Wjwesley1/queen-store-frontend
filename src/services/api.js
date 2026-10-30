import axios from 'axios';

// Em produção no Vercel, a API roda no mesmo domínio (URL relativa '')
const API_URL = process.env.REACT_APP_API_URL || '';

const getSessionId = () => {
  let sessionId = localStorage.getItem('queen_session');
  if (!sessionId) {
    sessionId = 'web_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('queen_session', sessionId);
  }
  return sessionId;
};

const api = axios.create({
  baseURL: API_URL,
  headers: { 'x-session-id': getSessionId() }
});

export default api;

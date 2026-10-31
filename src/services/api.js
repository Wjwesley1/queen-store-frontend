import axios from "axios";

// Em produção no Vercel, a API roda no mesmo domínio (URL relativa '')
let apiUrl = process.env.REACT_APP_API_URL || "";
if (apiUrl.includes("queen-store-api.onrender.com")) {
  apiUrl = "";
}

const getSessionId = () => {
  let sessionId = localStorage.getItem("queen_session");
  if (!sessionId) {
    sessionId =
      "web_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
    localStorage.setItem("queen_session", sessionId);
  }
  return sessionId;
};

const api = axios.create({
  baseURL: apiUrl,
  headers: { "x-session-id": getSessionId() },
});

// Interceptor para injetar dinamicamente o token de autenticação e sessão em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("queen_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers["x-session-id"] = getSessionId();
  return config;
});

export default api;

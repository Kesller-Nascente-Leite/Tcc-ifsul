import axios from "axios";

export const api = axios.create({
   baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api", // para desenvolvimento local
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token && config.url && !config.url.includes("/api/auth/")) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// interceptor de resposta para 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido ou expirado
      console.error("Token inválido! Redirecionando para login...");
      localStorage.removeItem("access_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

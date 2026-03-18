import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";
export const api = axios.create({
  baseURL: baseURL,
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    // Adiciona token em todas as requisições, exceto /auth
    if (token && config.url && !config.url.includes("/auth/")) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isAuthRoute =
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/register");

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthRoute
    ) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refresh_token");

      if (refreshToken) {
        try {
          const response = await api.post("/auth/refresh", { refreshToken });
          const newAccessToken = response.data.accessToken;
          localStorage.setItem("access_token", newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          console.error("Refresh token inválido, fazendo logout...");
          localStorage.clear();
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      } else {
        localStorage.clear();
        window.location.href = "/login";
      }
    }

    if (error.response?.status === 403 && !isAuthRoute) {
      console.error("Acesso negado - permissão insuficiente");
      localStorage.clear();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

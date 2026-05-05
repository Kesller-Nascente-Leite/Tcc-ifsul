import { api } from "@/shared/api/http";

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
  message: string;
}

export interface AuthUser {
  id: number;
  fullName: string;
  email: string;
  role: string;
  avatarUrl?: string | null;
}

export const AuthApi = {
  register: (payload: RegisterRequest) => {
    return api.post<RegisterResponse>("/auth/register", payload);
  },

  login: (payload: LoginRequest) => {
    return api.post<LoginResponse>("/auth/login", payload);
  },

  validateToken: () => api.get("/auth/validate"),

  refreshToken: (refreshToken: string) =>
    api.post<LoginResponse>("/auth/refresh", { refreshToken }),
};

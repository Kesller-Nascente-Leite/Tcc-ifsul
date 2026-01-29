import { api } from "./http";

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
  refreshToken?: string;
  user: {
    id: number;
    fullName: string;
    email: string;
    role: string;
  };
}

export const AuthApi = {
  register: (payload: RegisterRequest) => {
    return api.post<RegisterResponse>("/auth/register", payload);
  },

  login: (payload: LoginRequest) => {
    return api.post<LoginResponse>("/auth/login", payload);
  },
};

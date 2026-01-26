import { api } from "./http";

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface AuthReponse {
  accessToken: string;
  refreshToken?: string;
}

export const AuthApi = {
  register: (payload: RegisterRequest) => {
    return api.post<AuthReponse>("/auth/register", payload);
  },
  // fazer login depois
};

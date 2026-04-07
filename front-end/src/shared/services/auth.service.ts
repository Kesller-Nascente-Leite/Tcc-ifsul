import {
  AuthApi,
  type RegisterRequest,
  type LoginRequest,
} from "@/features/auth/api/auth.api";

export const AuthService = {
  async register(data: RegisterRequest) {
    const response = await AuthApi.register(data);
    return response.data;
  },
  async login(data: LoginRequest) {
    const response = await AuthApi.login(data);
    localStorage.setItem("access_token", response.data.accessToken);
    localStorage.setItem("refresh_token", response.data.refreshToken)
    localStorage.setItem("user", JSON.stringify(response.data.user));
    return response.data;
  },
};
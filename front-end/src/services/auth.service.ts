import { AuthApi, type RegisterRequest } from "../api/auth.api";

export const AuthService = {
  async register(data: RegisterRequest) {
    const response = await AuthApi.register(data);
    localStorage.setItem("access_token", response.data.accessToken);
    return response.data;
  },
};

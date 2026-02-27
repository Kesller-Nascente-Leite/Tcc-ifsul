import { createContext, useContext, useState, useEffect, type ReactNode} from "react";
import { useNavigate } from "react-router";
import { AuthApi, type LoginRequest, type RegisterRequest } from "../api/auth.api";
import { useTokenValidation } from "../hooks/useTokenValidation";

interface User {
  id: number;
  fullName: string;
  email: string;
  role: string;
}

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Valida token periodicamente
  useTokenValidation();

  // Carrega usuário do localStorage ao iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("access_token");

    if (storedUser && token) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
        localStorage.clear();
      }
    }

    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await AuthApi.login(credentials);
      const { accessToken, refreshToken, user: userData } = response.data;

      localStorage.setItem("access_token", accessToken);
      if (refreshToken) {
        localStorage.setItem("refresh_token", refreshToken);
      }
      localStorage.setItem("user", JSON.stringify(userData));

      setUser(userData);

      // Redireciona baseado na role
      if (userData.role === "TEACHER") {
        navigate("/teacher/dashboard");
      } else if (userData.role === "STUDENT") {
        navigate("/student/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      throw error;
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      await AuthApi.register(data);
      navigate("/login");
    } catch (error) {
      console.error("Erro ao registrar:", error);
      throw error;
    }
  };

  const logout = () => {
    AuthApi.logout().catch(console.error);
    localStorage.clear();
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
};
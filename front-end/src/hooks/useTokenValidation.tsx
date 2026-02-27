import { useEffect } from "react";
import { useNavigate } from "react-router";
import { AuthApi } from "../api/auth.api";

export function useTokenValidation() {
  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = async () => {
      try {
        const token = localStorage.getItem("access_token");

        if (!token) {
          return;
        }

        const lastValidation = localStorage.getItem("last_token_validation");
        const now = Date.now();

        // Valida a cada 15 minutos
        if (lastValidation && now - parseInt(lastValidation) < 15 * 60 * 1000) {
          return;
        }

        await AuthApi.validateToken();
        localStorage.setItem("last_token_validation", now.toString());
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error("Token inválido, fazendo logout...", error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          console.log("Token inválido detectado, fazendo logout...");
          localStorage.clear();
          navigate("/login");
        }
      }
    };

    // assim que eu terminar o back-end vou colocar para funcionar a validação do token, por enquanto só tem o refresh token
    // validateToken();

    const interval = setInterval(validateToken, 15 * 60 * 1000);

    return () => clearInterval(interval);
  }, [navigate]);
}

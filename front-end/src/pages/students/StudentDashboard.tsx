import { useEffect, useState } from "react";
import type { User } from "../../types/User";
import { ButtonComponent } from "../../components/partials/ButtonComponent";
import { useNavigate } from "react-router";
import { AuthService } from "../../services/auth.service";
import axios from "axios";
export function StudentDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await AuthService.logout();

      navigate("/", {
        state: {
          successMessage: "Usuário deslogado com sucesso.",
        },
      });
    } catch (err: unknown) {
      console.error(err);

      if (axios.isAxiosError(err)) {
        const message =
          err.response?.data?.message ||
          (err.code === "ERR_NETWORK"
            ? "Erro de conexão com o servidor."
            : "Credenciais inválidas.");
        setGeneralError(message);
      } else {
        setGeneralError("Ocorreu um erro inesperado.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);
  return (
    <div>
      {generalError && (
        <div className="mb-4 p-3 text-sm text-red-600 bg-red-100 border border-red-200 rounded-md">
          {generalError}
        </div>
      )}

      <h1>
        Seja bem vindo ao dashboard dos estudantes{" "}
        <strong>{user ? user.fullName : "Carregando..."}</strong>
      </h1>

      <ButtonComponent
        size="md"
        type="submit"
        isLoading={isLoading}
        onClick={handleLogout}
      >
        Logout
      </ButtonComponent>
    </div>
  );
}

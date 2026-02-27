import { Link, useNavigate } from "react-router";
import { ArrowRight, MessageSquareWarning } from "lucide-react";
import Logo from "../../assets/Logo.png";
import { FormComponent } from "../../components/ui/FormComponent";
import { InputComponent } from "../../components/ui/InputComponent";
import { ButtonComponent } from "../../components/ui/ButtonComponent";
import type React from "react";
import { useState, type ChangeEvent, type FormEvent as FormEventType } from "react";
import axios from "axios";
import { AuthService } from "../../services/auth.service";

export function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const [generalErro, setGeneralErro] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>, field: string) => {
    setFormData({ ...formData, [field]: e.target.value });
    if (generalErro) setGeneralErro("");
  };

  const validate = () => {
    const newError = {
      email: "",
      password: "",
    };
    let isValid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newError.email = "Insira um E-mail válido";
      isValid = false;
    }

    if (formData.password.length < 8) {
      newError.password = "Sua senha deve conter pelo menos 8 caracteres";
      isValid = false;
    }
    setError(newError);
    return isValid;
  };

  const handleLoginSubmit = async (e: FormEventType) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    setGeneralErro("");

    try {
      const payload = {
        password: formData.password,
        email: formData.email,
      };

      const responseData = await AuthService.login(payload);

      const userRole = responseData.user.role;

      if (userRole === "ADMIN") {
        navigate("/admin/dashboard");
      } else if (userRole === "TEACHER") {
        navigate("/teacher/dashboard");
      }
      else{
        navigate("/student/dashboard")
      }
    } catch (err: unknown) {
      console.error(err);

      if (axios.isAxiosError(err)) {
        const message =
          err.response?.data?.message ||
          (err.code === "ERR_NETWORK"
            ? "Erro de conexão com o servidor."
            : "Credenciais inválidas.");
        setGeneralErro(message);
      } else {
        setGeneralErro("Ocorreu um erro inesperado.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-surface rounded-2xl shadow-xl border border-border overflow-hidden">
        <div className="p-8 pb-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
            <img src={Logo} className="max-w-28 h-auto" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary">
            Bem-vindo de volta
          </h2>
          <p className="text-text-secondary text-sm mt-2">
            Acesse sua conta para continuar seus estudos.
          </p>
        </div>

        <div className="p-8 pt-0">
          {generalErro && (
            <div className="p-3 mt-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 animate-in slide-in-from-top-2">
              <span>
                <MessageSquareWarning /> {generalErro}
              </span>
            </div>
          )}
          <FormComponent onSubmit={handleLoginSubmit}>
            <div className="space-y-5">
              <InputComponent
                labelText="E-mail"
                type="email"
                placeholder="seu@email.com"
                required
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleChange(e, "email");
                }}
                error={error.email}
              />

              <div className="space-y-1">
                <InputComponent
                  labelText="Senha"
                  type="password"
                  placeholder="********"
                  required
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handleChange(e, "password");
                  }}
                  error={error.password}
                />
                <div className="flex justify-end">
                  <a
                    href="#"
                    className="text-xs text-primary hover:underline font-medium"
                  >
                    Esqueceu a senha?
                  </a>
                </div>
              </div>

              <ButtonComponent
                type="submit"
                variant="primary"
                fullWidth
                size="lg"
                className="shadow-md shadow-(--color-primary)/20"
                isLoading={isLoading}
              >
                Entrar na plataforma
              </ButtonComponent>
            </div>
          </FormComponent>

          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-sm text-text-secondary">
              Ainda não tem uma conta?{" "}
              <Link
                to="/register"
                className="text-primary font-bold hover:text-primary-hover inline-flex items-center gap-1 transition-colors"
              >
                Cadastre-se agora
                <ArrowRight size={14} />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

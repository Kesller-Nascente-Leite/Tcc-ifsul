import { useState, type ChangeEvent, type FormEvent } from "react";
import { FormComponent } from "../../components/ui/FormComponent";
import { InputComponent } from "../../components/ui/InputComponent";
import { ButtonComponent } from "../../components/ui/ButtonComponent";
import { useNavigate } from "react-router";
import axios from "axios";
import { AuthService } from "../../services/auth.service";

export function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>, field: string) => {
    setFormData({ ...formData, [field]: e.target.value });
    if (generalError) setGeneralError("");
  };

  const validate = () => {
    let isValid = true;
    const newErrors = { fullName: "", email: "", password: "" };

    if (formData.fullName.length < 3) {
      newErrors.fullName = "O nome deve conter pelo menos 3 caracteres";
      isValid = false;
    }

    if (!formData.email.includes("@")) {
      newErrors.email = "Insira um e-mail válido";
      isValid = false;
    }

    if (formData.password.length < 8) {
      newErrors.password = "Sua senha deve conter pelo menos 8 caracteres";
      isValid = false;
    }

    setError(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setGeneralError("");

    try {
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      };
      const responseData = await AuthService.register(payload);

      navigate("/login", {
        state: { successMessage: responseData.message },
      });
    } catch (err: unknown) {
      console.error(err);

      if (axios.isAxiosError(err)) {
        const message =
          err.response?.data?.message || "Erro ao cadastrar usuário.";
        setGeneralError(message);
      } else {
        setGeneralError("Ocorreu um erro inesperado.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg-main p-4">
      <div className="w-full max-w-md space-y-6 rounded-lg border bg-surface p-8 shadow-sm border-border">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text-primary">Criar conta</h1>
          <p className="text-sm text-text-secondary">
            Comece a organizar seus estudos hoje.
          </p>
        </div>

        {generalError && (
          <div className="mb-4 p-3 text-sm text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-md">
            {generalError}
          </div>
        )}

        <FormComponent onSubmit={handleSubmit}>
          <InputComponent
            required
            type="text"
            labelText="Nome de Usuário:"
            placeholder="Ex: Fulano"
            value={formData.fullName}
            onChange={(e) => handleChange(e, "fullName")}
            error={error.fullName}
          />

          <InputComponent
            required
            type="email"
            labelText="E-mail"
            placeholder="Ex: fulaninho@teste.com"
            value={formData.email}
            onChange={(e) => handleChange(e, "email")}
            error={error.email}
          />

          <div>
            <InputComponent
              type="password"
              labelText="Senha"
              placeholder="********"
              value={formData.password}
              autoComplete="off"
              onChange={(e) => handleChange(e, "password")}
            />
            {error.password && (
              <p className="text-xs text-red-500 mt-1 ml-1">{error.password}</p>
            )}
          </div>

          <ButtonComponent
            type="submit"
            fullWidth
            isLoading={isLoading}
            size="lg"
          >
            Cadastre-se
          </ButtonComponent>
        </FormComponent>
      </div>
    </main>
  );
}

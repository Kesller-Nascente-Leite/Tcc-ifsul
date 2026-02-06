import { useState, type ChangeEvent, type FormEvent } from "react";
import { FormComponent } from "../../components/partials/FormComponent";
import { InputComponent } from "../../components/partials/InputComponent";
import { ButtonComponent } from "../../components/partials/ButtonComponent";
import { useNavigate } from "react-router";
import axios from "axios";
import { AuthService } from "../../services/auth.service";

export function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  // "Guardar" os dados do formulario
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  // estado para erro
  const [error, setError] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  //estado de carregamento, muito massa
  const [isLoading, setIsLoading] = useState(false);

  const [generalError, setGeneralError] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>, field: string) => {
    setFormData({ ...formData, [field]: e.target.value });
    // limpa o erro quando o usuario digitar algo
    if (generalError) setGeneralError("");
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
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
      //primeiro prepara o objeto como o java esta esperando
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      };
      const responseData = await AuthService.register(payload);

      navigate("/login", {
        state: {
          successMessage: responseData.message,
        },
      });
    } catch (err: unknown) {
      console.error(err);

      // Verifica se o erro é uma instância do AxiosError
      if (axios.isAxiosError(err)) {
        // Agora o TypeScript sabe que 'err' tem a propriedade 'response'
        const message =
          err.response?.data?.message || "Erro ao cadastrar usuário.";
        setGeneralError(message);
      } else {
        // Para erros que não são do Axios (ex: erro de código)
        setGeneralError("Ocorreu um erro inesperado.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-6 rounded-lg border bg-white p-8 shadow-sm">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Criar conta</h1>
          <p className="text-sm text-gray-500">
            Comece a organizar seus estudos hoje.
          </p>
        </div>
        {generalError && (
          <div className="mb-4 p-3 text-sm text-red-600 bg-red-100 border border-red-200 rounded-md">
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange(e, "fullName")
            }
            error={error.fullName}
          />

          <InputComponent
            required
            type="email"
            labelText="E-mail"
            placeholder="Ex: fulaninho@teste.com"
            value={formData.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange(e, "email")
            }
            error={error.email}
          />
          <div className="relative">
            <InputComponent
              required
              type={showPassword ? "text" : "password"}
              labelText="Senha"
              placeholder="********"
              value={formData.password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleChange(e, "password");
              }}
              error={error.password}
            />
            <button
              type="button"
              className="text-xs text-blue-600 hover:text-blue-800 mt-1"
              onClick={toggleShowPassword}
            >
              {showPassword ? "Esconder senha" : "Mostrar senha"}
            </button>
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

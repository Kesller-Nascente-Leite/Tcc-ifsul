import { useState, type ChangeEvent, type FormEvent } from "react";
import { FormComponent } from "../../components/FormComponent";
import { InputComponent } from "../../components/InputComponent";
import { ButtonComponent } from "../../components/ButtonComponent";

export function Register() {
  // "Guardar" os dados do formulario
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
  });
  // estado para erro
  const [error, setError] = useState({
    fullname: "",
    email: "",
    password: "",
  });
  //estado de carregamento, muito massa
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, field: string) => {
    setFormData({ ...formData, [field]: e.target.value });
  };
  const validate = () => {
    let isValid = true;
    const newErrors = { fullname: "", email: "", password: "" };

    if (formData.fullname.length < 3) {
      newErrors.fullname = "O nome deve conter pelo menos 3 caracteres";
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

        <FormComponent onSubmit={handleSubmit}>
          <InputComponent
            labelText="Nome de Usuário:"
            placeholder="Ex: Fulano"
            value={formData.fullname}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange(e, "name")
            }
            error={error.fullname}
          />

          <InputComponent
            labelText="E-mail"
            placeholder="Ex: fulaninho@teste.com"
            value={formData.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange(e, "email")
            }
            error={error.email}
          />

          <InputComponent
            labelText="Senha"
            placeholder="********"
            value={formData.password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              handleChange(e, "password");
            }}
            error={error.password}
          />

          <ButtonComponent
            type="submit"
            fullWidth
            isLoading={isLoading}
            className="mt-3"
          >
            Cadastre-se
          </ButtonComponent>
        </FormComponent>
      </div>
    </main>
  );
}

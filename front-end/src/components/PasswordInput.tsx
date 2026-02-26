import { useState } from "react";
import { InputComponent } from "./InputComponent";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
  label: string;
  value: string;
  autoComplete?: "on" | "off" | "new-password" | "current-password";
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function PasswordInput({
  label,
  value,
  autoComplete = "off",
  onChange,
  error,
  placeholder = "Digite sua senha",
  disabled = false,
}: PasswordInputProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-text-primary ml-1">
        {label}
      </label>
      <div className="relative">
        <InputComponent
          autoComplete={autoComplete}
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          error={error}
          placeholder={placeholder}
          disabled={disabled}
          className="pr-10"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          disabled={disabled}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={show ? "Ocultar senha" : "Mostrar senha"}
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}
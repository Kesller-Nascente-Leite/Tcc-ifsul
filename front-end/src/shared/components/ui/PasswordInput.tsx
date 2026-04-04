import { useState } from "react";
import { InputComponent } from "@/shared/components/ui/InputComponent";
import { Eye, EyeOff } from "lucide-react";
import { Button, Label } from "react-aria-components";

interface PasswordInputProps {
  label: string;
  value: string;
  placeholder: string;
  error?: string;
  autoComplete?: "on" | "off";
  required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function PasswordInput({
  label,
  value,
  placeholder,
  error,
  autoComplete,
  required,
  onChange,
}: PasswordInputProps) {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-2">
      <Label className="text-sm font-bold text-slate-500 dark:text-slate-400 ml-1">
        {label}
      </Label>
      <div className="relative">
        <InputComponent
          autoComplete={autoComplete ?? "off"}
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          required={required}
          className="pr-10"
          placeholder={placeholder}
        />
        <Button
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </Button>
      </div>
      {error && (
        <span className="text-xs text-error font-medium text-red-600">
          {error}
        </span>
      )}
    </div>
  );
}

import { useState } from "react";
import { InputComponent } from "./InputComponent";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
  label: string;
  value: string;
  autoComplete?: "on" | "off";
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function PasswordInput({
  label,
  value,
  autoComplete,
  onChange,
}: PasswordInputProps) {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-2">
      <label className="text-sm font-bold text-slate-500 dark:text-slate-400 ml-1">
        {label}
      </label>
      <div className="relative">
        <InputComponent
          autoComplete={autoComplete ?? "off"}
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-800 dark:text-slate-100 pr-10"
        />
        <button
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}

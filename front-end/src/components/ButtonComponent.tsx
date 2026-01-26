import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  isLoading?: boolean;
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export function ButtonComponent({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  isLoading = false,
  className = "",
  ...props
}: ButtonProps) {
  // 1. Base dos estilos
  const baseStyles =
    "flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 duration-300";

  // 2. Mapeamento das variantes
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary:
      "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500",
    outline:
      "border border-gray-300 bg-transparent hover:bg-gray-100 text-gray-700",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-600",
  };

  // 3. Mapeamento dos tamanhos
  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
  };

  // 4. Montagem da classe final (Template String)
  const finalClass = `
    ${baseStyles} 
    ${variants[variant]} 
    ${sizes[size]} 
    ${fullWidth ? "w-full" : ""} 
    ${className}
  `.trim();

  return (
    <button
      className={finalClass}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          {/* Spinner SVG */}
          <svg
            className="h-4 w-4 animate-spin text-current"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Carregando...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}

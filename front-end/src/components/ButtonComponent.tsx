import type { ButtonHTMLAttributes, ReactNode } from "react";
// Tive que comentar, estava muito confuso oq cada coisa fazia 
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
    "flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 duration-300 mt-3";

  // 2. Mapeamento das variantes
  const variants = {
    primary:
      "bg-(--color-primary) text-white hover:bg-(--color-primary-hover) focus:ring-(--color-primary)/50",
    secondary:
      "bg-(--color-secondary) text-white hover:opacity-90 focus:ring-(--color-secondary)/50",
    outline:
      "border border-(--color-border) bg-transparent hover:bg-(--color-bg-main) text-(--color-text-primary)",
    danger:
      "bg-(--color-error) text-white hover:opacity-90 focus:ring-(--color-error)/50",
    ghost:
      "bg-transparent hover:bg-(--color-primary)/10 text-(--color-text-secondary) hover:text-(--color-primary)",
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

import { type ReactNode } from "react";
import {
  Button,
  type ButtonProps as AriaButtonProps,
} from "react-aria-components";

interface ButtonComponentProps extends Omit<AriaButtonProps, "className"> {
  children: ReactNode;
  isLoading?: boolean;
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  className?: string;
}

export function ButtonComponent({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  isLoading = false,
  className = "",
  isDisabled,
  ...props
}: ButtonComponentProps) {
  // Estilos base com estados de foco e pressed do react-aria
  const baseStyles =
    "flex items-center justify-center rounded-lg font-medium transition-all duration-200 " +
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " +
    "disabled:pointer-events-none disabled:opacity-50 " +
    "pressed:scale-95 active:scale-95";

  // Variantes com CSS variables corretas
  const variantStyles = {
    primary:
      "bg-primary text-white hover:bg-primary-hover " +
      "focus-visible:ring-primary/50 " +
      "shadow-sm hover:shadow-md",

    secondary:
      "bg-secondary text-white hover:opacity-90 " +
      "focus-visible:ring-secondary/50 " +
      "shadow-sm hover:shadow-md",

    outline:
      "border-2 border-border bg-transparent hover:bg-bg-main " +
      "text-text-primary hover:border-primary " +
      "focus-visible:ring-primary/30",

    danger:
      "bg-red-600 text-white hover:bg-red-700 " +
      "focus-visible:ring-red-500/50 " +
      "shadow-sm hover:shadow-md",

    ghost:
      "bg-transparent hover:bg-primary/10 " +
      "text-text-secondary hover:text-primary " +
      "focus-visible:ring-primary/30",
  };

  // Tamanhos
  const sizeStyles = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
  };

  // Classe final
  const buttonClass = [
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    fullWidth ? "w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return (
    <Button
      type={props.type || "submit"}
      className={buttonClass}
      isDisabled={isLoading || isDisabled}
      {...props}
    >
      {() => {
        return (
          <div>
            {isLoading ? (
              <>
                {/* Spinner animado */}
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Carregando...</span>
              </>
            ) : (
              children
            )}
          </div>
        );
      }}
    </Button>
  );
}

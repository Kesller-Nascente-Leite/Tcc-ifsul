import type { ReactNode } from "react";

interface FieldLabelProps {
  children: ReactNode;
  required?: boolean;
}

export function FieldLabel({ children, required = false }: FieldLabelProps) {
  return (
    <label
      className="mb-2 block text-sm font-medium"
      style={{ color: "var(--color-text-secondary)" }}
    >
      {children}
      {required && " *"}
    </label>
  );
}
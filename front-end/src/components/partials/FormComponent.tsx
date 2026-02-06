import type { ReactNode } from "react";
import type React from "react";

interface FormProps {
  onSubmit?: (event: React.FormEvent) => void;
  children?: ReactNode;
}

export function FormComponent({ onSubmit, children }: FormProps) {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (onSubmit) return onSubmit(event);
  };
  return <form onSubmit={handleSubmit}>{children}</form>;
}

import type { ReactNode } from "react";
import type React from "react";
import { Form } from "react-aria-components";

interface FormProps {
  onSubmit?: (event: React.FormEvent) => void;
  children?: ReactNode;
}

export function FormComponent({ onSubmit, children }: FormProps) {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (onSubmit) return onSubmit(event);
  };
  return <Form onSubmit={handleSubmit}>{children}</Form>;
}

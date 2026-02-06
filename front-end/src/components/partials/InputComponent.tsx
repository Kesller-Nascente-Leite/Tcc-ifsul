import { useId, type ComponentPropsWithRef } from "react";

interface InputProps extends ComponentPropsWithRef<"input"> {
  labelText?: string;
  error?: string;
}

export function InputComponent({
  labelText,
  error,
  ref,
  className,
  ...props
}: InputProps) {
  const inputId = useId();

  return (
    <div className="flex flex-col gap-1.5 w-full text-left">
      {labelText && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-(--color-text-primary)"
        >
          {labelText}
        </label>
      )}

      <input
        id={inputId}
        ref={ref}
        data-error={!!error}
        className={`
          bg-(--color-surface)
          text-(--color-text-primary)
          placeholder:text-(--color-text-secondary)
          border 
          border-(--color-border)
          rounded-lg
          p-2
          text-sm
          outline-none
          transition-all
          duration-300

          focus:border-(--color-primary)
          focus:ring-1
          focus:ring-(--color-primary)/30

          data-[error=true]:border-(--color-error)
          data-[error=true]:focus:ring-(--color-error)/30

          ${className || ""}
        `}
        {...props}
      />

      {error && (
        <span className="text-xs text-(--color-error) font-medium">
          {error}
        </span>
      )}
    </div>
  );
}
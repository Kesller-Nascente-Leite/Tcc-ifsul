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
    <div className="flex flex-col gap-1.5 w-full">
      {labelText && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-[rgb(var(--text-primary))]"
        >
          {labelText}
        </label>
      )}

      <input
        id={inputId}
        ref={ref}
        data-error={!!error}
        className={`
          bg-[rgb(var(--surface))]
          text-[rgb(var(--text-primary))]
          placeholder:text-[rgb(var(--text-secondary))]
          border 
          border-[rgb(var(--border))]
          rounded-lg
          p-2
          text-sm
          outline-none
          transition-all
          duration-300

          focus:border-[rgb(var(--primary))]
          focus:ring-1
          focus:ring-[rgb(var(--primary)/0.3)]

          data-[error=true]:border-[rgb(var(--error))]
          data-[error=true]:focus:ring-[rgb(var(--error)/0.3)]

          ${className || ""}
        `}
        {...props}
      />

      {error && (
        <span className="text-xs text-[rgb(var(--error))]">{error}</span>
      )}
    </div>
  );
}

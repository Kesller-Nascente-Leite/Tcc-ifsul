import { forwardRef, useId, type ComponentPropsWithoutRef } from "react";

interface InputProps extends ComponentPropsWithoutRef<"input"> {
  labelText?: string;
  error?: string;
}

export const InputComponent = forwardRef<HTMLInputElement, InputProps>(
  ({ labelText, error, className, ...props }, ref) => {
    const inputId = useId();

    return (
      <div className="flex flex-col gap-1.5 w-full text-left">
        {labelText && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-text-primary"
          >
            {labelText}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          data-error={!!error}
          className={`
            bg-surface
            text-text-primary
            placeholder:text-text-secondary
            border 
            border-border
            rounded-lg
            p-2
            text-sm
            outline-none
            transition-all
            duration-300
            focus:border-primary
            focus:ring-1
            focus:ring-primary/30
            data-[error=true]:border-error
            data-[error=true]:focus:ring-error/30
            disabled:opacity-50
            disabled:cursor-not-allowed
            ${className || ""}
          `}
          {...props}
        />
        {error && (
          <span className="text-xs text-error font-medium">{error}</span>
        )}
      </div>
    );
  },
);

InputComponent.displayName = "InputComponent";

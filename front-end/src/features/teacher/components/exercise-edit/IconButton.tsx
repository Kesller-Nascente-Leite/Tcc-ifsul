import type { ReactNode } from "react";

interface IconButtonProps {
  children: ReactNode;
  title: string;
  onClick: () => void;
  tone?: "default" | "danger";
  isDisabled?: boolean;
}

export function IconButton({
  children,
  title,
  onClick,
  tone = "default",
  isDisabled = false,
}: IconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      title={title}
      className="flex h-10 w-10 items-center justify-center rounded-2xl border transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
      style={{
        backgroundColor:
          tone === "danger"
            ? "var(--color-error-light)"
            : "var(--color-surface)",
        borderColor:
          tone === "danger"
            ? "var(--color-error-light)"
            : "var(--color-border)",
        color:
          tone === "danger"
            ? "var(--color-error)"
            : "var(--color-text-secondary)",
      }}
    >
      {children}
    </button>
  );
}
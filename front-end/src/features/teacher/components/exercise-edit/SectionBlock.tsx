import type { ReactNode } from "react";

interface SectionBlockProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function SectionBlock({ title, description, children }: SectionBlockProps) {
  return (
    <section className="space-y-4">
      <div>
        <h3
          className="text-lg font-semibold"
          style={{ color: "var(--color-text-primary)" }}
        >
          {title}
        </h3>
        {description && (
          <p
            className="mt-1 text-sm"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {description}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}
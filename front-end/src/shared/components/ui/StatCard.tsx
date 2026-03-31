import type { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: number | string;
  color: string;
}

export function StatCard({ icon, label, value, color }: StatCardProps) {
  return (
    <div
      className="p-4 sm:p-5 rounded-xl border transition-all hover:shadow-md"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <div
        className="inline-flex p-2.5 rounded-lg mb-3"
        style={{ backgroundColor: `${color}15`, color }}
      >
        {icon}
      </div>
      <p
        className="text-xs sm:text-sm mb-1 font-medium"
        style={{ color: "var(--color-text-secondary)" }}
      >
        {label}
      </p>
      <p
        className="text-2xl sm:text-3xl font-bold"
        style={{ color: "var(--color-text-primary)" }}
      >
        {value}
      </p>
    </div>
  );
}
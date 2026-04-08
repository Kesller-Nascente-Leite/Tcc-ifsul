interface MetricCardProps {
  label: string;
  value: string;
}

export function MetricCard({ label, value }: MetricCardProps) {
  return (
    <div
      className="rounded-2xl border p-4"
      style={{
        backgroundColor: "var(--color-surface-secondary)",
        borderColor: "var(--color-border)",
      }}
    >
      <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
        {label}
      </p>
      <p
        className="mt-1 text-lg font-bold"
        style={{ color: "var(--color-text-primary)" }}
      >
        {value}
      </p>
    </div>
  );
}
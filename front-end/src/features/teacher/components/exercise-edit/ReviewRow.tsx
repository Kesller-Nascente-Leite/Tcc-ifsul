interface ReviewRowProps {
  label: string;
  value: string;
}

export function ReviewRow({ label, value }: ReviewRowProps) {
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
        className="mt-1 text-sm font-semibold"
        style={{ color: "var(--color-text-primary)" }}
      >
        {value}
      </p>
    </div>
  );
}
interface SummaryChipProps {
  label: string;
  value: string;
  accentColor: string;
}

export function SummaryChip({ label, value, accentColor }: SummaryChipProps) {
  return (
    <div
      className="rounded-2xl border p-3"
      style={{
        backgroundColor: "var(--color-surface-secondary)",
        borderColor: "var(--color-border)",
      }}
    >
      <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
        {label}
      </p>
      <p className="mt-1 text-lg font-bold" style={{ color: accentColor }}>
        {value}
      </p>
    </div>
  );
}
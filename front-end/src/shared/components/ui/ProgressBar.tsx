interface ProgressBarProps {
  label: string;
  value: number;
  color: string;
}

export function ProgressBar({ label, value, color }: ProgressBarProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span
          className="text-xs font-medium"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {label}
        </span>
        <span
          className="text-sm font-bold"
          style={{ color: "var(--color-text-primary)" }}
        >
          {Math.round(value)}%
        </span>
      </div>
      <div
        className="h-2 rounded-full overflow-hidden"
        style={{ backgroundColor: "var(--color-border)" }}
      >
        <div
          className="h-full transition-all duration-500 ease-out"
          style={{
            width: `${value}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}

interface ToggleTileProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  accentColor: string;
}

export function ToggleTile({
  label,
  description,
  checked,
  onChange,
  accentColor,
}: ToggleTileProps) {
  return (
    <label
      className="cursor-pointer rounded-2xl border p-4 transition-colors"
      style={{
        borderColor: checked ? accentColor : "var(--color-border)",
        backgroundColor: checked
          ? "var(--color-surface-secondary)"
          : "var(--color-surface)",
      }}
    >
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="mt-1 h-4 w-4 shrink-0"
          style={{ accentColor }}
        />
        <div>
          <p
            className="font-semibold"
            style={{ color: "var(--color-text-primary)" }}
          >
            {label}
          </p>
          <p
            className="mt-1 text-sm"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {description}
          </p>
        </div>
      </div>
    </label>
  );
}
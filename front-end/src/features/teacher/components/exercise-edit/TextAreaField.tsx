import { FieldLabel } from "./FieldLabel";

const TEXTAREA_CLASSNAME =
  "min-h-[112px] w-full rounded-2xl border px-4 py-3 text-sm outline-none transition-colors resize-y";

interface TextAreaFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  rows?: number;
}

export function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
}: TextAreaFieldProps) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        placeholder={placeholder}
        className={TEXTAREA_CLASSNAME}
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border)",
          color: "var(--color-text-primary)",
        }}
      />
    </div>
  );
}
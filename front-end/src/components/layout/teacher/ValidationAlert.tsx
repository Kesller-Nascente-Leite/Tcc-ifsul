import { AlertCircle, X } from "lucide-react";
import type { ValidationError } from "../../../utils/ExerciseValidator";

interface ValidationAlertProps {
  errors: ValidationError[];
  onDismiss: () => void;
}

export function ValidationAlert({ errors, onDismiss }: ValidationAlertProps) {
  if (errors.length === 0) return null;

  return (
    <div
      className="rounded-xl border-2 p-4 mb-4 animate-in slide-in-from-top-2"
      style={{
        backgroundColor: "#ef444410",
        borderColor: "#ef4444",
      }}
    >
      <div className="flex items-start gap-3">
        <AlertCircle size={20} className="shrink-0 mt-0.5" style={{ color: "#ef4444" }} />
        <div className="flex-1">
          <h4 className="font-semibold text-sm mb-2" style={{ color: "#ef4444" }}>
            {errors.length === 1
              ? "Foi encontrado 1 erro"
              : `Foram encontrados ${errors.length} erros`}
          </h4>
          <ul className="space-y-1">
            {errors.map((error, index) => (
              <li
                key={`${error.field}-${index}`}
                className="text-sm"
                style={{ color: "#ef4444" }}
              >
                • {error.message}
              </li>
            ))}
          </ul>
        </div>
        <button
          onClick={onDismiss}
          className="p-1 rounded-lg transition-opacity hover:opacity-70"
          style={{ color: "#ef4444" }}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
import { useState } from "react";
import { CheckCircle2, Eye, AlertCircle } from "lucide-react";
import type { AttemptResponseDTO } from "@/shared/types/AttemptResponseDTO";

interface AttemptsTabProps {
  attempts: AttemptResponseDTO[];
  accentColor: string;
}

export function AttemptsTab({ attempts, accentColor }: AttemptsTabProps) {
  const [filter, setFilter] = useState<"all" | "passed" | "failed">("all");

  const filteredAttempts = attempts.filter((attempt) => {
    if (filter === "passed") return attempt.passed;
    if (filter === "failed") return !attempt.passed;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <FilterButton
          active={filter === "all"}
          onClick={() => setFilter("all")}
          label="Todos"
          count={attempts.length}
        />
        <FilterButton
          active={filter === "passed"}
          onClick={() => setFilter("passed")}
          label="Aprovados"
          count={attempts.filter((a) => a.passed).length}
        />
        <FilterButton
          active={filter === "failed"}
          onClick={() => setFilter("failed")}
          label="Reprovados"
          count={attempts.filter((a) => !a.passed).length}
        />
      </div>

      {/* Attempts Table */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border)",
        }}
      >
        {filteredAttempts.length === 0 ? (
          <div className="p-12 text-center">
            <AlertCircle
              size={48}
              className="mx-auto mb-4 opacity-50"
              style={{ color: "var(--color-text-secondary)" }}
            />
            <p style={{ color: "var(--color-text-secondary)" }}>
              Nenhuma tentativa encontrada
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead
                className="border-b"
                style={{ borderColor: "var(--color-border)" }}
              >
                <tr>
                  <th
                    className="px-6 py-4 text-left text-xs font-semibold uppercase"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    Aluno
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-semibold uppercase"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    Nota
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-semibold uppercase"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    Status
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-semibold uppercase"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    Tempo
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-semibold uppercase"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    Data
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-semibold uppercase"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAttempts.map((attempt) => (
                  <AttemptRow
                    key={attempt.id}
                    attempt={attempt}
                    accentColor={accentColor}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-lg font-medium transition-all"
      style={{
        backgroundColor: active
          ? "var(--color-accent)"
          : "var(--color-surface)",
        color: active ? "white" : "var(--color-text-primary)",
        border: `1px solid ${active ? "var(--color-accent)" : "var(--color-border)"}`,
      }}
    >
      {label} ({count})
    </button>
  );
}

function AttemptRow({
  attempt,
  accentColor,
}: {
  attempt: AttemptResponseDTO;
  accentColor: string;
}) {
  return (
    <tr
      className="border-b transition-colors hover:bg-opacity-50"
      style={{ borderColor: "var(--color-border)" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "var(--color-surface-hover)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
      }}
    >
      <td className="px-6 py-4">
        <div>
          <p
            className="font-semibold"
            style={{ color: "var(--color-text-primary)" }}
          >
            {attempt.studentName}
          </p>
          <p
            className="text-sm"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {attempt.studentEmail}
          </p>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <span
            className="text-2xl font-bold"
            style={{ color: "var(--color-text-primary)" }}
          >
            {attempt.score}
          </span>
          <span
            className="px-2 py-0.5 rounded text-xs font-bold"
            style={{
              backgroundColor: attempt.passed ? "#10b98115" : "#ef444415",
              color: attempt.passed ? "#10b981" : "#ef4444",
            }}
          >
            {attempt.percentage}%
          </span>
        </div>
      </td>
      <td className="px-6 py-4">
        <span
          className="flex items-center gap-1.5 text-sm font-medium"
          style={{
            color: attempt.passed ? "#10b981" : "#ef4444",
          }}
        >
          <CheckCircle2 size={16} />
          {attempt.passed ? "Aprovado" : "Reprovado"}
        </span>
      </td>
      <td className="px-6 py-4">
        <span
          className="text-sm"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {formatTime(attempt.timeSpent)}
        </span>
      </td>
      <td className="px-6 py-4">
        <span
          className="text-sm"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {attempt.submittedAt
            ? new Date(attempt.submittedAt).toLocaleDateString("pt-BR")
            : "Não enviado"}
        </span>
      </td>
      <td className="px-6 py-4">
        <button
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-all hover:scale-105"
          style={{
            backgroundColor: accentColor,
            color: "white",
          }}
        >
          <Eye size={14} />
          Ver
        </button>
      </td>
    </tr>
  );
}

function formatTime(seconds: number): string {
  if (!seconds) return "0min";
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return secs > 0 ? `${minutes}min ${secs}s` : `${minutes}min`;
}

import { Award, AlertTriangle, CheckCircle2 } from "lucide-react";
import type { CreateQuestionDTO } from "../../../types/CreateQuestionDTO";

interface PointsSummaryProps {
  questions: CreateQuestionDTO[];
  totalPoints?: number;
  accentColor: string;
}

export function PointsSummary({
  questions,
  totalPoints,
  accentColor,
}: PointsSummaryProps) {
  const currentSum = questions.reduce((sum, q) => sum + (q.points || 0), 0);
  const remaining = totalPoints ? totalPoints - currentSum : undefined;
  const isOverLimit = totalPoints !== undefined && currentSum > totalPoints;
  const isComplete = totalPoints !== undefined && currentSum === totalPoints;

  return (
    <div
      className="rounded-xl border-2 p-4"
      style={{
        backgroundColor: isOverLimit
          ? "#ef444410"
          : isComplete
            ? "#10b98110"
            : "var(--color-surface)",
        borderColor: isOverLimit
          ? "#ef4444"
          : isComplete
            ? "#10b981"
            : "var(--color-border)",
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="p-2 rounded-lg shrink-0"
          style={{
            backgroundColor: isOverLimit
              ? "#ef444420"
              : isComplete
                ? "#10b98120"
                : `${accentColor}20`,
            color: isOverLimit ? "#ef4444" : isComplete ? "#10b981" : accentColor,
          }}
        >
          {isOverLimit ? (
            <AlertTriangle size={20} />
          ) : isComplete ? (
            <CheckCircle2 size={20} />
          ) : (
            <Award size={20} />
          )}
        </div>

        <div className="flex-1">
          <h4
            className="font-semibold text-sm mb-2"
            style={{
              color: isOverLimit
                ? "#ef4444"
                : isComplete
                  ? "#10b981"
                  : "var(--color-text-primary)",
            }}
          >
            Distribuição de Pontos
          </h4>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span style={{ color: "var(--color-text-secondary)" }}>
                Pontos das questões:
              </span>
              <span
                className="font-bold"
                style={{
                  color: isOverLimit
                    ? "#ef4444"
                    : "var(--color-text-primary)",
                }}
              >
                {currentSum}
              </span>
            </div>

            {totalPoints !== undefined && (
              <>
                <div className="flex items-center justify-between text-sm">
                  <span style={{ color: "var(--color-text-secondary)" }}>
                    Pontuação total:
                  </span>
                  <span
                    className="font-bold"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {totalPoints}
                  </span>
                </div>

                <div
                  className="h-2 rounded-full overflow-hidden"
                  style={{ backgroundColor: "var(--color-border)" }}
                >
                  <div
                    className="h-full transition-all duration-300"
                    style={{
                      width: `${Math.min((currentSum / totalPoints) * 100, 100)}%`,
                      backgroundColor: isOverLimit
                        ? "#ef4444"
                        : isComplete
                          ? "#10b981"
                          : accentColor,
                    }}
                  />
                </div>

                {remaining !== undefined && (
                  <div className="flex items-center justify-between text-sm pt-1">
                    <span style={{ color: "var(--color-text-secondary)" }}>
                      {isOverLimit ? "Excedente:" : "Restante:"}
                    </span>
                    <span
                      className="font-bold"
                      style={{
                        color: isOverLimit
                          ? "#ef4444"
                          : remaining === 0
                            ? "#10b981"
                            : accentColor,
                      }}
                    >
                      {isOverLimit ? `+${Math.abs(remaining)}` : remaining} pts
                    </span>
                  </div>
                )}
              </>
            )}
          </div>

          {isOverLimit && (
            <p className="text-xs mt-2" style={{ color: "#ef4444" }}>
              ⚠️ A soma dos pontos das questões excede o total permitido
            </p>
          )}

          {isComplete && (
            <p className="text-xs mt-2" style={{ color: "#10b981" }}>
              ✓ Todos os pontos foram distribuídos
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
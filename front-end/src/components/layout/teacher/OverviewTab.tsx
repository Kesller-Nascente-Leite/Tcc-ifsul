import { Users, Award, CheckCircle2, Clock } from "lucide-react";
import { StatCard } from "../../ui/StatCard";
import type { ExerciseStatisticsDTO } from "../../../types/ExerciseStatisticsDTO";

interface OverviewTabProps {
  statistics: ExerciseStatisticsDTO;
  accentColor: string;
}

export function OverviewTab({ statistics, accentColor }: OverviewTabProps) {
  const passRate = statistics.passRate || 0;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Users size={24} />}
          label="Total de Tentativas"
          value={statistics.totalAttempts}
          color={accentColor}
        />
        <StatCard
          icon={<Award size={24} />}
          label="Média de Notas"
          value={`${Math.round(statistics.averagePercentage)}%`}
          color={accentColor}
        />
        <StatCard
          icon={<CheckCircle2 size={24} />}
          label="Taxa de Aprovação"
          value={`${Math.round(passRate)}%`}
          color={accentColor}
        />
        <StatCard
          icon={<Clock size={24} />}
          label="Tempo Médio"
          value={formatTime(statistics.averageTimeSpent)}
          color={accentColor}
        />
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          className="p-6 rounded-2xl border"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
          }}
        >
          <h3
            className="text-lg font-bold mb-6"
            style={{ color: "var(--color-text-primary)" }}
          >
            Resumo de Desempenho
          </h3>
          <div className="space-y-4">
            <MetricRow
              label="Maior Nota"
              value={`${statistics.highestScore}%`}
              color="#10b981"
            />
            <MetricRow
              label="Menor Nota"
              value={`${statistics.lowestScore}%`}
              color="#ef4444"
            />
            <MetricRow
              label="Média"
              value={`${Math.round(statistics.averageScore)}%`}
              color="#3b82f6"
            />
          </div>

          <div
            className="mt-6 pt-6 border-t"
            style={{ borderColor: "var(--color-border)" }}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className="text-sm font-medium"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Aprovados
              </span>
              <span className="text-lg font-bold" style={{ color: "#10b981" }}>
                {statistics.passedCount}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span
                className="text-sm font-medium"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Reprovados
              </span>
              <span className="text-lg font-bold" style={{ color: "#ef4444" }}>
                {statistics.failedCount}
              </span>
            </div>
          </div>
        </div>

        <div
          className="p-6 rounded-2xl border"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
          }}
        >
          <h3
            className="text-lg font-bold mb-6"
            style={{ color: "var(--color-text-primary)" }}
          >
            Estatísticas Gerais
          </h3>
          <div className="space-y-4">
            <div>
              <p
                className="text-sm mb-2"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Total de Alunos
              </p>
              <p
                className="text-3xl font-bold"
                style={{ color: "var(--color-text-primary)" }}
              >
                {statistics.totalStudents}
              </p>
            </div>

            <div>
              <p
                className="text-sm mb-2"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Média Geral de Pontos
              </p>
              <p
                className="text-3xl font-bold"
                style={{ color: "var(--color-text-primary)" }}
              >
                {Math.round(statistics.averageScore)}
              </p>
            </div>

            <div>
              <p
                className="text-sm mb-2"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Taxa de Conclusão
              </p>
              <div
                className="h-2 rounded-full overflow-hidden"
                style={{ backgroundColor: "var(--color-border)" }}
              >
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${passRate}%`,
                    backgroundColor: accentColor,
                  }}
                />
              </div>
              <p
                className="text-sm mt-1 font-semibold"
                style={{ color: accentColor }}
              >
                {Math.round(passRate)}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricRow({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <span
        className="text-sm font-medium"
        style={{ color: "var(--color-text-secondary)" }}
      >
        {label}
      </span>
      <span className="text-xl font-bold" style={{ color }}>
        {value}
      </span>
    </div>
  );
}

function formatTime(seconds: number): string {
  if (!seconds) return "0min";
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return secs > 0 ? `${minutes}min ${secs}s` : `${minutes}min`;
}

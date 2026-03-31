import { MessageSquare } from "lucide-react";
import type { ExerciseStatisticsDTO } from "@/shared/types/ExerciseStatisticsDTO";

interface QuestionsTabProps {
  statistics: ExerciseStatisticsDTO;
  accentColor: string;
}

export function QuestionsTab({ statistics, accentColor }: QuestionsTabProps) {
  return (
    <div
      className="p-12 text-center rounded-2xl border"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <div
        className="inline-flex p-4 rounded-full mb-4"
        style={{
          backgroundColor: `${accentColor}15`,
          color: accentColor,
        }}
      >
        <MessageSquare size={48} />
      </div>
      <h3
        className="text-lg font-semibold mb-2"
        style={{ color: "var(--color-text-primary)" }}
      >
        Analise por Questao
      </h3>
      <p
        className="text-sm mb-4"
        style={{ color: "var(--color-text-secondary)" }}
      >
        Estamos preparando uma visao mais detalhada por questao.
      </p>
      <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
        O exercicio ja tem {statistics.totalAttempts} tentativa(s) registrada(s).
        <br />
        Em breve voce podera ver estatisticas detalhadas de cada questao,
        <br />
        incluindo taxa de erro, dificuldade e desempenho geral.
      </p>
    </div>
  );
}

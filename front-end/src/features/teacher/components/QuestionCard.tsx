import { GripVertical, Edit3, Trash2, Award, CheckCircle } from "lucide-react";
import type { CreateQuestionDTO } from "@/shared/types/CreateQuestionDTO";

interface QuestionCardProps {
  question: CreateQuestionDTO;
  index: number;
  accentColor: string;
  onEdit: () => void;
  onDelete: () => void;
}

export function QuestionCard({
  question,
  index,
  accentColor,
  onEdit,
  onDelete,
}: QuestionCardProps) {
  const getTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      MULTIPLE_CHOICE_SINGLE: "Múltipla Escolha",
      MULTIPLE_CHOICE_MULTIPLE: "Múltipla Escolha (Múltipla)",
      TRUE_FALSE: "Verdadeiro/Falso",
      ESSAY: "Dissertativa",
      FILL_BLANKS: "Preencher Lacunas",
      ORDERING: "Ordenação",
      MATCHING: "Correspondência",
    };
    return labels[type] || type;
  };

const hasCorrectOptions = () => {
  return question.options?.some((o) => o.isCorrect) ?? false;
};
  hasCorrectOptions();
  return (
    <div
      className="rounded-xl border-2 overflow-hidden group hover:shadow-lg transition-all"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <div
        className="p-4 border-b flex items-center justify-between"
        style={{ borderColor: "var(--color-border)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="p-2 rounded-lg cursor-move opacity-50 hover:opacity-100 transition-opacity"
            style={{ backgroundColor: "var(--color-surface-hover)" }}
          >
            <GripVertical
              size={16}
              style={{ color: "var(--color-text-secondary)" }}
            />
          </div>
          <div className="flex items-center gap-2">
            <span
              className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold"
              style={{
                backgroundColor: `${accentColor}20`,
                color: accentColor,
              }}
            >
              {index + 1}
            </span>
            <span
              className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{
                backgroundColor: `${accentColor}15`,
                color: accentColor,
              }}
            >
              {getTypeLabel(question.type)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
            style={{ backgroundColor: "var(--color-surface-hover)" }}
          >
            <Award size={14} style={{ color: accentColor }} />
            <span
              className="text-sm font-bold"
              style={{ color: "var(--color-text-primary)" }}
            >
              {question.points} pts
            </span>
          </div>

          <button
            onClick={onEdit}
            className="p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
            style={{
              backgroundColor: "var(--color-surface-hover)",
              color: "var(--color-text-secondary)",
            }}
          >
            <Edit3 size={16} />
          </button>

          <button
            onClick={onDelete}
            className="p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
            style={{
              backgroundColor: "#ef444415",
              color: "#ef4444",
            }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="p-4">
        <p
          className="font-semibold mb-3 line-clamp-2"
          style={{ color: "var(--color-text-primary)" }}
        >
          {question.questionText}
        </p>

        {question.options && question.options.length > 0 && (
          <div className="space-y-2">
            {question.options.slice(0, 3).map((option, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 text-sm"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {option.isCorrect && (
                  <CheckCircle
                    size={16}
                    className="shrink-0 mt-0.5"
                    style={{ color: "#10b981" }}
                  />
                )}
                <span className="line-clamp-1 flex-1">
                  {option.isCorrect && "✓ "}
                  {option.optionText}
                </span>
              </div>
            ))}
            {question.options.length > 3 && (
              <p
                className="text-xs italic"
                style={{ color: "var(--color-text-secondary)" }}
              >
                +{question.options.length - 3} opções
              </p>
            )}
          </div>
        )}

        {question.type === "ESSAY" && (
          <p
            className="text-sm italic"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Resposta dissertativa (correção manual)
          </p>
        )}

        {question.explanation && (
          <div
            className="mt-3 p-3 rounded-lg text-sm"
            style={{ backgroundColor: "var(--color-surface-hover)" }}
          >
            <p
              className="font-semibold text-xs mb-1"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Explicação:
            </p>
            <p
              className="line-clamp-2"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {question.explanation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

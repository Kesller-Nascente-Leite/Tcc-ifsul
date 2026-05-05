import type { QuestionType } from "@/shared/types/QuestionType";

interface QuestionTypeOption {
  value: QuestionType;
  label: string;
  description: string;
}

const QUESTION_TYPE_OPTIONS: QuestionTypeOption[] = [
  {
    value: "MULTIPLE_CHOICE_SINGLE",
    label: "Multipla escolha",
    description: "Uma unica resposta correta.",
  },
  {
    value: "MULTIPLE_CHOICE_MULTIPLE",
    label: "Multipla resposta",
    description: "Mais de uma opção correta.",
  },
  {
    value: "TRUE_FALSE",
    label: "Verdadeiro ou falso",
    description: "Duas opções fixas para escolha rapida.",
  },
  {
    value: "ESSAY",
    label: "Dissertativa",
    description: "Resposta aberta com correcao manual.",
  },
  {
    value: "FILL_BLANKS",
    label: "Preencher lacuna",
    description: "Defina respostas aceitas para correcao automatica.",
  },
  {
    value: "ORDERING",
    label: "Ordenação",
    description: "A ordem da lista sera o gabarito.",
  },
  {
    value: "MATCHING",
    label: "Correspondencia",
    description: "Cada item recebe um par correspondente.",
  },
];

interface QuestionTypeModalProps {
  accentColor: string;
  onClose: () => void;
  onSelect: (type: QuestionType) => void;
}

export function QuestionTypeModal({
  accentColor,
  onClose,
  onSelect,
}: QuestionTypeModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl rounded-3xl border p-6 shadow-2xl"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border)",
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3
              className="text-xl font-semibold"
              style={{ color: "var(--color-text-primary)" }}
            >
              Escolha o tipo de questao
            </h3>
            <p
              className="mt-1 text-sm"
              style={{ color: "var(--color-text-secondary)" }}
            >
              A tela abre cada questao com os campos mais adequados ao tipo
              escolhido.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border px-3 py-1 text-sm font-medium transition-opacity hover:opacity-75"
            style={{
              borderColor: "var(--color-border)",
              color: "var(--color-text-secondary)",
            }}
          >
            Fechar
          </button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {QUESTION_TYPE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onSelect(option.value)}
              className="rounded-2xl border p-4 text-left transition-transform hover:-translate-y-0.5"
              style={{
                backgroundColor: "var(--color-surface-secondary)",
                borderColor: "var(--color-border)",
              }}
            >
              <span
                className="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
                style={{
                  backgroundColor: "var(--color-surface)",
                  color: accentColor,
                }}
              >
                {option.label}
              </span>
              <p
                className="mt-3 text-sm"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {option.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
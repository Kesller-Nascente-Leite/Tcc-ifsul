import { CheckCircle2 } from "lucide-react";
import type { CreateQuestionDTO } from "@/shared/types/CreateQuestionDTO";
import type { CreateQuestionOptionDTO } from "@/shared/types/CreateQuestionOptionDTO";
import type { QuestionConfigDTO } from "@/shared/types/QuestionConfigDTO";
import type { QuestionDisplayMode } from "@/shared/types/QuestionDisplayMode";
import type { QuestionType } from "@/shared/types/QuestionType";
import type { UpdateQuestionDTO } from "@/shared/types/UpdateQuestionDTO";

type QuestionOptionForm = Omit<CreateQuestionOptionDTO, "order"> & {
  tempId: string;
  order: number;
};

type QuestionForm = Omit<CreateQuestionDTO, "options" | "order"> & {
  tempId: string;
  id?: number;
  order: number;
  options: QuestionOptionForm[];
};

function createTempId(prefix: string) {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function mapResponseQuestions(questions: unknown[]): QuestionForm[] {
  return (questions ?? []).map((item: unknown, index: number) => {
    const question = item as Record<string, unknown>;
    const options = (question.options as unknown[]) ?? [];

    return normalizeQuestion(
      {
        tempId: createTempId("question"),
        id: typeof question.id === "number" ? question.id : undefined,
        type: String(question.type) as QuestionType,
        questionText: typeof question.questionText === "string" ? question.questionText : "",
        explanation: typeof question.explanation === "string" ? question.explanation : "",
        imageUrl: typeof question.imageUrl === "string" ? question.imageUrl : undefined,
        videoUrl: typeof question.videoUrl === "string" ? question.videoUrl : undefined,
        points: typeof question.points === "number" ? question.points : 0,
        order: typeof question.order === "number" ? question.order : index,
        isRequired: typeof question.isRequired === "boolean" ? question.isRequired : true,
        config: (question.config as QuestionConfigDTO) ?? {},
        options: options.map((optionItem: unknown, optionIndex: number) => {
          const option = optionItem as Record<string, unknown>;
          return {
            tempId: createTempId("option"),
            optionText: typeof option.optionText === "string" ? option.optionText : "",
            isCorrect: typeof option.isCorrect === "boolean" ? option.isCorrect : false,
            feedback: typeof option.feedback === "string" ? option.feedback : undefined,
            matchPair: typeof option.matchPair === "string" ? option.matchPair : undefined,
            correctPosition:
              typeof option.correctPosition === "number" ? option.correctPosition : undefined,
            order: typeof option.order === "number" ? option.order : optionIndex,
          } as QuestionOptionForm;
        }),
      },
      index,
    );
  });
}

export function mapExerciseResponseToForm(exercise: unknown) {
  const data = exercise as Record<string, unknown>;
  const timeLimitValue = data.timeLimit;
  let timeLimit: number | "" = "";

  if (typeof timeLimitValue === "number") {
    timeLimit = timeLimitValue;
  } else if (typeof timeLimitValue === "string") {
    const parsed = Number(timeLimitValue.trim());
    if (Number.isFinite(parsed)) {
      timeLimit = parsed;
    }
  }

  return {
    title: typeof data.title === "string" ? data.title : "",
    description: typeof data.description === "string" ? data.description : "",
    instructions: typeof data.instructions === "string" ? data.instructions : "",
    totalPoints: typeof data.totalPoints === "number" ? data.totalPoints : 100,
    passingScore: typeof data.passingScore === "number" ? data.passingScore : 60,
    timeLimit,
    maxAttempts: typeof data.maxAttempts === "number" ? data.maxAttempts : 0,
    shuffleQuestions: typeof data.shuffleQuestions === "boolean" ? data.shuffleQuestions : false,
    shuffleOptions: typeof data.shuffleOptions === "boolean" ? data.shuffleOptions : false,
    showCorrectAnswers: typeof data.showCorrectAnswers === "boolean" ? data.showCorrectAnswers : false,
    showScore: typeof data.showScore === "boolean" ? data.showScore : false,
    allowReview: typeof data.allowReview === "boolean" ? data.allowReview : false,
    questionDisplayMode:
      typeof data.questionDisplayMode === "string"
        ? (data.questionDisplayMode as QuestionDisplayMode)
        : "ALL_AT_ONCE",
  };
}

export function resolveExerciseEditLoadErrorMessage() {
  return "Erro ao carregar exercício";
}

export function resolveExerciseEditSaveErrorMessage() {
  return "Erro ao salvar exercício";
}

export function normalizeQuestions(questions: QuestionForm[]) {
  return questions.map((question, index) => normalizeQuestion(question, index));
}

function normalizeQuestion(question: QuestionForm, index: number): QuestionForm {
  return {
    ...question,
    order: index,
    options: question.options.map((option, optionIndex) => ({
      ...option,
      order: optionIndex,
      isCorrect:
        question.type === "ORDERING" || question.type === "MATCHING"
          ? true
          : option.isCorrect,
      correctPosition:
        question.type === "ORDERING" ? optionIndex + 1 : option.correctPosition,
    })),
  };
}

export function createQuestion(
  type: QuestionType,
  index: number,
  totalPoints: number,
): QuestionForm {
  const baseQuestion: QuestionForm = {
    tempId: createTempId("question"),
    type,
    questionText: "",
    explanation: "",
    imageUrl: undefined,
    videoUrl: undefined,
    points: Math.max(1, Math.floor(totalPoints / Math.max(index + 1, 1))),
    order: index,
    isRequired: true,
    config: {},
    options: [],
  };

  if (type === "TRUE_FALSE") {
    baseQuestion.options = [
      createOption({ optionText: "Verdadeiro" }),
      createOption({ optionText: "Falso" }),
    ];
  }

  if (type === "MULTIPLE_CHOICE_SINGLE" || type === "MULTIPLE_CHOICE_MULTIPLE") {
    baseQuestion.options = [createOption(), createOption()];
  }

  if (type === "ORDERING") {
    baseQuestion.options = [
      createOption({ isCorrect: true, correctPosition: 1 }),
      createOption({ isCorrect: true, correctPosition: 2 }),
    ];
  }

  if (type === "MATCHING") {
    baseQuestion.options = [
      createOption({ isCorrect: true, matchPair: "" }),
      createOption({ isCorrect: true, matchPair: "" }),
    ];
  }

  if (type === "FILL_BLANKS") {
    baseQuestion.config = { acceptableAnswers: [], caseSensitive: false };
  }

  return normalizeQuestion(baseQuestion, index);
}

export function swapItems<T>(array: T[], fromIndex: number, toIndex: number): T[] {
  const result = [...array];
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  return result;
}

export function createOption(overrides: Partial<QuestionOptionForm> = {}) {
  return {
    tempId: createTempId("option"),
    optionText: "",
    isCorrect: false,
    feedback: undefined,
    matchPair: undefined,
    correctPosition: undefined,
    order: 0,
    ...overrides,
  } as QuestionOptionForm;
}

export function parseAnswers(value: string) {
  return value
    .split(/[\n,]/)
    .map((answer) => answer.trim())
    .filter(Boolean);
}

export function trimOrUndefined(value?: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export function mapQuestionToDTO(question: QuestionForm, index: number): UpdateQuestionDTO {
  return {
    id: question.id || undefined,
    type: question.type,
    questionText: question.questionText.trim(),
    explanation: trimOrUndefined(question.explanation),
    imageUrl: trimOrUndefined(question.imageUrl),
    videoUrl: trimOrUndefined(question.videoUrl),
    points: question.points,
    order: index,
    isRequired: question.isRequired ?? true,
    config: buildQuestionConfig(question),
    options: buildQuestionOptions(question),
  };
}

export function mapQuestionToCreateDTO(question: QuestionForm, index: number) {
  return {
    type: question.type,
    questionText: question.questionText.trim(),
    explanation: trimOrUndefined(question.explanation),
    imageUrl: trimOrUndefined(question.imageUrl),
    videoUrl: trimOrUndefined(question.videoUrl),
    points: question.points,
    order: index,
    isRequired: question.isRequired ?? true,
    config: buildQuestionConfig(question),
    options: buildQuestionOptions(question),
  };
}

export function buildUpdatePayload<
  T extends {
    title: string;
    description?: string;
    instructions?: string;
    timeLimit: number | "";
  },
>(form: T) {
  return {
    ...form,
    title: form.title.trim(),
    description: trimOrUndefined(form.description),
    instructions: trimOrUndefined(form.instructions),
    timeLimit: typeof form.timeLimit === "number" ? form.timeLimit : undefined,
  };
}

export function createQuestionSignature(questions: QuestionForm[]) {
  return JSON.stringify(questions.map((q) => ({ type: q.type, questionText: q.questionText })));
}

export function renderQuestionPreview(question: QuestionForm, accentColor: string) {
  if (question.type === "ESSAY") {
    return (
      <p className="mt-4 text-sm" style={{ color: "var(--color-text-secondary)" }}>
        Resposta aberta com correcao manual.
      </p>
    );
  }

  if (question.type === "FILL_BLANKS") {
    const acceptableAnswers = question.config?.acceptableAnswers ?? [];
    return (
      <div
        className="mt-4 rounded-2xl border p-4"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border)",
        }}
      >
        <p
          className="text-xs font-semibold uppercase tracking-wide"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Respostas aceitas
        </p>
        <p className="mt-2 text-sm" style={{ color: "var(--color-text-primary)" }}>
          {acceptableAnswers.length > 0
            ? acceptableAnswers.join(", ")
            : "Nenhuma resposta aceita configurada."}
        </p>
      </div>
    );
  }

  if (question.type === "ORDERING") {
    return (
      <div className="mt-4 space-y-2">
        {question.options.map((option, index) => (
          <div
            key={option.tempId}
            className="flex items-center gap-3 rounded-2xl border px-4 py-3"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border)",
            }}
          >
            <span className="text-sm font-semibold" style={{ color: accentColor }}>
              {index + 1}.
            </span>
            <span style={{ color: "var(--color-text-primary)" }}>
              {option.optionText || "Item sem texto"}
            </span>
          </div>
        ))}
      </div>
    );
  }

  if (question.type === "MATCHING") {
    return (
      <div className="mt-4 space-y-2">
        {question.options.map((option) => (
          <div
            key={option.tempId}
            className="grid gap-2 rounded-2xl border px-4 py-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border)",
            }}
          >
            <span style={{ color: "var(--color-text-primary)" }}>
              {option.optionText || "Item sem texto"}
            </span>
            <span className="text-center text-sm font-semibold" style={{ color: accentColor }}>
              combina com
            </span>
            <span style={{ color: "var(--color-text-primary)" }}>
              {option.matchPair || "Par nao informado"}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-2">
      {question.options.map((option, index) => (
        <div
          key={option.tempId}
          className="flex items-center gap-3 rounded-2xl border px-4 py-3"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: option.isCorrect ? accentColor : "var(--color-border)",
          }}
        >
          <span
            className="text-sm font-semibold"
            style={{
              color: option.isCorrect ? accentColor : "var(--color-text-secondary)",
            }}
          >
            {String.fromCharCode(65 + index)}
          </span>
          <span
            className="flex-1 text-sm"
            style={{
              color: option.isCorrect ? accentColor : "var(--color-text-primary)",
              fontWeight: option.isCorrect ? 600 : 400,
            }}
          >
            {option.optionText || "Opção sem texto"}
          </span>
          {option.isCorrect && <CheckCircle2 size={16} color={accentColor} />}
        </div>
      ))}
    </div>
  );
}

function buildQuestionConfig(question: QuestionForm): QuestionConfigDTO | undefined {
  const config: QuestionConfigDTO = {};

  if (question.type === "FILL_BLANKS") {
    const acceptableAnswers =
      question.config?.acceptableAnswers?.filter((answer) => answer.trim()) ?? [];
    if (acceptableAnswers.length > 0) {
      config.acceptableAnswers = acceptableAnswers;
    }
    if (question.config?.caseSensitive) {
      config.caseSensitive = true;
    }
  }

  if (
    (question.type === "MULTIPLE_CHOICE_MULTIPLE" || question.type === "MATCHING") &&
    question.config?.partialCredit
  ) {
    config.partialCredit = true;
  }

  return Object.keys(config).length > 0 ? config : undefined;
}

function buildQuestionOptions(question: QuestionForm): CreateQuestionOptionDTO[] {
  if (question.type === "ESSAY" || question.type === "FILL_BLANKS") {
    return [];
  }

  return question.options.map((option, index) => ({
    optionText: option.optionText.trim(),
    isCorrect:
      question.type === "ORDERING" || question.type === "MATCHING"
        ? true
        : option.isCorrect,
    feedback: trimOrUndefined(option.feedback),
    order: index,
    matchPair: trimOrUndefined(option.matchPair),
    correctPosition:
      question.type === "ORDERING" ? index + 1 : option.correctPosition,
  }));
}

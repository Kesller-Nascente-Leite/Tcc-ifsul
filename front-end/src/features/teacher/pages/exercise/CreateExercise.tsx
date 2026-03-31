import { type ReactNode, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CirclePlus,
  ClipboardList,
  Eye,
  HelpCircle,
  Layers3,
  Settings2,
  Trash2,
} from "lucide-react";
import { ExerciseTeacherApi } from "@/features/teacher/api/exerciseTeacher.api";
import { PointsSummary } from "@/features/teacher/components/PointsSummary";
import { ProgressIndicator } from "@/features/teacher/components/ProgressIndicator";
import { ButtonComponent } from "@/shared/components/ui/ButtonComponent";
import { InputComponent } from "@/shared/components/ui/InputComponent";
import { NotificationComponent } from "@/shared/components/ui/NotificationComponent";
import { useTheme } from "@/app/providers/ThemeContext";
import type { CreateExerciseDTO } from "@/shared/types/CreateExerciseDTO";
import type { CreateQuestionDTO } from "@/shared/types/CreateQuestionDTO";
import type { CreateQuestionOptionDTO } from "@/shared/types/CreateQuestionOptionDTO";
import type { QuestionConfigDTO } from "@/shared/types/QuestionConfigDTO";
import type { QuestionDisplayMode } from "@/shared/types/QuestionDisplayMode";
import type { QuestionType } from "@/shared/types/QuestionType";
import {
  ExerciseValidator,
  type ValidationError,
} from "@/shared/utils/ExerciseValidator";
import { Button, Header, Input, Label, TextArea } from "react-aria-components";

type WizardStep = 0 | 1 | 2;

interface ExerciseFormState {
  title: string;
  description: string;
  instructions: string;
  totalPoints: number;
  passingScore: number;
  timeLimit: number | "";
  maxAttempts: number;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  showCorrectAnswers: boolean;
  showScore: boolean;
  allowReview: boolean;
  questionDisplayMode: QuestionDisplayMode;
}

interface QuestionOptionForm extends Omit<CreateQuestionOptionDTO, "order"> {
  tempId: string;
  order: number;
}

interface QuestionForm extends Omit<CreateQuestionDTO, "options" | "order"> {
  tempId: string;
  order: number;
  options: QuestionOptionForm[];
}

interface QuestionTypeOption {
  value: QuestionType;
  label: string;
  description: string;
}

const INITIAL_FORM_STATE: ExerciseFormState = {
  title: "",
  description: "",
  instructions: "",
  totalPoints: 100,
  passingScore: 60,
  timeLimit: "",
  maxAttempts: 0,
  shuffleQuestions: true,
  shuffleOptions: true,
  showCorrectAnswers: false,
  showScore: true,
  allowReview: false,
  questionDisplayMode: "ALL_AT_ONCE",
};

const STEPS = [
  { id: 1, label: "Detalhes", description: "Nome, pontuacao e comportamento" },
  { id: 2, label: "Questoes", description: "Monte o conteudo e o gabarito" },
  { id: 3, label: "Revisao", description: "Confira tudo antes de salvar" },
] as const;

const QUESTION_TYPE_OPTIONS: QuestionTypeOption[] = [
  {
    value: "MULTIPLE_CHOICE_SINGLE",
    label: "Multipla escolha",
    description: "Uma unica resposta correta.",
  },
  {
    value: "MULTIPLE_CHOICE_MULTIPLE",
    label: "Multipla resposta",
    description: "Mais de uma op��o correta.",
  },
  {
    value: "TRUE_FALSE",
    label: "Verdadeiro ou falso",
    description: "Duas op��es fixas para escolha rapida.",
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
    label: "Ordenacao",
    description: "A ordem da lista sera o gabarito.",
  },
  {
    value: "MATCHING",
    label: "Correspondencia",
    description: "Cada item recebe um par correspondente.",
  },
];

const DISPLAY_MODE_OPTIONS: Array<{
  value: QuestionDisplayMode;
  label: string;
  description: string;
}> = [
  {
    value: "ALL_AT_ONCE",
    label: "Tudo na mesma tela",
    description: "O aluno ve todas as questoes de uma vez.",
  },
  {
    value: "SEQUENTIAL",
    label: "Uma por vez",
    description: "Ideal para experiencias mais guiadas.",
  },
];

const TEXTAREA_CLASSNAME =
  "min-h-[112px] w-full rounded-2xl border px-4 py-3 text-sm outline-none transition-colors resize-y";

export function CreateExercise() {
  const { courseId, moduleId, lessonId } = useParams<{
    courseId: string;
    moduleId: string;
    lessonId: string;
  }>();
  const navigate = useNavigate();
  const { accentColor } = useTheme();

  const [currentStep, setCurrentStep] = useState<WizardStep>(0);
  const [form, setForm] = useState<ExerciseFormState>(INITIAL_FORM_STATE);
  const [questions, setQuestions] = useState<QuestionForm[]>([]);
  const [showQuestionTypeModal, setShowQuestionTypeModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  const lessonIdNumber = Number(lessonId);
  const totalQuestionPoints = questions.reduce(
    (sum, question) => sum + question.points,
    0,
  );
  const exercisePath = `/teacher/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/exercises`;

  const showNotification = (
    type: "success" | "error" | "info",
    message: string,
  ) => {
    setNotification({ type, message });
  };

  const clearErrorNotification = () => {
    setNotification((current) => (current?.type === "error" ? null : current));
  };

  const showValidationErrors = (errors: ValidationError[]) => {
    if (errors.length === 0) {
      return;
    }

    showNotification("error", formatValidationErrors(errors));
  };

  const updateForm = (updates: Partial<ExerciseFormState>) => {
    clearErrorNotification();
    setForm((current) => ({ ...current, ...updates }));
  };

  const updateQuestions = (
    updater: (current: QuestionForm[]) => QuestionForm[],
  ) => {
    clearErrorNotification();
    setQuestions((current) => normalizeQuestions(updater(current)));
  };

  const addQuestion = (type: QuestionType) => {
    updateQuestions((current) => [
      ...current,
      createQuestion(type, current.length, form.totalPoints),
    ]);
    setShowQuestionTypeModal(false);
  };

  const updateQuestion = (tempId: string, updates: Partial<QuestionForm>) => {
    updateQuestions((current) =>
      current.map((question) =>
        question.tempId === tempId ? { ...question, ...updates } : question,
      ),
    );
  };

  const updateQuestionConfig = (
    tempId: string,
    updates: Partial<QuestionConfigDTO>,
  ) => {
    updateQuestions((current) =>
      current.map((question) =>
        question.tempId === tempId
          ? { ...question, config: { ...question.config, ...updates } }
          : question,
      ),
    );
  };

  const removeQuestion = (tempId: string) => {
    updateQuestions((current) =>
      current.filter((question) => question.tempId !== tempId),
    );
  };

  const moveQuestion = (tempId: string, direction: "up" | "down") => {
    updateQuestions((current) => {
      const currentIndex = current.findIndex(
        (question) => question.tempId === tempId,
      );
      const targetIndex =
        direction === "up" ? currentIndex - 1 : currentIndex + 1;
      if (
        currentIndex < 0 ||
        targetIndex < 0 ||
        targetIndex >= current.length
      ) {
        return current;
      }
      return swapItems(current, currentIndex, targetIndex);
    });
  };

  const addOption = (questionTempId: string) => {
    updateQuestions((current) =>
      current.map((question) => {
        if (question.tempId !== questionTempId) {
          return question;
        }
        return {
          ...question,
          options: [
            ...question.options,
            createOption({
              isCorrect:
                question.type === "ORDERING" || question.type === "MATCHING",
              matchPair: question.type === "MATCHING" ? "" : undefined,
              correctPosition:
                question.type === "ORDERING"
                  ? question.options.length + 1
                  : undefined,
            }),
          ],
        };
      }),
    );
  };

  const updateOption = (
    questionTempId: string,
    optionTempId: string,
    updates: Partial<QuestionOptionForm>,
  ) => {
    updateQuestions((current) =>
      current.map((question) => {
        if (question.tempId !== questionTempId) {
          return question;
        }
        return {
          ...question,
          options: question.options.map((option) =>
            option.tempId === optionTempId ? { ...option, ...updates } : option,
          ),
        };
      }),
    );
  };
  const removeOption = (questionTempId: string, optionTempId: string) => {
    updateQuestions((current) =>
      current.map((question) => {
        if (question.tempId !== questionTempId) {
          return question;
        }
        return {
          ...question,
          options: question.options.filter(
            (option) => option.tempId !== optionTempId,
          ),
        };
      }),
    );
  };

  const moveOption = (
    questionTempId: string,
    optionTempId: string,
    direction: "up" | "down",
  ) => {
    updateQuestions((current) =>
      current.map((question) => {
        if (question.tempId !== questionTempId) {
          return question;
        }
        const currentIndex = question.options.findIndex(
          (option) => option.tempId === optionTempId,
        );
        const targetIndex =
          direction === "up" ? currentIndex - 1 : currentIndex + 1;
        if (
          currentIndex < 0 ||
          targetIndex < 0 ||
          targetIndex >= question.options.length
        ) {
          return question;
        }
        return {
          ...question,
          options: swapItems(question.options, currentIndex, targetIndex),
        };
      }),
    );
  };

  const toggleCorrectOption = (
    questionTempId: string,
    optionTempId: string,
  ) => {
    updateQuestions((current) =>
      current.map((question) => {
        if (question.tempId !== questionTempId) {
          return question;
        }
        if (
          question.type === "MULTIPLE_CHOICE_SINGLE" ||
          question.type === "TRUE_FALSE"
        ) {
          return {
            ...question,
            options: question.options.map((option) => ({
              ...option,
              isCorrect: option.tempId === optionTempId,
            })),
          };
        }
        if (question.type === "MULTIPLE_CHOICE_MULTIPLE") {
          return {
            ...question,
            options: question.options.map((option) =>
              option.tempId === optionTempId
                ? { ...option, isCorrect: !option.isCorrect }
                : option,
            ),
          };
        }
        return question;
      }),
    );
  };

  const updateFillBlankAnswers = (questionTempId: string, value: string) => {
    updateQuestionConfig(questionTempId, {
      acceptableAnswers: parseAnswers(value),
    });
  };

  const buildExercisePayload = (): CreateExerciseDTO => ({
    title: form.title.trim(),
    description: trimOrUndefined(form.description),
    instructions: trimOrUndefined(form.instructions),
    lessonId: Number.isFinite(lessonIdNumber) ? lessonIdNumber : 0,
    totalPoints: form.totalPoints,
    passingScore: form.passingScore,
    timeLimit: form.timeLimit === "" ? undefined : form.timeLimit,
    maxAttempts: form.maxAttempts,
    shuffleQuestions: form.shuffleQuestions,
    shuffleOptions: form.shuffleOptions,
    showCorrectAnswers: form.showCorrectAnswers,
    showScore: form.showScore,
    allowReview: form.allowReview,
    questionDisplayMode: form.questionDisplayMode,
    questions: questions.map((question, index) =>
      mapQuestionToDTO(question, index),
    ),
  });

  const validateBasicStep = () => {
    const errors = ExerciseValidator.validateBasicInfo(buildExercisePayload());
    showValidationErrors(errors);
    return errors.length === 0;
  };

  const validateQuestionStep = () => {
    const payload = buildExercisePayload();
    const errors = ExerciseValidator.validateQuestions(
      payload.questions,
      payload.totalPoints,
    );
    showValidationErrors(errors);
    return errors.length === 0;
  };

  const goToNextStep = () => {
    if (currentStep === 0) {
      if (!validateBasicStep()) {
        return;
      }
      setCurrentStep(1);
      return;
    }
    if (currentStep === 1) {
      if (!validateQuestionStep()) {
        return;
      }
      setCurrentStep(2);
    }
  };

  const handleSubmit = async () => {
    if (!Number.isFinite(lessonIdNumber)) {
      showNotification("error", "Nao foi possivel identificar a aula.");
      return;
    }

    const payload = buildExercisePayload();
    const errors = ExerciseValidator.validateComplete(payload);
    if (errors.length > 0) {
      showValidationErrors(errors);
      const hasBasicErrors = errors.some(
        (error) =>
          error.field !== "questions" && !error.field.startsWith("question_"),
      );
      setCurrentStep(hasBasicErrors ? 0 : 1);
      return;
    }

    try {
      setIsCreating(true);
      await ExerciseTeacherApi.create(payload);
      showNotification("success", "Exercicio criado com sucesso.");
      setTimeout(() => {
        navigate(exercisePath);
      }, 1200);
    } catch (error: unknown) {
      console.error("Erro ao criar exercicio:", error);
      const message =
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof error.response === "object" &&
        error.response !== null &&
        "data" in error.response &&
        typeof error.response.data === "object" &&
        error.response.data !== null &&
        "message" in error.response.data &&
        typeof error.response.data.message === "string"
          ? error.response.data.message
          : "Nao foi possivel criar o exercicio.";
      showNotification("error", message);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div
      className="min-h-screen pb-12"
      style={{ backgroundColor: "var(--color-bg-main)" }}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => navigate(exercisePath)}
          className="flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-75"
          style={{ color: "var(--color-text-secondary)" }}
        >
          <ArrowLeft size={18} />
          <span>Voltar para exercicios</span>
        </button>

        <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          <section
            className="rounded-3xl border p-6 shadow-sm"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border)",
            }}
          >
            <div
              className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold"
              style={{
                backgroundColor: "var(--color-surface-secondary)",
                color: accentColor,
              }}
            >
              <ClipboardList size={14} />
              Criacao guiada
            </div>
            <h1
              className="text-3xl font-bold sm:text-4xl"
              style={{ color: "var(--color-text-primary)" }}
            >
              Novo exercicio
            </h1>
            <p
              className="mt-3 max-w-2xl text-sm sm:text-base"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Preencha os dados do exerc�cio em etapas simples. Cada passo
              valida as informa��es automaticamente para garantir consist�ncia e
              envio correto ao backend.
            </p>
          </section>

          <section
            className="rounded-3xl border p-6 shadow-sm"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border)",
            }}
          >
            <h2
              className="text-sm font-semibold uppercase tracking-wide"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Resumo rapido
            </h2>
            <div className="mt-5 grid grid-cols-3 gap-3">
              <SummaryChip
                label="Questoes"
                value={questions.length.toString()}
                accentColor={accentColor}
              />
              <SummaryChip
                label="Pontos"
                value={totalQuestionPoints.toString()}
                accentColor={accentColor}
              />
              <SummaryChip
                label="Aprov."
                value={`${form.passingScore}%`}
                accentColor={accentColor}
              />
            </div>
            <p
              className="mt-4 text-sm"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {currentStep === 0 &&
                "Defina o objetivo e as regras do exercicio."}
              {currentStep === 1 &&
                "Monte as questoes e confira a distribuicao de pontos."}
              {currentStep === 2 && "Revise o conteudo final antes de salvar."}
            </p>
          </section>
        </div>

        <section
          className="rounded-3xl border p-5 shadow-sm"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
          }}
        >
          <ProgressIndicator
            steps={[...STEPS]}
            currentStep={currentStep}
            accentColor={accentColor}
          />
        </section>

        {notification && (
          <NotificationComponent
            type={notification.type}
            message={notification.message}
            onClose={() => setNotification(null)}
            duration={3000}
          />
        )}

        <section
          className="rounded-3xl border p-6 shadow-sm sm:p-8"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
          }}
        >
          {currentStep === 0 && (
            <div className="space-y-8">
              <div className="flex items-start gap-3">
                <div
                  className="mt-1 rounded-2xl p-3"
                  style={{
                    backgroundColor: "var(--color-surface-secondary)",
                    color: accentColor,
                  }}
                >
                  <Settings2 size={20} />
                </div>
                <div>
                  <h2
                    className="text-2xl font-semibold"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    Informacoes do exercicio
                  </h2>
                  <p
                    className="mt-1 text-sm"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    Defina o titulo, a nota minima e como o aluno vai interagir
                    com a atividade.
                  </p>
                </div>
              </div>

              <SectionBlock
                title="Base do exercicio"
                description="Esses campos ajudam o aluno a entender rapidamente o objetivo da atividade."
              >
                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="lg:col-span-2">
                    <FieldLabel required>Titulo do exercicio</FieldLabel>
                    <InputComponent
                      value={form.title}
                      onChange={(event) =>
                        updateForm({
                          title: (event.target as HTMLInputElement).value,
                        })
                      }
                      maxLength={120}
                      placeholder="Ex: Revisao de logica e estruturas condicionais"
                    />
                  </div>
                  <div className="lg:col-span-2">
                    <TextAreaField
                      label="Descricao"
                      value={form.description}
                      onChange={(value) => updateForm({ description: value })}
                      placeholder="Explique em poucas linhas o objetivo desse exercicio."
                    />
                  </div>
                  <div className="lg:col-span-2">
                    <TextAreaField
                      label="Instrucoes para o aluno"
                      value={form.instructions}
                      onChange={(value) => updateForm({ instructions: value })}
                      placeholder="Ex: leia cada questao com calma e revise antes de enviar."
                      rows={4}
                    />
                  </div>
                </div>
              </SectionBlock>

              <SectionBlock
                title="Pontuacao e tentativas"
                description="A nota minima eh percentual. O valor 0 em tentativas significa ilimitado."
              >
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <div>
                    <FieldLabel required>Pontos totais</FieldLabel>
                    <InputComponent
                      type="number"
                      min={1}
                      value={form.totalPoints}
                      onChange={(event) => {
                        const nextValue = (event.target as HTMLInputElement)
                          .valueAsNumber;
                        updateForm({
                          totalPoints: Number.isFinite(nextValue)
                            ? nextValue
                            : 0,
                        });
                      }}
                    />
                  </div>
                  <div>
                    <FieldLabel required>Nota minima (%)</FieldLabel>
                    <InputComponent
                      type="number"
                      min={0}
                      max={100}
                      value={form.passingScore}
                      onChange={(event) => {
                        const nextValue = (event.target as HTMLInputElement)
                          .valueAsNumber;
                        updateForm({
                          passingScore: Number.isFinite(nextValue)
                            ? nextValue
                            : 0,
                        });
                      }}
                    />
                  </div>
                  <div>
                    <FieldLabel>Tempo limite (min)</FieldLabel>
                    <InputComponent
                      type="number"
                      min={1}
                      value={form.timeLimit}
                      onChange={(event) => {
                        const input = event.target as HTMLInputElement;
                        updateForm({
                          timeLimit:
                            input.value === ""
                              ? ""
                              : Number.isFinite(input.valueAsNumber)
                                ? input.valueAsNumber
                                : "",
                        });
                      }}
                      placeholder="Opcional"
                    />
                  </div>
                  <div>
                    <FieldLabel>Maximo de tentativas</FieldLabel>
                    <InputComponent
                      type="number"
                      min={1}
                      value={form.maxAttempts}
                      onChange={(event) => {
                        const nextValue = (event.target as HTMLInputElement)
                          .valueAsNumber;
                      
                        updateForm({
                          maxAttempts: Number.isFinite(nextValue)
                            ? nextValue
                            : 0,
                        });
                      }}
                    />
                  </div>
                </div>
              </SectionBlock>

              <SectionBlock
                title="Experiencia do aluno"
                description="Escolha como as questoes serao apresentadas e quais informacoes aparecem ao final."
              >
                <div className="grid gap-3 lg:grid-cols-3">
                  {DISPLAY_MODE_OPTIONS.map((option) => {
                    const isSelected =
                      form.questionDisplayMode === option.value;
                    return (
                      <Label
                        key={option.value}
                        className="cursor-pointer rounded-2xl border p-4 transition-colors"
                        style={{
                          borderColor: isSelected
                            ? accentColor
                            : "var(--color-border)",
                          backgroundColor: isSelected
                            ? "var(--color-surface-secondary)"
                            : "var(--color-surface)",
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="questionDisplayMode"
                            checked={isSelected}
                            onChange={() =>
                              updateForm({ questionDisplayMode: option.value })
                            }
                            className="mt-1 h-4 w-4 shrink-0"
                            style={{ accentColor }}
                          />
                          <div>
                            <p
                              className="font-semibold"
                              style={{ color: "var(--color-text-primary)" }}
                            >
                              {option.label}
                            </p>
                            <p
                              className="mt-1 text-sm"
                              style={{ color: "var(--color-text-secondary)" }}
                            >
                              {option.description}
                            </p>
                          </div>
                        </div>
                      </Label>
                    );
                  })}
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  <ToggleTile
                    label="Embaralhar questoes"
                    description="Muda a ordem das questoes para cada tentativa."
                    checked={form.shuffleQuestions}
                    onChange={(checked) =>
                      updateForm({ shuffleQuestions: checked })
                    }
                    accentColor={accentColor}
                  />
                  <ToggleTile
                    label="Embaralhar op��es"
                    description="Embaralha alternativas de questoes objetivas."
                    checked={form.shuffleOptions}
                    onChange={(checked) =>
                      updateForm({ shuffleOptions: checked })
                    }
                    accentColor={accentColor}
                  />
                  <ToggleTile
                    label="Mostrar pontuacao"
                    description="Exibe o desempenho do aluno ao concluir."
                    checked={form.showScore}
                    onChange={(checked) => updateForm({ showScore: checked })}
                    accentColor={accentColor}
                  />
                  <ToggleTile
                    label="Mostrar respostas corretas"
                    description="Permite revelar o gabarito apos o envio."
                    checked={form.showCorrectAnswers}
                    onChange={(checked) =>
                      updateForm({ showCorrectAnswers: checked })
                    }
                    accentColor={accentColor}
                  />
                  <ToggleTile
                    label="Permitir revisao"
                    description="Libera consulta posterior da tentativa do aluno."
                    checked={form.allowReview}
                    onChange={(checked) => updateForm({ allowReview: checked })}
                    accentColor={accentColor}
                  />
                </div>
              </SectionBlock>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex items-start gap-3">
                  <div
                    className="mt-1 rounded-2xl p-3"
                    style={{
                      backgroundColor: "var(--color-surface-secondary)",
                      color: accentColor,
                    }}
                  >
                    <Layers3 size={20} />
                  </div>
                  <div>
                    <h2
                      className="text-2xl font-semibold"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      Monte as questoes
                    </h2>
                    <p
                      className="mt-1 text-sm"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      Cada tipo de questao agora mostra apenas os campos
                      realmente necessarios.
                    </p>
                  </div>
                </div>

                <ButtonComponent
                  type="button"
                  onClick={() => setShowQuestionTypeModal(true)}
                  className="gap-2"
                >
                  <CirclePlus size={18} />
                  Adicionar questao
                </ButtonComponent>
              </div>

              <PointsSummary
                questions={questions}
                totalPoints={form.totalPoints}
                accentColor={accentColor}
              />

              {questions.length === 0 ? (
                <div
                  className="rounded-3xl border border-dashed p-8 text-center"
                  style={{
                    backgroundColor: "var(--color-surface-secondary)",
                    borderColor: "var(--color-border)",
                  }}
                >
                  <div
                    className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
                    style={{
                      backgroundColor: "var(--color-surface)",
                      color: accentColor,
                    }}
                  >
                    <HelpCircle size={24} />
                  </div>
                  <h3
                    className="text-lg font-semibold"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    Nenhuma questao adicionada ainda
                  </h3>
                  <p
                    className="mx-auto mt-2 max-w-xl text-sm"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    Escolha um tipo de questao para comecar. A tela ja prepara
                    os campos mais importantes para voce.
                  </p>
                  <div className="mt-5 flex justify-center">
                    <ButtonComponent
                      type="button"
                      onClick={() => setShowQuestionTypeModal(true)}
                      className="gap-2"
                    >
                      <CirclePlus size={18} />
                      Criar primeira questao
                    </ButtonComponent>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {questions.map((question, index) => (
                    <QuestionEditorCard
                      key={question.tempId}
                      question={question}
                      index={index}
                      accentColor={accentColor}
                      canMoveUp={index > 0}
                      canMoveDown={index < questions.length - 1}
                      onMoveUp={() => moveQuestion(question.tempId, "up")}
                      onMoveDown={() => moveQuestion(question.tempId, "down")}
                      onUpdate={(updates) =>
                        updateQuestion(question.tempId, updates)
                      }
                      onUpdateConfig={(updates) =>
                        updateQuestionConfig(question.tempId, updates)
                      }
                      onRemove={() => removeQuestion(question.tempId)}
                      onAddOption={() => addOption(question.tempId)}
                      onRemoveOption={(optionTempId) =>
                        removeOption(question.tempId, optionTempId)
                      }
                      onMoveOption={(optionTempId, direction) =>
                        moveOption(question.tempId, optionTempId, direction)
                      }
                      onUpdateOption={(optionTempId, updates) =>
                        updateOption(question.tempId, optionTempId, updates)
                      }
                      onToggleCorrect={(optionTempId) =>
                        toggleCorrectOption(question.tempId, optionTempId)
                      }
                      onUpdateFillBlankAnswers={(value) =>
                        updateFillBlankAnswers(question.tempId, value)
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
                <div
                  className="rounded-3xl border p-6"
                  style={{
                    backgroundColor: "var(--color-surface-secondary)",
                    borderColor: "var(--color-border)",
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="mt-1 rounded-2xl p-3"
                      style={{
                        backgroundColor: "var(--color-surface)",
                        color: accentColor,
                      }}
                    >
                      <Eye size={20} />
                    </div>
                    <div>
                      <h2
                        className="text-2xl font-semibold"
                        style={{ color: "var(--color-text-primary)" }}
                      >
                        Revisao final
                      </h2>
                      <p
                        className="mt-1 text-sm"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        Confira o resumo, o gabarito e as configuracoes antes de
                        salvar.
                      </p>
                    </div>
                  </div>

                  <h3
                    className="mt-6 text-2xl font-bold"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {form.title.trim() || "Exercicio sem titulo"}
                  </h3>
                  {form.description.trim() && (
                    <p
                      className="mt-2 text-sm"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      {form.description}
                    </p>
                  )}
                  {form.instructions.trim() && (
                    <div
                      className="mt-5 rounded-2xl border p-4"
                      style={{
                        backgroundColor: "var(--color-surface)",
                        borderColor: "var(--color-border)",
                      }}
                    >
                      <p
                        className="text-xs font-semibold uppercase tracking-wide"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        Instrucoes
                      </p>
                      <p
                        className="mt-2 whitespace-pre-wrap text-sm"
                        style={{ color: "var(--color-text-primary)" }}
                      >
                        {form.instructions}
                      </p>
                    </div>
                  )}
                </div>

                <div
                  className="rounded-3xl border p-6"
                  style={{
                    backgroundColor: "var(--color-surface)",
                    borderColor: "var(--color-border)",
                  }}
                >
                  <h3
                    className="text-sm font-semibold uppercase tracking-wide"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    Indicadores
                  </h3>
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <MetricCard
                      label="Questoes"
                      value={questions.length.toString()}
                    />
                    <MetricCard
                      label="Pontos"
                      value={form.totalPoints.toString()}
                    />
                    <MetricCard
                      label="Minimo"
                      value={`${form.passingScore}%`}
                    />
                    <MetricCard
                      label="Tempo"
                      value={
                        form.timeLimit === ""
                          ? "Livre"
                          : `${form.timeLimit} min`
                      }
                    />
                  </div>
                  <div
                    className="mt-4 rounded-2xl border p-4"
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    <p
                      className="text-sm"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      Tentativas:{" "}
                      {form.maxAttempts === 0 ? "Ilimitadas" : form.maxAttempts}
                    </p>
                    <p
                      className="mt-2 text-sm"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      Exibicao: {getDisplayModeLabel(form.questionDisplayMode)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
                <SectionBlock
                  title="Comportamento"
                  description="Visao rapida das configuracoes que vao impactar a tentativa do aluno."
                >
                  <div className="grid gap-3 md:grid-cols-2">
                    <ReviewRow
                      label="Embaralhar questoes"
                      value={form.shuffleQuestions ? "Sim" : "Nao"}
                    />
                    <ReviewRow
                      label="Embaralhar op��es"
                      value={form.shuffleOptions ? "Sim" : "Nao"}
                    />
                    <ReviewRow
                      label="Mostrar pontuacao"
                      value={form.showScore ? "Sim" : "Nao"}
                    />
                    <ReviewRow
                      label="Mostrar respostas corretas"
                      value={form.showCorrectAnswers ? "Sim" : "Nao"}
                    />
                    <ReviewRow
                      label="Permitir revisao"
                      value={form.allowReview ? "Sim" : "Nao"}
                    />
                    <ReviewRow
                      label="Distribuicao atual"
                      value={`${totalQuestionPoints}/${form.totalPoints} pts`}
                    />
                  </div>
                </SectionBlock>

                <PointsSummary
                  questions={questions}
                  totalPoints={form.totalPoints}
                  accentColor={accentColor}
                />
              </div>

              <SectionBlock
                title="Preview das questoes"
                description="Esse resumo ajuda a validar rapidamente o tipo, a pontuacao e o gabarito de cada item."
              >
                <div className="space-y-4">
                  {questions.map((question, index) => (
                    <div
                      key={question.tempId}
                      className="rounded-2xl border p-5"
                      style={{
                        backgroundColor: "var(--color-surface-secondary)",
                        borderColor: "var(--color-border)",
                      }}
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold"
                              style={{
                                backgroundColor: "var(--color-surface)",
                                color: accentColor,
                              }}
                            >
                              {index + 1}
                            </span>
                            <span
                              className="rounded-full px-3 py-1 text-xs font-semibold"
                              style={{
                                backgroundColor: "var(--color-surface)",
                                color: accentColor,
                              }}
                            >
                              {getQuestionTypeLabel(question.type)}
                            </span>
                          </div>
                          <p
                            className="mt-3 text-base font-semibold"
                            style={{ color: "var(--color-text-primary)" }}
                          >
                            {question.questionText.trim() ||
                              "Pergunta sem enunciado"}
                          </p>
                        </div>

                        <div
                          className="rounded-2xl px-4 py-2 text-sm font-semibold"
                          style={{
                            backgroundColor: "var(--color-surface)",
                            color: "var(--color-text-primary)",
                          }}
                        >
                          {question.points} pts
                        </div>
                      </div>

                      {renderQuestionPreview(question, accentColor)}

                      {trimOrUndefined(question.explanation) && (
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
                            Explicacao
                          </p>
                          <p
                            className="mt-2 text-sm"
                            style={{ color: "var(--color-text-primary)" }}
                          >
                            {question.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </SectionBlock>
            </div>
          )}

          <div
            className="mt-8 flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between"
            style={{ borderColor: "var(--color-border)" }}
          >
            <p
              className="text-sm"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {currentStep === 0 &&
                "Primeiro definimos as regras gerais do exercicio."}
              {currentStep === 1 && "Depois montamos as questoes e o gabarito."}
              {currentStep === 2 && "Por fim, confira tudo antes de salvar."}
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              {currentStep > 0 && (
                <ButtonComponent
                  type="button"
                  variant="secondary"
                  onClick={() =>
                    setCurrentStep((currentStep - 1) as WizardStep)
                  }
                  className="gap-2"
                >
                  <ArrowLeft size={16} />
                  Voltar
                </ButtonComponent>
              )}

              {currentStep < 2 ? (
                <ButtonComponent
                  type="button"
                  onClick={goToNextStep}
                  className="gap-2"
                >
                  Proximo
                  <ArrowRight size={16} />
                </ButtonComponent>
              ) : (
                <ButtonComponent
                  type="button"
                  onClick={handleSubmit}
                  isLoading={isCreating}
                  className="gap-2"
                >
                  Salvar exercicio
                  <CheckCircle2 size={16} />
                </ButtonComponent>
              )}
            </div>
          </div>
        </section>
      </div>

      {showQuestionTypeModal && (
        <QuestionTypeModal
          accentColor={accentColor}
          onClose={() => setShowQuestionTypeModal(false)}
          onSelect={addQuestion}
        />
      )}
    </div>
  );
}

interface SummaryChipProps {
  label: string;
  value: string;
  accentColor: string;
}

function SummaryChip({ label, value, accentColor }: SummaryChipProps) {
  return (
    <div
      className="rounded-2xl border p-3"
      style={{
        backgroundColor: "var(--color-surface-secondary)",
        borderColor: "var(--color-border)",
      }}
    >
      <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
        {label}
      </p>
      <p className="mt-1 text-lg font-bold" style={{ color: accentColor }}>
        {value}
      </p>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="rounded-2xl border p-4"
      style={{
        backgroundColor: "var(--color-surface-secondary)",
        borderColor: "var(--color-border)",
      }}
    >
      <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
        {label}
      </p>
      <p
        className="mt-1 text-lg font-bold"
        style={{ color: "var(--color-text-primary)" }}
      >
        {value}
      </p>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="rounded-2xl border p-4"
      style={{
        backgroundColor: "var(--color-surface-secondary)",
        borderColor: "var(--color-border)",
      }}
    >
      <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
        {label}
      </p>
      <p
        className="mt-1 text-sm font-semibold"
        style={{ color: "var(--color-text-primary)" }}
      >
        {value}
      </p>
    </div>
  );
}

interface SectionBlockProps {
  title: string;
  description?: string;
  children: ReactNode;
}

function SectionBlock({ title, description, children }: SectionBlockProps) {
  return (
    <section className="space-y-4">
      <div>
        <h3
          className="text-lg font-semibold"
          style={{ color: "var(--color-text-primary)" }}
        >
          {title}
        </h3>
        {description && (
          <p
            className="mt-1 text-sm"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {description}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}

function FieldLabel({
  children,
  required = false,
}: {
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <Label
      className="mb-2 block text-sm font-medium"
      style={{ color: "var(--color-text-secondary)" }}
    >
      {children}
      {required && " *"}
    </Label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  rows?: number;
}) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <TextArea
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
function ToggleTile({
  label,
  description,
  checked,
  onChange,
  accentColor,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  accentColor: string;
}) {
  return (
    <Label
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
    </Label>
  );
}

function QuestionTypeModal({
  accentColor,
  onClose,
  onSelect,
}: {
  accentColor: string;
  onClose: () => void;
  onSelect: (type: QuestionType) => void;
}) {
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
          <Button
            type="button"
            onClick={onClose}
            className="rounded-full border px-3 py-1 text-sm font-medium transition-opacity hover:opacity-75"
            style={{
              borderColor: "var(--color-border)",
              color: "var(--color-text-secondary)",
            }}
          >
            Fechar
          </Button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {QUESTION_TYPE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onSelect(option.value)}
              className="rounded-2xl border p-4 text-left transition-transform hover:-translate-y-0.5 cursor-pointer"
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

interface QuestionEditorCardProps {
  question: QuestionForm;
  index: number;
  accentColor: string;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onUpdate: (updates: Partial<QuestionForm>) => void;
  onUpdateConfig: (updates: Partial<QuestionConfigDTO>) => void;
  onRemove: () => void;
  onAddOption: () => void;
  onRemoveOption: (optionTempId: string) => void;
  onMoveOption: (optionTempId: string, direction: "up" | "down") => void;
  onUpdateOption: (
    optionTempId: string,
    updates: Partial<QuestionOptionForm>,
  ) => void;
  onToggleCorrect: (optionTempId: string) => void;
  onUpdateFillBlankAnswers: (value: string) => void;
}

function QuestionEditorCard({
  question,
  index,
  accentColor,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  onUpdate,
  onUpdateConfig,
  onRemove,
  onAddOption,
  onRemoveOption,
  onMoveOption,
  onUpdateOption,
  onToggleCorrect,
  onUpdateFillBlankAnswers,
}: QuestionEditorCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const supportsOptions = [
    "MULTIPLE_CHOICE_SINGLE",
    "MULTIPLE_CHOICE_MULTIPLE",
    "TRUE_FALSE",
    "ORDERING",
    "MATCHING",
  ].includes(question.type);
  const isSingleChoice =
    question.type === "MULTIPLE_CHOICE_SINGLE" ||
    question.type === "TRUE_FALSE";

  return (
    <article
      className="overflow-hidden rounded-3xl border"
      style={{
        backgroundColor: "var(--color-surface-secondary)",
        borderColor: "var(--color-border)",
      }}
    >
      <Header
        className="flex flex-col gap-4 border-b p-5 sm:flex-row sm:items-start sm:justify-between"
        style={{ borderColor: "var(--color-border)" }}
      >
        <div className="flex min-w-0 items-start gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-sm font-bold"
            style={{
              backgroundColor: "var(--color-surface)",
              color: accentColor,
            }}
          >
            {index + 1}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="rounded-full px-3 py-1 text-xs font-semibold"
                style={{
                  backgroundColor: "var(--color-surface)",
                  color: accentColor,
                }}
              >
                {getQuestionTypeLabel(question.type)}
              </span>
              <span
                className="rounded-full px-3 py-1 text-xs font-semibold"
                style={{
                  backgroundColor: "var(--color-surface)",
                  color: "var(--color-text-secondary)",
                }}
              >
                {question.points} pts
              </span>
            </div>
            <p
              className="mt-3 truncate text-base font-semibold"
              style={{ color: "var(--color-text-primary)" }}
            >
              {question.questionText.trim() || "Nova questao"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <IconButton
            title="Mover para cima"
            onClick={onMoveUp}
            isDisabled={!canMoveUp}
          >
            <ArrowUp size={16} />
          </IconButton>
          <IconButton
            title="Mover para baixo"
            onClick={onMoveDown}
            isDisabled={!canMoveDown}
          >
            <ArrowDown size={16} />
          </IconButton>
          <IconButton
            title={isExpanded ? "Recolher" : "Expandir"}
            onClick={() => setIsExpanded((current) => !current)}
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </IconButton>
          <IconButton title="Remover questao" onClick={onRemove} tone="danger">
            <Trash2 size={16} />
          </IconButton>
        </div>
      </Header>

      {isExpanded && (
        <div className="space-y-5 p-5">
          <div className="grid gap-4 xl:grid-cols-[1fr_180px]">
            <div>
              <TextAreaField
                label="Enunciado"
                value={question.questionText}
                onChange={(value) => onUpdate({ questionText: value })}
                placeholder="Digite o texto da questao aqui."
                rows={4}
              />
            </div>
            <div>
              <FieldLabel required>Pontos</FieldLabel>
              <InputComponent
                type="number"
                min={1}
                value={question.points}
                onChange={(event) => {
                  const nextValue = (event.target as HTMLInputElement)
                    .valueAsNumber;
                  onUpdate({
                    points: Number.isFinite(nextValue) ? nextValue : 0,
                  });
                }}
              />
            </div>
          </div>

          {question.type === "FILL_BLANKS" && (
            <div
              className="rounded-2xl border p-4"
              style={{
                backgroundColor: "var(--color-surface)",
                borderColor: "var(--color-border)",
              }}
            >
              <p
                className="text-sm font-semibold"
                style={{ color: "var(--color-text-primary)" }}
              >
                Respostas aceitas
              </p>
              <p
                className="mt-1 text-sm"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Separe por virgula ou linha. Exemplo: React, reactjs, biblioteca React.
              </p>
              <TextArea
                value={question.config?.acceptableAnswers?.join(", ") ?? ""}
                onChange={(e) =>
                  onUpdateFillBlankAnswers(e.target.value)
                }
                rows={3}
                placeholder="Digite as respostas aceitas"
                className={`${TEXTAREA_CLASSNAME} mt-3 min-h-24`}
                style={{
                  backgroundColor: "var(--color-surface-secondary)",
                  borderColor: "var(--color-border)",
                  color: "var(--color-text-primary)",
                }}
              />
              <div className="mt-4">
                <ToggleTile
                  label="Diferenciar maiusculas e minusculas"
                  description="Ative somente se a resposta precisar respeitar exatamente a capitalizacao."
                  checked={Boolean(question.config?.caseSensitive)}
                  onChange={(checked) =>
                    onUpdateConfig({ caseSensitive: checked })
                  }
                  accentColor={accentColor}
                />
              </div>
            </div>
          )}

          {question.type === "ESSAY" && (
            <div
              className="rounded-2xl border p-4"
              style={{
                backgroundColor: "var(--color-surface)",
                borderColor: "var(--color-border)",
              }}
            >
              <p
                className="text-sm"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Questao dissertativa nao precisa de op��es. O aluno respondera
                com texto livre e a correcao sera manual.
              </p>
            </div>
          )}

          {supportsOptions && (
            <div
              className="rounded-2xl border p-4"
              style={{
                backgroundColor: "var(--color-surface)",
                borderColor: "var(--color-border)",
              }}
            >
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p
                    className="font-semibold"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {question.type === "MATCHING" ? "Pares" : "Op��es"}
                  </p>
                  <p
                    className="text-sm"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {question.type === "ORDERING" &&
                      "A ordem exibida aqui sera a ordem correta da resposta."}
                    {question.type === "MATCHING" &&
                      "Preencha cada item com seu par correspondente."}
                    {question.type === "MULTIPLE_CHOICE_MULTIPLE" &&
                      "Voce pode marcar mais de uma alternativa como correta."}
                    {question.type === "MULTIPLE_CHOICE_SINGLE" &&
                      "Marque somente uma alternativa correta."}
                    {question.type === "TRUE_FALSE" &&
                      "Selecione se a resposta correta eh verdadeiro ou falso."}
                  </p>
                </div>
                {question.type !== "TRUE_FALSE" && (
                  <ButtonComponent
                    type="button"
                    variant="ghost"
                    onClick={onAddOption}
                    className="gap-2"
                  >
                    <CirclePlus size={16} />
                    Adicionar
                  </ButtonComponent>
                )}
              </div>

              <div className="space-y-3">
                {question.options.map((option, optionIndex) => (
                  <div
                    key={option.tempId}
                    className="grid gap-3 rounded-2xl border p-4"
                    style={{
                      backgroundColor: "var(--color-surface-secondary)",
                      borderColor: "var(--color-border)",
                    }}
                  >
                    {(question.type === "MULTIPLE_CHOICE_SINGLE" ||
                      question.type === "MULTIPLE_CHOICE_MULTIPLE" ||
                      question.type === "TRUE_FALSE") && (
                      <div className="flex items-start gap-3">
                        <Input
                          type={isSingleChoice ? "radio" : "checkbox"}
                          checked={option.isCorrect}
                          onChange={() => onToggleCorrect(option.tempId)}
                          name={`correct-${question.tempId}`}
                          className="mt-3 h-4 w-4 shrink-0 hover:cursor-pointer"
                          style={{ accentColor }}
                        />
                        <div className="flex-1">
                          <FieldLabel>
                            Op��o {String.fromCharCode(65 + optionIndex)}
                          </FieldLabel>
                          <InputComponent
                            value={option.optionText}
                            onChange={(event) =>
                              onUpdateOption(option.tempId, {
                                optionText: (event.target as HTMLInputElement)
                                  .value,
                              })
                            }
                            disabled={question.type === "TRUE_FALSE"}
                            placeholder={`Digite a op��o ${String.fromCharCode(65 + optionIndex)}`}
                          />
                        </div>
                        {question.type !== "TRUE_FALSE" && (
                          <div className="flex items-center gap-2 pt-7">
                            <IconButton
                              title="Remover op��o"
                              onClick={() => onRemoveOption(option.tempId)}
                              tone="danger"
                            >
                              <Trash2 size={16} />
                            </IconButton>
                          </div>
                        )}
                      </div>
                    )}

                    {question.type === "ORDERING" && (
                      <div className="grid gap-3 sm:grid-cols-[64px_1fr_auto] sm:items-end">
                        <div>
                          <FieldLabel>Posicao</FieldLabel>
                          <div
                            className="flex h-10 items-center justify-center rounded-2xl border text-sm font-semibold"
                            style={{
                              backgroundColor: "var(--color-surface)",
                              borderColor: "var(--color-border)",
                              color: accentColor,
                            }}
                          >
                            {optionIndex + 1}
                          </div>
                        </div>
                        <div>
                          <FieldLabel>Item</FieldLabel>
                          <InputComponent
                            value={option.optionText}
                            onChange={(event) =>
                              onUpdateOption(option.tempId, {
                                optionText: (event.target as HTMLInputElement)
                                  .value,
                              })
                            }
                            placeholder="Digite o texto do item"
                          />
                        </div>
                        <div className="flex items-center gap-2 pb-1">
                          <IconButton
                            title="Mover item para cima"
                            onClick={() => onMoveOption(option.tempId, "up")}
                            isDisabled={optionIndex === 0}
                          >
                            <ArrowUp size={16} />
                          </IconButton>
                          <IconButton
                            title="Mover item para baixo"
                            onClick={() => onMoveOption(option.tempId, "down")}
                            isDisabled={
                              optionIndex === question.options.length - 1
                            }
                          >
                            <ArrowDown size={16} />
                          </IconButton>
                          <IconButton
                            title="Remover item"
                            onClick={() => onRemoveOption(option.tempId)}
                            tone="danger"
                          >
                            <Trash2 size={16} />
                          </IconButton>
                        </div>
                      </div>
                    )}

                    {question.type === "MATCHING" && (
                      <div className="grid gap-3 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
                        <div>
                          <FieldLabel>Coluna A</FieldLabel>
                          <InputComponent
                            value={option.optionText}
                            onChange={(event) =>
                              onUpdateOption(option.tempId, {
                                optionText: (event.target as HTMLInputElement)
                                  .value,
                              })
                            }
                            placeholder="Item da coluna A"
                          />
                        </div>
                        <div>
                          <FieldLabel>Coluna B</FieldLabel>
                          <InputComponent
                            value={option.matchPair ?? ""}
                            onChange={(event) =>
                              onUpdateOption(option.tempId, {
                                matchPair: (event.target as HTMLInputElement)
                                  .value,
                              })
                            }
                            placeholder="Par correspondente"
                          />
                        </div>
                        <div className="flex items-center gap-2 pb-1">
                          <IconButton
                            title="Remover par"
                            onClick={() => onRemoveOption(option.tempId)}
                            tone="danger"
                          >
                            <Trash2 size={16} />
                          </IconButton>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {(question.type === "MULTIPLE_CHOICE_MULTIPLE" ||
                question.type === "MATCHING") && (
                <div className="mt-4">
                  <ToggleTile
                    label="Permitir pontuacao parcial"
                    description="A pontuacao podera ser proporcional aos acertos do aluno."
                    checked={Boolean(question.config?.partialCredit)}
                    onChange={(checked) =>
                      onUpdateConfig({ partialCredit: checked })
                    }
                    accentColor={accentColor}
                  />
                </div>
              )}
            </div>
          )}

          <TextAreaField
            label="Explicacao opcional"
            value={question.explanation ?? ""}
            onChange={(value) => onUpdate({ explanation: value })}
            placeholder="Use esse campo para registrar um comentario, explicacao ou observacao para a correcao."
            rows={3}
          />
        </div>
      )}
    </article>
  );
}

function IconButton({
  children,
  title,
  onClick,
  tone = "default",
  isDisabled = false,
}: {
  children: ReactNode;
  title: string;
  onClick: () => void;
  tone?: "default" | "danger";
  isDisabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      title={title}
      className="flex h-10 w-10 items-center justify-center rounded-2xl border transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
      style={{
        backgroundColor:
          tone === "danger"
            ? "var(--color-error-light)"
            : "var(--color-surface)",
        borderColor:
          tone === "danger"
            ? "var(--color-error-light)"
            : "var(--color-border)",
        color:
          tone === "danger"
            ? "var(--color-error)"
            : "var(--color-text-secondary)",
      }}
    >
      {children}
    </button>
  );
}

function renderQuestionPreview(question: QuestionForm, accentColor: string) {
  if (question.type === "ESSAY") {
    return (
      <p
        className="mt-4 text-sm"
        style={{ color: "var(--color-text-secondary)" }}
      >
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
        <p
          className="mt-2 text-sm"
          style={{ color: "var(--color-text-primary)" }}
        >
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
            <span
              className="text-sm font-semibold"
              style={{ color: accentColor }}
            >
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
            <span
              className="text-center text-sm font-semibold"
              style={{ color: accentColor }}
            >
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
              color: option.isCorrect
                ? accentColor
                : "var(--color-text-secondary)",
            }}
          >
            {String.fromCharCode(65 + index)}
          </span>
          <span
            className="flex-1 text-sm"
            style={{
              color: option.isCorrect
                ? accentColor
                : "var(--color-text-primary)",
              fontWeight: option.isCorrect ? 600 : 400,
            }}
          >
            {option.optionText || "Op��o sem texto"}
          </span>
          {option.isCorrect && <CheckCircle2 size={16} color={accentColor} />}
        </div>
      ))}
    </div>
  );
}

function getQuestionTypeLabel(type: QuestionType) {
  return (
    QUESTION_TYPE_OPTIONS.find((option) => option.value === type)?.label ?? type
  );
}

function getDisplayModeLabel(mode: QuestionDisplayMode) {
  return (
    DISPLAY_MODE_OPTIONS.find((option) => option.value === mode)?.label ?? mode
  );
}

function formatValidationErrors(errors: ValidationError[]) {
  const visibleErrors = errors.slice(0, 3).map((error) => error.message);
  const baseMessage = visibleErrors.join(" | ");

  if (errors.length <= 3) {
    return baseMessage;
  }

  return `${baseMessage} | mais ${errors.length - 3} erro(s)`;
}

function trimOrUndefined(value?: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function parseAnswers(value: string) {
  return value
    .split(/[\n,]/)
    .map((answer) => answer.trim())
    .filter(Boolean);
}

function createTempId(prefix: string) {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function createOption(
  overrides: Partial<QuestionOptionForm> = {},
): QuestionOptionForm {
  return {
    tempId: createTempId("option"),
    optionText: "",
    isCorrect: false,
    feedback: undefined,
    matchPair: undefined,
    order: 0,
    correctPosition: undefined,
    ...overrides,
  };
}

function createQuestion(
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
      createOption({ optionText: "Verdadeiro", isCorrect: false }),
      createOption({ optionText: "Falso", isCorrect: false }),
    ];
  }

  if (
    type === "MULTIPLE_CHOICE_SINGLE" ||
    type === "MULTIPLE_CHOICE_MULTIPLE"
  ) {
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

function normalizeQuestions(questions: QuestionForm[]) {
  return questions.map((question, index) => normalizeQuestion(question, index));
}

function normalizeQuestion(
  question: QuestionForm,
  index: number,
): QuestionForm {
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

function mapQuestionToDTO(
  question: QuestionForm,
  index: number,
): CreateQuestionDTO {
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

function buildQuestionConfig(question: QuestionForm) {
  const config: QuestionConfigDTO = {};

  if (question.type === "FILL_BLANKS") {
    const acceptableAnswers =
      question.config?.acceptableAnswers?.filter((answer) => answer.trim()) ??
      [];
    if (acceptableAnswers.length > 0) {
      config.acceptableAnswers = acceptableAnswers;
    }
    if (question.config?.caseSensitive) {
      config.caseSensitive = true;
    }
  }

  if (
    (question.type === "MULTIPLE_CHOICE_MULTIPLE" ||
      question.type === "MATCHING") &&
    question.config?.partialCredit
  ) {
    config.partialCredit = true;
  }

  return Object.keys(config).length > 0 ? config : undefined;
}

function buildQuestionOptions(question: QuestionForm) {
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

function swapItems<T>(items: T[], firstIndex: number, secondIndex: number) {
  const nextItems = [...items];
  const firstItem = nextItems[firstIndex];
  nextItems[firstIndex] = nextItems[secondIndex];
  nextItems[secondIndex] = firstItem;
  return nextItems;
}

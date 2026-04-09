/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CirclePlus,
  ClipboardList,
  Eye,
  HelpCircle,
  Layers3,
  Settings2,
} from "lucide-react";
import { PointsSummary } from "@/features/teacher/components/PointsSummary";
import { ProgressIndicator } from "@/features/teacher/components/ProgressIndicator";
import { ButtonComponent } from "@/shared/components/ui/ButtonComponent";
import { InputComponent } from "@/shared/components/ui/InputComponent";
import { NotificationComponent } from "@/shared/components/ui/NotificationComponent";
import { LoadingSkeleton } from "@/shared/components/ui/LoadingSkeleton";
import { useTheme } from "@/app/providers/ThemeContext";
import { ExerciseTeacherApi } from "@/features/teacher/api/exerciseTeacher.api";
import {
  buildUpdatePayload,
  createOption,
  createQuestion,
  mapExerciseResponseToForm,
  mapQuestionToCreateDTO,
  mapQuestionToDTO,
  mapResponseQuestions,
  normalizeQuestions,
  parseAnswers,
  renderQuestionPreview,
  resolveExerciseEditLoadErrorMessage,
  resolveExerciseEditSaveErrorMessage,
  swapItems,
  trimOrUndefined,
} from "./exerciseEdit.utils";
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
import { Button, Label } from "react-aria-components";
import { SummaryChip } from "@/features/teacher/components/exercise-edit/SummaryChip";
import { MetricCard } from "@/features/teacher/components/exercise-edit/MetricCard";
import { ReviewRow } from "@/features/teacher/components/exercise-edit/ReviewRow";
import { SectionBlock } from "@/features/teacher/components/exercise-edit/SectionBlock";
import { FieldLabel } from "@/features/teacher/components/exercise-edit/FieldLabel";
import { TextAreaField } from "@/features/teacher/components/exercise-edit/TextAreaField";
import { ToggleTile } from "@/features/teacher/components/exercise-edit/ToggleTile";
import { QuestionTypeModal } from "@/features/teacher/components/exercise-edit/QuestionTypeModal";
import { QuestionEditorCard } from "@/features/teacher/components/exercise-edit/QuestionEditorCard";
import { getQuestionTypeLabel, getDisplayModeLabel } from "@/features/teacher/components/exercise-edit/utils";

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

export function ExerciseEdit() {
  const { courseId, moduleId, lessonId, exerciseId } = useParams<{
    courseId: string;
    moduleId: string;
    lessonId: string;
    exerciseId: string;
  }>();
  const navigate = useNavigate();
  const { accentColor } = useTheme();

  const [currentStep, setCurrentStep] = useState<WizardStep>(0);
  const [form, setForm] = useState<ExerciseFormState>(INITIAL_FORM_STATE);
  const [questions, setQuestions] = useState<QuestionForm[]>([]);
  const [showQuestionTypeModal, setShowQuestionTypeModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadErrorMessage, setLoadErrorMessage] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  const lessonIdNumber = Number(lessonId);
  const exerciseIdNumber = Number(exerciseId);
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

    const formatValidationErrors = (errors: ValidationError[]) => {
      return errors.map(error => error.message).join("\n");
    };

    showNotification("error", formatValidationErrors(errors));
  };

  useEffect(() => {
    if (!Number.isFinite(exerciseIdNumber)) {
      setLoadErrorMessage(
        "Nao foi possivel identificar o exercicio para edicao.",
      );
      setIsLoading(false);
      return;
    }

    const loadExercise = async () => {
      try {
        setIsLoading(true);
        setLoadErrorMessage(null);

        const response = await ExerciseTeacherApi.getById(
          exerciseIdNumber,
          true,
        );
        const exercise = response.data;
        const loadedQuestions = mapResponseQuestions(exercise.questions ?? []);

        setForm(mapExerciseResponseToForm(exercise));
        setQuestions(loadedQuestions);
      } catch (error: unknown) {
        console.error("Erro ao carregar exercicio:", error);
        setLoadErrorMessage(resolveExerciseEditLoadErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    };

    loadExercise();
  }, [exerciseIdNumber]);

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
      mapQuestionToCreateDTO(question, index),
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
    if (!Number.isFinite(exerciseIdNumber)) {
      showNotification("error", "Nao foi possivel identificar o exercicio.");
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
      await ExerciseTeacherApi.update(exerciseIdNumber, {
        ...buildUpdatePayload(form),
        questions: questions.map((question, index) =>
          mapQuestionToDTO(question, index),
        ),
      });
      showNotification("success", "Exercicio atualizado com sucesso.");
      setTimeout(() => {
        navigate(exercisePath);
      }, 1200);
    } catch (error: unknown) {
      console.error("Erro ao atualizar exercicio:", error);
      showNotification("error", resolveExerciseEditSaveErrorMessage(error));
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (loadErrorMessage) {
    return (
      <div
        className="min-h-screen pb-12"
        style={{ backgroundColor: "var(--color-bg-main)" }}
      >
        <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
          <Button
            type="button"
            onClick={() => navigate(exercisePath)}
            className="flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-75"
            style={{ color: "var(--color-text-secondary)" }}
          >
            <ArrowLeft size={18} />
            <span>Voltar para exercicios</span>
          </Button>

          <NotificationComponent
            type="error"
            message={loadErrorMessage}
            onClose={() => navigate(exercisePath)}
            duration={0}
          />

          <section
            className="rounded-3xl border p-6 shadow-sm"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border)",
            }}
          >
            <h1
              className="text-2xl font-bold"
              style={{ color: "var(--color-text-primary)" }}
            >
              Edicao indisponivel no ambiente atual
            </h1>
            <p
              className="mt-3 text-sm"
              style={{ color: "var(--color-text-secondary)" }}
            >
              A tela de edicao foi criada no front, mas o backend deste projeto
              ainda nao expoe todos os endpoints necessarios para carregar e
              salvar as questoes com seguranca.
            </p>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen pb-12"
      style={{ backgroundColor: "var(--color-bg-main)" }}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <Button
          type="button"
          onClick={() => navigate(exercisePath)}
          className="flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-75"
          style={{ color: "var(--color-text-secondary)" }}
        >
          <ArrowLeft size={18} />
          <span>Voltar para exercicios</span>
        </Button>

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
              Edicao guiada
            </div>
            <h1
              className="text-3xl font-bold sm:text-4xl"
              style={{ color: "var(--color-text-primary)" }}
            >
              Editar exercicio
            </h1>
            <p
              className="mt-3 max-w-2xl text-sm sm:text-base"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Preencha os dados do exercício em etapas simples. Cada passo
              valida as informações automaticamente para garantir consistência e
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
                    if (isLoading) {
                      return <LoadingSkeleton />;
                    }

                    if (loadErrorMessage) {
                      return (
                        <div
                          className="min-h-screen pb-12"
                          style={{ backgroundColor: "var(--color-bg-main)" }}
                        >
                          <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
                            <Button
                              type="button"
                              onClick={() => navigate(exercisePath)}
                              className="flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-75"
                              style={{ color: "var(--color-text-secondary)" }}
                            >
                              <ArrowLeft size={18} />
                              <span>Voltar para exercicios</span>
                            </Button>

                            <NotificationComponent
                              type="error"
                              message={loadErrorMessage}
                              onClose={() => navigate(exercisePath)}
                              duration={0}
                            />

                            <section
                              className="rounded-3xl border p-6 shadow-sm"
                              style={{
                                backgroundColor: "var(--color-surface)",
                                borderColor: "var(--color-border)",
                              }}
                            >
                              <h1
                                className="text-2xl font-bold"
                                style={{ color: "var(--color-text-primary)" }}
                              >
                                Edicao indisponivel no ambiente atual
                              </h1>
                              <p
                                className="mt-3 text-sm"
                                style={{ color: "var(--color-text-secondary)" }}
                              >
                                A tela de edicao foi criada no front, mas o
                                backend deste projeto ainda nao expoe todos os
                                endpoints necessarios para carregar e salvar as
                                questoes com seguranca.
                              </p>
                            </section>
                          </div>
                        </div>
                      );
                    }

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
                    label="Embaralhar opções"
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
                      label="Embaralhar opções"
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

                      {question.explanation && trimOrUndefined(question.explanation) ? (
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
                      ) : null}
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
                  Salvar alteracoes
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

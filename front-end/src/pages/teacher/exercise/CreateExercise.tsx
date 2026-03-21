/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  ClipboardList,
  Plus,
  Settings,
  Trash2,
  Eye,
  GripVertical,
  X,
} from "lucide-react";
import { ButtonComponent } from "../../../components/ui/ButtonComponent";
import { InputComponent } from "../../../components/ui/InputComponent";
import { NotificationComponent } from "../../../components/ui/NotificationComponent";
import { useTheme } from "../../../context/ThemeContext";
import { Button, Label, TextArea } from "react-aria-components";
import { ExerciseTeacherApi } from "../../../api/exerciseTeacher.api";
import type { CreateQuestionDTO } from "../../../types/CreateQuestionDTO";
import type { CreateQuestionOptionDTO } from "../../../types/CreateQuestionOptionDTO";
import type { QuestionType } from "../../../types/QuestionType";
import type { CreateExerciseDTO } from "../../../types/CreateExerciseDTO";

type WizardStep = 1 | 2 | 3;

interface QuestionForm extends Omit<CreateQuestionDTO, "options"> {
  tempId: string;
  options: QuestionOptionForm[];
}

interface QuestionOptionForm extends CreateQuestionOptionDTO {
  tempId: string;
}

const QUESTION_TYPES: Array<{
  value: QuestionType;
  label: string;
  description: string;
}> = [
  {
    value: "MULTIPLE_CHOICE_SINGLE",
    label: "Múltipla Escolha (Uma resposta)",
    description: "Questão com várias opções, apenas uma correta",
  },
  {
    value: "MULTIPLE_CHOICE_MULTIPLE",
    label: "Múltipla Escolha (Múltiplas respostas)",
    description: "Questão com várias opções, mais de uma correta",
  },
  {
    value: "TRUE_FALSE",
    label: "Verdadeiro ou Falso",
    description: "Questão com apenas duas opções: V ou F",
  },
  {
    value: "ESSAY",
    label: "Dissertativa",
    description: "Resposta aberta, correção manual",
  },
  {
    value: "FILL_BLANKS",
    label: "Preencher Lacunas",
    description: "Completar espaços em branco no texto",
  },
  {
    value: "ORDERING",
    label: "Ordenação",
    description: "Colocar itens na ordem correta",
  },
  {
    value: "MATCHING",
    label: "Correspondência",
    description: "Associar itens de duas colunas",
  },
];

export function CreateExercise() {
  const { courseId, moduleId, lessonId } = useParams<{
    courseId: string;
    moduleId: string;
    lessonId: string;
  }>();
  const { accentColor } = useTheme();
  const navigate = useNavigate();

  // Estado do Wizard
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);

  // Estado do Formulário
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [totalPoints, setTotalPoints] = useState(100);
  const [passingScore, setPassingScore] = useState(60);
  const [timeLimit, setTimeLimit] = useState<number | undefined>(undefined);
  const [maxAttempts, setMaxAttempts] = useState(0);
  const [shuffleQuestions, setShuffleQuestions] = useState(true);
  const [shuffleOptions, setShuffleOptions] = useState(true);
  const [showCorrectAnswers, setShowCorrectAnswers] = useState(false);
  const [showScore, setShowScore] = useState(true);
  const [allowReview, setAllowReview] = useState(false);
  const [questionDisplayMode, setQuestionDisplayMode] =
    useState<string>("ALL_AT_ONCE");

  // Estado do Formulário
  const [questions, setQuestions] = useState<QuestionForm[]>([]);
  const [showQuestionTypeModal, setShowQuestionTypeModal] = useState(false);

  // Estado de Loading e Notificações
  const [isCreating, setIsCreating] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  const showNotification = (
    type: "success" | "error" | "info",
    message: string,
  ) => {
    setNotification({ type, message });
  };

  const goToNextStep = () => {
    if (currentStep === 1) {
      if (!validateStep1()) return;
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!validateStep2()) return;
      setCurrentStep(3);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as WizardStep);
    }
  };

  const goToStep = (step: WizardStep) => {
    if (step < currentStep) {
      setCurrentStep(step);
    }
  };

  // Validações
  const validateStep1 = (): boolean => {
    if (!title.trim()) {
      showNotification("error", "Título é obrigatório");
      return false;
    }
    if (totalPoints <= 0) {
      showNotification("error", "Pontuação total deve ser maior que zero");
      return false;
    }
    if (passingScore < 0 || passingScore > 100) {
      showNotification("error", "Nota de aprovação deve estar entre 0 e 100");
      return false;
    }
    return true;
  };

  const validateStep2 = (): boolean => {
    if (questions.length === 0) {
      showNotification("error", "Adicione pelo menos uma questão");
      return false;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.questionText.trim()) {
        showNotification("error", `Questão ${i + 1}: Texto é obrigatório`);
        return false;
      }

      if (q.points == null || q.points == undefined) {
        showNotification("error", `Questão ${i + 1} deve ter uma pontuação`);
      }

      if (q.points <= 0) {
        showNotification(
          "error",
          `Questão ${i + 1}: Pontuação deve ser maior que zero`,
        );
        return false;
      }

      // Validar opções para tipos específicos
      if (
        q.type === "MULTIPLE_CHOICE_SINGLE" ||
        q.type === "MULTIPLE_CHOICE_MULTIPLE"
      ) {
        if (q.options.length < 2) {
          showNotification(
            "error",
            `Questão ${i + 1}: Adicione pelo menos 2 opções`,
          );
          return false;
        }
        const correctCount = q.options.filter((o) => o.isCorrect).length;
        if (q.type === "MULTIPLE_CHOICE_SINGLE" && correctCount !== 1) {
          showNotification(
            "error",
            `Questão ${i + 1}: Marque exatamente uma opção correta`,
          );
          return false;
        }
        if (q.type === "MULTIPLE_CHOICE_MULTIPLE" && correctCount === 0) {
          showNotification(
            "error",
            `Questão ${i + 1}: Marque pelo menos uma opção correta`,
          );
          return false;
        }
      }

      if (q.type === "TRUE_FALSE") {
        if (q.options.length !== 2) {
          showNotification(
            "error",
            `Questão ${i + 1}: Deve ter exatamente 2 opções (V e F)`,
          );
          return false;
        }
        const correctCount = q.options.filter((o) => o.isCorrect).length;
        if (correctCount !== 1) {
          showNotification(
            "error",
            `Questão ${i + 1}: Marque a opção correta (V ou F)`,
          );
          return false;
        }
      }

      if (q.type === "ORDERING" || q.type === "MATCHING") {
        if (q.options.length < 2) {
          showNotification(
            "error",
            `Questão ${i + 1}: Adicione pelo menos 2 itens`,
          );
          return false;
        }
      }
    }

    return true;
  };

  const addQuestion = (type: QuestionType) => {
    const newQuestion: QuestionForm = {
      tempId: `temp-${Date.now()}`,
      type,
      questionText: "",
      points: Math.floor(totalPoints / (questions.length + 1)),
      explanation: "",
      orderIndex: questions.length,
      options: [],
    };

    // Adicionar opções padrão para TRUE_FALSE
    if (type === "TRUE_FALSE") {
      newQuestion.options = [
        {
          tempId: `opt-${Date.now()}-1`,
          optionText: "Verdadeiro",
          isCorrect: false,
          orderIndex: 0,
        },
        {
          tempId: `opt-${Date.now()}-2`,
          optionText: "Falso",
          isCorrect: false,
          orderIndex: 1,
        },
      ];
    }

    setQuestions([...questions, newQuestion]);
    setShowQuestionTypeModal(false);
  };

  const removeQuestion = (tempId: string) => {
    setQuestions(questions.filter((q) => q.tempId !== tempId));
  };

  const updateQuestion = (tempId: string, updates: Partial<QuestionForm>) => {
    setQuestions(
      questions.map((q) => (q.tempId === tempId ? { ...q, ...updates } : q)),
    );
  };

  const addOption = (questionTempId: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.tempId === questionTempId) {
          const newOption: QuestionOptionForm = {
            tempId: `opt-${Date.now()}`,
            optionText: "",
            isCorrect: false,
            orderIndex: q.options.length,
          };
          return { ...q, options: [...q.options, newOption] };
        }
        return q;
      }),
    );
  };

  const removeOption = (questionTempId: string, optionTempId: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.tempId === questionTempId) {
          return {
            ...q,
            options: q.options.filter((o) => o.tempId !== optionTempId),
          };
        }
        return q;
      }),
    );
  };

  const updateOption = (
    questionTempId: string,
    optionTempId: string,
    updates: Partial<QuestionOptionForm>,
  ) => {
    setQuestions(
      questions.map((q) => {
        if (q.tempId === questionTempId) {
          return {
            ...q,
            options: q.options.map((o) =>
              o.tempId === optionTempId ? { ...o, ...updates } : o,
            ),
          };
        }
        return q;
      }),
    );
  };

  const toggleCorrectOption = (
    questionTempId: string,
    optionTempId: string,
  ) => {
    setQuestions(
      questions.map((q) => {
        if (q.tempId === questionTempId) {
          if (q.type === "MULTIPLE_CHOICE_SINGLE" || q.type === "TRUE_FALSE") {
            // Apenas uma opção correta
            return {
              ...q,
              options: q.options.map((o) => ({
                ...o,
                isCorrect: o.tempId === optionTempId,
              })),
            };
          } else {
            // Múltiplas opções corretas
            return {
              ...q,
              options: q.options.map((o) =>
                o.tempId === optionTempId
                  ? { ...o, isCorrect: !o.isCorrect }
                  : o,
              ),
            };
          }
        }
        return q;
      }),
    );
  };

  const handleSubmit = async () => {
    if (!validateStep1() || !validateStep2()) {
      setCurrentStep(1);
      return;
    }

    if (!lessonId) {
      showNotification("error", "ID da aula não encontrado");
      return;
    }

    try {
      setIsCreating(true);

      // Preparar questões (remover tempId e converter para DTO)
      const questionsDTO: CreateQuestionDTO[] = questions.map((q) => ({
        type: q.type,
        questionText: q.questionText,
        points: q.points,
        explanation: q.explanation,
        orderIndex: q.orderIndex,
        options: q.options.map((o) => ({
          optionText: o.optionText,
          isCorrect: o.isCorrect,
          orderIndex: o.orderIndex,
        })),
      }));

      const exerciseDTO: CreateExerciseDTO = {
        title: title.trim(),
        description: description.trim() || undefined,
        instructions: instructions.trim() || undefined,
        lessonId: Number(lessonId),
        totalPoints,
        passingScore,
        timeLimit: timeLimit || undefined,
        maxAttempts,
        shuffleQuestions,
        shuffleOptions,
        showCorrectAnswers,
        showScore,
        allowReview,
        questionDisplayMode: questionDisplayMode as any,
        questions: questionsDTO,
      };

      await ExerciseTeacherApi.create(exerciseDTO);

      showNotification("success", "Exercício criado com sucesso!");

      setTimeout(() => {
        navigate(
          `/teacher/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/exercises`,
        );
      }, 1500);
    } catch (error: any) {
      console.error("Erro ao criar exercício:", error);
      showNotification(
        "error",
        error.response?.data?.message || "Erro ao criar exercício",
      );
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <div className="mb-6">
        <Button
          onClick={() =>
            navigate(
              `/teacher/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/exercises`,
            )
          }
          className="flex items-center gap-2 hover:opacity-80 transition-colors mb-4"
          style={{ color: "var(--color-text-secondary)" }}
        >
          <ArrowLeft size={20} />
          <span className="text-sm">Voltar para Exercícios</span>
        </Button>

        <h1
          className="text-2xl sm:text-3xl font-bold"
          style={{ color: "var(--color-text-primary)" }}
        >
          Criar Novo Exercício
        </h1>
        <p
          className="text-sm mt-1"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Preencha as informações abaixo para criar um exercício
        </p>
      </div>

      {/* Notificação */}
      {notification && (
        <NotificationComponent
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
          duration={3000}
        />
      )}

      {/* Stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {/* Step 1 */}
          <div className="flex flex-col items-center flex-1">
            <Button
              onClick={() => goToStep(1)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                currentStep >= 1
                  ? "text-white"
                  : "border-2 border-gray-400 text-gray-400"
              }`}
              style={{
                backgroundColor: currentStep >= 1 ? accentColor : "transparent",
                borderColor:
                  currentStep >= 1 ? accentColor : "var(--color-border)",
              }}
            >
              {currentStep > 1 ? (
                <CheckCircle size={20} />
              ) : (
                <Settings size={20} />
              )}
            </Button>
            <span
              className={`text-xs mt-2 font-medium ${currentStep === 1 ? "" : "opacity-60"}`}
              style={{ color: "var(--color-text-secondary)" }}
            >
              Configurações
            </span>
          </div>

          {/* Linha */}
          <div
            className="h-0.5 flex-1 mx-2"
            style={{
              backgroundColor:
                currentStep >= 2 ? accentColor : "var(--color-border)",
            }}
          />

          {/* Step 2 */}
          <div className="flex flex-col items-center flex-1">
            <Button
              onClick={() => currentStep > 2 && goToStep(2)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                currentStep >= 2
                  ? "text-white"
                  : "border-2 border-gray-400 text-gray-400"
              }`}
              style={{
                backgroundColor: currentStep >= 2 ? accentColor : "transparent",
                borderColor:
                  currentStep >= 2 ? accentColor : "var(--color-border)",
              }}
              isDisabled={currentStep < 2}
            >
              {currentStep > 2 ? (
                <CheckCircle size={20} />
              ) : (
                <ClipboardList size={20} />
              )}
            </Button>
            <span
              className={`text-xs mt-2 font-medium ${currentStep === 2 ? "" : "opacity-60"}`}
              style={{ color: "var(--color-text-secondary)" }}
            >
              Questões
            </span>
          </div>

          {/* Linha */}
          <div
            className="h-0.5 flex-1 mx-2"
            style={{
              backgroundColor:
                currentStep >= 3 ? accentColor : "var(--color-border)",
            }}
          />

          {/* Step 3 */}
          <div className="flex flex-col items-center flex-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                currentStep >= 3
                  ? "text-white"
                  : "border-2 border-gray-400 text-gray-400"
              }`}
              style={{
                backgroundColor: currentStep >= 3 ? accentColor : "transparent",
                borderColor:
                  currentStep >= 3 ? accentColor : "var(--color-border)",
              }}
            >
              <Eye size={20} />
            </div>
            <span
              className={`text-xs mt-2 font-medium ${currentStep === 3 ? "" : "opacity-60"}`}
              style={{ color: "var(--color-text-secondary)" }}
            >
              Revisão
            </span>
          </div>
        </div>
      </div>

      {/* Conteúdo dos Steps */}
      <div
        className="p-6 rounded-2xl border"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border)",
        }}
      >
        {/* STEP 1: Configurações */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2
              className="text-xl font-bold mb-4"
              style={{ color: "var(--color-text-primary)" }}
            >
              Configurações do Exercício
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Título */}
              <div className="lg:col-span-2">
                <Label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Título do Exercício *
                </Label>
                <InputComponent
                  value={title}
                  onChange={(e) =>
                    setTitle((e.target as HTMLInputElement).value)
                  }
                  placeholder="Ex: Avaliação de JavaScript - Módulo 1"
                  maxLength={100}
                />
              </div>

              {/* Descrição */}
              <div className="lg:col-span-2">
                <Label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Descrição
                </Label>
                <TextArea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Breve descrição do exercício..."
                  rows={3}
                  maxLength={500}
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 resize-none"
                  style={{
                    backgroundColor: "var(--color-surface-secondary)",
                    borderColor: "var(--color-border)",
                    color: "var(--color-text-primary)",
                  }}
                />
              </div>

              {/* Instruções */}
              <div className="lg:col-span-2">
                <Label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Instruções para os Alunos
                </Label>
                <TextArea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Instruções específicas sobre como realizar o exercício..."
                  rows={4}
                  maxLength={1000}
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 resize-none"
                  style={{
                    backgroundColor: "var(--color-surface-secondary)",
                    borderColor: "var(--color-border)",
                    color: "var(--color-text-primary)",
                  }}
                />
              </div>

              {/* Pontuação Total */}
              <div>
                <Label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Pontuação Total *
                </Label>
                <InputComponent
                  type="number"
                  min={1}
                  max={1000}
                  value={totalPoints}
                  onChange={(e) =>
                    setTotalPoints((e.target as HTMLInputElement).valueAsNumber)
                  }
                />
              </div>

              {/* Nota de Aprovação */}
              <div>
                <Label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Nota de Aprovação (%) *
                </Label>
                <InputComponent
                  type="number"
                  min={0}
                  max={100}
                  value={passingScore}
                  onChange={(e) =>
                    setPassingScore(
                      (e.target as HTMLInputElement).valueAsNumber,
                    )
                  }
                />
              </div>

              {/* Tempo Limite */}
              <div>
                <Label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Tempo Limite (minutos)
                </Label>
                <InputComponent
                  type="number"
                  min={0}
                  value={timeLimit || ""}
                  onChange={(e) =>
                    setTimeLimit(
                      (e.target as HTMLInputElement).valueAsNumber || undefined,
                    )
                  }
                  placeholder="Sem limite"
                />
              </div>

              {/* Tentativas Máximas */}
              <div>
                <Label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Tentativas Máximas
                </Label>
                <InputComponent
                  type="number"
                  min={0}
                  value={maxAttempts}
                  onChange={(e) =>
                    setMaxAttempts((e.target as HTMLInputElement).valueAsNumber)
                  }
                  placeholder="0 = Ilimitado"
                />
              </div>

              {/* Modo de Exibição */}
              <div className="lg:col-span-2">
                <Label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Modo de Exibição das Questões
                </Label>
                <select
                  value={questionDisplayMode}
                  onChange={(e) => setQuestionDisplayMode(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: "var(--color-surface-secondary)",
                    borderColor: "var(--color-border)",
                    color: "var(--color-text-primary)",
                  }}
                >
                  <option value="ALL_AT_ONCE">Todas de uma vez</option>
                  <option value="ONE_AT_A_TIME">Uma por vez</option>
                </select>
              </div>

              {/* Opções Adicionais */}
              <div className="lg:col-span-2 space-y-3">
                <h3
                  className="font-semibold text-sm mb-3"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  Opções Adicionais
                </h3>

                {/* Embaralhar Questões */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={shuffleQuestions}
                    onChange={(e) => setShuffleQuestions(e.target.checked)}
                    className="w-4 h-4 rounded"
                    style={{ accentColor }}
                  />
                  <span
                    className="text-sm"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    Embaralhar ordem das questões
                  </span>
                </label>

                {/* Embaralhar Opções */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={shuffleOptions}
                    onChange={(e) => setShuffleOptions(e.target.checked)}
                    className="w-4 h-4 rounded"
                    style={{ accentColor }}
                  />
                  <span
                    className="text-sm"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    Embaralhar opções das questões
                  </span>
                </label>

                {/* Mostrar Respostas Corretas */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showCorrectAnswers}
                    onChange={(e) => setShowCorrectAnswers(e.target.checked)}
                    className="w-4 h-4 rounded"
                    style={{ accentColor }}
                  />
                  <span
                    className="text-sm"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    Mostrar respostas corretas após finalizar
                  </span>
                </label>

                {/* Mostrar Pontuação */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showScore}
                    onChange={(e) => setShowScore(e.target.checked)}
                    className="w-4 h-4 rounded"
                    style={{ accentColor }}
                  />
                  <span
                    className="text-sm"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    Mostrar pontuação ao aluno
                  </span>
                </label>

                {/* Permitir Revisão */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowReview}
                    onChange={(e) => setAllowReview(e.target.checked)}
                    className="w-4 h-4 rounded"
                    style={{ accentColor }}
                  />
                  <span
                    className="text-sm"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    Permitir revisão de respostas antes de finalizar
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Questões */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2
                className="text-xl font-bold"
                style={{ color: "var(--color-text-primary)" }}
              >
                Questões ({questions.length})
              </h2>
              <ButtonComponent
                onClick={() => setShowQuestionTypeModal(true)}
                className="flex items-center gap-2"
              >
                <div className="flex">
                  <Plus size={16} />
                  Adicionar Questão
                </div>
              </ButtonComponent>
            </div>

            {questions.length === 0 ? (
              <div className="text-center py-12">
                <ClipboardList
                  size={48}
                  className="mx-auto mb-4 opacity-50"
                  style={{ color: "var(--color-text-secondary)" }}
                />
                <p style={{ color: "var(--color-text-secondary)" }}>
                  Nenhuma questão adicionada ainda
                </p>
                <p
                  className="text-sm mt-2"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Clique em "Adicionar Questão" para começar
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((question, index) => (
                  <QuestionEditor
                    key={question.tempId}
                    question={question}
                    index={index}
                    accentColor={accentColor}
                    onUpdate={(updates) =>
                      updateQuestion(question.tempId, updates)
                    }
                    onRemove={() => removeQuestion(question.tempId)}
                    onAddOption={() => addOption(question.tempId)}
                    onRemoveOption={(optionTempId) =>
                      removeOption(question.tempId, optionTempId)
                    }
                    onUpdateOption={(optionTempId, updates) =>
                      updateOption(question.tempId, optionTempId, updates)
                    }
                    onToggleCorrect={(optionTempId) =>
                      toggleCorrectOption(question.tempId, optionTempId)
                    }
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* STEP 3: Revisão */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h2
              className="text-xl font-bold mb-4"
              style={{ color: "var(--color-text-primary)" }}
            >
              Revisão do Exercício
            </h2>

            {/* Informações Gerais */}
            <div
              className="p-4 rounded-lg"
              style={{ backgroundColor: "var(--color-surface-secondary)" }}
            >
              <h3
                className="font-semibold mb-3"
                style={{ color: "var(--color-text-primary)" }}
              >
                Informações Gerais
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <span
                    className="font-medium"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    Título:
                  </span>{" "}
                  <span style={{ color: "var(--color-text-primary)" }}>
                    {title}
                  </span>
                </div>
                <div>
                  <span
                    className="font-medium"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    Pontuação:
                  </span>{" "}
                  <span style={{ color: "var(--color-text-primary)" }}>
                    {totalPoints} pontos
                  </span>
                </div>
                <div>
                  <span
                    className="font-medium"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    Aprovação:
                  </span>{" "}
                  <span style={{ color: "var(--color-text-primary)" }}>
                    {passingScore}%
                  </span>
                </div>
                <div>
                  <span
                    className="font-medium"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    Questões:
                  </span>{" "}
                  <span style={{ color: "var(--color-text-primary)" }}>
                    {questions.length}
                  </span>
                </div>
                {timeLimit && (
                  <div>
                    <span
                      className="font-medium"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      Tempo:
                    </span>{" "}
                    <span style={{ color: "var(--color-text-primary)" }}>
                      {timeLimit} min
                    </span>
                  </div>
                )}
                <div>
                  <span
                    className="font-medium"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    Tentativas:
                  </span>{" "}
                  <span style={{ color: "var(--color-text-primary)" }}>
                    {maxAttempts === 0 ? "Ilimitadas" : maxAttempts}
                  </span>
                </div>
              </div>
            </div>

            {/* Preview das Questões */}
            <div>
              <h3
                className="font-semibold mb-3"
                style={{ color: "var(--color-text-primary)" }}
              >
                Preview das Questões
              </h3>
              <div className="space-y-3">
                {questions.map((question, index) => (
                  <div
                    key={question.tempId}
                    className="p-4 rounded-lg"
                    style={{
                      backgroundColor: "var(--color-surface-secondary)",
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className="font-bold shrink-0"
                        style={{ color: accentColor }}
                      >
                        {index + 1}.
                      </span>
                      <div className="flex-1">
                        <p
                          className="font-medium mb-2"
                          style={{ color: "var(--color-text-primary)" }}
                        >
                          {question.questionText}
                        </p>
                        <p
                          className="text-xs mb-2"
                          style={{ color: "var(--color-text-secondary)" }}
                        >
                          Tipo:{" "}
                          {
                            QUESTION_TYPES.find(
                              (t) => t.value === question.type,
                            )?.label
                          }{" "}
                          | {question.points} pontos
                        </p>

                        {question.options.length > 0 && (
                          <div className="space-y-1 mt-2">
                            {question.options.map((option, optIndex) => (
                              <div
                                key={option.tempId}
                                className="flex items-center gap-2 text-sm"
                              >
                                <span
                                  style={{
                                    color: option.isCorrect
                                      ? accentColor
                                      : "var(--color-text-secondary)",
                                  }}
                                >
                                  {String.fromCharCode(65 + optIndex)})
                                </span>
                                <span
                                  style={{
                                    color: option.isCorrect
                                      ? accentColor
                                      : "var(--color-text-primary)",
                                    fontWeight: option.isCorrect
                                      ? "600"
                                      : "normal",
                                  }}
                                >
                                  {option.optionText}
                                </span>
                                {option.isCorrect && (
                                  <CheckCircle size={14} color={accentColor} />
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Botões de Navegação */}
        <div
          className="flex items-center justify-between mt-8 pt-6 border-t"
          style={{ borderColor: "var(--color-border)" }}
        >
          <div>
            {currentStep > 1 && (
              <ButtonComponent
                onClick={goToPreviousStep}
                variant="secondary"
                className="flex items-center gap-2"
              >
                <ArrowLeft size={16} />
                Voltar
              </ButtonComponent>
            )}
          </div>

          <div className="flex items-center gap-3">
            {currentStep < 3 ? (
              <ButtonComponent
                onClick={goToNextStep}
                className="flex items-center gap-2"
              >
                <div className="flex justify-center">
                  Próximo
                  <ArrowRight size={16} />
                </div>
              </ButtonComponent>
            ) : (
              <ButtonComponent
                onClick={handleSubmit}
                isDisabled={isCreating}
                className="flex items-center gap-2"
              >
                <div className="flex">
                  {isCreating ? "Criando..." : "Criar Exercício"}
                  <CheckCircle size={16} />
                </div>
              </ButtonComponent>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Seleção de Tipo de Questão */}
      {showQuestionTypeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          onClick={() => setShowQuestionTypeModal(false)}
        >
          <div
            className="w-full max-w-2xl p-6 rounded-2xl border max-h-[80vh] overflow-y-auto"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3
                className="text-xl font-bold"
                style={{ color: "var(--color-text-primary)" }}
              >
                Selecione o Tipo de Questão
              </h3>
              <Button
                onClick={() => setShowQuestionTypeModal(false)}
                className="p-2 rounded-lg hover:opacity-80 transition-opacity"
                style={{ backgroundColor: "var(--color-surface-hover)" }}
              >
                <X size={20} style={{ color: "var(--color-text-secondary)" }} />
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {QUESTION_TYPES.map((type) => (
                <Button
                  key={type.value}
                  onClick={() => addQuestion(type.value)}
                  className="p-4 rounded-lg border text-left hover:shadow-md transition-all"
                  style={{
                    backgroundColor: "var(--color-surface-secondary)",
                    borderColor: "var(--color-border)",
                  }}
                >
                  <h4
                    className="font-semibold mb-1"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {type.label}
                  </h4>
                  <p
                    className="text-xs"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {type.description}
                  </p>
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// COMPONENTE: EDITOR DE QUESTÃO
interface QuestionEditorProps {
  question: QuestionForm;
  index: number;
  accentColor: string;
  onUpdate: (updates: Partial<QuestionForm>) => void;
  onRemove: () => void;
  onAddOption: () => void;
  onRemoveOption: (optionTempId: string) => void;
  onUpdateOption: (
    optionTempId: string,
    updates: Partial<QuestionOptionForm>,
  ) => void;
  onToggleCorrect: (optionTempId: string) => void;
}

function QuestionEditor({
  question,
  index,
  accentColor,
  onUpdate,
  onRemove,
  onAddOption,
  onRemoveOption,
  onUpdateOption,
  onToggleCorrect,
}: QuestionEditorProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const questionTypeLabel =
    QUESTION_TYPES.find((t) => t.value === question.type)?.label ||
    question.type;

  return (
    <div
      className="p-4 rounded-lg border"
      style={{
        backgroundColor: "var(--color-surface-secondary)",
        borderColor: "var(--color-border)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3 flex-1">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold shrink-0"
            style={{ backgroundColor: accentColor }}
          >
            {index + 1}
          </div>
          <div className="flex-1 min-w-0">
            <h4
              className="font-semibold truncate"
              style={{ color: "var(--color-text-primary)" }}
            >
              {question.questionText || "Nova questão"}
            </h4>
            <p
              className="text-xs"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {questionTypeLabel} • {question.points} pontos
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg hover:opacity-80 transition-opacity"
            style={{ backgroundColor: "var(--color-surface-hover)" }}
          >
            <GripVertical
              size={16}
              style={{ color: "var(--color-text-secondary)" }}
            />
          </Button>
          <Button
            onClick={onRemove}
            className="p-2 rounded-lg hover:opacity-80 transition-opacity"
            style={{
              backgroundColor: "var(--color-error-light)",
              color: "var(--color-error)",
            }}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>

      {/* Conteúdo Expansível */}
      {isExpanded && (
        <div className="space-y-4">
          {/* Texto da Questão */}
          <div>
            <Label
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Texto da Questão *
            </Label>
            <TextArea
              value={question.questionText}
              onChange={(e) => onUpdate({ questionText: e.target.value })}
              placeholder="Digite o enunciado da questão..."
              rows={3}
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 resize-none"
              style={{
                backgroundColor: "var(--color-surface)",
                borderColor: "var(--color-border)",
                color: "var(--color-text-primary)",
              }}
            />
          </div>

          {/* Pontuação */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Pontuação *
              </Label>
              <InputComponent
                type="number"
                min={1}
                value={question.points}
                onChange={(e) =>
                  onUpdate({
                    points: (e.target as HTMLInputElement).valueAsNumber,
                  })
                }
              />
            </div>
          </div>

          {/* Opções (para tipos específicos) */}
          {(question.type === "MULTIPLE_CHOICE_SINGLE" ||
            question.type === "MULTIPLE_CHOICE_MULTIPLE" ||
            question.type === "TRUE_FALSE" ||
            question.type === "ORDERING" ||
            question.type === "MATCHING") && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label
                  className="block text-sm font-medium"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Opções
                </Label>
                {question.type !== "TRUE_FALSE" && (
                  <Button
                    onClick={onAddOption}
                    className="text-sm flex items-center gap-1 hover:opacity-80"
                    style={{ color: accentColor }}
                  >
                    <Plus size={14} />
                    Adicionar
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                {question.options.map((option, optIndex) => (
                  <div key={option.tempId} className="flex items-center gap-2">
                    {/* Checkbox/Radio para marcar correta */}
                    <input
                      type={
                        question.type === "MULTIPLE_CHOICE_SINGLE" ||
                        question.type === "TRUE_FALSE"
                          ? "radio"
                          : "checkbox"
                      }
                      checked={option.isCorrect}
                      onChange={() => onToggleCorrect(option.tempId)}
                      name={`correct-${question.tempId}`}
                      className="w-4 h-4 shrink-0"
                      style={{ accentColor }}
                    />

                    {/* Letra da opção */}
                    <span
                      className="font-medium w-6 shrink-0"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      {String.fromCharCode(65 + optIndex)}
                    </span>

                    {/* Texto da opção */}
                    <InputComponent
                      value={option.optionText}
                      onChange={(e) =>
                        onUpdateOption(option.tempId, {
                          optionText: (e.target as HTMLInputElement).value,
                        })
                      }
                      placeholder={`Opção ${String.fromCharCode(65 + optIndex)}`}
                      className="flex-1"
                      disabled={question.type === "TRUE_FALSE"}
                    />

                    {/* Botão Remover */}
                    {question.type !== "TRUE_FALSE" && (
                      <Button
                        onClick={() => onRemoveOption(option.tempId)}
                        className="p-2 rounded-lg hover:opacity-80 transition-opacity shrink-0"
                        style={{
                          backgroundColor: "var(--color-error-light)",
                          color: "var(--color-error)",
                        }}
                      >
                        <Trash2 size={14} />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {question.type === "MULTIPLE_CHOICE_MULTIPLE" && (
                <p
                  className="text-xs mt-2"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Marque todas as opções corretas
                </p>
              )}
            </div>
          )}

          {/* Explicação */}
          <div>
            <Label
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Explicação (opcional)
            </Label>
            <TextArea
              value={question.explanation || ""}
              onChange={(e) => onUpdate({ explanation: e.target.value })}
              placeholder="Explicação da resposta correta..."
              rows={2}
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 resize-none"
              style={{
                backgroundColor: "var(--color-surface)",
                borderColor: "var(--color-border)",
                color: "var(--color-text-primary)",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

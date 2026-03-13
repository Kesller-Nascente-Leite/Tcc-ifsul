import { useState } from "react";
import {
  ChevronRight,
  ChevronLeft,
  Save,
  CheckCircle,
  FileText,
  Plus,
  Clock,
  Award,
  X,
} from "lucide-react";
import { QuestionEditor, QuestionTypeSelector, Step3Review } from "../../../components/layout/teacher/QuestionEditor";

// Tipos
type QuestionType =
  | "MULTIPLE_CHOICE_SINGLE"
  | "MULTIPLE_CHOICE_MULTIPLE"
  | "TRUE_FALSE"
  | "ESSAY"
  | "FILL_BLANKS"
  | "ORDERING"
  | "MATCHING";

interface Question {
  id: string;
  type: QuestionType;
  questionText: string;
  points: number;
  options: QuestionOption[];
  config?: {
    caseSensitive?: boolean;
    partialCredit?: boolean;
    minWords?: number;
    maxWords?: number;
    acceptableAnswers?: string[];
  };
}

interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
  feedback?: string;
  matchPair?: string;
  correctPosition?: number;
}

export default function CreateExerciseWizard({ onClose, onSave }: {
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSave: (data: any) => void;
}) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    totalPoints: 100,
    passingScore: 70,
    timeLimit: null as number | null,
    maxAttempts: 0,
    shuffleQuestions: true,
    shuffleOptions: true,
    showCorrectAnswers: false,
  });
  const [questions, setQuestions] = useState<Question[]>([]);

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-zinc-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-zinc-900">
              Criar Novo Exercício
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
            >
              <X size={20} className="text-zinc-600" />
            </button>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <StepIndicator step={1} currentStep={step} label="Configurações" />
              <StepIndicator step={2} currentStep={step} label="Questões" />
              <StepIndicator step={3} currentStep={step} label="Revisão" />
            </div>
            <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-blue-500 to-blue-600 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {step === 1 && (
            <Step1Configuration formData={formData} setFormData={setFormData} />
          )}
          {step === 2 && (
            <Step2Questions questions={questions} setQuestions={setQuestions} />
          )}
          {step === 3 && (
            <Step3Review formData={formData} questions={questions} />
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-zinc-200 flex items-center justify-between">
          <button
            onClick={step > 1 ? () => setStep(step - 1) : onClose}
            className="flex items-center gap-2 px-4 py-2.5 text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors font-medium"
          >
            <ChevronLeft size={18} />
            {step > 1 ? "Voltar" : "Cancelar"}
          </button>

          <div className="flex items-center gap-3">
            {step < totalSteps ? (
              <button
                onClick={() => setStep(step + 1)}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Próximo
                <ChevronRight size={18} />
              </button>
            ) : (
              <button
                onClick={() => onSave({ ...formData, questions })}
                className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                <Save size={18} />
                Criar Exercício
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StepIndicator({ step, currentStep, label }: {
  step: number;
  currentStep: number;
  label: string;
}) {
  const isActive = currentStep === step;
  const isCompleted = currentStep > step;

  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
          isCompleted
            ? "bg-green-600 text-white"
            : isActive
              ? "bg-blue-600 text-white"
              : "bg-zinc-200 text-zinc-600"
        }`}
      >
        {isCompleted ? <CheckCircle size={18} /> : step}
      </div>
      <span
        className={`text-sm font-medium ${
          isActive ? "text-zinc-900" : "text-zinc-500"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

// Step 1: Configurações
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Step1Configuration({ formData, setFormData }: any) {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-bold text-zinc-900 mb-4">
          Informações Básicas
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-2">
              Título do Exercício *
            </label>
            <input
              type="text"
              placeholder="Ex: Quiz - Introdução ao React"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-2">
              Descrição
            </label>
            <textarea
              placeholder="Descreva o objetivo deste exercício..."
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-200 pt-6">
        <h3 className="text-lg font-bold text-zinc-900 mb-4">Pontuação</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-2">
              <Award size={16} className="inline mr-1" />
              Pontuação Total
            </label>
            <input
              type="number"
              min="0"
              value={formData.totalPoints}
              onChange={(e) =>
                setFormData({ ...formData, totalPoints: parseInt(e.target.value) })
              }
              className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-2">
              <CheckCircle size={16} className="inline mr-1" />
              Nota Mínima (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={formData.passingScore}
              onChange={(e) =>
                setFormData({ ...formData, passingScore: parseInt(e.target.value) })
              }
              className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-200 pt-6">
        <h3 className="text-lg font-bold text-zinc-900 mb-4">
          Configurações Avançadas
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-2">
                <Clock size={16} className="inline mr-1" />
                Tempo Limite (minutos)
              </label>
              <input
                type="number"
                min="1"
                placeholder="Sem limite"
                value={formData.timeLimit || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    timeLimit: e.target.value ? parseInt(e.target.value) : null,
                  })
                }
                className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-2">
                Máximo de Tentativas
              </label>
              <input
                type="number"
                min="0"
                value={formData.maxAttempts}
                onChange={(e) =>
                  setFormData({ ...formData, maxAttempts: parseInt(e.target.value) })
                }
                className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-zinc-500 mt-1">0 = ilimitado</p>
            </div>
          </div>

          <div className="space-y-3 bg-zinc-50 p-4 rounded-lg">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.shuffleQuestions}
                onChange={(e) =>
                  setFormData({ ...formData, shuffleQuestions: e.target.checked })
                }
                className="w-5 h-5 rounded border-zinc-300"
              />
              <span className="text-sm font-medium text-zinc-700">
                Embaralhar ordem das questões
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.shuffleOptions}
                onChange={(e) =>
                  setFormData({ ...formData, shuffleOptions: e.target.checked })
                }
                className="w-5 h-5 rounded border-zinc-300"
              />
              <span className="text-sm font-medium text-zinc-700">
                Embaralhar opções de resposta
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.showCorrectAnswers}
                onChange={(e) =>
                  setFormData({ ...formData, showCorrectAnswers: e.target.checked })
                }
                className="w-5 h-5 rounded border-zinc-300"
              />
              <span className="text-sm font-medium text-zinc-700">
                Mostrar respostas corretas após conclusão
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

// Step 2: Questões
function Step2Questions({ questions, setQuestions }: {
  questions: Question[];
  setQuestions: (questions: Question[]) => void;
}) {
  const [showQuestionTypeSelector, setShowQuestionTypeSelector] = useState(false);

  const addQuestion = (type: QuestionType) => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type,
      questionText: "",
      points: 10,
      options: [],
    };

    // Adicionar opções padrão conforme o tipo
    if (type === "MULTIPLE_CHOICE_SINGLE" || type === "MULTIPLE_CHOICE_MULTIPLE") {
      newQuestion.options = [
        { id: "1", text: "", isCorrect: false },
        { id: "2", text: "", isCorrect: false },
      ];
    } else if (type === "TRUE_FALSE") {
      newQuestion.options = [
        { id: "1", text: "Verdadeiro", isCorrect: false },
        { id: "2", text: "Falso", isCorrect: false },
      ];
    }

    setQuestions([...questions, newQuestion]);
    setShowQuestionTypeSelector(false);
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, ...updates } : q)));
  };

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  return (
    <div className="p-6 space-y-6">
      {questions.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText size={32} className="text-zinc-400" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900 mb-2">
            Nenhuma questão adicionada
          </h3>
          <p className="text-zinc-600 mb-6">
            Adicione questões ao seu exercício
          </p>
          <button
            onClick={() => setShowQuestionTypeSelector(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            <Plus size={20} />
            Adicionar Questão
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-zinc-900">
              Questões ({questions.length})
            </h3>
            <button
              onClick={() => setShowQuestionTypeSelector(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
            >
              <Plus size={16} />
              Adicionar
            </button>
          </div>

          <div className="space-y-4">
            {questions.map((question, index) => (
              <QuestionEditor
                key={question.id}
                question={question}
                index={index}
                onUpdate={(updates) => updateQuestion(question.id, updates)}
                onDelete={() => deleteQuestion(question.id)}
              />
            ))}
          </div>
        </>
      )}

      {showQuestionTypeSelector && (
        <QuestionTypeSelector
          onSelect={addQuestion}
          onClose={() => setShowQuestionTypeSelector(false)}
        />
      )}
    </div>
  );
}

// Continua no próximo arquivo...
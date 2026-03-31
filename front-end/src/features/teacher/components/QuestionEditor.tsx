import { useState } from "react";
import {
  ListChecks,
  CheckCircle,
  MessageSquare,
  FileText,
  ArrowUpDown,
  Link2,
  Plus,
  Trash2,
  GripVertical,
  X,
  Settings,
} from "lucide-react";

// Tipos (continuação)
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

// Seletor de Tipo de Questão
export function QuestionTypeSelector({
  onSelect,
  onClose,
}: {
  onSelect: (type: QuestionType) => void;
  onClose: () => void;
}) {
  const questionTypes = [
    {
      type: "MULTIPLE_CHOICE_SINGLE" as QuestionType,
      icon: <ListChecks size={24} />,
      title: "Múltipla Escolha",
      description: "Uma resposta correta",
      color: "blue",
    },
    {
      type: "MULTIPLE_CHOICE_MULTIPLE" as QuestionType,
      icon: <CheckCircle size={24} />,
      title: "Múltipla Escolha",
      description: "Várias respostas corretas",
      color: "purple",
    },
    {
      type: "TRUE_FALSE" as QuestionType,
      icon: <CheckCircle size={24} />,
      title: "Verdadeiro/Falso",
      description: "Questões binárias",
      color: "green",
    },
    {
      type: "ESSAY" as QuestionType,
      icon: <MessageSquare size={24} />,
      title: "Dissertativa",
      description: "Resposta em texto livre",
      color: "orange",
    },
    {
      type: "FILL_BLANKS" as QuestionType,
      icon: <FileText size={24} />,
      title: "Preencher Lacunas",
      description: "Complete o texto",
      color: "pink",
    },
    {
      type: "ORDERING" as QuestionType,
      icon: <ArrowUpDown size={24} />,
      title: "Ordenação",
      description: "Organize na ordem correta",
      color: "indigo",
    },
    {
      type: "MATCHING" as QuestionType,
      icon: <Link2 size={24} />,
      title: "Correspondência",
      description: "Relacione os itens",
      color: "teal",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl">
        <div className="p-6 border-b border-zinc-200 flex items-center justify-between">
          <h3 className="text-xl font-bold text-zinc-900">
            Escolha o Tipo de Questão
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-zinc-600" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {questionTypes.map((qt) => (
            <QuestionTypeCard
              key={qt.type}
              {...qt}
              onClick={() => onSelect(qt.type)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function QuestionTypeCard({
  icon,
  title,
  description,
  color,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  onClick: () => void;
}) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100",
    purple: "bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100",
    green: "bg-green-50 text-green-600 border-green-200 hover:bg-green-100",
    orange: "bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100",
    pink: "bg-pink-50 text-pink-600 border-pink-200 hover:bg-pink-100",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100",
    teal: "bg-teal-50 text-teal-600 border-teal-200 hover:bg-teal-100",
  };

  return (
    <button
      onClick={onClick}
      className={`p-5 rounded-xl border-2 transition-all text-left ${colors[color]} hover:shadow-lg hover:scale-105`}
    >
      <div className="flex items-start gap-4">
        <div className="shrink-0">{icon}</div>
        <div>
          <h4 className="font-bold mb-1">{title}</h4>
          <p className="text-sm opacity-80">{description}</p>
        </div>
      </div>
    </button>
  );
}

// Editor de Questão
export function QuestionEditor({
  question,
  index,
  onUpdate,
  onDelete,
}: {
  question: Question;
  index: number;
  onUpdate: (updates: Partial<Question>) => void;
  onDelete: () => void;
}) {
  const [showConfig, setShowConfig] = useState(false);

  const getQuestionTypeLabel = (type: QuestionType) => {
    const labels: Record<QuestionType, string> = {
      MULTIPLE_CHOICE_SINGLE: "Múltipla Escolha (uma resposta)",
      MULTIPLE_CHOICE_MULTIPLE: "Múltipla Escolha (várias respostas)",
      TRUE_FALSE: "Verdadeiro/Falso",
      ESSAY: "Dissertativa",
      FILL_BLANKS: "Preencher Lacunas",
      ORDERING: "Ordenação",
      MATCHING: "Correspondência",
    };
    return labels[type];
  };

  const addOption = () => {
    const newOption: QuestionOption = {
      id: Date.now().toString(),
      text: "",
      isCorrect: false,
    };
    onUpdate({ options: [...question.options, newOption] });
  };

  const updateOption = (optionId: string, updates: Partial<QuestionOption>) => {
    onUpdate({
      options: question.options.map((opt) =>
        opt.id === optionId ? { ...opt, ...updates } : opt
      ),
    });
  };

  const deleteOption = (optionId: string) => {
    onUpdate({
      options: question.options.filter((opt) => opt.id !== optionId),
    });
  };

  return (
    <div className="bg-white border-2 border-zinc-200 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-5 bg-zinc-50 border-b border-zinc-200">
        <div className="flex items-start gap-4">
          <button className="p-1 cursor-move hover:bg-zinc-200 rounded transition-colors">
            <GripVertical size={20} className="text-zinc-400" />
          </button>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                #{index + 1}
              </span>
              <span className="text-xs font-semibold text-zinc-600">
                {getQuestionTypeLabel(question.type)}
              </span>
            </div>

            <input
              type="text"
              placeholder="Digite a pergunta..."
              value={question.questionText}
              onChange={(e) => onUpdate({ questionText: e.target.value })}
              className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <label className="text-sm font-semibold text-zinc-700">
                Pontos:
              </label>
              <input
                type="number"
                min="1"
                value={question.points}
                onChange={(e) => onUpdate({ points: parseInt(e.target.value) })}
                className="w-20 px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
              />
            </div>

            <button
              onClick={() => setShowConfig(!showConfig)}
              className="p-2 hover:bg-zinc-200 rounded-lg transition-colors"
              title="Configurações"
            >
              <Settings size={18} className="text-zinc-600" />
            </button>

            <button
              onClick={onDelete}
              className="p-2 hover:bg-red-100 rounded-lg transition-colors"
              title="Excluir"
            >
              <Trash2 size={18} className="text-red-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        {question.type === "MULTIPLE_CHOICE_SINGLE" ||
        question.type === "MULTIPLE_CHOICE_MULTIPLE" ||
        question.type === "TRUE_FALSE" ? (
          <div className="space-y-3">
            {question.options.map((option, optIndex) => (
              <div key={option.id} className="flex items-start gap-3">
                <input
                  type={
                    question.type === "MULTIPLE_CHOICE_SINGLE" ? "radio" : "checkbox"
                  }
                  checked={option.isCorrect}
                  onChange={(e) =>
                    updateOption(option.id, { isCorrect: e.target.checked })
                  }
                  className="mt-3 w-5 h-5"
                />
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder={`Opção ${optIndex + 1}`}
                    value={option.text}
                    onChange={(e) => updateOption(option.id, { text: e.target.value })}
                    className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Feedback (opcional)"
                    value={option.feedback || ""}
                    onChange={(e) =>
                      updateOption(option.id, { feedback: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-zinc-200 rounded-lg text-sm mt-2"
                  />
                </div>
                {question.type !== "TRUE_FALSE" && (
                  <button
                    onClick={() => deleteOption(option.id)}
                    className="mt-2 p-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} className="text-red-600" />
                  </button>
                )}
              </div>
            ))}

            {question.type !== "TRUE_FALSE" && (
              <button
                onClick={addOption}
                className="flex items-center gap-2 px-4 py-2.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium text-sm border-2 border-dashed border-blue-200"
              >
                <Plus size={16} />
                Adicionar Opção
              </button>
            )}
          </div>
        ) : question.type === "ESSAY" ? (
          <div className="space-y-3">
            <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg">
              <p className="text-sm text-zinc-600">
                Os alunos responderão com texto livre. Você poderá corrigir
                manualmente após a submissão.
              </p>
            </div>

            {showConfig && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-2">
                    Mín. Palavras
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Sem mínimo"
                    value={question.config?.minWords || ""}
                    onChange={(e) =>
                      onUpdate({
                        config: {
                          ...question.config,
                          minWords: e.target.value
                            ? parseInt(e.target.value)
                            : undefined,
                        },
                      })
                    }
                    className="w-full px-4 py-2 border border-zinc-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-2">
                    Máx. Palavras
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Sem máximo"
                    value={question.config?.maxWords || ""}
                    onChange={(e) =>
                      onUpdate({
                        config: {
                          ...question.config,
                          maxWords: e.target.value
                            ? parseInt(e.target.value)
                            : undefined,
                        },
                      })
                    }
                    className="w-full px-4 py-2 border border-zinc-300 rounded-lg"
                  />
                </div>
              </div>
            )}
          </div>
        ) : question.type === "FILL_BLANKS" ? (
          <div className="space-y-3">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-900 font-medium mb-1">
                💡 Dica: Use ___ para indicar a lacuna
              </p>
              <p className="text-xs text-amber-700">
                Ex: O hook ___ é usado para gerenciar estado
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-2">
                Respostas Aceitas (separadas por vírgula)
              </label>
              <input
                type="text"
                placeholder="useState, use state, UseState"
                className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg"
              />
            </div>

            {showConfig && (
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-5 h-5" />
                <span className="text-sm font-medium text-zinc-700">
                  Case-sensitive
                </span>
              </label>
            )}
          </div>
        ) : null}
      </div>

      {/* Configurações Expandidas */}
      {showConfig && (
        <div className="px-5 pb-5">
          <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg space-y-3">
            <h4 className="font-semibold text-zinc-900 text-sm">
              Configurações Avançadas
            </h4>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={question.config?.partialCredit || false}
                onChange={(e) =>
                  onUpdate({
                    config: {
                      ...question.config,
                      partialCredit: e.target.checked,
                    },
                  })
                }
                className="w-5 h-5"
              />
              <span className="text-sm font-medium text-zinc-700">
                Permitir pontuação parcial
              </span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}

// Step 3: Revisão
export function Step3Review({ formData, questions }: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formData: any;
  questions: Question[];
}) {
  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
        <h3 className="text-2xl font-bold text-blue-900 mb-2">
          {formData.title || "Sem título"}
        </h3>
        <p className="text-blue-700">
          {formData.description || "Sem descrição"}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div>
            <p className="text-xs text-blue-700 font-semibold mb-1">Questões</p>
            <p className="text-2xl font-bold text-blue-900">{questions.length}</p>
          </div>
          <div>
            <p className="text-xs text-blue-700 font-semibold mb-1">Pontos</p>
            <p className="text-2xl font-bold text-blue-900">{totalPoints}</p>
          </div>
          <div>
            <p className="text-xs text-blue-700 font-semibold mb-1">
              Nota Mínima
            </p>
            <p className="text-2xl font-bold text-blue-900">
              {formData.passingScore}%
            </p>
          </div>
          <div>
            <p className="text-xs text-blue-700 font-semibold mb-1">Tempo</p>
            <p className="text-2xl font-bold text-blue-900">
              {formData.timeLimit ? `${formData.timeLimit}min` : "Ilimitado"}
            </p>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-lg font-bold text-zinc-900 mb-4">
          Resumo das Questões
        </h4>
        <div className="space-y-3">
          {questions.map((q, index) => (
            <div
              key={q.id}
              className="p-4 bg-white border border-zinc-200 rounded-lg"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-zinc-100 text-zinc-700 text-xs font-bold rounded">
                      #{index + 1}
                    </span>
                    <span className="text-sm font-semibold text-zinc-900">
                      {q.questionText || "Pergunta sem título"}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600">
                    {q.options.length} opções • {q.points} pontos
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
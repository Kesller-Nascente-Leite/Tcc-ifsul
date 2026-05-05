import { useState } from "react";
import {
  X,
  CheckCircle,
  XCircle,
  Save,
  Award,
  MessageSquare,
  AlertCircle,
} from "lucide-react";

// Modal de Correção
export function GradingModal({
  attempt,
  onClose,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attempt: any;
  onClose: () => void;
}) {
  const [essayAnswers, setEssayAnswers] = useState([
    {
      id: 1,
      questionText: "Explique o conceito de hooks em React",
      studentAnswer:
        "Hooks são funções especiais do React que permitem usar estado e outros recursos em componentes funcionais. O useState permite adicionar estado local, e o useEffect permite realizar efeitos colaterais.",
      maxPoints: 20,
      pointsEarned: 0,
      isCorrect: false,
      feedback: "",
    },
    {
      id: 2,
      questionText: "Qual a diferença entre props e state?",
      studentAnswer:
        "Props são dados passados de pai para filho e são imutáveis. State é gerenciado dentro do componente e pode ser alterado usando setState.",
      maxPoints: 15,
      pointsEarned: 0,
      isCorrect: false,
      feedback: "",
    },
  ]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateEssay = (id: number, updates: any) => {
    setEssayAnswers(
      essayAnswers.map((essay) => (essay.id === id ? { ...essay, ...updates } : essay))
    );
  };

  const handleSave = () => {
    // Salvar correções
    console.log("Salvando correções:", essayAnswers);
    onClose();
  };

  const totalEarned = essayAnswers.reduce((sum, e) => sum + e.pointsEarned, 0);
  const totalMax = essayAnswers.reduce((sum, e) => sum + e.maxPoints, 0);
  const percentage = totalMax > 0 ? (totalEarned / totalMax) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-zinc-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-zinc-900">
                Corrigir Questões Dissertativas
              </h2>
              <p className="text-zinc-600 mt-1">
                {attempt.studentName} - Tentativa #{attempt.attemptNumber}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
            >
              <X size={20} className="text-zinc-600" />
            </button>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="font-medium text-zinc-700">
                  Progresso: {essayAnswers.filter((e) => e.pointsEarned > 0).length} de{" "}
                  {essayAnswers.length}
                </span>
                <span className="font-bold text-zinc-900">
                  {totalEarned}/{totalMax} pontos ({percentage.toFixed(1)}%)
                </span>
              </div>
              <div className="h-2 bg-zinc-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-blue-500 to-blue-600 transition-all duration-500"
                  style={{
                    width: `${(essayAnswers.filter((e) => e.pointsEarned > 0).length / essayAnswers.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {essayAnswers.map((essay, index) => (
            <div
              key={essay.id}
              className="bg-white border-2 border-zinc-200 rounded-xl overflow-hidden"
            >
              {/* Question Header */}
              <div className="p-5 bg-zinc-50 border-b border-zinc-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                        Questão #{index + 1}
                      </span>
                      <span className="text-xs font-semibold text-zinc-600">
                        Dissertativa
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-zinc-900">
                      {essay.questionText}
                    </h3>
                  </div>
                  <div className="ml-4 text-right">
                    <p className="text-xs text-zinc-500 mb-1">Pontos</p>
                    <p className="text-xl font-bold text-zinc-900">
                      {essay.maxPoints}
                    </p>
                  </div>
                </div>
              </div>

              {/* Student Answer */}
              <div className="p-5 bg-blue-50 border-b border-blue-100">
                <div className="flex items-start gap-3 mb-2">
                  <MessageSquare size={18} className="text-blue-600 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-blue-900 mb-2">
                      Resposta do Aluno
                    </p>
                    <p className="text-zinc-800 leading-relaxed">
                      {essay.studentAnswer}
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-blue-700">
                      <span>{essay.studentAnswer.split(" ").length} palavras</span>
                      <span>{essay.studentAnswer.length} caracteres</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grading */}
              <div className="p-5 space-y-4">
                {/* Quick Actions */}
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-zinc-700">
                    Ação Rápida:
                  </span>
                  <button
                    onClick={() =>
                      updateEssay(essay.id, {
                        pointsEarned: essay.maxPoints,
                        isCorrect: true,
                        feedback: "Resposta completa e correta!",
                      })
                    }
                    className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
                  >
                    <CheckCircle size={14} className="inline mr-1" />
                    Nota Máxima
                  </button>
                  <button
                    onClick={() =>
                      updateEssay(essay.id, {
                        pointsEarned: Math.floor(essay.maxPoints * 0.7),
                        isCorrect: true,
                        feedback: "Boa resposta, mas pode melhorar.",
                      })
                    }
                    className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                  >
                    70%
                  </button>
                  <button
                    onClick={() =>
                      updateEssay(essay.id, {
                        pointsEarned: 0,
                        isCorrect: false,
                        feedback: "Resposta incorreta ou incompleta.",
                      })
                    }
                    className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                  >
                    <XCircle size={14} className="inline mr-1" />
                    Incorreta
                  </button>
                </div>

                {/* Manual Grading */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-zinc-700 mb-2">
                      <Award size={16} className="inline mr-1" />
                      Pontos Obtidos
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        max={essay.maxPoints}
                        step="0.5"
                        value={essay.pointsEarned}
                        onChange={(e) =>
                          updateEssay(essay.id, {
                            pointsEarned: parseFloat(e.target.value),
                            isCorrect: parseFloat(e.target.value) > 0,
                          })
                        }
                        className="flex-1 px-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-bold"
                      />
                      <span className="text-zinc-500 font-medium">
                        / {essay.maxPoints}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-zinc-700 mb-2">
                      Porcentagem
                    </label>
                    <div className="px-4 py-3 bg-zinc-100 border border-zinc-300 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-zinc-900">
                          {((essay.pointsEarned / essay.maxPoints) * 100).toFixed(1)}%
                        </span>
                        {essay.pointsEarned >= essay.maxPoints * 0.7 ? (
                          <CheckCircle size={20} className="text-green-600" />
                        ) : (
                          <XCircle size={20} className="text-red-600" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Feedback */}
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-2">
                    Feedback para o Aluno
                  </label>
                  <textarea
                    placeholder="Escreva um feedback construtivo..."
                    rows={3}
                    value={essay.feedback}
                    onChange={(e) =>
                      updateEssay(essay.id, { feedback: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* AI Suggestion (placeholder) */}
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <AlertCircle size={18} className="text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-purple-900 mb-1">
                        💡 Sugestão da IA
                      </p>
                      <p className="text-sm text-purple-800">
                        Esta resposta demonstra compreensão dos conceitos principais.
                        Sugestão: 16-18 pontos (80-90%)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-zinc-200 flex items-center justify-between bg-zinc-50">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-sm text-zinc-600">Pontuação Total</p>
              <p className="text-2xl font-bold text-zinc-900">
                {totalEarned}/{totalMax}
              </p>
            </div>
            <div
              className={`px-4 py-2 rounded-lg font-bold ${
                percentage >= 70
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {percentage.toFixed(1)}%
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-6 py-3 text-zinc-700 hover:bg-zinc-200 rounded-lg transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              <Save size={18} />
              Salvar Correção
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componentes auxiliares
export function StatsCard({
  title,
  value,
  icon,
  trend,
  trendLabel,
  color,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: number;
  trendLabel: string;
  color: "blue" | "green" | "purple" | "amber";
}) {
  const colors = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    green: "bg-green-50 text-green-600 border-green-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-6">
      <div className={`inline-flex p-3 rounded-lg ${colors[color]} mb-4`}>
        {icon}
      </div>
      <p className="text-sm text-zinc-600 mb-2">{title}</p>
      <p className="text-3xl font-bold text-zinc-900 mb-3">{value}</p>
      {trend !== 0 && (
        <div className="flex items-center gap-1.5">
          <span
            className={`text-sm font-semibold ${trend > 0 ? "text-green-600" : "text-red-600"}`}
          >
            {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
          </span>
          <span className="text-xs text-zinc-500">{trendLabel}</span>
        </div>
      )}
    </div>
  );
}

export function DistributionBar({
  label,
  count,
  total,
  color,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
}) {
  const percentage = (count / total) * 100;

  const colors: Record<string, string> = {
    green: "bg-green-500",
    blue: "bg-blue-500",
    yellow: "bg-yellow-500",
    orange: "bg-orange-500",
    red: "bg-red-500",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-zinc-700">{label}</span>
        <span className="text-sm font-bold text-zinc-900">
          {count} ({percentage.toFixed(1)}%)
        </span>
      </div>
      <div className="h-3 bg-zinc-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${colors[color]} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function QuestionsTab({ questions }: { questions: any[] }) {
  return (
    <div className="space-y-4">
      {questions.map((q) => (
        <div
          key={q.id}
          className="bg-white border border-zinc-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-1 bg-zinc-100 text-zinc-700 text-xs font-bold rounded-full">
                  #{q.id}
                </span>
                <span className="text-xs font-semibold text-zinc-600">{q.type}</span>
              </div>
              <h3 className="text-lg font-bold text-zinc-900">{q.text}</h3>
            </div>

            {q.pendingReview && (
              <span className="ml-4 px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg text-sm font-semibold">
                {q.pendingReview} pendentes
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-zinc-600 mb-1">Respostas</p>
              <p className="text-2xl font-bold text-zinc-900">{q.totalAnswers}</p>
            </div>
            <div>
              <p className="text-sm text-zinc-600 mb-1">Acertos</p>
              <p className="text-2xl font-bold text-green-600">{q.correctAnswers}</p>
            </div>
            <div>
              <p className="text-sm text-zinc-600 mb-1">Taxa de Erro</p>
              <p
                className={`text-2xl font-bold ${
                  q.errorRate > 20
                    ? "text-red-600"
                    : q.errorRate > 10
                      ? "text-orange-600"
                      : "text-green-600"
                }`}
              >
                {q.errorRate.toFixed(1)}%
              </p>
            </div>
          </div>

          <div className="mt-4">
            <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-green-500 to-green-600"
                style={{
                  width: `${q.totalAnswers > 0 ? (q.correctAnswers / q.totalAnswers) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
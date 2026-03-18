import { useState } from "react";
import {
  Users,
  Clock,
  Award,
  CheckCircle,

  BarChart3,
  Eye,
  Edit3,
  MessageSquare,
  ArrowLeft,
  Filter,
  Download,
} from "lucide-react";
import { DistributionBar, GradingModal, QuestionsTab, StatsCard } from "../../../components/layout/teacher/Grading";

interface Attempt {
  id: number;
  studentName: string;
  studentEmail: string;
  attemptNumber: number;
  score: number;
  percentage: number;
  passed: boolean;
  timeSpent: number;
  submittedAt: string;
  status: "graded" | "pending_review";
  pendingEssayCount?: number;
}

export function ExerciseStatistics() {
  const [selectedTab, setSelectedTab] = useState<"overview" | "attempts" | "questions">("overview");
  const [selectedAttempt, setSelectedAttempt] = useState<Attempt | null>(null);

  // Mock data
  const stats = {
    totalAttempts: 45,
    totalStudents: 32,
    averageScore: 78.5,
    averagePercentage: 78.5,
    passedCount: 28,
    failedCount: 4,
    averageTimeSpent: 1245, // em segundos
    highestScore: 98,
    lowestScore: 45,
  };

  const attempts: Attempt[] = [
    {
      id: 1,
      studentName: "João Silva",
      studentEmail: "joao@email.com",
      attemptNumber: 1,
      score: 85,
      percentage: 85,
      passed: true,
      timeSpent: 1200,
      submittedAt: "2024-03-15T10:30:00",
      status: "graded",
    },
    {
      id: 2,
      studentName: "Maria Santos",
      studentEmail: "maria@email.com",
      attemptNumber: 2,
      score: 92,
      percentage: 92,
      passed: true,
      timeSpent: 1400,
      submittedAt: "2024-03-15T11:15:00",
      status: "graded",
    },
    {
      id: 3,
      studentName: "Pedro Costa",
      studentEmail: "pedro@email.com",
      attemptNumber: 1,
      score: 65,
      percentage: 65,
      passed: false,
      timeSpent: 900,
      submittedAt: "2024-03-15T14:20:00",
      status: "pending_review",
      pendingEssayCount: 2,
    },
  ];

  const questionStats = [
    {
      id: 1,
      text: "O que é React?",
      type: "MULTIPLE_CHOICE_SINGLE",
      totalAnswers: 45,
      correctAnswers: 40,
      errorRate: 11.1,
    },
    {
      id: 2,
      text: "Explique hooks em React",
      type: "ESSAY",
      totalAnswers: 45,
      correctAnswers: 0,
      errorRate: 0,
      pendingReview: 12,
    },
    {
      id: 3,
      text: "useState serve para...",
      type: "FILL_BLANKS",
      totalAnswers: 45,
      correctAnswers: 38,
      errorRate: 15.6,
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-zinc-600 hover:text-zinc-900 mb-4"
          >
            <ArrowLeft size={20} />
            Voltar
          </button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 mb-2">
                Estatísticas do Exercício
              </h1>
              <p className="text-zinc-600">Quiz - Introdução ao React</p>
            </div>

            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-zinc-300 text-zinc-700 rounded-lg hover:bg-zinc-50 transition-colors font-medium">
                <Filter size={18} />
                Filtrar
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                <Download size={18} />
                Exportar
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mt-6 border-b border-zinc-200">
            <TabButton
              active={selectedTab === "overview"}
              onClick={() => setSelectedTab("overview")}
              icon={<BarChart3 size={18} />}
            >
              Visão Geral
            </TabButton>
            <TabButton
              active={selectedTab === "attempts"}
              onClick={() => setSelectedTab("attempts")}
              icon={<Users size={18} />}
            >
              Tentativas ({attempts.length})
            </TabButton>
            <TabButton
              active={selectedTab === "questions"}
              onClick={() => setSelectedTab("questions")}
              icon={<MessageSquare size={18} />}
            >
              Questões
            </TabButton>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {selectedTab === "overview" && (
          <OverviewTab stats={stats} questionStats={questionStats} />
        )}
        {selectedTab === "attempts" && (
          <AttemptsTab
            attempts={attempts}
            onViewAttempt={(attempt) => setSelectedAttempt(attempt)}
          />
        )}
        {selectedTab === "questions" && <QuestionsTab questions={questionStats} />}
      </main>

      {/* Modal de correção */}
      {selectedAttempt && (
        <GradingModal
          attempt={selectedAttempt}
          onClose={() => setSelectedAttempt(null)}
        />
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-3 border-b-2 font-semibold transition-colors ${
        active
          ? "border-blue-600 text-blue-600"
          : "border-transparent text-zinc-600 hover:text-zinc-900"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

// Aba: Visão Geral
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function OverviewTab({ stats, questionStats }: any) {
  const passRate = (stats.passedCount / stats.totalAttempts) * 100;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total de Tentativas"
          value={stats.totalAttempts.toString()}
          icon={<Users size={24} />}
          trend={+12}
          trendLabel="vs. mês anterior"
          color="blue"
        />
        <StatsCard
          title="Média de Notas"
          value={`${stats.averagePercentage}%`}
          icon={<Award size={24} />}
          trend={+5}
          trendLabel="vs. mês anterior"
          color="green"
        />
        <StatsCard
          title="Taxa de Aprovação"
          value={`${Math.round(passRate)}%`}
          icon={<CheckCircle size={24} />}
          trend={-2}
          trendLabel="vs. mês anterior"
          color="purple"
        />
        <StatsCard
          title="Tempo Médio"
          value={`${Math.floor(stats.averageTimeSpent / 60)}min`}
          icon={<Clock size={24} />}
          trend={0}
          trendLabel="vs. mês anterior"
          color="amber"
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribuição de Notas */}
        <div className="bg-white border border-zinc-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-zinc-900 mb-6">
            Distribuição de Notas
          </h3>
          <div className="space-y-3">
            <DistributionBar label="90-100%" count={12} total={45} color="green" />
            <DistributionBar label="80-89%" count={16} total={45} color="blue" />
            <DistributionBar label="70-79%" count={10} total={45} color="yellow" />
            <DistributionBar label="60-69%" count={4} total={45} color="orange" />
            <DistributionBar label="0-59%" count={3} total={45} color="red" />
          </div>
        </div>

        {/* Questões Mais Difíceis */}
        <div className="bg-white border border-zinc-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-zinc-900 mb-6">
            Questões Mais Difíceis
          </h3>
          <div className="space-y-3">
            {questionStats
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              .sort((a: any, b: any) => b.errorRate - a.errorRate)
              .slice(0, 5)
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              .map((q: any) => (
                <div key={q.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-zinc-900 truncate">
                      {q.text}
                    </p>
                    <p className="text-xs text-zinc-500">{q.type}</p>
                  </div>
                  <div className="ml-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-bold ${
                        q.errorRate > 20
                          ? "bg-red-100 text-red-700"
                          : q.errorRate > 10
                            ? "bg-orange-100 text-orange-700"
                            : "bg-green-100 text-green-700"
                      }`}
                    >
                      {q.errorRate.toFixed(1)}% erro
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Aba: Tentativas
function AttemptsTab({
  attempts,
  onViewAttempt,
}: {
  attempts: Attempt[];
  onViewAttempt: (attempt: Attempt) => void;
}) {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
      <table className="w-full">
        <thead className="bg-zinc-50 border-b border-zinc-200">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-600 uppercase">
              Aluno
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-600 uppercase">
              Tentativa
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-600 uppercase">
              Nota
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-600 uppercase">
              Status
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-600 uppercase">
              Tempo
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-600 uppercase">
              Data
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-600 uppercase">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200">
          {attempts.map((attempt) => (
            <tr key={attempt.id} className="hover:bg-zinc-50 transition-colors">
              <td className="px-6 py-4">
                <div>
                  <p className="font-semibold text-zinc-900">
                    {attempt.studentName}
                  </p>
                  <p className="text-sm text-zinc-500">{attempt.studentEmail}</p>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="px-2.5 py-1 bg-zinc-100 text-zinc-700 rounded-full text-sm font-medium">
                  #{attempt.attemptNumber}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-zinc-900">
                    {attempt.score}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-bold ${
                      attempt.passed
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {attempt.percentage}%
                  </span>
                </div>
              </td>
              <td className="px-6 py-4">
                {attempt.status === "graded" ? (
                  <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
                    <CheckCircle size={16} />
                    Corrigido
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-amber-600 text-sm font-medium">
                    <MessageSquare size={16} />
                    {attempt.pendingEssayCount} pendentes
                  </span>
                )}
              </td>
              <td className="px-6 py-4">
                <span className="text-sm text-zinc-600">
                  {Math.floor(attempt.timeSpent / 60)}min
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm text-zinc-600">
                  {new Date(attempt.submittedAt).toLocaleDateString("pt-BR")}
                </span>
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => onViewAttempt(attempt)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  {attempt.status === "pending_review" ? (
                    <>
                      <Edit3 size={14} />
                      Corrigir
                    </>
                  ) : (
                    <>
                      <Eye size={14} />
                      Ver
                    </>
                  )}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Continua no próximo arquivo...
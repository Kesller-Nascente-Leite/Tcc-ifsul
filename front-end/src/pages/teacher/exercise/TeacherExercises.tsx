import { useState, useEffect } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  BarChart3,
  Users,
  Clock,
  Award,
  CheckCircle,
  Eye,
  Copy,
  MoreVertical,
  FileText,
  TrendingUp,
} from "lucide-react";

// Tipos
interface Exercise {
  id: number;
  title: string;
  description: string;
  totalPoints: number;
  passingScore: number;
  timeLimit: number | null;
  questionsCount: number;
  isActive: boolean;
  availableFrom: string | null;
  availableUntil: string | null;
  createdAt: string;
  statistics: {
    totalAttempts: number;
    totalStudents: number;
    averagePercentage: number;
    passedCount: number;
    failedCount: number;
  };
}

export default function TeacherExercises() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  //   const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  //   const [view, setView] = useState<"grid" | "list">("grid");
  const [setSelectedExercise] = useState<Exercise | null>(null);

  useEffect(() => {
    // Simular fetch de exercícios
    setTimeout(() => {
      setExercises([
        {
          id: 1,
          title: "Quiz - Introdução ao React",
          description: "Teste seus conhecimentos sobre React básico",
          totalPoints: 100,
          passingScore: 70,
          timeLimit: 30,
          questionsCount: 10,
          isActive: true,
          availableFrom: null,
          availableUntil: null,
          createdAt: "2024-03-10T10:00:00",
          statistics: {
            totalAttempts: 45,
            totalStudents: 32,
            averagePercentage: 78.5,
            passedCount: 28,
            failedCount: 4,
          },
        },
        {
          id: 2,
          title: "Prova - Hooks Avançados",
          description: "Avaliação completa sobre hooks customizados",
          totalPoints: 150,
          passingScore: 80,
          timeLimit: 60,
          questionsCount: 15,
          isActive: true,
          availableFrom: "2024-03-15T09:00:00",
          availableUntil: "2024-03-22T23:59:59",
          createdAt: "2024-03-08T14:30:00",
          statistics: {
            totalAttempts: 18,
            totalStudents: 18,
            averagePercentage: 72.3,
            passedCount: 12,
            failedCount: 6,
          },
        },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-zinc-900 tracking-tight mb-2">
                Exercícios
              </h1>
              <p className="text-zinc-600 text-lg">
                Gerencie quizzes, provas e atividades da sua disciplina
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-lg shadow-blue-600/20"
            >
              <Plus size={20} />
              Novo Exercício
            </button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            <StatCard
              icon={<FileText size={20} />}
              label="Total de Exercícios"
              value={exercises.length.toString()}
              color="blue"
            />
            <StatCard
              icon={<Users size={20} />}
              label="Média de Alunos"
              value={Math.round(
                exercises.reduce(
                  (acc, ex) => acc + ex.statistics.totalStudents,
                  0,
                ) / exercises.length,
              ).toString()}
              color="purple"
            />
            <StatCard
              icon={<CheckCircle size={20} />}
              label="Taxa de Aprovação"
              value={`${Math.round(
                exercises.reduce(
                  (acc, ex) =>
                    acc +
                    (ex.statistics.passedCount /
                      (ex.statistics.passedCount + ex.statistics.failedCount)) *
                      100,
                  0,
                ) / exercises.length,
              )}%`}
              color="green"
            />
            <StatCard
              icon={<TrendingUp size={20} />}
              label="Média Geral"
              value={`${Math.round(
                exercises.reduce(
                  (acc, ex) => acc + ex.statistics.averagePercentage,
                  0,
                ) / exercises.length,
              )}%`}
              color="amber"
            />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : exercises.length === 0 ? (
          <EmptyState onCreateClick={() => setShowCreateModal(true)} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {exercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                onEdit={() => setSelectedExercise(exercise)}
                onDelete={() => {}}
                onViewStats={() => {}}
              />
            ))}
          </div>
        )}
      </main>

      {/* Create Modal */}
      {showCreateModal && (
        <CreateExerciseModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}

// Componentes auxiliares
function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: "blue" | "purple" | "green" | "amber";
}) {
  const colors = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    green: "bg-green-50 text-green-600 border-green-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-5">
      <div className={`inline-flex p-2.5 rounded-lg ${colors[color]} mb-3`}>
        {icon}
      </div>
      <p className="text-sm text-zinc-600 mb-1">{label}</p>
      <p className="text-2xl font-bold text-zinc-900">{value}</p>
    </div>
  );
}

function ExerciseCard({
  exercise,
  onEdit,
  onDelete,
  onViewStats,
}: {
  exercise: Exercise;
  onEdit: () => void;
  onDelete: () => void;
  onViewStats: () => void;
}) {
  const passRate =
    (exercise.statistics.passedCount /
      (exercise.statistics.passedCount + exercise.statistics.failedCount)) *
    100;

  return (
    <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden hover:shadow-xl hover:border-zinc-300 transition-all duration-300 group">
      {/* Header */}
      <div className="p-6 border-b border-zinc-100">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">
                {exercise.title}
              </h3>
              {exercise.isActive && (
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                  Ativo
                </span>
              )}
            </div>
            <p className="text-zinc-600 text-sm line-clamp-2">
              {exercise.description}
            </p>
          </div>
          <DropdownMenu onEdit={onEdit} onDelete={onDelete} />
        </div>

        {/* Meta info */}
        <div className="flex flex-wrap gap-4 text-sm text-zinc-600">
          <div className="flex items-center gap-1.5">
            <FileText size={16} />
            <span>{exercise.questionsCount} questões</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Award size={16} />
            <span>{exercise.totalPoints} pontos</span>
          </div>
          {exercise.timeLimit && (
            <div className="flex items-center gap-1.5">
              <Clock size={16} />
              <span>{exercise.timeLimit} min</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="p-6 bg-zinc-50">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-zinc-500 mb-1">Tentativas</p>
            <p className="text-2xl font-bold text-zinc-900">
              {exercise.statistics.totalAttempts}
            </p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 mb-1">Alunos</p>
            <p className="text-2xl font-bold text-zinc-900">
              {exercise.statistics.totalStudents}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-zinc-600">Taxa de Aprovação</span>
              <span className="text-sm font-semibold text-zinc-900">
                {Math.round(passRate)}%
              </span>
            </div>
            <div className="h-2 bg-zinc-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-green-500 to-green-600 transition-all duration-500"
                style={{ width: `${passRate}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-zinc-600">Média de Notas</span>
              <span className="text-sm font-semibold text-zinc-900">
                {Math.round(exercise.statistics.averagePercentage)}%
              </span>
            </div>
            <div className="h-2 bg-zinc-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-blue-500 to-blue-600 transition-all duration-500"
                style={{ width: `${exercise.statistics.averagePercentage}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-5">
          <button
            onClick={onViewStats}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-zinc-300 text-zinc-700 rounded-lg hover:bg-zinc-50 hover:border-zinc-400 transition-colors font-medium text-sm"
          >
            <BarChart3 size={16} />
            Estatísticas
          </button>
          <button
            onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
          >
            <Edit3 size={16} />
            Editar
          </button>
        </div>
      </div>
    </div>
  );
}

function DropdownMenu({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
      >
        <MoreVertical size={18} className="text-zinc-600" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-zinc-200 rounded-lg shadow-xl z-20 overflow-hidden">
            <button
              onClick={() => {
                onEdit();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-zinc-50 text-zinc-700 text-sm font-medium transition-colors"
            >
              <Edit3 size={16} />
              Editar
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-zinc-50 text-zinc-700 text-sm font-medium transition-colors">
              <Copy size={16} />
              Duplicar
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-zinc-50 text-zinc-700 text-sm font-medium transition-colors">
              <Eye size={16} />
              Visualizar
            </button>
            <div className="border-t border-zinc-200" />
            <button
              onClick={() => {
                onDelete();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-600 text-sm font-medium transition-colors"
            >
              <Trash2 size={16} />
              Excluir
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function EmptyState({ onCreateClick }: { onCreateClick: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-96 text-center">
      <div className="w-20 h-20 bg-zinc-100 rounded-2xl flex items-center justify-center mb-6">
        <FileText size={40} className="text-zinc-400" />
      </div>
      <h3 className="text-2xl font-bold text-zinc-900 mb-2">
        Nenhum exercício criado
      </h3>
      <p className="text-zinc-600 mb-8 max-w-md">
        Comece criando seu primeiro quiz, prova ou atividade para seus alunos
      </p>
      <button
        onClick={onCreateClick}
        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
      >
        <Plus size={20} />
        Criar Primeiro Exercício
      </button>
    </div>
  );
}

function CreateExerciseModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-zinc-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-zinc-900">
              Criar Novo Exercício
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
        <div className="p-6">
          <p className="text-zinc-600">
            Modal de criação será implementado no próximo arquivo...
          </p>
        </div>
      </div>
    </div>
  );
}

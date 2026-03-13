import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  Plus,
  Edit3,
  Trash2,
  BarChart3,
  Users,
  Clock,
  Award,
  CheckCircle,
  XCircle,
  ArrowLeft,
  MoreVertical,
  FileText,
  TrendingUp,
  ClipboardList,
  Copy,
} from "lucide-react";
import { ButtonComponent } from "../../../components/ui/ButtonComponent";
import { NotificationComponent } from "../../../components/ui/NotificationComponent";
import {
  ConfirmDialog,
  useConfirmDialog,
} from "../../../components/ui/ConfirmDialog";
import { ExerciseTeacherApi } from "../../../api/exerciseTeacher.api";
import { LessonTeacherApi } from "../../../api/lessonTeacher.api";
import type { ExerciseResponseDTO } from "../../../types/ExerciseTypes";
import type { LessonDTO } from "../../../types/LessonDTO";
import { useTheme } from "../../../context/ThemeContext";
import { Header, Button } from "react-aria-components";

export default function TeacherExercises() {
  const { lessonId, moduleId, courseId } = useParams<{
    lessonId: string;
    moduleId: string;
    courseId: string;
  }>();
  const { accentColor, isDark } = useTheme();
  const navigate = useNavigate();
  const { isOpen, setIsOpen, confirm, dialogConfig } = useConfirmDialog();

  const [lesson, setLesson] = useState<LessonDTO | null>(null);
  const [exercises, setExercises] = useState<ExerciseResponseDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  useEffect(() => {
    if (!lessonId) return;
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

  const loadData = async () => {
    if (!lessonId) return;

    try {
      setIsLoading(true);
      const [lessonResponse, exercisesResponse] = await Promise.all([
        LessonTeacherApi.getById(Number(lessonId)),
        ExerciseTeacherApi.listByLesson(Number(lessonId)),
      ]);

      setLesson(lessonResponse.data);
      setExercises(exercisesResponse.data || []);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      showNotification("error", "Erro ao carregar exercícios");
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (
    type: "success" | "error" | "info",
    message: string
  ) => {
    setNotification({ type, message });
  };

  const deleteExercise = async (exercise: ExerciseResponseDTO) => {
    const confirmed = await confirm({
      title: "Confirmar exclusão",
      message: (
        <div className="space-y-2">
          <p>Tem certeza que deseja excluir o exercício:</p>
          <p
            className="font-semibold"
            style={{ color: "var(--color-text-primary)" }}
          >
            "{exercise.title}"?
          </p>
          <p className="text-xs">Esta ação não pode ser desfeita.</p>
        </div>
      ),
      confirmText: "Sim, excluir",
      cancelText: "Cancelar",
      variant: "danger",
      isDark,
    });

    if (confirmed) {
      try {
        await ExerciseTeacherApi.remove(exercise.id);
        setExercises((prev) => prev.filter((e) => e.id !== exercise.id));
        showNotification("success", "Exercício excluído com sucesso!");
      } catch (error) {
        console.error("Erro ao excluir exercício:", error);
        showNotification("error", "Erro ao excluir exercício");
      }
    }
  };

  const duplicateExercise = async (exercise: ExerciseResponseDTO) => {
    try {
      const response = await ExerciseTeacherApi.duplicate(exercise.id);
      setExercises((prev) => [...prev, response.data]);
      showNotification("success", "Exercício duplicado com sucesso!");
    } catch (error) {
      console.error("Erro ao duplicar exercício:", error);
      showNotification("error", "Erro ao duplicar exercício");
    }
  };

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{ backgroundColor: "var(--color-bg-main)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin"
            style={{
              borderColor: accentColor,
              color: "var(--color-text-secondary)",
            }}
          />
          <span style={{ color: "var(--color-text-secondary)" }}>
            Carregando...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <Header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() =>
              navigate(
                `/teacher/courses/${courseId}/modules/${moduleId}/lessons`
              )
            }
            className="flex items-center gap-2 hover:opacity-80 transition-colors mb-2"
            style={{ color: "var(--color-text-secondary)" }}
          >
            <ArrowLeft size={20} />
            <span className="text-sm">Voltar para Aulas</span>
          </button>
          <h1
            className="text-2xl font-bold"
            style={{ color: "var(--color-text-primary)" }}
          >
            Exercícios
          </h1>
          <p
            className="text-sm"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {lesson?.title || "Carregando..."}
          </p>
        </div>

        <ButtonComponent
          onClick={() =>
            navigate(
              `/teacher/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/exercises/create`
            )
          }
          className="w-full sm:w-auto"
        >
          <Plus size={20} className="mr-2" />
          Novo Exercício
        </ButtonComponent>
      </Header>

      {/* Notificação */}
      {notification && (
        <NotificationComponent
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
          duration={3000}
        />
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          icon={<FileText size={20} />}
          label="Total de Exercícios"
          value={exercises.length.toString()}
          color={accentColor}
        />
        <StatCard
          icon={<Users size={20} />}
          label="Média de Alunos"
          value={Math.round(
            exercises.reduce((acc, ex) => acc + (ex.statistics?.totalStudents || 0), 0) /
              (exercises.length || 1)
          ).toString()}
          color={accentColor}
        />
        <StatCard
          icon={<CheckCircle size={20} />}
          label="Taxa de Aprovação"
          value={`${Math.round(
            exercises.reduce(
              (acc, ex) =>
                acc +
                ((ex.statistics?.passRate || 0)),
              0
            ) / (exercises.length || 1)
          )}%`}
          color={accentColor}
        />
        <StatCard
          icon={<TrendingUp size={20} />}
          label="Média Geral"
          value={`${Math.round(
            exercises.reduce((acc, ex) => acc + (ex.statistics?.averagePercentage || 0), 0) /
              (exercises.length || 1)
          )}%`}
          color={accentColor}
        />
      </div>

      {/* Lista de Exercícios */}
      <div
        className="p-4 sm:p-6 rounded-2xl border"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3
            className="font-bold text-lg"
            style={{ color: "var(--color-text-primary)" }}
          >
            Exercícios Criados
          </h3>
          <div
            className="text-sm"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {exercises.length} exercício(s)
          </div>
        </div>

        {exercises.length === 0 ? (
          <div className="text-center py-12">
            <ClipboardList
              size={48}
              className="mx-auto mb-4 opacity-50"
              style={{ color: "var(--color-text-secondary)" }}
            />
            <p style={{ color: "var(--color-text-secondary)" }}>
              Nenhum exercício criado ainda.
            </p>
            <p
              className="text-sm mt-2"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Crie seu primeiro exercício clicando no botão acima
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {exercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                accentColor={accentColor}
                onEdit={() =>
                  navigate(
                    `/teacher/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/exercises/${exercise.id}/edit`
                  )
                }
                onDelete={() => deleteExercise(exercise)}
                onViewStats={() =>
                  navigate(
                    `/teacher/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/exercises/${exercise.id}/stats`
                  )
                }
                onDuplicate={() => duplicateExercise(exercise)}
              />
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        isDark={isDark}
        {...dialogConfig}
      />
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
  color: string;
}) {
  return (
    <div
      className="p-5 rounded-xl border"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <div
        className="inline-flex p-2.5 rounded-lg mb-3"
        style={{ backgroundColor: `${color}15`, color }}
      >
        {icon}
      </div>
      <p className="text-sm mb-1" style={{ color: "var(--color-text-secondary)" }}>
        {label}
      </p>
      <p className="text-2xl font-bold" style={{ color: "var(--color-text-primary)" }}>
        {value}
      </p>
    </div>
  );
}

function ExerciseCard({
  exercise,
  accentColor,
  onEdit,
  onDelete,
  onViewStats,
  onDuplicate,
}: {
  exercise: ExerciseResponseDTO;
  accentColor: string;
  onEdit: () => void;
  onDelete: () => void;
  onViewStats: () => void;
  onDuplicate: () => void;
}) {
  const [showMenu, setShowMenu] = useState(false);
  const passRate = exercise.statistics?.passRate || 0;

  return (
    <div
      className="rounded-xl border hover:shadow-md transition-all overflow-hidden"
      style={{
        backgroundColor: "var(--color-surface-secondary)",
        borderColor: "var(--color-border)",
      }}
    >
      {/* Header */}
      <div
        className="p-5 border-b"
        style={{ borderColor: "var(--color-border)" }}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3
                className="text-xl font-bold"
                style={{ color: "var(--color-text-primary)" }}
              >
                {exercise.title}
              </h3>
              {exercise.isActive && (
                <span
                  className="px-2 py-0.5 text-xs font-semibold rounded-full"
                  style={{
                    backgroundColor: `${accentColor}15`,
                    color: accentColor,
                  }}
                >
                  Ativo
                </span>
              )}
            </div>
            <p
              className="text-sm line-clamp-2"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {exercise.description || "Sem descrição"}
            </p>
          </div>

          {/* Menu */}
          <div className="relative ml-2">
            <Button
              className="p-2 hover:bg-opacity-10 rounded-lg transition-colors"
              style={{ backgroundColor: `${accentColor}10` }}
              onClick={() => setShowMenu(!showMenu)}
            >
              <MoreVertical size={18} style={{ color: accentColor }} />
            </Button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div
                  className="absolute right-0 top-full mt-2 w-48 rounded-lg border shadow-xl z-20 overflow-hidden"
                  style={{
                    backgroundColor: "var(--color-surface)",
                    borderColor: "var(--color-border)",
                  }}
                >
                  <button
                    onClick={() => {
                      onEdit();
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors"
                    style={{
                      color: "var(--color-text-primary)",
                      backgroundColor: "transparent",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "var(--color-surface-hover)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <Edit3 size={16} />
                    Editar
                  </button>
                  <button
                    onClick={() => {
                      onDuplicate();
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors"
                    style={{
                      color: "var(--color-text-primary)",
                      backgroundColor: "transparent",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "var(--color-surface-hover)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <Copy size={16} />
                    Duplicar
                  </button>
                  <div
                    className="border-t"
                    style={{ borderColor: "var(--color-border)" }}
                  />
                  <button
                    onClick={() => {
                      onDelete();
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors"
                    style={{
                      color: "var(--color-error)",
                      backgroundColor: "transparent",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "var(--color-error-light)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <Trash2 size={16} />
                    Excluir
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Meta info */}
        <div className="flex flex-wrap gap-4 text-sm" style={{ color: "var(--color-text-secondary)" }}>
          <div className="flex items-center gap-1.5">
            <FileText size={16} />
            <span>{exercise.questionsCount || 0} questões</span>
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
      {exercise.statistics && (
        <div
          className="p-5"
          style={{ backgroundColor: "var(--color-surface-hover)" }}
        >
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs mb-1" style={{ color: "var(--color-text-secondary)" }}>
                Tentativas
              </p>
              <p className="text-2xl font-bold" style={{ color: "var(--color-text-primary)" }}>
                {exercise.statistics.totalAttempts}
              </p>
            </div>
            <div>
              <p className="text-xs mb-1" style={{ color: "var(--color-text-secondary)" }}>
                Alunos
              </p>
              <p className="text-2xl font-bold" style={{ color: "var(--color-text-primary)" }}>
                {exercise.statistics.totalStudents}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                  Taxa de Aprovação
                </span>
                <span className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
                  {Math.round(passRate)}%
                </span>
              </div>
              <div
                className="h-2 rounded-full overflow-hidden"
                style={{ backgroundColor: "var(--color-border)" }}
              >
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${passRate}%`,
                    background: `linear-gradient(to right, ${accentColor}, ${accentColor}dd)`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                  Média de Notas
                </span>
                <span className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
                  {Math.round(exercise.statistics.averagePercentage)}%
                </span>
              </div>
              <div
                className="h-2 rounded-full overflow-hidden"
                style={{ backgroundColor: "var(--color-border)" }}
              >
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${exercise.statistics.averagePercentage}%`,
                    background: `linear-gradient(to right, ${accentColor}, ${accentColor}dd)`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-5">
            <button
              onClick={onViewStats}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm rounded-lg font-medium transition-colors"
              style={{
                backgroundColor: "var(--color-surface)",
                color: "var(--color-text-primary)",
                border: `1px solid var(--color-border)`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--color-surface-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--color-surface)";
              }}
            >
              <BarChart3 size={16} />
              Estatísticas
            </button>
            <button
              onClick={onEdit}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm rounded-lg font-medium transition-colors"
              style={{
                backgroundColor: accentColor,
                color: "white",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.9";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
              }}
            >
              <Edit3 size={16} />
              Editar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
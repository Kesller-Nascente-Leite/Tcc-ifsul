/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Plus, ArrowLeft, Search } from "lucide-react";
import { ButtonComponent } from "@/shared/components/ui/ButtonComponent";
import { NotificationComponent } from "@/shared/components/ui/NotificationComponent";
import {
  ConfirmDialog,
  useConfirmDialog,
} from "@/shared/components/ui/ConfirmDialog";
import { StatCard } from "@/shared/components/ui/StatCard";
import { EmptyState } from "@/shared/components/ui/EmptyState";
import { LoadingSkeleton } from "@/shared/components/ui/LoadingSkeleton";
import { PaginationComponent } from "@/shared/components/ui/PaginationComponent";
import { ExerciseCard } from "@/features/teacher/components/ExerciseCard";
import { ExerciseTeacherApi } from "@/features/teacher/api/exerciseTeacher.api";
import { LessonTeacherApi } from "@/features/teacher/api/lessonTeacher.api";
import type { ExerciseResponseDTO } from "@/shared/types/ExerciseResponseDTO";
import type { LessonDTO } from "@/shared/types/LessonDTO";
import { useTheme } from "@/app/providers/ThemeContext";
import { FileText, Users, CheckCircle2, TrendingUp } from "lucide-react";

export function TeacherExercises() {
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
  const [filteredExercises, setFilteredExercises] = useState<
    ExerciseResponseDTO[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  useEffect(() => {
    if (!lessonId) return;
    loadData();
  }, [lessonId]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredExercises(exercises);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = exercises.filter(
      (exercise) =>
        exercise.title.toLowerCase().includes(query) ||
        exercise.description?.toLowerCase().includes(query),
    );
    setFilteredExercises(filtered);
  }, [searchQuery, exercises]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

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
      setFilteredExercises(exercisesResponse.data || []);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      showNotification("error", "Erro ao carregar exercícios");
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (
    type: "success" | "error" | "info",
    message: string,
  ) => {
    setNotification({ type, message });
  };

  const deleteExercise = async (exercise: ExerciseResponseDTO) => {
    const confirmed = await confirm({
      title: "Confirmar exclusão",
      message: (
        <div className="space-y-2">
          <p>Tem certeza que deseja excluir:</p>
          <p className="font-semibold text-base">"{exercise.title}"?</p>
          <p className="text-sm opacity-80">Esta ação não pode ser desfeita.</p>
        </div>
      ),
      confirmText: "Sim, excluir",
      cancelText: "Cancelar",
      variant: "danger",
      isDark,
    });

    if (confirmed && exercise.id) {
      try {
        await ExerciseTeacherApi.remove(exercise.id);
        setExercises((prev) => prev.filter((e) => e.id !== exercise.id));
        showNotification("success", "Exercício excluído com sucesso!");
      } catch (error) {
        console.error("Erro ao excluir:", error);
        showNotification("error", "Erro ao excluir exercício");
      }
    }
  };

  const duplicateExercise = async (exercise: ExerciseResponseDTO) => {
    if (!exercise.id) return;

    try {
      const response = await ExerciseTeacherApi.duplicate(exercise.id);
      setExercises((prev) => [...prev, response.data]);
      showNotification("success", "Exercício duplicado com sucesso!");
    } catch (error) {
      console.error("Erro ao duplicar:", error);
      showNotification("error", "Erro ao duplicar exercício");
    }
  };

  // Calcular estatísticas gerais
  const totalExercises = exercises.length;
  const avgStudents =
    exercises.reduce(
      (acc, ex) => acc + (ex.statistics?.totalStudents || 0),
      0,
    ) / (totalExercises || 1);
  const avgPassRate =
    exercises.reduce((acc, ex) => acc + (ex.statistics?.passRate || 0), 0) /
    (totalExercises || 1);
  const avgScore =
    exercises.reduce(
      (acc, ex) => acc + (ex.statistics?.averagePercentage || 0),
      0,
    ) / (totalExercises || 1);

  const EXERCISES_PER_PAGE = 6;
  const totalPages = Math.max(
    1,
    Math.ceil(filteredExercises.length / EXERCISES_PER_PAGE),
  );
  const paginatedExercises = filteredExercises.slice(
    (currentPage - 1) * EXERCISES_PER_PAGE,
    currentPage * EXERCISES_PER_PAGE,
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  if (isLoading) {
    return <LoadingSkeleton/>;
  }

  return (
    <div
      className="min-h-screen pb-12"
      style={{ backgroundColor: "var(--color-bg-main)" }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-10 border-b backdrop-blur-lg"
        style={{
          backgroundColor: isDark
            ? "rgba(24, 24, 27, 0.8)"
            : "rgba(255, 255, 255, 0.8)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() =>
              navigate(
                `/teacher/courses/${courseId}/modules/${moduleId}/lessons`,
              )
            }
            className="flex items-center gap-2 mb-3 transition-opacity hover:opacity-70"
            style={{ color: "var(--color-text-secondary)" }}
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Voltar para Aulas</span>
          </button>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1
                className="text-2xl sm:text-3xl font-bold mb-1 truncate"
                style={{ color: "var(--color-text-primary)" }}
              >
                Exercícios
              </h1>
              <p
                className="text-sm sm:text-base truncate"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {lesson?.title || "Carregando..."}
              </p>
            </div>

            <ButtonComponent
              onClick={() =>
                navigate(
                  `/teacher/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/exercises/create`,
                )
              }
              className="w-full sm:w-auto shrink-0"
            >
              <Plus size={20} className="mr-2" />
              Novo Exercício
            </ButtonComponent>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            icon={<FileText size={20} />}
            label="Total"
            value={totalExercises}
            color={accentColor}
          />
          <StatCard
            icon={<Users size={20} />}
            label="Média Alunos"
            value={Math.round(avgStudents)}
            color={accentColor}
          />
          <StatCard
            icon={<CheckCircle2 size={20} />}
            label="Aprovação"
            value={`${Math.round(avgPassRate)}%`}
            color={accentColor}
          />
          <StatCard
            icon={<TrendingUp size={20} />}
            label="Média"
            value={`${Math.round(avgScore)}%`}
            color={accentColor}
          />
        </div>

        {/* Search Bar */}
        <div
          className="relative"
          style={{
            backgroundColor: "var(--color-surface)",
            borderRadius: "12px",
          }}
        >
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2"
            style={{ color: "var(--color-text-secondary)" }}
          />
          <input
            type="text"
            placeholder="Buscar exercícios..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-transparent outline-none"
            style={{ color: "var(--color-text-primary)" }}
          />
        </div>

        {/* Lista de Exercícios */}
        <div
          className="rounded-2xl border p-6"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3
              className="text-lg font-bold"
              style={{ color: "var(--color-text-primary)" }}
            >
              {searchQuery
                ? `${filteredExercises.length} resultado(s)`
                : `${exercises.length} exercício(s)`}
            </h3>
          </div>

          {filteredExercises.length === 0 ? (
            <EmptyState
              searchQuery={searchQuery}
              onClearSearch={() => setSearchQuery("")}
            />
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {paginatedExercises.map((exercise) => (
                  <ExerciseCard
                    key={exercise.id}
                    exercise={exercise}
                    accentColor={accentColor}
                    onEdit={() =>
                      navigate(
                        `/teacher/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/exercises/${exercise.id}/edit`,
                      )
                    }
                    onDelete={() => deleteExercise(exercise)}
                    onViewStats={() =>
                      navigate(
                        `/teacher/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/exercises/${exercise.id}/stats`,
                      )
                    }
                    onDuplicate={() => duplicateExercise(exercise)}
                  />
                ))}
              </div>

              <PaginationComponent
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
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

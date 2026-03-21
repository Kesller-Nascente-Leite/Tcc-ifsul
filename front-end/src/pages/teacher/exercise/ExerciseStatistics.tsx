/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  BarChart3,
  Users,
  MessageSquare,
  Download,
} from "lucide-react";
import { ButtonComponent } from "../../../components/ui/ButtonComponent";
import { NotificationComponent } from "../../../components/ui/NotificationComponent";
import { LoadingSkeleton } from "../../../components/ui/LoadingSkeleton";
import { OverviewTab } from "../../../components/layout/teacher/OverviewTab";
import { AttemptsTab } from "../../../components/layout/teacher/AttemptsTab";
import { QuestionsTab } from "../../../components/layout/teacher/QuestionsTab";
import { ExerciseTeacherApi } from "../../../api/exerciseTeacher.api";
import type { ExerciseStatisticsDTO } from "../../../types/ExerciseStatisticsDTO";
import type { AttemptResponseDTO } from "../../../types/AttemptResponseDTO";
import { useTheme } from "../../../context/ThemeContext";

type TabType = "overview" | "attempts" | "questions";

export function ExerciseStatistics() {
  const { exerciseId, courseId, moduleId, lessonId } = useParams<{
    exerciseId: string;
    courseId: string;
    moduleId: string;
    lessonId: string;
  }>();
  const { accentColor, isDark } = useTheme();
  const navigate = useNavigate();

  const [selectedTab, setSelectedTab] = useState<TabType>("overview");
  const [statistics, setStatistics] = useState<ExerciseStatisticsDTO | null>(
    null,
  );
  const [attempts, setAttempts] = useState<AttemptResponseDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  useEffect(() => {
    if (!exerciseId) return;
    loadData();
  }, [exerciseId]);

  const loadData = async () => {
    if (!exerciseId) return;

    try {
      setIsLoading(true);
      const [statsResponse, attemptsResponse] = await Promise.all([
        ExerciseTeacherApi.getStatistics(Number(exerciseId)),
        ExerciseTeacherApi.listAttempts(Number(exerciseId)),
      ]);

      setStatistics(statsResponse.data);
      setAttempts(attemptsResponse.data || []);
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
      showNotification("error", "Erro ao carregar estatísticas");
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

  const handleExport = async () => {
    if (!exerciseId) return;

    try {
      await ExerciseTeacherApi.exportResults(Number(exerciseId));
      showNotification("success", "Resultados exportados com sucesso!");
    } catch (error) {
      console.error("Erro ao exportar:", error);
      showNotification("error", "Erro ao exportar resultados");
    }
  };

  if (isLoading) {
    return <LoadingSkeleton accentColor={accentColor} />;
  }

  if (!statistics) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p style={{ color: "var(--color-text-secondary)" }}>
          Erro ao carregar estatísticas
        </p>
      </div>
    );
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
                `/teacher/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/exercises`,
              )
            }
            className="flex items-center gap-2 mb-3 transition-opacity hover:opacity-70"
            style={{ color: "var(--color-text-secondary)" }}
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Voltar para Exercícios</span>
          </button>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1
                className="text-2xl sm:text-3xl font-bold mb-1"
                style={{ color: "var(--color-text-primary)" }}
              >
                Estatísticas do Exercício
              </h1>
              <p
                className="text-sm sm:text-base"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {statistics.exerciseTitle || "Carregando..."}
              </p>
            </div>

            <div className="flex gap-3">
              <ButtonComponent
                onClick={handleExport}
                className="flex items-center gap-2"
                variant="outline"
              >
                <Download size={18} />
                <span className="hidden sm:inline">Exportar</span>
              </ButtonComponent>
            </div>
          </div>

          {/* Tabs */}
          <div
            className="flex gap-2 mt-6 border-b overflow-x-auto"
            style={{ borderColor: "var(--color-border)" }}
          >
            <TabButton
              active={selectedTab === "overview"}
              onClick={() => setSelectedTab("overview")}
              icon={<BarChart3 size={18} />}
              label="Visão Geral"
              accentColor={accentColor}
            />
            <TabButton
              active={selectedTab === "attempts"}
              onClick={() => setSelectedTab("attempts")}
              icon={<Users size={18} />}
              label={`Tentativas (${attempts.length})`}
              accentColor={accentColor}
            />
            <TabButton
              active={selectedTab === "questions"}
              onClick={() => setSelectedTab("questions")}
              icon={<MessageSquare size={18} />}
              label="Questões"
              accentColor={accentColor}
            />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {notification && (
          <div className="mb-6">
            <NotificationComponent
              type={notification.type}
              message={notification.message}
              onClose={() => setNotification(null)}
              duration={3000}
            />
          </div>
        )}

        {selectedTab === "overview" && (
          <OverviewTab statistics={statistics} accentColor={accentColor} />
        )}
        {selectedTab === "attempts" && (
          <AttemptsTab attempts={attempts} accentColor={accentColor} />
        )}
        {selectedTab === "questions" && (
          <QuestionsTab statistics={statistics} accentColor={accentColor} />
        )}
      </main>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
  accentColor,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  accentColor: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-3 border-b-2 font-semibold transition-all whitespace-nowrap ${
        active ? "border-current" : "border-transparent"
      }`}
      style={{
        color: active ? accentColor : "var(--color-text-secondary)",
      }}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

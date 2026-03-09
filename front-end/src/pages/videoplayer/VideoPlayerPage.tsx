import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  Loader2,
  Play,
  Globe,
  HardDrive,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { VideoPlayer } from "../../components/VideoPlayer";
import { VideoTeacherApi } from "../../api/videoTeacher.api";
import { NotificationComponent } from "../../components/ui/NotificationComponent";
import type { VideoDTO } from "../../types/LessonDTO";
import { useTheme } from "../../context/ThemeContext";

export function VideoPlayerPage() {
  const { videoId, courseId, moduleId } = useParams<{
    videoId: string;
    courseId: string;
    moduleId: string;
  }>();
  const { accentColor, isDark } = useTheme();
  const navigate = useNavigate();

  const [video, setVideo] = useState<VideoDTO | null>(null);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [watchTime, setWatchTime] = useState(0);
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  useEffect(() => {
    loadVideo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);

  const loadVideo = async () => {
    if (!videoId) return;

    try {
      setIsLoading(true);

      // Buscar informações do vídeo
      const response = await VideoTeacherApi.getById(Number(videoId));
      const videoData = response.data;
      setVideo(videoData);

      // Se for vídeo do banco, baixar o blob
      if (videoData.storageType === "DATABASE") {
        const blob = await VideoTeacherApi.getVideoBlob(Number(videoId));
        setVideoBlob(blob);
      }
    } catch (error) {
      console.error("Erro ao carregar vídeo:", error);
      setNotification({
        type: "error",
        message: "Erro ao carregar vídeo",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTimeUpdate = (currentTime: number, duration: number) => {
    const percentage = (currentTime / duration) * 100;
    setProgress(percentage);
    setWatchTime(Math.floor(currentTime));

    // Aqui você pode salvar o progresso no backend
    console.log("Progresso:", percentage.toFixed(1), "%");
  };

  const handleComplete = () => {
    setIsCompleted(true);
    setNotification({
      type: "success",
      message: "🎉 Vídeo concluído com sucesso!",
    });
    // Aqui você pode marcar como concluído no backend
  };

  const goBack = () => {
    navigate(`/teacher/courses/${courseId}/modules/${moduleId}/lessons`);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{
          backgroundColor: "var(--color-bg-main)",
          backgroundImage: `radial-gradient(circle at 20% 50%, ${accentColor}10 0%, transparent 50%),
                           radial-gradient(circle at 80% 80%, ${accentColor}10 0%, transparent 50%)`,
        }}
      >
        <div className="text-center">
          <div
            className="relative inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full"
            style={{
              backgroundColor: `${accentColor}20`,
              boxShadow: `0 0 40px ${accentColor}40`,
            }}
          >
            <Loader2
              size={40}
              className="animate-spin"
              style={{ color: accentColor }}
            />
          </div>
          <h2
            className="text-xl font-bold mb-2"
            style={{ color: "var(--color-text-primary)" }}
          >
            Preparando vídeo...
          </h2>
          <p
            className="text-sm"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Aguarde enquanto carregamos o conteúdo
          </p>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{ backgroundColor: "var(--color-bg-main)" }}
      >
        <div className="text-center max-w-md">
          <div
            className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full"
            style={{ backgroundColor: "var(--color-error-light)" }}
          >
            <XCircle size={40} style={{ color: "var(--color-error)" }} />
          </div>
          <h2
            className="text-2xl font-bold mb-3"
            style={{ color: "var(--color-text-primary)" }}
          >
            Vídeo não encontrado
          </h2>
          <p
            className="text-sm mb-6"
            style={{ color: "var(--color-text-secondary)" }}
          >
            O vídeo que você está procurando não existe ou foi removido.
          </p>
          <button
            onClick={goBack}
            className="px-6 py-3 rounded-xl font-semibold transition-all hover:opacity-90 hover:shadow-lg"
            style={{
              backgroundColor: accentColor,
              color: "white",
            }}
          >
            <ArrowLeft size={18} className="inline mr-2" />
            Voltar para aulas
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "var(--color-bg-main)",
        backgroundImage: isDark
          ? `radial-gradient(circle at 10% 20%, ${accentColor}05 0%, transparent 50%)`
          : `radial-gradient(circle at 10% 20%, ${accentColor}08 0%, transparent 50%)`,
      }}
    >
      {notification && (
        <NotificationComponent
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
          duration={3000}
        />
      )}

      {/* Header com Breadcrumb */}
      <div
        className="sticky top-0 z-10 backdrop-blur-md border-b"
        style={{
          backgroundColor: isDark ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.5)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={goBack}
            className="flex items-center gap-2 hover:gap-3 transition-all group"
            style={{ color: "var(--color-text-secondary)" }}
          >
            <ArrowLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="text-sm font-medium group-hover:text-current transition-colors">
              Voltar para aulas
            </span>
          </button>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Video Player Container */}
        <div className="mb-8">
          <div
            className="rounded-3xl overflow-hidden shadow-2xl"
            style={{
              backgroundColor: "var(--color-surface)",
              border: `1px solid var(--color-border)`,
              boxShadow: `0 20px 60px ${accentColor}20`,
            }}
          >
            {video.storageType === "URL" && video.url ? (
              <VideoPlayer
                videoUrl={video.url}
                title={video.title}
                onTimeUpdate={handleTimeUpdate}
                onComplete={handleComplete}
              />
            ) : videoBlob ? (
              <VideoPlayer
                videoBlob={videoBlob}
                title={video.title}
                onTimeUpdate={handleTimeUpdate}
                onComplete={handleComplete}
              />
            ) : (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <XCircle
                    size={48}
                    className="mx-auto mb-4 opacity-50"
                    style={{ color: "var(--color-error)" }}
                  />
                  <p style={{ color: "var(--color-text-secondary)" }}>
                    Erro ao carregar vídeo
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          {progress > 0 && !isCompleted && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span
                  className="text-xs font-medium"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Progresso do vídeo
                </span>
                <span
                  className="text-xs font-bold"
                  style={{ color: accentColor }}
                >
                  {progress.toFixed(1)}%
                </span>
              </div>
              <div
                className="h-1.5 rounded-full overflow-hidden"
                style={{ backgroundColor: `${accentColor}20` }}
              >
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${progress}%`,
                    backgroundColor: accentColor,
                    boxShadow: `0 0 10px ${accentColor}60`,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Grid de Informações */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informações Principais */}
          <div className="lg:col-span-2 space-y-6">
            {/* Título e Descrição */}
            <div
              className="p-6 rounded-2xl border"
              style={{
                backgroundColor: "var(--color-surface)",
                borderColor: "var(--color-border)",
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="p-3 rounded-xl shrink-0"
                  style={{
                    backgroundColor: `${accentColor}15`,
                  }}
                >
                  <Play
                    size={24}
                    style={{ color: accentColor }}
                    fill={accentColor}
                  />
                </div>
                <div className="flex-1">
                  <h1
                    className="text-2xl font-bold mb-2"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {video.title}
                  </h1>
                  <div className="flex items-center gap-4 text-sm flex-wrap">
                    <div
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                      style={{
                        backgroundColor:
                          video.storageType === "URL"
                            ? `${accentColor}15`
                            : "var(--color-surface-secondary)",
                      }}
                    >
                      {video.storageType === "URL" ? (
                        <>
                          <Globe size={16} style={{ color: accentColor }} />
                          <span style={{ color: accentColor }}>
                            Vídeo Externo
                          </span>
                        </>
                      ) : (
                        <>
                          <HardDrive
                            size={16}
                            style={{ color: "var(--color-text-secondary)" }}
                          />
                          <span
                            style={{ color: "var(--color-text-secondary)" }}
                          >
                            Vídeo Local
                          </span>
                        </>
                      )}
                    </div>

                    {watchTime > 0 && (
                      <div
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                        style={{
                          backgroundColor: "var(--color-surface-secondary)",
                        }}
                      >
                        <Clock
                          size={16}
                          style={{ color: "var(--color-text-secondary)" }}
                        />
                        <span style={{ color: "var(--color-text-secondary)" }}>
                          {formatTime(watchTime)} assistido
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Status de Conclusão */}
            {isCompleted && (
              <div
                className="p-6 rounded-2xl border animate-fadeIn"
                style={{
                  backgroundColor: `${accentColor}10`,
                  borderColor: accentColor,
                }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: accentColor }}
                  >
                    <CheckCircle2 size={24} className="text-white" />
                  </div>
                  <div>
                    <h3
                      className="font-bold text-lg mb-1"
                      style={{ color: accentColor }}
                    >
                      Parabéns! Vídeo concluído 🎉
                    </h3>
                    <p
                      className="text-sm"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      Você assistiu este vídeo até o final. Continue com a
                      próxima aula!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar com Estatísticas */}
          <div className="space-y-6">
            {/* Card de Progresso */}
            <div
              className="p-6 rounded-2xl border"
              style={{
                backgroundColor: "var(--color-surface)",
                borderColor: "var(--color-border)",
              }}
            >
              <h3
                className="font-bold text-sm mb-4 uppercase tracking-wider"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Seu Progresso
              </h3>

              {/* Círculo de Progresso */}
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <svg
                    className="transform -rotate-90"
                    width="120"
                    height="120"
                  >
                    {/* Background circle */}
                    <circle
                      cx="60"
                      cy="60"
                      r="52"
                      stroke={`${accentColor}20`}
                      strokeWidth="8"
                      fill="none"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="60"
                      cy="60"
                      r="52"
                      stroke={accentColor}
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 52}`}
                      strokeDashoffset={`${2 * Math.PI * 52 * (1 - progress / 100)}`}
                      strokeLinecap="round"
                      style={{
                        transition: "stroke-dashoffset 0.3s ease",
                        filter: `drop-shadow(0 0 6px ${accentColor}60)`,
                      }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className="text-2xl font-bold"
                      style={{ color: accentColor }}
                    >
                      {progress.toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Estatísticas */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className="text-sm"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    Tempo assistido
                  </span>
                  <span
                    className="text-sm font-bold"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {formatTime(watchTime)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span
                    className="text-sm"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    Status
                  </span>
                  <span
                    className="text-sm font-bold"
                    style={{
                      color: isCompleted
                        ? accentColor
                        : "var(--color-text-secondary)",
                    }}
                  >
                    {isCompleted
                      ? "✓ Concluído"
                      : progress > 0
                        ? "Em andamento"
                        : "Não iniciado"}
                  </span>
                </div>
              </div>
            </div>

            {/* Dicas de Navegação */}
            <div
              className="p-6 rounded-2xl border"
              style={{
                backgroundColor: "var(--color-surface)",
                borderColor: "var(--color-border)",
              }}
            >
              <h3
                className="font-bold text-sm mb-4 uppercase tracking-wider"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Atalhos do Teclado
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span style={{ color: "var(--color-text-secondary)" }}>
                    Play/Pause
                  </span>
                  <kbd
                    className="px-2 py-1 rounded font-mono text-xs"
                    style={{
                      backgroundColor: "var(--color-surface-secondary)",
                      color: "var(--color-text-primary)",
                    }}
                  >
                    Espaço
                  </kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span style={{ color: "var(--color-text-secondary)" }}>
                    Tela cheia
                  </span>
                  <kbd
                    className="px-2 py-1 rounded font-mono text-xs"
                    style={{
                      backgroundColor: "var(--color-surface-secondary)",
                      color: "var(--color-text-primary)",
                    }}
                  >
                    F
                  </kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span style={{ color: "var(--color-text-secondary)" }}>
                    Avançar 10s
                  </span>
                  <kbd
                    className="px-2 py-1 rounded font-mono text-xs"
                    style={{
                      backgroundColor: "var(--color-surface-secondary)",
                      color: "var(--color-text-primary)",
                    }}
                  >
                    →
                  </kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span style={{ color: "var(--color-text-secondary)" }}>
                    Voltar 10s
                  </span>
                  <kbd
                    className="px-2 py-1 rounded font-mono text-xs"
                    style={{
                      backgroundColor: "var(--color-surface-secondary)",
                      color: "var(--color-text-primary)",
                    }}
                  >
                    ←
                  </kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span style={{ color: "var(--color-text-secondary)" }}>
                    Mute
                  </span>
                  <kbd
                    className="px-2 py-1 rounded font-mono text-xs"
                    style={{
                      backgroundColor: "var(--color-surface-secondary)",
                      color: "var(--color-text-primary)",
                    }}
                  >
                    M
                  </kbd>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

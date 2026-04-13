import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  Loader2,
  Play,
  Globe,
  HardDrive,
  XCircle,
} from "lucide-react";
import { VideoPlayer } from "@/shared/components/common/VideoPlayer";
import { VideoTeacherApi } from "@/features/teacher/api/videoTeacher.api";
import { NotificationComponent } from "@/shared/components/ui/NotificationComponent";
import type { VideoDTO } from "@/shared/types/LessonDTO";
import { useTheme } from "@/app/providers/ThemeContext";

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

  const goBack = () => {
    navigate(`/teacher/courses/${courseId}/modules/${moduleId}/lessons`);
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
                videoId={Number(videoId)}
              />
            ) : videoBlob ? (
              <VideoPlayer
                videoBlob={videoBlob}
                title={video.title}
                videoId={Number(videoId)}
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
        </div>

        {/* Informações do Vídeo */}
        <div className="max-w-4xl mx-auto">
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
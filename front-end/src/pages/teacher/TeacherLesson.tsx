import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  Plus,
  Edit2,
  Trash2,
  PlayCircle,
  Clock,
  Video as VideoIcon,
  ArrowLeft,
  Link as LinkIcon,
  FileVideo,
  Upload,
  Download,
  Globe,
  Play,
} from "lucide-react";
import { ButtonComponent } from "../../components/ui/ButtonComponent";
import { InputComponent } from "../../components/ui/InputComponent";
import { NotificationComponent } from "../../components/ui/NotificationComponent";
import {
  ConfirmDialog,
  useConfirmDialog,
} from "../../components/ui/ConfirmDialog";
import { LessonTeacherApi } from "../../api/lessonTeacher.api";
import { VideoTeacherApi } from "../../api/videoTeacher.api";
import { ModuleTeacherApi } from "../../api/moduleTeacher.api";
import type { LessonDTO, VideoDTO } from "../../types/LessonDTO";
import type { ModuleDTO } from "../../types/ModuleDTO";
import { useTheme } from "../../context/ThemeContext";
import { Button, Header, Label, TextArea } from "react-aria-components";

export function TeacherLessons() {
  const { moduleId, courseId } = useParams<{
    moduleId: string;
    courseId: string;
  }>();
  const { accentColor, isDark } = useTheme();
  const navigate = useNavigate();
  const { isOpen, setIsOpen, confirm, dialogConfig } = useConfirmDialog();

  const [module, setModule] = useState<ModuleDTO | null>(null);
  const [lessons, setLessons] = useState<LessonDTO[]>([]);

  // Formulário de Aula
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonDescription, setLessonDescription] = useState("");
  const [lessonDuration, setLessonDuration] = useState<number>(0);

  // Modal de Vídeo
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<LessonDTO | null>(null);
  const [videoMode, setVideoMode] = useState<"url" | "upload">("url");
  const [videoTitle, setVideoTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const [isLoadingModule, setIsLoadingModule] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isAddingVideo, setIsAddingVideo] = useState(false);

  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  useEffect(() => {
    if (moduleId) {
      loadModuleData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleId]);

  const loadModuleData = async () => {
    if (!moduleId) return;

    try {
      setIsLoadingModule(true);
      const [moduleResponse, lessonsResponse] = await Promise.all([
        ModuleTeacherApi.getById(Number(moduleId)),
        LessonTeacherApi.listByModule(Number(moduleId)),
      ]);

      setModule(moduleResponse.data);

      // Carregar vídeos para cada aula
      const lessonsWithVideos = await Promise.all(
        lessonsResponse.data.map(async (lesson) => {
          if (lesson.id) {
            try {
              const videosResponse = await VideoTeacherApi.listVideos(
                lesson.id
              );
              return { ...lesson, videos: videosResponse.data };
            } catch (error) {
              console.error(
                `Erro ao carregar vídeos da aula ${lesson.id}:`,
                error
              );
              return { ...lesson, videos: [] };
            }
          }
          return lesson;
        })
      );

      setLessons(lessonsWithVideos || []);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      showNotification("error", "Erro ao carregar informações do módulo");
    } finally {
      setIsLoadingModule(false);
    }
  };

  const showNotification = (
    type: "success" | "error" | "info",
    message: string
  ) => {
    setNotification({ type, message });
  };

  const createLesson = async () => {
    if (!lessonTitle.trim()) {
      showNotification("error", "O título da aula é obrigatório");
      return;
    }

    if (!lessonDescription.trim()) {
      showNotification("error", "A descrição da aula é obrigatória");
      return;
    }

    if (!moduleId) return;

    const payload: LessonDTO = {
      title: lessonTitle.trim(),
      description: lessonDescription.trim(),
      orderIndex: lessons.length + 1,
      durationMinutes: lessonDuration || undefined,
      moduleId: Number(moduleId),
    };

    try {
      setIsCreating(true);
      const response = await LessonTeacherApi.create(payload);
      const created = response.data;

      setLessons((prev) => [...prev, { ...created, videos: [] }]);
      setLessonTitle("");
      setLessonDescription("");
      setLessonDuration(0);
      showNotification("success", "Aula criada com sucesso!");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Erro ao criar aula:", error);
      showNotification(
        "error",
        error.response?.data?.message || "Erro ao criar aula"
      );
    } finally {
      setIsCreating(false);
    }
  };

  const deleteLesson = async (lesson: LessonDTO) => {
    const confirmed = await confirm({
      title: "Confirmar exclusão",
      message: (
        <div className="space-y-2">
          <p>Tem certeza que deseja excluir a aula:</p>
          <p
            className="font-semibold"
            style={{ color: "var(--color-text-primary)" }}
          >
            "{lesson.title}"?
          </p>
          <p className="text-xs">Esta ação não pode ser desfeita.</p>
        </div>
      ),
      confirmText: "Sim, excluir",
      cancelText: "Cancelar",
      variant: "danger",
      isDark,
    });

    if (confirmed && lesson.id) {
      try {
        await LessonTeacherApi.remove(lesson.id);
        setLessons((prev) => prev.filter((l) => l.id !== lesson.id));
        showNotification("success", "Aula excluída com sucesso!");
      } catch (error) {
        console.error("Erro ao excluir aula:", error);
        showNotification("error", "Erro ao excluir aula");
      }
    }
  };

  const openVideoModal = (lesson: LessonDTO) => {
    setSelectedLesson(lesson);
    setShowVideoModal(true);
    setVideoMode("url");
    setVideoTitle("");
    setVideoUrl("");
    setVideoFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tamanho (900MB)
      if (file.size > 900 * 1024 * 1024) {
        showNotification("error", "Arquivo muito grande. Máximo: 900MB");
        return;
      }

      // Validar tipo
      if (!file.type.startsWith("video/")) {
        showNotification("error", "Apenas arquivos de vídeo são permitidos");
        return;
      }

      setVideoFile(file);
      if (!videoTitle.trim()) {
        setVideoTitle(file.name.replace(/\.[^/.]+$/, "")); 
      }
    }
  };

  const addVideo = async () => {
    if (!videoTitle.trim()) {
      showNotification("error", "Título do vídeo é obrigatório");
      return;
    }

    if (!selectedLesson?.id) return;

    try {
      setIsAddingVideo(true);

      if (videoMode === "upload") {
        if (!videoFile) {
          showNotification("error", "Selecione um arquivo de vídeo");
          return;
        }

        await VideoTeacherApi.uploadVideo(
          selectedLesson.id,
          videoTitle.trim(),
          videoFile
        );
      } else {
        if (!videoUrl.trim()) {
          showNotification("error", "URL do vídeo é obrigatória");
          return;
        }

        await VideoTeacherApi.addVideoUrl(
          selectedLesson.id,
          videoTitle.trim(),
          videoUrl.trim()
        );
      }

      // Recarregar aulas
      await loadModuleData();

      setShowVideoModal(false);
      setVideoTitle("");
      setVideoUrl("");
      setVideoFile(null);
      showNotification("success", "Vídeo adicionado com sucesso!");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Erro ao adicionar vídeo:", error);
      showNotification(
        "error",
        error.response?.data?.message || "Erro ao adicionar vídeo"
      );
    } finally {
      setIsAddingVideo(false);
    }
  };

  const downloadVideo = async (video: VideoDTO) => {
    if (!video.id) return;

    try {
      showNotification("info", "Iniciando download...");
      await VideoTeacherApi.downloadVideo(video.id, video.title);
      showNotification("success", "Download concluído!");
    } catch (error) {
      console.error("Erro ao baixar vídeo:", error);
      showNotification("error", "Erro ao baixar vídeo");
    }
  };

  const deleteVideo = async (videoId: number) => {
    const confirmed = await confirm({
      title: "Confirmar exclusão",
      message: "Tem certeza que deseja excluir este vídeo?",
      confirmText: "Sim, excluir",
      cancelText: "Cancelar",
      variant: "danger",
      isDark,
    });

    if (confirmed) {
      try {
        await VideoTeacherApi.remove(videoId);
        await loadModuleData();
        showNotification("success", "Vídeo excluído com sucesso!");
      } catch (error) {
        console.error("Erro ao excluir vídeo:", error);
        showNotification("error", "Erro ao excluir vídeo");
      }
    }
  };

  if (isLoadingModule) {
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
    <div className="space-y-6">
      {/* Header */}
      <Header className="flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate(`/teacher/courses/${courseId}/modules`)}
            className="flex items-center gap-2 hover:opacity-80 transition-colors mb-2"
            style={{ color: "var(--color-text-secondary)" }}
          >
            <ArrowLeft size={20} />
            <span className="text-sm">Voltar para Módulos</span>
          </button>
          <h1
            className="text-2xl font-bold"
            style={{ color: "var(--color-text-primary)" }}
          >
            Aulas do Módulo
          </h1>
          <p
            className="text-sm"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {module?.title || "Carregando..."}
          </p>
        </div>
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

      {/* Grid Principal */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário de Criação */}
        <div
          className="lg:col-span-1 p-6 rounded-2xl border h-fit"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="p-2 rounded-lg"
              style={{ backgroundColor: `${accentColor}15` }}
            >
              <Plus size={20} style={{ color: accentColor }} />
            </div>
            <h3
              className="font-bold text-lg"
              style={{ color: "var(--color-text-primary)" }}
            >
              Nova Aula
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <Label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Título da Aula *
              </Label>
              <InputComponent
                value={lessonTitle}
                onChange={(e) =>
                  setLessonTitle((e.target as HTMLInputElement).value)
                }
                placeholder="Ex: Introdução aos Hooks"
                disabled={isCreating}
              />
            </div>

            <div>
              <Label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Descrição *
              </Label>
              <TextArea
                value={lessonDescription}
                onChange={(e) => setLessonDescription(e.target.value)}
                placeholder="Descreva o conteúdo desta aula..."
                disabled={isCreating}
                rows={4}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: "var(--color-surface-secondary)",
                  borderColor: "var(--color-border)",
                  color: "var(--color-text-primary)",
                }}
              />
            </div>

            <div>
              <Label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Duração (minutos)
              </Label>
              <InputComponent
                type="number"
                min={0}
                value={lessonDuration}
                onChange={(e) =>
                  setLessonDuration(
                    (e.target as HTMLInputElement).valueAsNumber || 0
                  )
                }
                placeholder="30"
                disabled={isCreating}
              />
            </div>

            <div className="pt-2">
              <ButtonComponent
                onClick={createLesson}
                isDisabled={
                  isCreating ||
                  !lessonTitle.trim() ||
                  !lessonDescription.trim()
                }
              >
                {isCreating ? "Criando..." : "Criar Aula"}
              </ButtonComponent>
            </div>
          </div>
        </div>

        {/* Lista de Aulas */}
        <div
          className="lg:col-span-2 p-6 rounded-2xl border"
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
              Aulas Criadas
            </h3>
            <div
              className="text-sm"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {lessons.length} aula(s)
            </div>
          </div>

          {lessons.length === 0 ? (
            <div className="text-center py-12">
              <PlayCircle
                size={48}
                className="mx-auto mb-4 opacity-50"
                style={{ color: "var(--color-text-secondary)" }}
              />
              <p style={{ color: "var(--color-text-secondary)" }}>
                Nenhuma aula criada ainda.
              </p>
              <p
                className="text-sm mt-2"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Crie sua primeira aula ao lado →
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {lessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  className="p-5 rounded-xl border hover:shadow-md transition-all"
                  style={{
                    backgroundColor: "var(--color-surface-secondary)",
                    borderColor: "var(--color-border)",
                  }}
                >
                  {/* Header da Aula */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className="flex items-center justify-center w-8 h-8 rounded-full text-white text-sm font-bold"
                          style={{ backgroundColor: accentColor }}
                        >
                          {index + 1}
                        </span>
                        <h4
                          className="font-bold text-lg"
                          style={{ color: "var(--color-text-primary)" }}
                        >
                          {lesson.title}
                        </h4>
                        {lesson.durationMinutes && (
                          <div
                            className="flex items-center gap-1 text-xs"
                            style={{ color: "var(--color-text-secondary)" }}
                          >
                            <Clock size={14} />
                            <span>{lesson.durationMinutes} min</span>
                          </div>
                        )}
                      </div>
                      <p
                        className="text-sm"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        {lesson.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors"
                        style={{
                          backgroundColor: "var(--color-surface-hover)",
                          color: "var(--color-text-primary)",
                        }}
                        onClick={() =>
                          navigate(
                            `/teacher/courses/${courseId}/modules/${moduleId}/lessons/${lesson.id}/edit`
                          )
                        }
                      >
                        <Edit2 size={16} />
                        Editar
                      </Button>

                      <Button
                        className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors"
                        style={{
                          backgroundColor: "var(--color-error-light)",
                          color: "var(--color-error)",
                        }}
                        onClick={() => deleteLesson(lesson)}
                      >
                        <Trash2 size={16} />
                        Excluir
                      </Button>
                    </div>
                  </div>

                  {/* Vídeos da Aula */}
                  <div
                    className="mt-4 pt-4 border-t"
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h5
                        className="font-semibold text-sm flex items-center gap-2"
                        style={{ color: "var(--color-text-primary)" }}
                      >
                        <VideoIcon size={16} />
                        Vídeos ({lesson.videos?.length || 0})
                      </h5>
                      <Button
                        className="flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg transition-colors"
                        style={{
                          backgroundColor: `${accentColor}15`,
                          color: accentColor,
                        }}
                        onClick={() => openVideoModal(lesson)}
                      >
                        <Plus size={14} />
                        Adicionar Vídeo
                      </Button>
                    </div>

                    {lesson.videos && lesson.videos.length > 0 ? (
                      <div className="space-y-2">
                        {lesson.videos.map((video) => (
                          <div
                            key={video.id}
                            className="flex items-center justify-between p-3 rounded-lg"
                            style={{
                              backgroundColor: "var(--color-surface-hover)",
                            }}
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <div
                                className="p-2 rounded-lg"
                                style={{
                                  backgroundColor: `${accentColor}15`,
                                  color: accentColor,
                                }}
                              >
                                {video.storageType === "URL" ? (
                                  <Globe size={16} />
                                ) : (
                                  <FileVideo size={16} />
                                )}
                              </div>
                              <div className="flex-1">
                                <p
                                  className="text-sm font-medium"
                                  style={{
                                    color: "var(--color-text-primary)",
                                  }}
                                >
                                  {video.title}
                                </p>
                                {video.storageType === "URL" && video.url && (
                                  <a
                                    href={video.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs flex items-center gap-1 hover:underline"
                                    style={{ color: accentColor }}
                                  >
                                    <LinkIcon size={12} />
                                    Ver vídeo
                                  </a>
                                )}
                                {video.storageType === "DATABASE" && (
                                  <span
                                    className="text-xs"
                                    style={{
                                      color: "var(--color-text-secondary)",
                                    }}
                                  >
                                    Armazenado no banco de dados
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {video.storageType === "DATABASE" && (
                                  <><Button
                                  className="p-2 rounded-lg transition-colors hover:opacity-80"
                                  style={{
                                    backgroundColor: `${accentColor}15`,
                                    color: accentColor,
                                  }}
                                  onClick={() => navigate(
                                    `/teacher/courses/${courseId}/modules/${moduleId}/lessons/${lesson.id}/videos/${video.id}/watch`
                                  )}
                                >
                                  <Play size={16} />
                                </Button><Button
                                  className="p-2 rounded-lg transition-colors hover:opacity-80"
                                  style={{
                                    backgroundColor: `${accentColor}15`,
                                    color: accentColor,
                                  }}
                                  onClick={() => downloadVideo(video)}
                                >
                                    <Download size={16} />
                                  </Button></>
                              )}
                              <Button
                                className="p-2 rounded-lg transition-colors"
                                style={{
                                  backgroundColor: "var(--color-error-light)",
                                  color: "var(--color-error)",
                                }}
                                onClick={() =>
                                  video.id && deleteVideo(video.id)
                                }
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p
                        className="text-xs text-center py-2"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        Nenhum vídeo adicionado
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modal de Adicionar Vídeo */}
      {showVideoModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          onClick={() => setShowVideoModal(false)}
        >
          <div
            className="w-full max-w-md p-6 rounded-2xl border"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              className="text-xl font-bold mb-4"
              style={{ color: "var(--color-text-primary)" }}
            >
              Adicionar Vídeo
            </h3>

            {/* Seletor de Modo */}
            <div className="flex gap-2 mb-4">
              <Button
                className="flex-1 px-4 py-2 rounded-lg transition-all font-semibold"
                style={{
                  backgroundColor:
                    videoMode === "url" ? accentColor : "var(--color-surface-hover)",
                  color:
                    videoMode === "url"
                      ? "white"
                      : "var(--color-text-secondary)",
                }}
                onClick={() => setVideoMode("url")}
              >
                <Globe size={16} className="inline mr-2" />
                Link URL
              </Button>
              <Button
                className="flex-1 px-4 py-2 rounded-lg transition-all font-semibold"
                style={{
                  backgroundColor:
                    videoMode === "upload" ? accentColor : "var(--color-surface-hover)",
                  color:
                    videoMode === "upload"
                      ? "white"
                      : "var(--color-text-secondary)",
                }}
                onClick={() => setVideoMode("upload")}
              >
                <Upload size={16} className="inline mr-2" />
                Upload
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Título do Vídeo *
                </Label>
                <InputComponent
                  value={videoTitle}
                  onChange={(e) =>
                    setVideoTitle((e.target as HTMLInputElement).value)
                  }
                  placeholder="Ex: Parte 1 - Conceitos Iniciais"
                  disabled={isAddingVideo}
                />
              </div>

              {videoMode === "url" ? (
                <div>
                  <Label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    URL do Vídeo *
                  </Label>
                  <InputComponent
                    value={videoUrl}
                    onChange={(e) =>
                      setVideoUrl((e.target as HTMLInputElement).value)
                    }
                    placeholder="https://youtube.com/watch?v=..."
                    disabled={isAddingVideo}
                  />
                  <p
                    className="text-xs mt-1"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    Cole o link do YouTube, Vimeo ou outro serviço
                  </p>
                </div>
              ) : (
                <div>
                  <Label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    Arquivo de Vídeo * (Máx: 100MB)
                  </Label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    disabled={isAddingVideo}
                    className="w-full px-4 py-2 rounded-lg border file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold hover:file:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: "var(--color-surface-secondary)",
                      borderColor: "var(--color-border)",
                      color: "var(--color-text-primary)",
                    }}
                  />
                  {videoFile && (
                    <p
                      className="text-xs mt-1"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      Arquivo: {videoFile.name} (
                      {(videoFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <ButtonComponent
                  onClick={() => setShowVideoModal(false)}
                  isDisabled={isAddingVideo}
                  variant="secondary"
                >
                  Cancelar
                </ButtonComponent>
                <ButtonComponent
                  onClick={addVideo}
                  isDisabled={
                    isAddingVideo ||
                    !videoTitle.trim() ||
                    (videoMode === "url" ? !videoUrl.trim() : !videoFile)
                  }
                >
                  {isAddingVideo ? "Adicionando..." : "Adicionar Vídeo"}
                </ButtonComponent>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        isDark={isDark}
        {...dialogConfig}
      />
    </div>
  );
}
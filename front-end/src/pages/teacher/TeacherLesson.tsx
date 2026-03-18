/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  Plus,
  Edit2,
  Trash2,
  PlayCircle,
  Clock,
  ArrowLeft,
  Link as LinkIcon,
  FileVideo,
  Download,
  Globe,
  Play,
  FileText,
  ExternalLink,
  Calendar,
  Upload,
  ChevronDown,
  ChevronUp,
  DownloadIcon,
  NotebookText,
  ClipboardList,
  BarChart3,
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
import { AttachmentTeacherApi } from "../../api/attachmentTeacher.api";
import type { AttachmentDTO } from "../../types/AttachmentDTO";
import { ExerciseTeacherApi } from "../../api/exerciseTeacher.api";

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

  // NOVO: Estado para controlar quais aulas estão expandidas
  const [expandedLessons, setExpandedLessons] = useState<Set<number>>(
    new Set(),
  );

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

  // Modal de Anexo
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [attachmentMode, setAttachmentMode] = useState<"url" | "upload">(
    "upload",
  );
  const [attachmentTitle, setAttachmentTitle] = useState("");
  const [attachmentDescription, setAttachmentDescription] = useState("");
  const [attachmentFileUrl, setAttachmentFileUrl] = useState("");
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [attachmentDeliveryDate, setAttachmentDeliveryDate] = useState("");
  const [isAddingAttachment, setIsAddingAttachment] = useState(false);

  const openAttachmentModal = (lesson: LessonDTO) => {
    setSelectedLesson(lesson);
    setShowAttachmentModal(true);
    setAttachmentMode("upload");
    setAttachmentTitle("");
    setAttachmentDescription("");
    setAttachmentFileUrl("");
    setAttachmentFile(null);
    setAttachmentDeliveryDate("");
  };

  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  // Alternar expansão de aula
  const toggleLessonExpansion = (lessonId: number | undefined) => {
    if (!lessonId) return;

    setExpandedLessons((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(lessonId)) {
        newSet.delete(lessonId);
      } else {
        newSet.add(lessonId);
      }
      return newSet;
    });
  };

  // Verificar se aula está expandida
  const isLessonExpanded = (lessonId: number | undefined): boolean => {
    return lessonId ? expandedLessons.has(lessonId) : false;
  };

  useEffect(() => {
    if (!moduleId) return;

    const abortController = new AbortController();
    loadModuleData(abortController.signal);

    // Cleanup: cancela requisições ao desmontar
    return () => {
      abortController.abort();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleId]);

  const loadModuleData = async (signal?: AbortSignal) => {
    if (!moduleId) return;

    try {
      setIsLoadingModule(true);

      const [moduleResponse, lessonsResponse] = await Promise.all([
        ModuleTeacherApi.getById(Number(moduleId), { signal }),
        LessonTeacherApi.listByModule(Number(moduleId), { signal }),
      ]);

      // Verificar se foi cancelado
      if (signal?.aborted) return;

      setModule(moduleResponse.data);

      const lessonsWithContent = await Promise.all(
        lessonsResponse.data.map(async (lesson) => {
          if (lesson.id) {
            try {
              const [videosResponse, attachmentsResponse, exercisesResponse] =
                await Promise.all([
                  VideoTeacherApi.listVideos(lesson.id),
                  AttachmentTeacherApi.listByLesson(lesson.id),
                  ExerciseTeacherApi.listByLesson(lesson.id),
                ]);
              return {
                ...lesson,
                videos: videosResponse.data,
                attachments: attachmentsResponse.data,
                exercises: exercisesResponse.data,
              };
            } catch (error: any) {
              // Ignorar erros de cancelamento
              if (
                error.name === "CanceledError" ||
                error.name === "AbortError"
              ) {
                return lesson;
              }
              console.error(
                `Erro ao carregar conteúdo da aula ${lesson.id}:`,
                error,
              );
              return {
                ...lesson,
                videos: [],
                attachments: [],
                exercises: [],
              };
            }
          }
          return lesson;
        }),
      );

      // Verificar novamente antes de atualizar state
      if (signal?.aborted) return;

      setLessons(lessonsWithContent || []);
    } catch (error: any) {
      // Não mostrar erro se foi cancelado
      if (error.name === "CanceledError" || error.name === "AbortError") {
        console.log(
          "Requisições canceladas - componente desmontado ou moduleId mudou",
        );
        return;
      }
      console.error("Erro ao carregar dados:", error);
      showNotification("error", "Erro ao carregar informações do módulo");
    } finally {
      setIsLoadingModule(false);
    }
  };

  const showNotification = (
    type: "success" | "error" | "info",
    message: string,
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

    if (lessonDuration > 6000) {
      showNotification(
        "error",
        " Não é permitido um curso com mais de 100 horas",
      );
      return;
    }

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
    } catch (error: any) {
      console.error("Erro ao criar aula:", error);
      showNotification(
        "error",
        error.response?.data?.message || "Erro ao criar aula",
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
      if (file.size > 900 * 1024 * 1024) {
        showNotification("error", "Arquivo muito grande. Máximo: 900MB");
        return;
      }

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

  const handleAttachmentFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        showNotification("error", "Arquivo muito grande. Máximo: 50MB");
        return;
      }

      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/plain",
        "image/jpeg",
        "image/png",
        "image/jpg",
      ];

      if (!allowedTypes.includes(file.type)) {
        showNotification(
          "error",
          "Tipo de arquivo não permitido. Use PDF, DOC, PPTX, XLS, TXT ou imagens",
        );
        return;
      }

      setAttachmentFile(file);
      if (!attachmentTitle.trim()) {
        setAttachmentTitle(file.name.replace(/\.[^/.]+$/, ""));
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
          videoFile,
        );
      } else {
        if (!videoUrl.trim()) {
          showNotification("error", "URL do vídeo é obrigatória");
          return;
        }

        await VideoTeacherApi.addVideoUrl(
          selectedLesson.id,
          videoTitle.trim(),
          videoUrl.trim(),
        );
      }

      await loadModuleData();

      setShowVideoModal(false);
      setVideoTitle("");
      setVideoUrl("");
      setVideoFile(null);
      showNotification("success", "Vídeo adicionado com sucesso!");
    } catch (error: any) {
      console.error("Erro ao adicionar vídeo:", error);
      showNotification(
        "error",
        error.response?.data?.message || "Erro ao adicionar vídeo",
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

  const addAttachment = async () => {
    if (!attachmentTitle.trim()) {
      showNotification("error", "Título do anexo é obrigatório");
      return;
    }

    if (!attachmentDescription.trim()) {
      showNotification("error", "Descrição do anexo é obrigatória");
      return;
    }

    if (!selectedLesson?.id) return;

    try {
      setIsAddingAttachment(true);

      if (attachmentMode === "upload") {
        if (!attachmentFile) {
          showNotification("error", "Selecione um arquivo");
          return;
        }

        await AttachmentTeacherApi.uploadFile(
          selectedLesson.id,
          attachmentTitle.trim(),
          attachmentDescription.trim(),
          attachmentDeliveryDate,
          attachmentFile,
        );
      } else {
        if (!attachmentFileUrl.trim()) {
          showNotification("error", "URL do anexo é obrigatória");
          return;
        }

        const payload: AttachmentDTO = {
          title: attachmentTitle.trim(),
          description: attachmentDescription.trim(),
          fileUrl: attachmentFileUrl.trim(),
          deliveryDate: attachmentDeliveryDate
            ? new Date(attachmentDeliveryDate).toISOString()
            : undefined,
          lessonId: selectedLesson.id,
        };

        await AttachmentTeacherApi.createWithUrl(payload);
      }

      await loadModuleData();
      setShowAttachmentModal(false);
      showNotification("success", "Anexo adicionado com sucesso!");
    } catch (error: any) {
      console.error("Erro ao adicionar anexo:", error);
      showNotification(
        "error",
        error.response?.data?.message || "Erro ao adicionar anexo",
      );
    } finally {
      setIsAddingAttachment(false);
    }
  };

  const deleteAttachment = async (attachmentId: number) => {
    const confirmed = await confirm({
      title: "Confirmar exclusão",
      message: "Tem certeza que deseja excluir este anexo?",
      confirmText: "Sim, excluir",
      cancelText: "Cancelar",
      variant: "danger",
      isDark,
    });

    if (confirmed) {
      try {
        await AttachmentTeacherApi.remove(attachmentId);
        await loadModuleData();
        showNotification("success", "Anexo excluído com sucesso!");
      } catch (error) {
        console.error("Erro ao excluir anexo:", error);
        showNotification("error", "Erro ao excluir anexo");
      }
    }
  };

  const downloadAttachment = async (attachment: AttachmentDTO) => {
    if (!attachment.id) return;
    try {
      showNotification("info", "Iniciando download...");
      const fileName = attachment.fileName || attachment.title || "Arquivo";
      await AttachmentTeacherApi.downloadFile(attachment.id, fileName);
      showNotification("success", "Download concluído");
    } catch (error: any) {
      console.error("Erro ao baixar anexo:", error);
      showNotification("error", "Erro ao baixar anexo");
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Responsivo */}
      <Header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate(`/teacher/modules`)}
            className="flex items-center gap-2 hover:opacity-80 transition-colors mb-2"
            style={{ color: "var(--color-text-secondary)" }}
          >
            <ArrowLeft size={20} />
            <span className="text-sm">Voltar para Módulos</span>
          </button>
          <h1
            className="text-2xl font-bold wrap-break-word"
            style={{ color: "var(--color-text-primary)" }}
          >
            Aulas do Módulo
          </h1>
          <p
            className="text-sm line-clamp-2"
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
          className="lg:col-span-1 p-4 sm:p-6 rounded-2xl border h-fit"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="p-2 rounded-lg shrink-0"
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
                maxLength={100}
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
                maxLength={1000}
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
                max={6000}
                value={lessonDuration}
                onChange={(e) =>
                  setLessonDuration(
                    (e.target as HTMLInputElement).valueAsNumber || 0,
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
                  isCreating || !lessonTitle.trim() || !lessonDescription.trim()
                }
                className="w-full"
              >
                {isCreating ? "Criando..." : "Criar Aula"}
              </ButtonComponent>
            </div>
          </div>
        </div>

        {/* Lista de Aulas */}
        <div
          className="lg:col-span-2 p-4 sm:p-6 rounded-2xl border flex flex-col"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
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
            <div className="text-center py-12 flex-1 flex flex-col justify-center">
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
                Crie sua primeira aula ao lado
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {lessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  className="rounded-xl border hover:shadow-md transition-all"
                  style={{
                    backgroundColor: "var(--color-surface-secondary)",
                    borderColor: "var(--color-border)",
                  }}
                >
                  {/* Header*/}
                  <div
                    className="p-4 sm:p-5 cursor-pointer select-none"
                    onClick={() => toggleLessonExpansion(lesson.id)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        {" "}
                        {/* min-w-0 ajuda no truncamento do texto flex */}
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                          <span
                            className="flex items-center justify-center w-8 h-8 rounded-full text-white text-sm font-bold shrink-0"
                            style={{ backgroundColor: accentColor }}
                          >
                            {index + 1}
                          </span>
                          <h4
                            className="font-bold text-lg wrap-break-word"
                            style={{ color: "var(--color-text-primary)" }}
                          >
                            {lesson.title}
                          </h4>
                          {lesson.durationMinutes && (
                            <div
                              className="flex items-center gap-1 text-xs shrink-0"
                              style={{ color: "var(--color-text-secondary)" }}
                            >
                              <Clock size={14} />
                              <span>{lesson.durationMinutes} min</span>
                            </div>
                          )}
                        </div>
                        {/* Badges e Descrição em colunas no mobile */}
                        <div className="flex flex-col gap-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className="text-xs px-2 py-1 rounded-full shrink-0"
                              style={{
                                backgroundColor: `${accentColor}15`,
                                color: accentColor,
                              }}
                            >
                              {lesson.videos?.length || 0} Vídeos
                            </span>
                            <span
                              className="text-xs px-2 py-1 rounded-full shrink-0"
                              style={{
                                backgroundColor: `${accentColor}15`,
                                color: accentColor,
                              }}
                            >
                              {lesson.attachments?.length || 0} Anexos
                            </span>
                            <span
                              className="text-xs px-2 py-1 rounded-full shrink-0"
                              style={{
                                backgroundColor: `${accentColor}15`,
                                color: accentColor,
                              }}
                            >
                              {lesson.exercises?.length || 0} Exercícios
                            </span>
                          </div>
                          <p
                            className="text-sm line-clamp-2"
                            style={{ color: "var(--color-text-secondary)" }}
                          >
                            {lesson.description}
                          </p>
                        </div>
                      </div>

                      {/* Ícone de expandir/colapsar isolado no topo direito */}
                      <button
                        className="p-1 rounded-lg hover:bg-opacity-10 transition-all shrink-0 mt-1"
                        style={{
                          backgroundColor: `${accentColor}10`,
                          color: accentColor,
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLessonExpansion(lesson.id);
                        }}
                      >
                        {isLessonExpanded(lesson.id) ? (
                          <ChevronUp size={20} />
                        ) : (
                          <ChevronDown size={20} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Conteúdo Expansível */}
                  <div
                    className="overflow-hidden transition-all duration-300 ease-in-out"
                    style={{
                      maxHeight: isLessonExpanded(lesson.id) ? "3000px" : "0",
                      opacity: isLessonExpanded(lesson.id) ? 1 : 0,
                    }}
                  >
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5">
                      {/* Botões de Ação da Aula */}
                      <div
                        className="flex flex-wrap items-center gap-2 mb-4 pb-4 border-b"
                        style={{ borderColor: "var(--color-border)" }}
                      >
                        <Button
                          className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors"
                          style={{
                            backgroundColor: "var(--color-surface-hover)",
                            color: "var(--color-text-primary)",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(
                              `/teacher/courses/${courseId}/modules/${moduleId}/lessons/${lesson.id}/edit`,
                            );
                          }}
                        >
                          <Edit2 size={16} />
                          Editar Aula
                        </Button>

                        <Button
                          className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors"
                          style={{
                            backgroundColor: "var(--color-error-light)",
                            color: "var(--color-error)",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteLesson(lesson);
                          }}
                        >
                          <Trash2 size={16} />
                          Excluir Aula
                        </Button>
                      </div>

                      {/* SEÇÃO: Vídeos */}
                      <div className="mb-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
                          <h5
                            className="font-semibold text-sm flex items-center gap-2"
                            style={{ color: "var(--color-text-primary)" }}
                          >
                            <PlayCircle size={16} />
                            Vídeos ({lesson.videos?.length || 0})
                          </h5>
                          <Button
                            className="w-full sm:w-auto flex justify-center items-center gap-2 px-3 py-2 sm:py-1.5 text-sm sm:text-xs rounded-lg transition-colors"
                            style={{
                              backgroundColor: `${accentColor}15`,
                              color: accentColor,
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              openVideoModal(lesson);
                            }}
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
                                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-lg gap-3"
                                style={{
                                  backgroundColor: "var(--color-surface-hover)",
                                }}
                              >
                                <div className="flex items-center gap-3 w-full sm:w-auto flex-1 min-w-0">
                                  <div
                                    className="p-2 rounded-lg shrink-0"
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
                                  <div className="flex-1 min-w-0">
                                    <p
                                      className="text-sm font-medium truncate"
                                      style={{
                                        color: "var(--color-text-primary)",
                                      }}
                                    >
                                      {video.title}
                                    </p>
                                    {video.storageType === "URL" &&
                                      video.url && (
                                        <a
                                          href={video.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-xs flex items-center gap-1 hover:underline truncate"
                                          style={{ color: accentColor }}
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          <LinkIcon
                                            size={12}
                                            className="shrink-0"
                                          />
                                          <span className="truncate">
                                            {video.url}
                                          </span>
                                        </a>
                                      )}
                                    {video.storageType === "DATABASE" && (
                                      <span
                                        className="text-xs truncate block"
                                        style={{
                                          color: "var(--color-text-secondary)",
                                        }}
                                      >
                                        Arquivo no banco de dados
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 border-border pt-2 sm:pt-0">
                                  {video.storageType === "DATABASE" && (
                                    <>
                                      <Button
                                        className="flex-1 sm:flex-none flex justify-center p-2 rounded-lg transition-colors hover:opacity-80"
                                        style={{
                                          backgroundColor: `${accentColor}15`,
                                          color: accentColor,
                                        }}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          navigate(
                                            `/teacher/courses/${courseId}/modules/${moduleId}/lessons/${lesson.id}/videos/${video.id}/watch`,
                                          );
                                        }}
                                      >
                                        <Play size={16} />
                                      </Button>
                                      <Button
                                        className="flex-1 sm:flex-none flex justify-center p-2 rounded-lg transition-colors hover:opacity-80"
                                        style={{
                                          backgroundColor: `${accentColor}15`,
                                          color: accentColor,
                                        }}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          downloadVideo(video);
                                        }}
                                      >
                                        <Download size={16} />
                                      </Button>
                                    </>
                                  )}
                                  <Button
                                    className="flex-1 sm:flex-none flex justify-center p-2 rounded-lg transition-colors"
                                    style={{
                                      backgroundColor:
                                        "var(--color-error-light)",
                                      color: "var(--color-error)",
                                    }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                                      video.id && deleteVideo(video.id);
                                    }}
                                  >
                                    <Trash2 size={16} />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p
                            className="text-xs text-center py-4 bg-surface-hover rounded-lg"
                            style={{ color: "var(--color-text-secondary)" }}
                          >
                            Nenhum vídeo adicionado
                          </p>
                        )}
                      </div>

                      {/* Anexos */}
                      <div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
                          <h5
                            className="font-semibold text-sm flex items-center gap-2"
                            style={{ color: "var(--color-text-primary)" }}
                          >
                            <FileText size={16} />
                            Anexos ({lesson.attachments?.length || 0})
                          </h5>
                          <Button
                            className="w-full sm:w-auto flex justify-center items-center gap-2 px-3 py-2 sm:py-1.5 text-sm sm:text-xs rounded-lg transition-colors"
                            style={{
                              backgroundColor: `${accentColor}15`,
                              color: accentColor,
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              openAttachmentModal(lesson);
                            }}
                          >
                            <Plus size={14} />
                            Adicionar Anexo
                          </Button>
                        </div>

                        {lesson.attachments && lesson.attachments.length > 0 ? (
                          <div className="space-y-2">
                            {lesson.attachments.map((attachment) => (
                              <div
                                key={attachment.id}
                                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-lg gap-3"
                                style={{
                                  backgroundColor: "var(--color-surface-hover)",
                                }}
                              >
                                <div className="flex items-start sm:items-center gap-3 w-full sm:w-auto flex-1 min-w-0">
                                  <div
                                    className="p-2 rounded-lg shrink-0"
                                    style={{
                                      backgroundColor: `${accentColor}15`,
                                      color: accentColor,
                                    }}
                                  >
                                    {attachment.type === "LINK" ? (
                                      <FileText size={16} />
                                    ) : (
                                      <NotebookText size={16} />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p
                                      className="text-sm font-medium truncate"
                                      style={{
                                        color: "var(--color-text-primary)",
                                      }}
                                    >
                                      {attachment.title}
                                    </p>
                                    <p
                                      className="text-xs line-clamp-2 sm:line-clamp-1"
                                      style={{
                                        color: "var(--color-text-secondary)",
                                      }}
                                    >
                                      {attachment.description}
                                    </p>
                                    {attachment.deliveryDate && (
                                      <div
                                        className="flex items-center gap-1 text-xs mt-1"
                                        style={{
                                          color: "var(--color-text-secondary)",
                                        }}
                                      >
                                        <Calendar
                                          size={12}
                                          className="shrink-0"
                                        />
                                        <span className="truncate">
                                          Entrega:{" "}
                                          {new Date(
                                            attachment.deliveryDate,
                                          ).toLocaleDateString("pt-BR")}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 border-border pt-2 sm:pt-0">
                                  {attachment.type === "LINK" ? (
                                    <a
                                      href={attachment.fileUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex-1 sm:flex-none flex justify-center p-2 rounded-lg transition-colors hover:opacity-80"
                                      style={{
                                        backgroundColor: `${accentColor}15`,
                                        color: accentColor,
                                      }}
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <ExternalLink size={16} />
                                    </a>
                                  ) : (
                                    <button
                                      className="flex-1 sm:flex-none flex justify-center p-2 rounded-lg transition-colors hover:opacity-80"
                                      style={{
                                        backgroundColor: `${accentColor}15`,
                                        color: accentColor,
                                      }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        downloadAttachment(attachment);
                                      }}
                                    >
                                      <DownloadIcon size={16} />
                                    </button>
                                  )}
                                  <Button
                                    className="flex-1 sm:flex-none flex justify-center p-2 rounded-lg transition-colors"
                                    style={{
                                      backgroundColor:
                                        "var(--color-error-light)",
                                      color: "var(--color-error)",
                                    }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                                      attachment.id &&
                                        deleteAttachment(attachment.id);
                                    }}
                                  >
                                    <Trash2 size={16} />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p
                            className="text-xs text-center py-4 bg-surface-hover rounded-lg"
                            style={{ color: "var(--color-text-secondary)" }}
                          >
                            Nenhum anexo adicionado
                          </p>
                        )}
                      </div>
                      {/* SEÇÃO: Atividades / Exercícios */}
                      <div className="mt-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
                          <h5
                            className="font-semibold text-sm flex items-center gap-2"
                            style={{ color: "var(--color-text-primary)" }}
                          >
                            <ClipboardList size={16} />
                            Exercícios ({lesson.exercises?.length || 0})
                          </h5>
                          <Button
                            className="w-full sm:w-auto flex justify-center items-center gap-2 px-3 py-2 sm:py-1.5 text-sm sm:text-xs rounded-lg transition-colors"
                            style={{
                              backgroundColor: `${accentColor}15`,
                              color: accentColor,
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(
                                `/teacher/courses/${courseId}/modules/${moduleId}/lessons/${lesson.id}/exercises`,
                              );
                            }}
                          >
                            <Plus size={14} />
                            Gerenciar Exercícios
                          </Button>
                        </div>

                        {lesson.exercises && lesson.exercises.length > 0 ? (
                          <div className="space-y-2">
                            {lesson.exercises.map((exercise) => (
                              <div
                                key={exercise.id}
                                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-lg gap-3"
                                style={{
                                  backgroundColor: "var(--color-surface-hover)",
                                }}
                              >
                                <div className="flex items-center gap-3 w-full sm:w-auto flex-1 min-w-0">
                                  <div
                                    className="p-2 rounded-lg shrink-0"
                                    style={{
                                      backgroundColor: `${accentColor}15`,
                                      color: accentColor,
                                    }}
                                  >
                                    <ClipboardList size={16} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p
                                      className="text-sm font-medium truncate"
                                      style={{
                                        color: "var(--color-text-primary)",
                                      }}
                                    >
                                      {exercise.title}
                                    </p>
                                    <div
                                      className="flex items-center gap-2 text-xs"
                                      style={{
                                        color: "var(--color-text-secondary)",
                                      }}
                                    >
                                      <span>
                                        {exercise.questionsCount || 0} questões
                                      </span>
                                      <span>•</span>
                                      <span>{exercise.totalPoints} pontos</span>
                                      {exercise.statistics && (
                                        <>
                                          <span>•</span>
                                          <span>
                                            {exercise.statistics.totalAttempts}{" "}
                                            tentativas
                                          </span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 border-border pt-2 sm:pt-0">
                                  <Button
                                    className="flex-1 sm:flex-none flex justify-center items-center gap-1 px-3 py-2 rounded-lg transition-colors text-xs"
                                    style={{
                                      backgroundColor: `${accentColor}15`,
                                      color: accentColor,
                                    }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigate(
                                        `/teacher/courses/${courseId}/modules/${moduleId}/lessons/${lesson.id}/exercises/${exercise.id}/stats`,
                                      );
                                    }}
                                  >
                                    <BarChart3 size={14} />
                                    Stats
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p
                            className="text-xs text-center py-4 bg-surface-hover rounded-lg"
                            style={{ color: "var(--color-text-secondary)" }}
                          >
                            Nenhum exercício criado
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modal de Vídeo */}
      {showVideoModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          onClick={() => setShowVideoModal(false)}
        >
          <div
            className="w-full max-w-md p-4 sm:p-6 rounded-2xl border max-h-[90vh] overflow-y-auto"
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

            <div className="flex flex-col sm:flex-row gap-2 mb-4">
              <Button
                className="flex-1 px-4 py-2 flex justify-center items-center rounded-lg transition-all font-semibold"
                style={{
                  backgroundColor:
                    videoMode === "url"
                      ? accentColor
                      : "var(--color-surface-hover)",
                  color:
                    videoMode === "url"
                      ? "white"
                      : "var(--color-text-secondary)",
                }}
                onClick={() => setVideoMode("url")}
              >
                <Globe size={16} className="mr-2" />
                Link URL
              </Button>
              <Button
                className="flex-1 px-4 py-2 flex justify-center items-center rounded-lg transition-all font-semibold"
                style={{
                  backgroundColor:
                    videoMode === "upload"
                      ? accentColor
                      : "var(--color-surface-hover)",
                  color:
                    videoMode === "upload"
                      ? "white"
                      : "var(--color-text-secondary)",
                }}
                onClick={() => setVideoMode("upload")}
              >
                <Upload size={16} className="mr-2" />
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
                    Arquivo de Vídeo * (Máx: 900MB)
                  </Label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    disabled={isAddingVideo}
                    className="w-full px-4 py-2 rounded-lg border file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold hover:file:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    style={{
                      backgroundColor: "var(--color-surface-secondary)",
                      borderColor: "var(--color-border)",
                      color: "var(--color-text-primary)",
                    }}
                  />
                  {videoFile && (
                    <p
                      className="text-xs mt-1 truncate"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      Arquivo: {videoFile.name} (
                      {(videoFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </div>
              )}

              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
                <div className="flex-1">
                  <ButtonComponent
                    onClick={() => setShowVideoModal(false)}
                    isDisabled={isAddingVideo}
                    variant="secondary"
                    className="w-full"
                  >
                    Cancelar
                  </ButtonComponent>
                </div>
                <div className="flex-1">
                  <ButtonComponent
                    onClick={addVideo}
                    isDisabled={
                      isAddingVideo ||
                      !videoTitle.trim() ||
                      (videoMode === "url" ? !videoUrl.trim() : !videoFile)
                    }
                    className="w-full"
                  >
                    {isAddingVideo ? "Adicionando..." : "Adicionar Vídeo"}
                  </ButtonComponent>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Anexo */}
      {showAttachmentModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          onClick={() => setShowAttachmentModal(false)}
        >
          <div
            className="w-full max-w-md p-4 sm:p-6 rounded-2xl border max-h-[90vh] overflow-y-auto"
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
              Adicionar Anexo
            </h3>

            <div className="flex flex-col sm:flex-row gap-2 mb-4">
              <Button
                className="flex-1 px-4 py-2 flex justify-center items-center rounded-lg transition-all font-semibold"
                style={{
                  backgroundColor:
                    attachmentMode === "upload"
                      ? accentColor
                      : "var(--color-surface-hover)",
                  color:
                    attachmentMode === "upload"
                      ? "white"
                      : "var(--color-text-secondary)",
                }}
                onClick={() => setAttachmentMode("upload")}
              >
                <Upload size={16} className="mr-2" />
                Upload Arquivo
              </Button>
              <Button
                className="flex-1 px-4 py-2 flex justify-center items-center rounded-lg transition-all font-semibold"
                style={{
                  backgroundColor:
                    attachmentMode === "url"
                      ? accentColor
                      : "var(--color-surface-hover)",
                  color:
                    attachmentMode === "url"
                      ? "white"
                      : "var(--color-text-secondary)",
                }}
                onClick={() => setAttachmentMode("url")}
              >
                <Globe size={16} className="mr-2" />
                Link URL
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Título do Anexo *
                </Label>
                <InputComponent
                  value={attachmentTitle}
                  onChange={(e) =>
                    setAttachmentTitle((e.target as HTMLInputElement).value)
                  }
                  placeholder="Ex: Material Complementar - Parte 1"
                  disabled={isAddingAttachment}
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
                  value={attachmentDescription}
                  onChange={(e) => setAttachmentDescription(e.target.value)}
                  placeholder="Descreva o conteúdo deste anexo..."
                  disabled={isAddingAttachment}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: "var(--color-surface-secondary)",
                    borderColor: "var(--color-border)",
                    color: "var(--color-text-primary)",
                  }}
                />
              </div>

              {attachmentMode === "upload" ? (
                <div>
                  <Label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    Arquivo * (Máx: 50MB)
                  </Label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.jpg,.jpeg,.png"
                    onChange={handleAttachmentFileChange}
                    disabled={isAddingAttachment}
                    className="w-full px-4 py-2 rounded-lg border file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold hover:file:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    style={{
                      backgroundColor: "var(--color-surface-secondary)",
                      borderColor: "var(--color-border)",
                      color: "var(--color-text-primary)",
                    }}
                  />
                  {attachmentFile && (
                    <p
                      className="text-xs mt-1 truncate"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      Arquivo: {attachmentFile.name} (
                      {(attachmentFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                  <p
                    className="text-xs mt-1"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    Formatos aceitos: PDF, DOC, PPTX, XLS, TXT, JPG, PNG
                  </p>
                </div>
              ) : (
                <div>
                  <Label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    URL do Arquivo *
                  </Label>
                  <InputComponent
                    value={attachmentFileUrl}
                    onChange={(e) =>
                      setAttachmentFileUrl((e.target as HTMLInputElement).value)
                    }
                    placeholder="https://drive.google.com/file/..."
                    disabled={isAddingAttachment}
                  />
                  <p
                    className="text-xs mt-1"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    Cole o link do Google Drive, Dropbox, etc.
                  </p>
                </div>
              )}

              <div>
                <Label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Data de Entrega (Opcional)
                </Label>
                <InputComponent
                  type="datetime-local"
                  value={attachmentDeliveryDate}
                  onChange={(e) =>
                    setAttachmentDeliveryDate(
                      (e.target as HTMLInputElement).value,
                    )
                  }
                  disabled={isAddingAttachment}
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
                <div className="flex-1">
                  <ButtonComponent
                    onClick={() => setShowAttachmentModal(false)}
                    isDisabled={isAddingAttachment}
                    variant="secondary"
                    className="w-full"
                  >
                    Cancelar
                  </ButtonComponent>
                </div>
                <div className="flex-1">
                  <ButtonComponent
                    onClick={addAttachment}
                    isDisabled={
                      isAddingAttachment ||
                      !attachmentTitle.trim() ||
                      !attachmentDescription.trim() ||
                      (attachmentMode === "url"
                        ? !attachmentFileUrl.trim()
                        : !attachmentFile)
                    }
                    className="w-full"
                  >
                    {isAddingAttachment ? "Adicionando..." : "Adicionar Anexo"}
                  </ButtonComponent>
                </div>
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

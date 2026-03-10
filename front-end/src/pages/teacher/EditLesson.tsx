import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  Loader2,
  Save,
  X,
  BookOpen,
  Clock,
  AlertCircle,
  CheckCircle2,
  LucideAlertOctagon,
} from "lucide-react";
import { InputComponent } from "../../components/ui/InputComponent";
import { NotificationComponent } from "../../components/ui/NotificationComponent";
import { LessonTeacherApi } from "../../api/lessonTeacher.api";
import type { LessonDTO } from "../../types/LessonDTO";
import { useTheme } from "../../context/ThemeContext";
import { Button, Label, TextArea } from "react-aria-components";

export function EditLesson() {
  const { lessonId, courseId, moduleId } = useParams<{
    lessonId: string;
    courseId: string;
    moduleId: string;
  }>();
  const { accentColor, isDark } = useTheme();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState<LessonDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [durationMinutes, setDurationMinutes] = useState<number>(0);

  // Validation
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
  }>({});
  const [hasChanges, setHasChanges] = useState(false);

  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  useEffect(() => {
    loadLesson();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

  useEffect(() => {
    if (lesson) {
      const changed =
        title !== lesson.title ||
        description !== lesson.description ||
        durationMinutes !== (lesson.durationMinutes || 0);
      setHasChanges(changed);
    }
  }, [title, description, durationMinutes, lesson]);

  const loadLesson = async () => {
    if (!lessonId) return;

    try {
      setIsLoading(true);
      const response = await LessonTeacherApi.getById(Number(lessonId));
      const lessonData = response.data;

      setLesson(lessonData);
      setTitle(lessonData.title);
      setDescription(lessonData.description);
      setDurationMinutes(lessonData.durationMinutes || 0);
    } catch (error) {
      console.error("Erro ao carregar aula:", error);
      setNotification({
        type: "error",
        message: "Erro ao carregar informações da aula",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const validate = (): boolean => {
    const newErrors: { title?: string; description?: string } = {};

    if (!title.trim()) {
      newErrors.title = "O título é obrigatório";
    } else if (title.trim().length < 3) {
      newErrors.title = "O título deve ter pelo menos 3 caracteres";
    }

    if (!description.trim()) {
      newErrors.description = "A descrição é obrigatória";
    } else if (description.trim().length < 10) {
      newErrors.description = "A descrição deve ter pelo menos 10 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      setNotification({
        type: "error",
        message: "Por favor, corrija os erros antes de salvar",
      });
      return;
    }

    if (!lessonId || !lesson) return;

    try {
      setIsSaving(true);

      const updatedLesson: LessonDTO = {
        ...lesson,
        title: title.trim(),
        description: description.trim(),
        durationMinutes: durationMinutes || undefined,
      };

      await LessonTeacherApi.update(Number(lessonId), updatedLesson);

      setNotification({
        type: "success",
        message: "✅ Aula atualizada com sucesso!",
      });

      setHasChanges(false);

      // Aguardar um pouco antes de redirecionar
      setTimeout(() => {
        goBack();
      }, 1500);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Erro ao salvar aula:", error);
      setNotification({
        type: "error",
        message: error.response?.data?.message || "Erro ao salvar alterações",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      const confirm = window.confirm(
        "Você tem alterações não salvas. Deseja realmente sair?",
      );
      if (!confirm) return;
    }
    goBack();
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
          backgroundImage: `radial-gradient(circle at 20% 50%, ${accentColor}10 0%, transparent 50%)`,
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
            Carregando aula...
          </h2>
          <p
            className="text-sm"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Aguarde enquanto buscamos as informações
          </p>
        </div>
      </div>
    );
  }

  if (!lesson) {
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
            <AlertCircle size={40} style={{ color: "var(--color-error)" }} />
          </div>
          <h2
            className="text-2xl font-bold mb-3"
            style={{ color: "var(--color-text-primary)" }}
          >
            Aula não encontrada
          </h2>
          <p
            className="text-sm mb-6"
            style={{ color: "var(--color-text-secondary)" }}
          >
            A aula que você está tentando editar não existe ou foi removida.
          </p>
          <Button
            onClick={goBack}
            className="px-6 py-3 rounded-xl font-semibold transition-all hover:opacity-90"
            style={{
              backgroundColor: accentColor,
              color: "white",
            }}
          >
            <ArrowLeft size={18} className="inline mr-2" />
            Voltar para aulas
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen pb-8"
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

      {/* Header Sticky */}
      <div
        className="sticky top-0 z-10 backdrop-blur-md border-b"
        style={{
          backgroundColor: isDark ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.5)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={handleCancel}
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
            </Button>

            {hasChanges && (
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium"
                style={{
                  backgroundColor: `${accentColor}15`,
                  color: accentColor,
                }}
              >
                <div
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: accentColor }}
                />
                Alterações não salvas
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header com Ícone */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div
              className="p-4 rounded-2xl"
              style={{
                backgroundColor: `${accentColor}15`,
                boxShadow: `0 8px 24px ${accentColor}20`,
              }}
            >
              <BookOpen size={32} style={{ color: accentColor }} />
            </div>
            <div>
              <h1
                className="text-3xl font-bold mb-1"
                style={{ color: "var(--color-text-primary)" }}
              >
                Editar Aula
              </h1>
              <p
                className="text-sm"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Atualize as informações da aula
              </p>
            </div>
          </div>
        </div>

        {/* Grid Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulário */}
          <div className="lg:col-span-2 space-y-6">
            {/* Card de Informações Básicas */}
            <div
              className="p-6 rounded-2xl border"
              style={{
                backgroundColor: "var(--color-surface)",
                borderColor: "var(--color-border)",
              }}
            >
              <h2
                className="text-lg font-bold mb-6"
                style={{ color: "var(--color-text-primary)" }}
              >
                Informações Básicas
              </h2>

              <div className="space-y-5">
                {/* Título */}
                <div>
                  <Label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    Título da Aula *
                  </Label>
                  <InputComponent
                    value={title}
                    onChange={(e) =>
                      setTitle((e.target as HTMLInputElement).value)
                    }
                    placeholder="Ex: Introdução aos Hooks do React"
                    disabled={isSaving}
                  />
                  {errors.title && (
                    <div
                      className="flex items-center gap-2 mt-2 text-xs"
                      style={{ color: "var(--color-error)" }}
                    >
                      <AlertCircle size={14} />
                      <span>{errors.title}</span>
                    </div>
                  )}
                  <p
                    className="text-xs mt-1.5"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {title.length}/100 caracteres
                  </p>
                </div>

                {/* Descrição */}
                <div>
                  <Label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    Descrição *
                  </Label>
                  <TextArea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descreva o conteúdo que será abordado nesta aula..."
                    disabled={isSaving}
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 resize-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    style={{
                      backgroundColor: "var(--color-surface-secondary)",
                      borderColor: errors.description
                        ? "var(--color-error)"
                        : "var(--color-border)",
                      color: "var(--color-text-primary)",
                    }}
                  />
                  {errors.description && (
                    <div
                      className="flex items-center gap-2 mt-2 text-xs"
                      style={{ color: "var(--color-error)" }}
                    >
                      <AlertCircle size={14} />
                      <span>{errors.description}</span>
                    </div>
                  )}
                  <p
                    className="text-xs mt-1.5"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {description.length}/500 caracteres
                  </p>
                </div>

                {/* Duração */}
                <div>
                  <Label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    Duração estimada (minutos)
                  </Label>
                  <div className="relative">
                    <Clock
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ color: "var(--color-text-secondary)" }}
                    />
                    <InputComponent
                      type="number"
                      min={0}
                      max={999}
                      value={durationMinutes}
                      onChange={(e) =>
                        setDurationMinutes(
                          (e.target as HTMLInputElement).valueAsNumber || 0,
                        )
                      }
                      placeholder="0"
                      disabled={isSaving}
                      className="pl-12"
                    />
                  </div>
                  <p
                    className="text-xs mt-1.5"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    Opcional - ajuda os alunos a planejarem seu tempo
                  </p>
                </div>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex items-center gap-4">
              <Button
                onClick={handleSave}
                isDisabled={isSaving || !hasChanges}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
                style={{
                  backgroundColor: hasChanges
                    ? accentColor
                    : "var(--color-surface-secondary)",
                  color: hasChanges ? "white" : "var(--color-text-secondary)",
                }}
              >
                {isSaving ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Salvar Alterações
                  </>
                )}
              </Button>

              <Button
                onClick={handleCancel}
                isDisabled={isSaving}
                className="px-6 py-4 rounded-xl font-semibold transition-all hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: "var(--color-surface-secondary)",
                  color: "var(--color-text-primary)",
                }}
              >
                <X size={20} className="inline mr-2" />
                Cancelar
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Preview */}
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
                Prévia
              </h3>

              <div className="space-y-3">
                <div>
                  <p
                    className="text-xs mb-1"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    Título
                  </p>
                  <p
                    className="font-bold text-sm line-clamp-2"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {title || "Sem título"}
                  </p>
                </div>

                <div>
                  <p
                    className="text-xs mb-1"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    Descrição
                  </p>
                  <p
                    className="text-sm line-clamp-3"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {description || "Sem descrição"}
                  </p>
                </div>

                {durationMinutes > 0 && (
                  <div className="flex items-center gap-2 pt-2">
                    <Clock size={14} style={{ color: accentColor }} />
                    <span
                      className="text-xs font-medium"
                      style={{ color: accentColor }}
                    >
                      {durationMinutes} min
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Status */}
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
                Status
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className="text-sm"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    Título preenchido
                  </span>
                  {title.trim() ? (
                    <CheckCircle2 size={18} style={{ color: accentColor }} />
                  ) : (
                    <AlertCircle
                      size={18}
                      style={{ color: "var(--color-error)" }}
                    />
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span
                    className="text-sm"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    Descrição preenchida
                  </span>
                  {description.trim() ? (
                    <CheckCircle2 size={18} style={{ color: accentColor }} />
                  ) : (
                    <AlertCircle
                      size={18}
                      style={{ color: "var(--color-error)" }}
                    />
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span
                    className="text-sm"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    Alterações pendentes
                  </span>
                  {hasChanges ? (
                    <div
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{ backgroundColor: accentColor }}
                    />
                  ) : (
                    <CheckCircle2
                      size={18}
                      style={{ color: "var(--color-text-secondary)" }}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Dicas */}
            <div
              className="p-6 rounded-2xl border"
              style={{
                backgroundColor: `${accentColor}10`,
                borderColor: `${accentColor}40`,
              }}
            >
              <h3
                className="font-bold text-sm mb-3"
                style={{ color: accentColor }}
              >
                <div className="flex text-">
                  <LucideAlertOctagon size={16} />
                  Dicas
                </div>
              </h3>
              <ul
                className="space-y-2 text-xs"
                style={{ color: "var(--color-text-primary)" }}
              >
                <li>• Use títulos claros e descritivos</li>
                <li>• Descreva os objetivos de aprendizado</li>
                <li>• Indique pré-requisitos se necessário</li>
                <li>• Estime a duração com precisão</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

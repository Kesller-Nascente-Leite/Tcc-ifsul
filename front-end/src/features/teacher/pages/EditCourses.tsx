import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Save, ArrowLeft, CheckCircle, XCircle, BookOpen } from "lucide-react";
import { ButtonComponent } from "@/shared/components/ui/ButtonComponent";
import { InputComponent } from "@/shared/components/ui/InputComponent";
import { CourseTeacherApi } from "@/features/teacher/api/courseTeacher.api";
import { useTheme } from "@/app/providers/ThemeContext";
import { useCourseAuthorization } from "@/app/hooks/useCourseAuthorization";

type CourseItem = {
  id?: number | null;
  title: string;
  description: string;
  published: boolean;
  teacherId: number;
  teacherName: string;
};

export function EditCourses() {
  const { accentColor } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // parametro da url
  const { validateCourseOwner, isLoading: isAuthLoading } =
    useCourseAuthorization();

  const [course, setCourse] = useState<CourseItem | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    if (isAuthLoading) return;

    if (id) {
      loadCourse(Number(id));
    } else {
      navigate("/teacher/course");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, navigate, isAuthLoading]);

  const loadCourse = async (courseId: number) => {
    try {
      setIsLoading(true);
      const response = await CourseTeacherApi.getById(courseId);
      const loadedCourse = response.data;

      if (!validateCourseOwner) {
        showNotification("error", "Erro ao validar autorização");
        setTimeout(() => navigate("/teacher/course"), 2000);
        return;
      }

      const authorization = validateCourseOwner(loadedCourse);
      if (!authorization.isAuthorized) {
        showNotification(
          "error",
          authorization.reason ||
            "Você não tem permissão para editar este curso",
        );
        setTimeout(() => navigate("/teacher/course"), 2000);
        return;
      }

      setCourse(loadedCourse);
      setTitle(loadedCourse.title);
      setDescription(loadedCourse.description);
    } catch (error) {
      console.error("Erro ao carregar curso:", error);
      const errorResponse = (error as { response?: { status: number } })
        .response;
      if (errorResponse?.status === 403 || errorResponse?.status === 401) {
        showNotification(
          "error",
          "Você não tem permissão para editar este curso",
        );
      } else {
        showNotification("error", "Erro ao carregar dados do curso");
      }
      setTimeout(() => navigate("/teacher/course"), 2000);
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const updateCourse = async () => {
    if (!title.trim() || !description.trim()) {
      showNotification("error", "Título e descrição são obrigatórios");
      return;
    }

    if (!course || !id) return;

    const updatedPayload: CourseItem = {
      ...course,
      title: title.trim(),
      description: description.trim(),
    };

    try {
      setIsSaving(true);
      await CourseTeacherApi.update(Number(id), updatedPayload);
      showNotification("success", "Curso atualizado com sucesso!");
      setTimeout(() => navigate("/teacher/course"), 1500);
    } catch (error) {
      console.error("Erro ao atualizar curso:", error);
      const errorResponse = (
        error as { response?: { data?: { message?: string } } }
      ).response;
      showNotification(
        "error",
        errorResponse?.data?.message || "Erro ao atualizar curso",
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3 text-text-secondary">
          <div
            className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"
            style={{ borderColor: accentColor }}
          />
          <span>Carregando dados do curso...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/teacher/course")}
            className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-text-secondary"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">
              Editar Curso
            </h1>
            <p className="text-sm text-text-secondary">
              Atualize as informações do seu curso
            </p>
          </div>
        </div>
      </header>

      {notification && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-3 ${
            notification.type === "success"
              ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
              : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle size={20} className="text-green-600" />
          ) : (
            <XCircle size={20} className="text-red-600" />
          )}
          <p className="text-sm font-medium">{notification.message}</p>
        </div>
      )}

      <section className="p-6 rounded-2xl border bg-surface border-border">
        <div className="flex items-center gap-3 mb-6">
          <div
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${accentColor}15` }}
          >
            <BookOpen size={20} style={{ color: accentColor }} />
          </div>
          <h3 className="font-bold text-lg">Informações do Curso</h3>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Título do Curso *
            </label>
            <InputComponent
              value={title}
              onChange={(e) => setTitle((e.target as HTMLInputElement).value)}
              disabled={isSaving}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Descrição *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSaving}
              rows={5}
              className="w-full px-4 py-3 rounded-lg border bg-background border-border text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <button
              onClick={() => navigate("/teacher/course")}
              className="px-4 py-2 text-sm text-text-secondary"
            >
              Cancelar
            </button>
            <ButtonComponent
              onClick={updateCourse}
              isDisabled={
                isSaving ||
                (title === course?.title && description === course?.description)
              }
            >
              <div className="flex items-center gap-2">
                <Save size={18} />
                {isSaving ? "Salvando..." : "Salvar Alterações"}
              </div>
            </ButtonComponent>
          </div>
        </div>
      </section>
    </div>
  );
}

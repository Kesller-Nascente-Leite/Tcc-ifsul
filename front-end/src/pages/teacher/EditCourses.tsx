import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Save, ArrowLeft, CheckCircle, XCircle, BookOpen } from "lucide-react";
import { ButtonComponent } from "../../components/ButtonComponent";
import { InputComponent } from "../../components/InputComponent";
import { CourseTeacherApi } from "../../api/courseTeacher.api";
import { useTheme } from "../../context/ThemeContext";

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
  const { id } = useParams<{ id: string }>(); // Pega o ID da URL

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
    if (id) {
      loadCourse(Number(id));
    } else {
      showNotification("error", "ID do curso não fornecido");
      navigate("/teacher/courses");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadCourse = async (courseId: number) => {
    try {
      setIsLoading(true);
      // Assumindo que você tem um método getById ou similar na sua API
      const response = await CourseTeacherApi.getById(courseId);
      const loadedCourse = response.data;

      setCourse(loadedCourse);
      setTitle(loadedCourse.title);
      setDescription(loadedCourse.description);
    } catch (error) {
      console.error("Erro ao carregar curso:", error);
      showNotification("error", "Erro ao carregar dados do curso");
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

      setTimeout(() => navigate("/teacher/create-course"), 1500);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Erro ao atualizar curso:", error);
      showNotification(
        "error",
        error.response?.data?.message || "Erro ao atualizar curso",
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
      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/teacher/courses")}
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

      {/* Notificação */}
      {notification && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-3 ${
            notification.type === "success"
              ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
              : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle
              size={20}
              className="text-green-600 dark:text-green-400"
            />
          ) : (
            <XCircle size={20} className="text-red-600 dark:text-red-400" />
          )}
          <p
            className={`text-sm font-medium ${
              notification.type === "success"
                ? "text-green-800 dark:text-green-200"
                : "text-red-800 dark:text-red-200"
            }`}
          >
            {notification.message}
          </p>
        </div>
      )}

      {/* Formulário de Edição */}
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
              placeholder="Ex: Programação Web com React"
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
              placeholder="Descreva o conteúdo e objetivos do curso..."
              disabled={isSaving}
              rows={5}
              className="w-full px-4 py-3 rounded-lg border bg-background border-border text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <button
              onClick={() => navigate("/teacher/courses")}
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-text-secondary"
            >
              Cancelar
            </button>
            <ButtonComponent
              onClick={updateCourse}
              disabled={
                isSaving ||
                !title.trim() ||
                !description.trim() ||
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

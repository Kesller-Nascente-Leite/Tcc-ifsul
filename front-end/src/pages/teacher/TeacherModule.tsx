import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Plus,
  Edit2,
  Trash2,
  BookOpen,
  List,
  CheckCircle,
  XCircle,
  Info,
} from "lucide-react";
import { ButtonComponent } from "../../components/ui/ButtonComponent";
import { InputComponent } from "../../components/ui/InputComponent";
import { CourseTeacherApi } from "../../api/courseTeacher.api";
import { ModuleTeacherApi } from "../../api/moduleTeacher.api";
import { useTheme } from "../../context/ThemeContext";

interface CourseDTO {
  id?: number | null;
  title: string;
  description: string;
  published: boolean;
  teacherId: number;
  teacherName: string;
}

interface ModuleItem {
  id?: number | null;
  title: string;
  description: string;
  orderIndex: number;
  courseId?: number;
}

export function TeacherModules() {
  const { accentColor } = useTheme();
  const navigate = useNavigate();

  const [courses, setCourses] = useState<CourseDTO[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<CourseDTO | null>(null);
  const [modules, setModules] = useState<ModuleItem[]>([]);

  const [moduleTitle, setModuleTitle] = useState("");
  const [moduleDescription, setModuleDescription] = useState("");

  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [isLoadingModules, setIsLoadingModules] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  // Carregar cursos do professor ao montar
  useEffect(() => {
    loadCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Carregar módulos quando um curso é selecionado
  useEffect(() => {
    if (selectedCourse) {
      loadModules(selectedCourse.id!);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCourse]);

  const loadCourses = async () => {
    try {
      setIsLoadingCourses(true);
      const response = await CourseTeacherApi.listAllTeacherCourses();
      setCourses(response.data || []);
    } catch (error) {
      console.error("Erro ao carregar cursos:", error);
      showNotification("error", "Erro ao carregar cursos");
    } finally {
      setIsLoadingCourses(false);
    }
  };

  const loadModules = async (courseId: number) => {
    try {
      setIsLoadingModules(true);
      const response = await ModuleTeacherApi.listByCourse(courseId);
      setModules(response.data || []);

      if (response.data.length === 0) {
        showNotification(
          "info",
          "Nenhum módulo encontrado. Crie o primeiro módulo!",
        );
      }
    } catch (error) {
      console.error("Erro ao carregar módulos:", error);
      showNotification("error", "Erro ao carregar módulos");
    } finally {
      setIsLoadingModules(false);
    }
  };

  const showNotification = (
    type: "success" | "error" | "info",
    message: string,
  ) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const createModule = async () => {
    if (!moduleTitle.trim()) {
      showNotification("error", "O título do módulo é obrigatório");
      return;
    }

    if (!selectedCourse) {
      showNotification("error", "Selecione um curso primeiro");
      return;
    }

    const payload: ModuleItem = {
      title: moduleTitle.trim(),
      description: moduleDescription.trim(),
      orderIndex: modules.length + 1,
      courseId: selectedCourse.id!,
    };

    // Melhor e mais pratico para fazer validações específicas do formulário, evitando muitos ifs aninhados
    const valideForm = () => {
      if (!moduleTitle.trim()) return "O título do módulo é obrigatório";
      if (moduleTitle.trim().length < 3)
        return "O título deve conter no mínimo 3 caracteres";
      if (moduleTitle.trim().length > 100)
        return "O título deve conter no máximo 100 caracteres";
      if (moduleDescription.trim().length > 255)
        return "A descrição deve conter no máximo 255 caracteres";
      return null;
    };

    const error = valideForm();
    if (error) return showNotification("error", error);

    try {
      setIsCreating(true);
      const response = await ModuleTeacherApi.create(payload);
      const created = response.data;

      setModules((prev) => [...prev, created]);
      setModuleTitle("");
      setModuleDescription("");
      showNotification("success", "Módulo criado com sucesso!");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Erro ao criar módulo:", error);
      showNotification(
        "error",
        error.response?.data?.message || "Erro ao criar módulo",
      );
    } finally {
      setIsCreating(false);
    }
  };

  const deleteModule = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este módulo?")) {
      return;
    }

    try {
      await ModuleTeacherApi.remove(id);
      setModules((prev) => prev.filter((m) => m.id !== id));
      showNotification("success", "Módulo excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir módulo:", error);
      showNotification("error", "Erro ao excluir módulo");
    }
  };

  // Função auxiliar para obter estilos da notificação
  const getNotificationStyles = () => {
    switch (notification?.type) {
      case "success":
        return {
          bg: "bg-green-50 dark:bg-green-900/20",
          border: "border-green-200 dark:border-green-800",
          text: "text-green-800 dark:text-green-200",
          icon: (
            <CheckCircle
              size={20}
              className="text-green-600 dark:text-green-400"
            />
          ),
        };
      case "error":
        return {
          bg: "bg-red-50 dark:bg-red-900/20",
          border: "border-red-200 dark:border-red-800",
          text: "text-red-800 dark:text-red-200",
          icon: (
            <XCircle size={20} className="text-red-600 dark:text-red-400" />
          ),
        };
      case "info":
        return {
          bg: "bg-blue-50 dark:bg-blue-900/20",
          border: "border-blue-200 dark:border-blue-800",
          text: "text-blue-800 dark:text-blue-200",
          icon: <Info size={20} className="text-blue-600 dark:text-blue-400" />,
        };
      default:
        return {
          bg: "",
          border: "",
          text: "",
          icon: null,
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            Módulos do Curso
          </h1>
          <p className="text-sm text-text-secondary">
            Organize o conteúdo do seu curso em módulos
          </p>
        </div>
        <ButtonComponent size="sm" onClick={() => navigate("/teacher/courses")}>
          Voltar para Cursos
        </ButtonComponent>
      </header>

      {/* Notificação */}
      {notification && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-3 ${getNotificationStyles().bg} ${getNotificationStyles().border}`}
        >
          {getNotificationStyles().icon}
          <p className={`text-sm font-medium ${getNotificationStyles().text}`}>
            {notification.message}
          </p>
        </div>
      )}

      {/* Seletor de Curso */}
      <section className="p-6 rounded-2xl border bg-surface border-border">
        <h3 className="font-bold text-lg mb-4">1. Selecione o Curso</h3>

        {isLoadingCourses ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-3 text-text-secondary">
              <div
                className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"
                style={{ borderColor: accentColor }}
              />
              <span>Carregando cursos...</span>
            </div>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen
              size={48}
              className="mx-auto mb-4 text-text-secondary opacity-50"
            />
            <p className="text-text-secondary mb-4">
              Você ainda não criou nenhum curso.
            </p>
            <ButtonComponent
              size="sm"
              onClick={() => navigate("/teacher/courses")}
            >
              Criar Primeiro Curso
            </ButtonComponent>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
              <button
                key={course.id}
                onClick={() => setSelectedCourse(course)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  selectedCourse?.id === course.id
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-border hover:border-primary/50 hover:shadow-md"
                }`}
              >
                <h4 className="font-bold text-text-primary mb-1">
                  {course.title}
                </h4>
                <p className="text-xs text-text-secondary line-clamp-2">
                  {course.description}
                </p>
                {selectedCourse?.id === course.id && (
                  <div className="flex items-center gap-1 mt-2">
                    <CheckCircle size={14} className="text-primary" />
                    <span className="text-xs font-medium text-primary">
                      Selecionado
                    </span>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Criar e Listar Módulos */}
      {selectedCourse && (
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulário de Criação */}
          <div className="lg:col-span-1 p-6 rounded-2xl border bg-surface border-border">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: `${accentColor}15` }}
              >
                <Plus size={20} style={{ color: accentColor }} />
              </div>
              <h3 className="font-bold text-lg">2. Novo Módulo</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Título do Módulo *
                </label>
                <InputComponent
                  value={moduleTitle}
                  onChange={(e) =>
                    setModuleTitle((e.target as HTMLInputElement).value)
                  }
                  placeholder="Ex: Introdução ao React"
                  disabled={isCreating}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Descrição
                </label>
                <textarea
                  value={moduleDescription}
                  onChange={(e) => setModuleDescription(e.target.value)}
                  placeholder="Descreva o conteúdo deste módulo..."
                  disabled={isCreating}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border bg-background border-border text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div className="pt-2">
                <ButtonComponent
                  onClick={createModule}
                  disabled={isCreating || !moduleTitle.trim()}
                >
                  {isCreating ? "Criando..." : "Criar Módulo"}
                </ButtonComponent>
              </div>
            </div>
          </div>

          {/* Lista de Módulos */}
          <div className="lg:col-span-2 p-6 rounded-2xl border bg-surface border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">3. Módulos do Curso</h3>
              <div className="text-sm text-text-secondary">
                {modules.length} módulo(s)
              </div>
            </div>

            {isLoadingModules ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-3 text-text-secondary">
                  <div
                    className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"
                    style={{ borderColor: accentColor }}
                  />
                  <span>Carregando módulos...</span>
                </div>
              </div>
            ) : modules.length === 0 ? (
              <div className="text-center py-12">
                <List
                  size={48}
                  className="mx-auto mb-4 text-text-secondary opacity-50"
                />
                <p className="text-text-secondary">
                  Nenhum módulo criado ainda.
                </p>
                <p className="text-sm text-text-secondary mt-2">
                  Crie seu primeiro módulo ao lado →
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {modules.map((module, index) => (
                  <div
                    key={module.id}
                    className="p-5 rounded-xl border bg-slate-50 dark:bg-slate-900/20 border-border hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold">
                            {index + 1}
                          </span>
                          <h4 className="font-bold text-lg text-text-primary">
                            {module.title}
                          </h4>
                        </div>
                        <p className="text-sm text-text-secondary">
                          {module.description || "Sem descrição"}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-text-primary"
                          onClick={() => {
                            /* TODO: Implementar edição */
                          }}
                        >
                          <Edit2 size={16} />
                          Editar
                        </button>

                        <button
                          className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                          onClick={() => module.id && deleteModule(module.id)}
                        >
                          <Trash2 size={16} />
                          Excluir
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

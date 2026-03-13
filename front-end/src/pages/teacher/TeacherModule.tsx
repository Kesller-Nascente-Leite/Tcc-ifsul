import { useEffect, useState} from 'react';
import { useNavigate } from "react-router";
import {
  Plus,
  Edit2,
  Trash2,
  BookOpen,
  List,
  CheckCircle,
  PlayCircle,
} from "lucide-react";
import { ButtonComponent } from "../../components/ui/ButtonComponent";
import { InputComponent } from "../../components/ui/InputComponent";
import { NotificationComponent } from "../../components/ui/NotificationComponent";
import {
  ConfirmDialog,
  useConfirmDialog,
} from "../../components/ui/ConfirmDialog";
import { CourseTeacherApi } from "../../api/courseTeacher.api";
import { ModuleTeacherApi } from "../../api/moduleTeacher.api";
import type { ModuleDTO } from "../../types/ModuleDTO";
import { useTheme } from "../../context/ThemeContext";
import { type CourseDTO } from "../../types/CourseDTO";
import { Button, Header, Label, TextArea } from "react-aria-components";

export function TeacherModules() {
  const { accentColor, isDark } = useTheme();
  const navigate = useNavigate();
  const { isOpen, setIsOpen, confirm, dialogConfig } = useConfirmDialog();

  const [courses, setCourses] = useState<CourseDTO[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<CourseDTO | null>(null);
  const [modules, setModules] = useState<ModuleDTO[]>([]);

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
    if (selectedCourse?.id) {
      loadModules(selectedCourse.id);
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
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

    const payload: ModuleDTO = {
      title: moduleTitle.trim(),
      description: moduleDescription.trim(),
      orderIndex: modules.length + 1,
      courseId: selectedCourse.id!,
    };

    const validateForm = () => {
      if (!moduleTitle.trim()) return "O título do módulo é obrigatório";
      if (moduleTitle.trim().length < 3)
        return "O título deve conter no mínimo 3 caracteres";
      if (moduleTitle.trim().length > 100)
        return "O título deve conter no máximo 100 caracteres";
      if (moduleDescription.trim().length > 500)
        return "A descrição deve conter no máximo 500 caracteres";
      if (moduleDescription.trim().length === 0)
        return "A descrição do módulo é obrigatória";
      if (moduleDescription.trim().length < 10)
        return "A descrição deve conter no mínimo 10 caracteres";
      return null;
    };

    const error = validateForm();
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

  const handleDeleteModule = async (module: ModuleDTO) => {
    const confirmed = await confirm({
      title: "Confirmar exclusão",
      message: (
        <div className="space-y-2">
          <p>Tem certeza que deseja excluir o módulo:</p>
          <p className="font-semibold text-text-primary">"{module.title}"?</p>
          <p className="text-xs">Esta ação não pode ser desfeita.</p>
        </div>
      ),
      confirmText: "Sim, excluir",
      cancelText: "Cancelar",
      variant: "danger",
      isDark,
    });

    if (confirmed && module.id) {
      try {
        await ModuleTeacherApi.remove(module.id);
        setModules((prev) => prev.filter((m) => m.id !== module.id));
        showNotification("success", "Módulo excluído com sucesso!");
      } catch (error) {
        console.error("Erro ao excluir módulo:", error);
        showNotification("error", "Erro ao excluir módulo");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Responsivo */}
      <Header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            Módulos do Curso
          </h1>
          <p className="text-sm text-text-secondary">
            Organize o conteúdo do seu curso em módulos
          </p>
        </div>
        <ButtonComponent
          size="sm"
          onClick={() => navigate("/teacher/course")}
          className="w-full sm:w-auto"
        >
          Voltar para Cursos
        </ButtonComponent>
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

      {/* Seletor de Curso */}
      <section className="p-4 sm:p-6 rounded-2xl border bg-surface border-border">
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
              <Button
                key={course.id}
                onClick={() => setSelectedCourse(course)}
                className={`p-4 rounded-xl border text-left transition-all outline-none ${
                  selectedCourse?.id === course.id
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-border hover:border-primary/50 hover:shadow-md"
                }`}
              >
                <h4 className="font-bold text-text-primary mb-1 wrap-break-word">
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
              </Button>
            ))}
          </div>
        )}
      </section>

      {/* Criar e Listar Módulos */}
      {selectedCourse && (
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulário de Criação */}
          <div className="lg:col-span-1 p-6 rounded-2xl border bg-surface border-border h-fit">
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
                <Label className="block text-sm font-medium text-text-secondary mb-2">
                  Título do Módulo *
                </Label>
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
                <Label className="block text-sm font-medium text-text-secondary mb-2">
                  Descrição
                </Label>
                <TextArea
                  value={moduleDescription}
                  onChange={(e) => setModuleDescription(e.target.value)}
                  placeholder="Descreva o conteúdo deste módulo..."
                  disabled={isCreating}
                  rows={4}
                  minLength={10}
                  className="w-full px-4 py-2 rounded-lg border bg-background border-border text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div className="pt-2">
                <ButtonComponent
                  onClick={createModule}
                  isDisabled={isCreating || !moduleTitle.trim()}
                  className="w-full"
                >
                  {isCreating ? "Criando..." : "Criar Módulo"}
                </ButtonComponent>
              </div>
            </div>
          </div>

          {/* Lista de Módulos Responsiva */}
          <div className="lg:col-span-2 p-4 sm:p-6 rounded-2xl border bg-surface border-border">
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
              <div className="space-y-4">
                {modules.map((module, index) => (
                  <div
                    key={module.id}
                    className="p-4 sm:p-5 rounded-xl border bg-slate-50 dark:bg-slate-900/20 border-border hover:shadow-md transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold shrink-0">
                            {index + 1}
                          </span>
                          <h4 className="font-bold text-lg text-text-primary wrap-break-word">
                            {module.title}
                          </h4>
                        </div>
                        <p className="text-sm text-text-secondary">
                          {module.description || "Sem descrição"}
                        </p>
                      </div>

                      {/* Botões de Ação do Módulo - Stack no mobile */}
                      <div className="flex flex-wrap items-center gap-2">
                        <Button
                          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-text-primary"
                          onClick={() => {
                            if (selectedCourse?.id && module.id) {
                              navigate(
                                `/teacher/courses/${selectedCourse.id}/modules/${module.id}/edit`,
                                { state: { module } },
                              );
                            }
                          }}
                        >
                          <Edit2 size={16} />
                          <span className="sm:inline">Editar</span>
                        </Button>

                        <Button
                          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                          onClick={() => {
                            if (selectedCourse?.id && module.id) {
                              navigate(
                                `/teacher/courses/${selectedCourse.id}/modules/${module.id}/lessons`,
                              );
                            }
                          }}
                        >
                          <PlayCircle size={16} />
                          <span>Aulas</span>
                        </Button>

                        <Button
                          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                          onClick={() => handleDeleteModule(module)}
                        >
                          <Trash2 size={16} />
                          <span className="sm:inline">Excluir</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        isDark={isDark}
        {...dialogConfig}
      />
    </div>
  );
}

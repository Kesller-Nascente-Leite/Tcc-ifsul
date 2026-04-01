import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Eye,
  ChevronLeft,
  ChevronRight,
  Users,
} from "lucide-react";
import { ButtonComponent } from "@/shared/components/ui/ButtonComponent";
import { InputComponent } from "@/shared/components/ui/InputComponent";
import { CourseTeacherApi } from "@/features/teacher/api/courseTeacher.api";
import { useTheme } from "@/app/providers/ThemeContext";
import {
  ConfirmDialog,
  useConfirmDialog,
} from "@/shared/components/ui/ConfirmDialog";
import type { CourseDTO } from "@/shared/types/CourseDTO";
import { Button, Header, Label, TextArea } from "react-aria-components";

export function TeacherCourse() {
  const { accentColor, isDark } = useTheme();
  const navigate = useNavigate();
  const { isOpen, setIsOpen, confirm, dialogConfig } = useConfirmDialog();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [courses, setCourses] = useState<CourseDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  //  estado da paginação
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 3; // Quantidade de cursos por página

  // Carregar cursos existentes
  useEffect(() => {
    loadCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadCourses = async () => {
    try {
      setIsLoading(true);
      const response = await CourseTeacherApi.listAllTeacherCourses();
      setCourses(response.data || []);
    } catch (error) {
      console.error("Erro ao carregar cursos:", error);
      showNotification("error", "Erro ao carregar cursos");
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const isCourseDataValid = (): boolean => {
    const trimmendTitle = title.trim();
    const trimmendDescription = description.trim();
    let thereIsNoError: boolean = true;
    if (!trimmendTitle) {
      showNotification("error", "O título é obrigatório");
      return (thereIsNoError = false);
    }

    if (trimmendTitle.length < 3) {
      showNotification("error", "O título deve conter pelo menos 3 caracteres");
      return (thereIsNoError = false);
    }
    if (trimmendTitle.length > 255) {
      showNotification(
        "error",
        "O título deve conter menos do que 255 caracteres",
      );
      return (thereIsNoError = false);
    }
    if (!trimmendDescription) {
      showNotification("error", "A descrição é obrigatória");
      return (thereIsNoError = false);
    }
    if (trimmendDescription.length < 10) {
      showNotification(
        "error",
        "A descrição deve conter pelo menos 10 caracteres",
      );
      return (thereIsNoError = false);
    }
    return thereIsNoError;
  };

  const saveCourse = async () => {
    if (!isCourseDataValid()) return;
    const userRaw = localStorage.getItem("user");
    if (!userRaw) {
      showNotification("error", "Sessão expirada. Faça login novamente.");
      return;
    }
    let teacherId: number | undefined;
    let teacherName = "";

    if (userRaw) {
      try {
        const user = JSON.parse(userRaw);
        teacherId = user.id;
        teacherName = user.fullName || user.name || "";
      } catch (err) {
        console.error("Erro ao obter dados do usuário", err);
        showNotification("error", "Erro ao obter dados do professor");
        return;
      }
    }

    if (!teacherId) {
      showNotification("error", "ID do professor não encontrado");
      return;
    }

    const payload: CourseDTO = {
      title: title.trim(),
      description: description.trim(),
      published: false,
      teacherId: teacherId,
      teacherName: teacherName,
    };

    try {
      setIsCreating(true);
      const response = await CourseTeacherApi.create(payload);
      const created = response.data;

      setCourses((prev) => [created, ...prev]);
      setTitle("");
      setDescription("");

      setCurrentPage(1);
      showNotification("success", "Curso criado com sucesso!");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Erro ao criar curso:", error);
      showNotification(
        "error",
        error.response?.data?.message || "Erro ao criar curso",
      );
    } finally {
      setIsCreating(false);
    }
  };

  const deleteCourse = async (id: number) => {
    const confirmed = await confirm({
      title: "Confirmar exclusão",
      message: (
        <div className="space-y-2">
          <p>Tem certeza que deseja excluir o curso:</p>
          <p className="font-semibold text-text-primary">
            "{courses.find((c) => c.id === id)?.title}"?
          </p>
          <p className="text-xs">Esta ação não pode ser desfeita.</p>
        </div>
      ),
      confirmText: "Sim, excluir",
      cancelText: "Cancelar",
      variant: "danger",
      isDark,
    });

    if (confirmed) {
      try {
        await CourseTeacherApi.remove(id);
        setCourses((prev) => prev.filter((c) => c.id !== id));
        showNotification("success", "Curso excluído com sucesso!");
      } catch (error) {
        console.error("Erro ao excluir curso:", error);
        showNotification("error", "Erro ao excluir curso");
      }
    }
  };

  const togglePublish = async (course: CourseDTO) => {
    if (!course.id) return;

    try {
      const updated: CourseDTO = {
        ...course,
        published: !course.published,
      };

      await CourseTeacherApi.update(course.id, updated);
      setCourses((prev) => prev.map((c) => (c.id === course.id ? updated : c)));

      showNotification(
        "success",
        updated.published ? "Curso publicado!" : "Curso despublicado!",
      );
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      showNotification("error", "Erro ao atualizar status de publicação");
    }
  };

  const totalPages = Math.ceil(courses.length / ITEMS_PER_PAGE);
  const indexOfLastCourse = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstCourse = indexOfLastCourse - ITEMS_PER_PAGE;

  const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [courses.length, currentPage, totalPages]);

  return (
    <div className="space-y-6">
      {/* Header Responsivo */}
      <Header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Meus Cursos</h1>
          <p className="text-sm text-text-secondary">
            Crie e gerencie seus cursos
          </p>
        </div>
      </Header>

      {/* Notificação (Mantida igual) */}
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

      {/* Grid Principal */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário de criação */}
        <div className="lg:col-span-1 p-6 rounded-2xl border bg-surface border-border h-fit">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="p-2 rounded-lg"
              style={{ backgroundColor: `${accentColor}15` }}
            >
              <Plus size={20} style={{ color: accentColor }} />
            </div>
            <h3 className="font-bold text-lg">Novo Curso</h3>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="block text-sm font-medium text-text-secondary mb-2">
                Título do Curso *
              </Label>
              <InputComponent
                value={title}
                onChange={(e) => setTitle((e.target as HTMLInputElement).value)}
                placeholder="Ex: Programação Web com React"
                disabled={isCreating}
              />
            </div>

            <div>
              <Label className="block text-sm font-medium text-text-secondary mb-2">
                Descrição *
              </Label>
              <TextArea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva o conteúdo e objetivos do curso..."
                disabled={isCreating}
                rows={4}
                className="w-full px-4 py-2 rounded-lg border bg-background border-border text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              />
            </div>

            <div className="pt-2">
              <ButtonComponent
                onClick={saveCourse}
                isDisabled={isCreating || !title.trim() || !description.trim()}
                className="w-full"
              >
                {isCreating ? "Criando..." : "Criar Curso"}
              </ButtonComponent>
            </div>

            <div className="pt-2 text-xs text-text-secondary">
              * Campos obrigatórios
            </div>
          </div>
        </div>

        {/* Lista de cursos */}
        <div className="lg:col-span-2 p-4 sm:p-6 rounded-2xl border bg-surface border-border flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">Cursos Criados</h3>
            <div className="text-sm text-text-secondary">
              {courses.length} curso(s)
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12 flex-1">
              <div className="flex items-center gap-3 text-text-secondary">
                <div
                  className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"
                  style={{ borderColor: accentColor }}
                />
                <span>Carregando cursos...</span>
              </div>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-12 flex-1 flex flex-col justify-center">
              <BookOpen
                size={48}
                className="mx-auto mb-4 text-text-secondary opacity-50"
              />
              <p className="text-text-secondary">Nenhum curso criado ainda.</p>
              <p className="text-sm text-text-secondary mt-2">
                Crie seu primeiro curso ao lado →
              </p>
            </div>
          ) : (
            <div className="flex flex-col flex-1 justify-between">
              <div className="space-y-4">
                {currentCourses.map((course) => (
                  <div
                    key={course.id}
                    className="p-4 sm:p-5 rounded-xl border bg-slate-50 dark:bg-slate-900/20 border-border hover:shadow-md transition-all"
                  >
                    <div className="flex flex-col mb-4 gap-2">
                      {/* Título e Status Responsivos */}
                      <div className="flex flex-wrap items-center gap-3">
                        <h4 className="font-bold text-lg text-text-primary break-all">
                          {course.title}
                        </h4>
                        {course.published ? (
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 flex items-center gap-1 shrink-0">
                            <CheckCircle size={12} />
                            Publicado
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 shrink-0">
                            Rascunho
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-text-secondary line-clamp-2">
                        {course.description}
                      </p>
                    </div>

                    {/* Botões de Ação Responsivos */}
                    <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between pt-4 border-t border-border gap-3">
                      {/* Grupo 1: Ver, Alunos, Editar */}
                      <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto">
                        <ButtonComponent
                          size="sm"
                          onClick={() => navigate(`/teacher/modules`)}
                          className="flex-1 sm:flex-none justify-center"
                        >
                          <div className="flex items-center justify-center gap-2">
                            <Eye size={16} />
                            <span>Módulos</span>
                          </div>
                        </ButtonComponent>

                        <ButtonComponent
                          size="sm"
                          onClick={() =>
                            navigate(`/teacher/courses/${course.id}/students`)
                          }
                          className="flex-1 sm:flex-none justify-center"
                        >
                          <div className="flex items-center justify-center gap-2">
                            <Users size={16} className="mr-1" />
                            <span>Alunos</span>
                          </div>
                        </ButtonComponent>

                        <Button
                          className="flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-text-primary flex-1 sm:flex-none"
                          onClick={() =>
                            navigate(`/teacher/courses/${course.id}/edit`)
                          }
                        >
                          <Edit2 size={16} />
                          Editar
                        </Button>
                      </div>

                      {/* Grupo 2: Publicar e Excluir */}
                      <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto xl:justify-end">
                        <Button
                          className={`flex-1 sm:flex-none flex items-center justify-center px-3 py-2 text-sm rounded-lg transition-colors ${
                            course.published
                              ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-200"
                              : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200"
                          }`}
                          onClick={() => togglePublish(course)}
                        >
                          {course.published ? "Despublicar" : "Publicar"}
                        </Button>

                        <Button
                          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                          onClick={() => course.id && deleteCourse(course.id)}
                        >
                          <Trash2 size={16} />
                          Excluir
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Controles de Paginação Responsivos */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 mt-6 border-t border-border">
                  <span className="text-sm text-text-secondary font-medium">
                    Página {currentPage} de {totalPages}
                  </span>
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
                    <Button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      isDisabled={currentPage === 1}
                      className="flex-1 sm:flex-none flex justify-center p-2 rounded-lg border border-border hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-text-primary transition-colors"
                      aria-label="Página Anterior"
                    >
                      <ChevronLeft size={18} />
                    </Button>
                    <Button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      isDisabled={currentPage === totalPages}
                      className="flex-1 sm:flex-none flex justify-center p-2 rounded-lg border border-border hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-text-primary transition-colors"
                      aria-label="Próxima Página"
                    >
                      <ChevronRight size={18} />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Informações adicionais */}
      {courses.length > 0 && (
        <section className="p-5 rounded-xl border bg-surface border-border flex flex-col sm:flex-row gap-3">
          <div
            className="p-2 rounded-lg shrink-0 self-start"
            style={{ backgroundColor: `${accentColor}15` }}
          >
            <BookOpen size={20} style={{ color: accentColor }} />
          </div>
          <div>
            <h4 className="font-bold text-md text-text-primary mb-1">
              Próximos passos
            </h4>
            <p className="text-sm text-text-secondary">
              Após criar um curso, você pode adicionar matérias e conteúdos.
              Cursos publicados ficam visíveis para os alunos na página de
              "Cursos Disponíveis". Lembre-se de despublicar caso precise fazer
              grandes alterações.
            </p>
          </div>
        </section>
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

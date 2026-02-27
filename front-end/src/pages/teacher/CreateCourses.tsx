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
} from "lucide-react";
import { ButtonComponent } from "../../components/ui/ButtonComponent";
import { InputComponent } from "../../components/ui/InputComponent";
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

export function CreateCourse() {
  const { accentColor } = useTheme();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  //  estado da paginação
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5; // Quantidade de cursos por página

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

  const saveCourse = async () => {
    if (!title.trim()) {
      showNotification("error", "O título é obrigatório");
      return;
    }

    if (!description.trim()) {
      showNotification("error", "A descrição é obrigatória");
      return;
    }

    const userRaw = localStorage.getItem("user");
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

    const payload: CourseItem = {
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
      
      // Volta para a página 1 para o professor ver o curso que acabou de criar
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
    if (!confirm("Tem certeza que deseja excluir este curso?")) {
      return;
    }

    try {
      await CourseTeacherApi.remove(id);
      setCourses((prev) => prev.filter((c) => c.id !== id));
      showNotification("success", "Curso excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir curso:", error);
      showNotification("error", "Erro ao excluir curso");
    }
  };

  const togglePublish = async (course: CourseItem) => {
    if (!course.id) return;

    try {
      const updated: CourseItem = {
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
  
  // "Fatia" o array original para pegar apenas os 5 da página atual
  const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);

  // Efeito para garantir que a página atual não fique num "limbo" se o usuário deletar o último item da última página
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [courses.length, currentPage, totalPages]);


  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Meus Cursos</h1>
          <p className="text-sm text-text-secondary">
            Crie e gerencie seus cursos
          </p>
        </div>
        <ButtonComponent
          size="sm"
          onClick={() => navigate("/teacher/subjects")}
        >
          Gerenciar Matérias
        </ButtonComponent>
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
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Título do Curso *
              </label>
              <InputComponent
                value={title}
                onChange={(e) => setTitle((e.target as HTMLInputElement).value)}
                placeholder="Ex: Programação Web com React"
                disabled={isCreating}
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
                disabled={isCreating}
                rows={4}
                className="w-full px-4 py-2 rounded-lg border bg-background border-border text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              />
            </div>

            <div className="pt-2">
              <ButtonComponent
                onClick={saveCourse}
                disabled={isCreating || !title.trim() || !description.trim()}
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
        <div className="lg:col-span-2 p-6 rounded-2xl border bg-surface border-border flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">Cursos Criados</h3>
            <div className="text-sm text-text-secondary">
              {courses.length} curso(s) no total
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
              <div className="space-y-3">
                {/* AQUI ESTÁ A MUDANÇA: Usando currentCourses ao invés de courses */}
                {currentCourses.map((course) => (
                  <div
                    key={course.id}
                    className="p-5 rounded-xl border bg-slate-50 dark:bg-slate-900/20 border-border hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-bold text-lg text-text-primary">
                            {course.title}
                          </h4>
                          {course.published ? (
                            <span className="px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 flex items-center gap-1">
                              <CheckCircle size={12} />
                              Publicado
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300">
                              Rascunho
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-text-secondary line-clamp-2">
                          {course.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <div className="flex items-center gap-2">
                        <ButtonComponent
                          size="sm"
                          onClick={() => navigate(`/teacher/subjects?course=${course.id}`)}
                        >
                          <Eye size={16} />
                          Ver Matérias
                        </ButtonComponent>

                        <button
                          className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-text-primary"
                          onClick={() => navigate(`/teacher/courses/${course.id}/edit`)}
                        >
                          <Edit2 size={16} />
                          Editar
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                            course.published
                              ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-200"
                              : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200"
                          }`}
                          onClick={() => togglePublish(course)}
                        >
                          {course.published ? "Despublicar" : "Publicar"}
                        </button>

                        <button
                          className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                          onClick={() => course.id && deleteCourse(course.id)}
                        >
                          <Trash2 size={16} />
                          Excluir
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* CONTROLES DE PAGINAÇÃO */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-border">
                  <span className="text-sm text-text-secondary font-medium">
                    Página {currentPage} de {totalPages}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-border hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-text-primary transition-colors"
                      title="Página Anterior"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-border hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-text-primary transition-colors"
                      title="Próxima Página"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Informações adicionais */}
      {courses.length > 0 && (
        <section className="p-5 rounded-xl border bg-surface border-border">
          <div className="flex items-start gap-3">
            <div
              className="p-2 rounded-lg mt-1"
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
                "Cursos Disponíveis". Lembre-se de despublicar caso precise
                fazer grandes alterações.
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
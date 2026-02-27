import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  BookOpen,
  Search,
  Filter,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { ButtonComponent } from "../../components/ui/ButtonComponent";
import { useTheme } from "../../context/ThemeContext";
import { CourseStudentApi, type CourseDTO } from "../../api/courseStudent.api";

interface CourseCardProps {
  course: CourseDTO;
  onEnroll: (courseId: number) => void;
  isEnrolling: boolean;
}

function CourseCard({ course, onEnroll, isEnrolling }: CourseCardProps) {
  const { accentColor } = useTheme();

  return (
    <div className="p-5 rounded-xl border shadow-sm bg-surface border-border hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className="p-3 rounded-lg"
            style={{ backgroundColor: `${accentColor}15` }}
          >
            <BookOpen size={24} style={{ color: accentColor }} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-text-primary">
              {course.title}
            </h3>
            <p className="text-sm text-text-secondary flex items-center gap-2">
              <Users size={14} />
              Prof. {course.teacherName}
            </p>
          </div>
        </div>
        {course.published ? (
          <span className="px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
            Publicado
          </span>
        ) : (
          <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300">
            Em breve
          </span>
        )}
      </div>

      <p className="text-sm text-text-secondary mb-4 line-clamp-2">
        {course.description || "Nenhuma descrição disponível."}
      </p>

      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-4 text-xs text-text-secondary">
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>40h/aula</span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={14} />
            <span>24 alunos</span>
          </div>
        </div>
        <ButtonComponent
          size="sm"
          onClick={() => course.id && onEnroll(course.id)}
          disabled={!course.published || isEnrolling}
        >
          {isEnrolling ? "Inscrevendo..." : "Inscrever-se"}
        </ButtonComponent>
      </div>
    </div>
  );
}

export function AvailableCourses() {
  const { accentColor } = useTheme();
  const navigate = useNavigate();

  const [courses, setCourses] = useState<CourseDTO[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<CourseDTO[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPublished, setFilterPublished] = useState<"all" | "published">(
    "all",
  );
  const [isLoading, setIsLoading] = useState(true);
  const [enrollingCourseId, setEnrollingCourseId] = useState<number | null>(
    null,
  );
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Carregar cursos disponíveis
  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setIsLoading(true);
      const response = await CourseStudentApi.listAllCourse();
      setCourses(response.data);
      setFilteredCourses(response.data);
    } catch (error) {
      console.error("Erro ao carregar cursos:", error);
      setNotification({
        type: "error",
        message: "Erro ao carregar cursos. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrar cursos por busca e status
  useEffect(() => {
    let result = [...courses];

    // Filtro de busca
    if (searchTerm) {
      result = result.filter(
        (course) =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.description?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Filtro de publicação
    if (filterPublished === "published") {
      result = result.filter((course) => course.published);
    }

    setFilteredCourses(result);
  }, [searchTerm, filterPublished, courses]);

  const handleEnroll = async (courseId: number) => {
    try {
      setEnrollingCourseId(courseId);
      await CourseStudentApi.enroll(courseId);

      setNotification({
        type: "success",
        message: "Inscrição realizada com sucesso!",
      });

      // Remover o curso da lista após inscrição
      setTimeout(() => {
        setCourses((prev) => prev.filter((c) => c.id !== courseId));
        setNotification(null);
      }, 2000);
    } catch (error) {
      console.error("Erro ao se inscrever:", error);
      setNotification({
        type: "error",
        message: "Erro ao realizar inscrição. Tente novamente.",
      });
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setEnrollingCourseId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            Cursos Disponíveis
          </h1>
          <p className="text-sm text-text-secondary">
            Encontre e inscreva-se em novos cursos
          </p>
        </div>
        <ButtonComponent
          size="sm"
          onClick={() => navigate("/student/subjects")}
        >
          Meus Cursos
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
            <CheckCircle2
              size={20}
              className="text-green-600 dark:text-green-400"
            />
          ) : (
            <AlertCircle size={20} className="text-red-600 dark:text-red-400" />
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

      {/* Barra de busca e filtros */}
      <section className="p-5 rounded-xl border bg-surface border-border">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Campo de busca */}
          <div className="flex-1 relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
            />
            <input
              type="text"
              placeholder="Buscar por curso, professor ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background border-border text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Filtro de status */}
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-text-secondary" />
            <select
              value={filterPublished}
              onChange={(e) =>
                setFilterPublished(e.target.value as "all" | "published")
              }
              className="px-4 py-2 opacity-100 rounded-lg border bg-bg-main border-border text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="all" >Todos os cursos</option>
              <option value="published">Apenas publicados</option>
            </select>
          </div>
        </div>

        {/* Estatísticas rápidas */}
        <div className="flex items-center gap-6 mt-4 pt-4 border-t border-border text-sm text-text-secondary">
          <div>
            Total de cursos: <span className="font-bold">{courses.length}</span>
          </div>
          <div>
            Resultados:{" "}
            <span className="font-bold">{filteredCourses.length}</span>
          </div>
          <div>
            Publicados:{" "}
            <span className="font-bold">
              {courses.filter((c) => c.published).length}
            </span>
          </div>
        </div>
      </section>

      {/* Lista de cursos */}
      <section>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3 text-text-secondary">
              <div
                className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"
                style={{ borderColor: accentColor }}
              />
              <span>Carregando cursos...</span>
            </div>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="p-12 rounded-xl border border-dashed bg-surface border-border text-center">
            <BookOpen
              size={48}
              className="mx-auto mb-4 text-text-secondary opacity-50"
            />
            <h3 className="font-bold text-lg text-text-primary mb-2">
              Nenhum curso encontrado
            </h3>
            <p className="text-sm text-text-secondary mb-4">
              {searchTerm
                ? "Tente ajustar sua busca ou filtros"
                : "Não há cursos disponíveis no momento"}
            </p>
            {searchTerm && (
              <ButtonComponent
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setFilterPublished("all");
                }}
              >
                Limpar filtros
              </ButtonComponent>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onEnroll={handleEnroll}
                isEnrolling={enrollingCourseId === course.id}
              />
            ))}
          </div>
        )}
      </section>

      {/* Informações adicionais */}
      {!isLoading && filteredCourses.length > 0 && (
        <section className="p-5 rounded-xl border bg-surface border-border">
          <div className="flex items-start gap-3">
            <div
              className="p-2 rounded-lg mt-1"
              style={{ backgroundColor: `${accentColor}15` }}
            >
              <AlertCircle size={20} style={{ color: accentColor }} />
            </div>
            <div>
              <h4 className="font-bold text-md text-text-primary mb-1">
                Como funciona?
              </h4>
              <p className="text-sm text-text-secondary">
                Ao clicar em "Inscrever-se", você será automaticamente
                adicionado ao curso e poderá acessá-lo através da seção "Minhas
                Matérias" no painel principal. Você receberá uma notificação de
                confirmação e poderá começar seus estudos imediatamente.
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  Users,
  UserPlus,
  Trash2,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Mail,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { ButtonComponent } from "@/shared/components/ui/ButtonComponent";
import { useTheme } from "@/app/providers/ThemeContext";
import {
  ConfirmDialog,
  useConfirmDialog,
} from "@/shared/components/ui/ConfirmDialog";
import { CourseTeacherApi } from "@/features/teacher/api/courseTeacher.api";
import { CourseEnrollmentApi } from "@/features/teacher/api/courseEnrollment.api";
import type { CourseDTO } from "@/shared/types/CourseDTO";
import type { StudentDTO } from "@/shared/types/CourseEnrollmentDTO";

export function ManageCourseStudents() {
  const { courseId } = useParams<{ courseId: string }>();
  const { accentColor, isDark } = useTheme();
  const navigate = useNavigate();
  const { isOpen, setIsOpen, confirm, dialogConfig } = useConfirmDialog();

  // Estados
  const [course, setCourse] = useState<CourseDTO | null>(null);
  const [students, setStudents] = useState<StudentDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "warning";
    message: string;
  } | null>(null);

  useEffect(() => {
    if (courseId) {
      loadCourseData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const loadCourseData = async () => {
    if (!courseId) return;

    try {
      setIsLoading(true);
      const [courseResponse, studentsResponse] = await Promise.all([
        CourseTeacherApi.getById(Number(courseId)),
        CourseEnrollmentApi.listStudentsByCourse(Number(courseId)),
      ]);

      setCourse(courseResponse.data);
      setStudents(studentsResponse.data || []);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      showNotification("error", "Erro ao carregar informações do curso");
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (
    type: "success" | "error" | "warning",
    message: string,
  ) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const removeStudent = async (student: StudentDTO) => {
    const confirmed = await confirm({
      title: "Remover aluno",
      message: (
        <div className="space-y-2">
          <p>Deseja remover o aluno:</p>
          <p className="font-semibold text-text-primary">{student.fullName}</p>
          <p className="text-xs text-text-secondary">{student.email}</p>
          <p className="text-xs mt-2">
            Ele perderá acesso a todo o conteúdo deste curso.
          </p>
        </div>
      ),
      confirmText: "Sim, remover",
      cancelText: "Cancelar",
      variant: "danger",
      isDark,
    });

    if (confirmed && courseId) {
      try {
        await CourseEnrollmentApi.removeStudent(Number(courseId), student.id);
        setStudents((prev) => prev.filter((s) => s.id !== student.id));
        showNotification("success", "Aluno removido com sucesso!");
      } catch (error) {
        console.error("Erro ao remover aluno:", error);
        showNotification("error", "Erro ao remover aluno");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-3 text-text-secondary">
          <div
            className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin"
            style={{ borderColor: accentColor }}
          />
          <span>Carregando...</span>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <AlertCircle size={48} className="text-text-secondary mb-4" />
        <p className="text-text-secondary">Curso não encontrado</p>
        <ButtonComponent
          onClick={() => navigate("/teacher/course")}
          className="mt-4"
        >
          Voltar para Cursos
        </ButtonComponent>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <header>
        <button
          onClick={() => navigate("/teacher/course")}
          className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors mb-4"
        >
          <ArrowLeft size={20} />
          <span className="text-sm">Voltar para Cursos</span>
        </button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-primary mb-1">
              {course.title}
            </h1>
            <p className="text-sm text-text-secondary">
              Gerenciamento de Alunos
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row-reverse sm:items-center">
            <ButtonComponent
              type="button"
              onClick={() => navigate(`/teacher/courses/${courseId}/students/add`)}
              className="w-full sm:w-auto"
            >
              <div className="flex items-center gap-2">
                <UserPlus size={16} />
                <span>Adicionar Aluno</span>
              </div>
            </ButtonComponent>

          {/* Estatísticas */}
            <div className="rounded-xl border border-border bg-surface px-4 py-3 text-left sm:text-right">
              <p
                className="text-2xl font-bold leading-none"
                style={{ color: accentColor }}
              >
                {students.length}
              </p>
              <p className="mt-1 text-xs text-text-secondary">
                {students.length === 1
                  ? "Aluno Matriculado"
                  : "Alunos Matriculados"}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Notificação */}
      {notification && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-3 ${
            notification.type === "success"
              ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
              : notification.type === "warning"
                ? "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
                : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle
              size={20}
              className="text-green-600 dark:text-green-400"
            />
          ) : notification.type === "warning" ? (
            <AlertCircle
              size={20}
              className="text-amber-600 dark:text-amber-400"
            />
          ) : (
            <XCircle size={20} className="text-red-600 dark:text-red-400" />
          )}
          <p
            className={`text-sm font-medium ${
              notification.type === "success"
                ? "text-green-800 dark:text-green-200"
                : notification.type === "warning"
                  ? "text-amber-800 dark:text-amber-200"
                  : "text-red-800 dark:text-red-200"
            }`}
          >
            {notification.message}
          </p>
        </div>
      )}

      <section>
        <div className="p-6 rounded-2xl border bg-surface border-border">
          <div className="mb-4">
            <h3 className="font-bold text-lg">Alunos Matriculados</h3>
          </div>

          {students.length === 0 ? (
            <div className="text-center py-12">
              <Users
                size={48}
                className="mx-auto mb-4 text-text-secondary opacity-50"
              />
              <p className="text-text-secondary">
                Nenhum aluno matriculado ainda.
              </p>
              <p className="text-sm text-text-secondary mt-2">
                Use o botão Adicionar Aluno para matricular o primeiro aluno.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="p-4 rounded-xl border bg-background border-border hover:border-primary/30 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: accentColor }}
                      >
                        {student.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-semibold text-text-primary">
                          {student.fullName}
                        </h4>
                        <div className="flex items-center gap-1 text-xs text-text-secondary">
                          <Mail size={12} />
                          {student.email}
                        </div>
                        {student.enrolledAt && (
                          <div className="flex items-center gap-1 text-xs text-text-secondary mt-1">
                            <Calendar size={12} />
                            Matriculado em{" "}
                            {new Date(student.enrolledAt).toLocaleDateString(
                              "pt-BR",
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => removeStudent(student)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Remover aluno"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Informações Adicionais */}
      <section className="p-5 rounded-xl border bg-surface border-border">
        <div className="flex items-start gap-3">
          <div
            className="p-2 rounded-lg mt-1"
            style={{ backgroundColor: `${accentColor}15` }}
          >
            <Users size={20} style={{ color: accentColor }} />
          </div>
          <div>
            <h4 className="font-bold text-md text-text-primary mb-1">
              Como funciona?
            </h4>
            <p className="text-sm text-text-secondary">
              Adicione alunos ao curso digitando o email cadastrado na
              plataforma. Os alunos matriculados terão acesso a todos os módulos
              e conteúdos publicados deste curso. Você pode remover alunos a
              qualquer momento.
            </p>
          </div>
        </div>
      </section>

      <ConfirmDialog
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        isDark={isDark}
        {...dialogConfig}
      />
    </div>
  );
}

import { type FormEvent, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  CheckCircle,
  Mail,
  UserPlus,
  Users,
  XCircle,
} from "lucide-react";
import { ButtonComponent } from "@/shared/components/ui/ButtonComponent";
import { InputComponent } from "@/shared/components/ui/InputComponent";
import { useTheme } from "@/app/providers/ThemeContext";
import { CourseTeacherApi } from "@/features/teacher/api/courseTeacher.api";
import { CourseEnrollmentApi } from "@/features/teacher/api/courseEnrollment.api";
import type { CourseDTO } from "@/shared/types/CourseDTO";
import type { StudentDTO } from "@/shared/types/CourseEnrollmentDTO";

type Notification = {
  type: "success" | "error" | "warning";
  message: string;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function AddCourseStudent() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { accentColor } = useTheme();

  const [course, setCourse] = useState<CourseDTO | null>(null);
  const [students, setStudents] = useState<StudentDTO[]>([]);
  const [studentEmail, setStudentEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<Notification | null>(null);

  const normalizedEmail = studentEmail.trim().toLowerCase();
  const isAlreadyEnrolled = useMemo(
    () => students.some((student) => student.email.toLowerCase() === normalizedEmail),
    [normalizedEmail, students],
  );

  useEffect(() => {
    loadPageData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const loadPageData = async () => {
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
      console.error("Erro ao carregar dados do curso:", error);
      showNotification("error", "Erro ao carregar dados do curso");
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (type: Notification["type"], message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const getSubmitErrorMessage = (error: unknown) => {
    if (
      typeof error === "object" &&
      error !== null &&
      "response" in error &&
      typeof error.response === "object" &&
      error.response !== null &&
      "data" in error.response &&
      typeof error.response.data === "object" &&
      error.response.data !== null &&
      "message" in error.response.data &&
      typeof error.response.data.message === "string"
    ) {
      return error.response.data.message;
    }

    return "Erro ao adicionar aluno";
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!normalizedEmail) {
      showNotification("error", "Informe o email do aluno");
      return;
    }

    if (!emailRegex.test(normalizedEmail)) {
      showNotification("error", "Informe um email valido");
      return;
    }

    if (isAlreadyEnrolled) {
      showNotification("warning", "Este aluno ja esta matriculado no curso");
      return;
    }

    if (!courseId) return;

    try {
      setIsSubmitting(true);
      await CourseEnrollmentApi.enrollStudent(Number(courseId), normalizedEmail);
      setStudentEmail("");
      showNotification("success", "Aluno adicionado com sucesso");
      await loadPageData();
    } catch (error) {
      console.error("Erro ao adicionar aluno:", error);
      showNotification("error", getSubmitErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-text-secondary">
          <div
            className="h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent"
            style={{ borderColor: accentColor }}
          />
          <span>Carregando...</span>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <AlertCircle size={48} className="mb-4 text-text-secondary" />
        <p className="text-text-secondary">Curso nao encontrado</p>
        <ButtonComponent
          type="button"
          onClick={() => navigate("/teacher/course")}
          className="mt-4"
        >
          Voltar para cursos
        </ButtonComponent>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header className="space-y-4">
        <button
          type="button"
          onClick={() => navigate(`/teacher/courses/${courseId}/students`)}
          className="flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-text-primary"
        >
          <ArrowLeft size={20} />
          Voltar para alunos
        </button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">
              Adicionar aluno
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-text-secondary">
              <span className="inline-flex items-center gap-2">
                <BookOpen size={16} />
                {course.title}
              </span>
              <span className="inline-flex items-center gap-2">
                <Users size={16} />
                {students.length} aluno(s) matriculado(s)
              </span>
            </div>
          </div>

          <ButtonComponent
            type="button"
            variant="outline"
            onClick={() => navigate(`/teacher/courses/${courseId}/students`)}
          >
            Ver alunos
          </ButtonComponent>
        </div>
      </header>

      {notification && (
        <div
          className={`flex items-center gap-3 rounded-xl border p-4 ${
            notification.type === "success"
              ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
              : notification.type === "warning"
                ? "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20"
                : "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
          ) : notification.type === "warning" ? (
            <AlertCircle size={20} className="text-amber-600 dark:text-amber-400" />
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

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-border bg-surface p-6 lg:col-span-2"
        >
          <div className="flex items-center gap-3">
            <div
              className="rounded-lg p-2"
              style={{ backgroundColor: `${accentColor}15` }}
            >
              <UserPlus size={20} style={{ color: accentColor }} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text-primary">
                Dados do aluno
              </h2>
              <p className="text-sm text-text-secondary">
                Use o email cadastrado na plataforma.
              </p>
            </div>
          </div>

          <InputComponent
            labelText="Email do aluno"
            type="email"
            value={studentEmail}
            onChange={(event) =>
              setStudentEmail((event.target as HTMLInputElement).value)
            }
            placeholder="aluno@exemplo.com"
            disabled={isSubmitting}
            error={
              normalizedEmail && isAlreadyEnrolled
                ? "Aluno ja matriculado neste curso"
                : undefined
            }
          />

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <ButtonComponent
              type="button"
              variant="outline"
              onClick={() => navigate(`/teacher/courses/${courseId}/students`)}
              className="w-full sm:w-auto"
            >
              Cancelar
            </ButtonComponent>
            <ButtonComponent
              type="submit"
              isLoading={isSubmitting}
              isDisabled={!studentEmail.trim() || isAlreadyEnrolled}
              className="w-full sm:w-auto"
            >
              Adicionar aluno
            </ButtonComponent>
          </div>
        </form>

        <aside className="rounded-2xl border border-border bg-surface p-6">
          <div
            className="mb-4 inline-flex rounded-lg p-2"
            style={{ backgroundColor: `${accentColor}15` }}
          >
            <Mail size={20} style={{ color: accentColor }} />
          </div>
          <h2 className="text-lg font-bold text-text-primary">Acesso ao curso</h2>
          <p className="mt-2 text-sm text-text-secondary">
            Depois de adicionado, o aluno podera acessar os modulos, aulas e
            exercicios publicados deste curso.
          </p>
        </aside>
      </section>
    </div>
  );
}

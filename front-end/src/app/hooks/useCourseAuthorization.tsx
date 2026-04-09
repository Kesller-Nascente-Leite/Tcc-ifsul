import { useAuth } from "@/app/providers/AuthContext";
import { type CourseDTO } from "@/shared/types/CourseDTO";

interface AuthorizationResult {
  isAuthorized: boolean;
  reason?: string;
}

export function useCourseAuthorization() {
  const { user, isLoading } = useAuth();
  const storedUser = localStorage.getItem("user");
  const authenticatedUser =
    user ?? (storedUser ? JSON.parse(storedUser) : null);

  const validateCourseOwner = (
    course: CourseDTO | null,
  ): AuthorizationResult => {
    if (!course) {
      return { isAuthorized: false, reason: "Curso não encontrado" };
    }

    if (!authenticatedUser) {
      return { isAuthorized: false, reason: "Usuário não autenticado" };
    }

    if (course.id === undefined) {
      return {
        isAuthorized: false,
        reason: "Você não tem permissão para editar este curso",
      };
    }

    return { isAuthorized: true };
  };

  return { validateCourseOwner, user: authenticatedUser, isLoading };
}

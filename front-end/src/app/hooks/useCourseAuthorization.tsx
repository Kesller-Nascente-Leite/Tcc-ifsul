import { useAuth } from "@/app/providers/AuthContext";
import { type CourseDTO } from "@/shared/types/CourseDTO";

interface AuthorizationResult {
  isAuthorized: boolean;
  reason?: string;
}

/**
 * Hook para validar se o usuário logado é o proprietário de um curso
 * 
 * Estratégia:
 * 1. Se o backend retorna teacherUserId, compara com user.id (mais seguro)
 * 2. Se não, compara teacherId com user.id (compatível com versão atual)
 * 3. Contexto: o backend faz validação real, esse é uma camada extra no frontend
 */
export function useCourseAuthorization() {
  const { user } = useAuth();

  const validateCourseOwner = (course: CourseDTO | null): AuthorizationResult => {
    if (!course) {
      return { isAuthorized: false, reason: "Curso não encontrado" };
    }

    if (!user) {
      return { isAuthorized: false, reason: "Usuário não autenticado" };
    }

    // Prioridade 1: usar teacherUserId se disponível (mais seguro)
    if (course.teacherUserId !== undefined) {
      if (course.teacherUserId !== user.id) {
        return {
          isAuthorized: false,
          reason: "Você não tem permissão para editar este curso",
        };
      }
      return { isAuthorized: true };
    }

    // Prioridade 2: comparar teacherId com user.id (compatível com versão atual)
    // Nota: isso assume que o backend já mapeou correctamente teacherId = user.id
    if (course.teacherId !== user.id) {
      return {
        isAuthorized: false,
        reason: "Você não tem permissão para editar este curso",
      };
    }

    return { isAuthorized: true };
  };

  return { validateCourseOwner, user };
}

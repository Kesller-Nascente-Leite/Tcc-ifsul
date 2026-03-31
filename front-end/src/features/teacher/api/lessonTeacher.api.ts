import { api } from "@/shared/api/http";
import type { LessonDTO } from "@/shared/types/LessonDTO";

export const LessonTeacherApi = {
  // Listar aulas de um módulo
  listByModule: (moduleId: number, config?: { signal?: AbortSignal }) =>
    api.get<LessonDTO[]>(`/teacher/modules/${moduleId}/lessons`, config),

  // Buscar aula por ID
  getById: (id: number) => api.get<LessonDTO>(`/teacher/lessons/${id}`),

  // Criar aula
  create: (payload: LessonDTO) =>
    api.post<LessonDTO>("/teacher/lessons", payload),

  // Atualizar aula
  update: (id: number, payload: LessonDTO) =>
    api.put<LessonDTO>(`/teacher/lessons/${id}`, payload),

  // Deletar aula
  remove: (id: number) => api.delete(`/teacher/lessons/${id}`),
};

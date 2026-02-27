import { api } from "./http";

export interface ModuleDTO {
  id?: number;
  title: string;
  description: string;
  orderIndex: number;
  courseId: number;
}

export const ModuleApi = {
  // Lista módulos de um curso
  listByCourse: (courseId: number) =>
    api.get<ModuleDTO[]>(`/teacher/courses/${courseId}/modules`),

  // Busca módulo por ID
  getById: (id: number) => api.get<ModuleDTO>(`/teacher/modules/${id}`),

  // Cria novo módulo
  create: (payload: ModuleDTO) =>
    api.post<ModuleDTO>("/teacher/modules", payload),

  // Atualiza módulo
  update: (id: number, payload: ModuleDTO) =>
    api.put<ModuleDTO>(`/teacher/modules/${id}`, payload),

  // Deleta módulo
  remove: (id: number) => api.delete(`/teacher/modules/${id}`),

  // Reordena módulos
  reorder: (courseId: number, moduleIds: number[]) =>
    api.put(`/teacher/courses/${courseId}/modules/reorder`, { moduleIds }),
};

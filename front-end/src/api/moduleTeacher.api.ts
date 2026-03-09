import { api } from "./http";
import type { ModuleDTO } from "../types/ModuleDTO";

export const ModuleTeacherApi = {
  listByCourse: (courseId: number) =>
    api.get<ModuleDTO[]>(`/teacher/courses/${courseId}/modules`),

  // Busca módulo por ID
  getById: (id: number) => api.get<ModuleDTO>(`/teacher/modules/${id}`),

  create: (payload: ModuleDTO) =>
    api.post<ModuleDTO>("/teacher/modules/create", payload),

  update: (id: number, payload: ModuleDTO) =>
    api.put<ModuleDTO>(`/teacher/modules/${id}`, payload),

  remove: (id: number) => api.delete(`/teacher/modules/${id}`),

  reorder: (courseId: number, moduleIds: number[]) =>
    api.put(`/teacher/courses/${courseId}/modules/reorder`, { moduleIds }),
};

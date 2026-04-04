/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/shared/api/http";
import { type CourseDTO } from "@/shared/types/CourseDTO";

export const CourseTeacherApi = {
  // verifica se existe o curso com o id fornecido
  getById: (id: number) => api.get<CourseDTO>(`/teacher/courses/${id}`),

  listAllTeacherCourses: (params?: any) =>
    api.get<CourseDTO[]>("/teacher/courses/list-all-teacher-courses", {
      params,
    }),

  get: (id: number) => api.get<CourseDTO>(`/teacher/courses/${id}`),

  create: (payload: CourseDTO) =>
    api.post<CourseDTO>("/teacher/courses/create", payload),

  update: (id: number, payload: CourseDTO) =>
    api.put<CourseDTO>(`/teacher/courses/${id}`, payload),

  remove: (id: number) => api.delete(`/teacher/courses/${id}/delete`),

  togglePublish: (id: number) => api.patch(`/teacher/courses/${id}/publish`),
};

/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "./http";

export interface CourseDTO {
  id?: number | null;
  title: string;
  description: string;
  published: boolean;
  teacherId: number;
  teacherName: string;
}

export const CourseTeacherApi = {
  // verifica se existe o curso com o id fornecido
  getById: (id: number) => api.get<CourseDTO>(`/courses/teacher/${id}`),

  listAllTeacherCourses: (params?: any) =>
    api.get<CourseDTO[]>("/courses/teacher/list-all-teacher-courses", { params }),

  get: (id: number) => api.get<CourseDTO>(`/courses/teacher/${id}`),

  create: (payload: CourseDTO) =>
    api.post<CourseDTO>("/courses/teacher/create", payload),

  update: (id: number, payload: CourseDTO) =>
    api.put<CourseDTO>(`/courses/teacher/${id}`, payload),

  remove: (id: number) => api.delete(`/courses/teacher/${id}`),

  togglePublish: (id: number) => api.patch(`/courses/teacher/${id}/publish`),
};

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
  listAllTeacherCourses: (params?: any) =>
    api.get<CourseDTO[]>("/teacher/courses", { params }),

  get: (id: number) => api.get<CourseDTO>(`/teacher/courses/${id}`),

  create: (payload: CourseDTO) =>
    api.post<CourseDTO>("/teacher/courses", payload),

  update: (id: number, payload: CourseDTO) =>
    api.put<CourseDTO>(`/teacher/courses/${id}`, payload),

  remove: (id: number) => api.delete(`/teacher/courses/${id}`),

  togglePublish: (id: number) => api.patch(`/courses/${id}/publish`),
};

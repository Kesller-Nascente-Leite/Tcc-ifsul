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

export const CourseStudentApi = {
  list: (params?: any) => api.get<CourseDTO[]>("/student/courses", { params }),

  listAllCourse: () => api.get<CourseDTO[]>("/student/courses/all"),

  // Para buscar um curso expecifico
  get: (id: number) => api.get<CourseDTO>(`/student/courses/${id}`),

  remove: (id: number) => api.delete(`/student/courses/${id}`),

  // Para o alunos se inscrever-se em um curso
  enroll: (courseId: number) => api.post(`/student/courses/${courseId}/enroll`),

  // Cancelar inscrição do aluno(se precisar)
  unenroll: (courseId: number) =>
    api.delete(`/student/courses/${courseId}/enroll`),
};

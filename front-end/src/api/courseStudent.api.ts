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
  list: (params?: any) => api.get<CourseDTO[]>("/courses/student", { params }),

  listAllCourse: () => api.get<CourseDTO[]>("/courses/student/all"),

  // Para buscar um curso expecifico
  get: (id: number) => api.get<CourseDTO>(`/courses/student/${id}`),

  remove: (id: number) => api.delete(`/courses/student/${id}`),

  // Para o alunos se inscrever-se em um curso
  enroll: (courseId: number) => api.post(`/courses/student/${courseId}/enroll`),

  // Cancelar inscrição do aluno(se precisar)
  unenroll: (courseId: number) =>
    api.delete(`/courses/student/${courseId}/enroll`),
};

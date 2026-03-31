/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/shared/api/http";
import { type CourseDTO } from "@/shared/types/CourseDTO";

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

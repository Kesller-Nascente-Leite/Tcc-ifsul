import { api } from "./http";
import type { CourseEnrollmentDTO, StudentDTO } from "../types/CourseEnrollmentDTO";

export const CourseEnrollmentApi = {
  // Listar alunos matriculados no curso
  listStudentsByCourse: (courseId: number) => {
    return api.get<StudentDTO[]>(`/teacher/courses/${courseId}/students`);
  },

  // Adicionar aluno ao curso (por email)
  enrollStudent: (courseId: number, studentEmail: string) => {
    return api.post<CourseEnrollmentDTO>(`/teacher/courses/${courseId}/students`, {
      studentEmail,
    });
  },

  // Remover aluno do curso
  removeStudent: (courseId: number, studentId: number) => {
    return api.delete(`/teacher/courses/${courseId}/students/${studentId}`);
  },
};

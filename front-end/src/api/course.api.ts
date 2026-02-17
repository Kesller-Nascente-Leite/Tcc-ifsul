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

  export const CourseApi = {
    list: (params?: any) => api.get<CourseDTO[]>("/courses", { params }),

    listAllCourse: () => api.get<CourseDTO[]>("/courses/all"),

    get: (id: number) => api.get<CourseDTO>(`/courses/${id}`),

    create: (payload: CourseDTO) => api.post<CourseDTO>("/courses", payload),

    update: (id: number, payload: CourseDTO) =>
      api.put<CourseDTO>(`/courses/${id}`, payload),

    remove: (id: number) => api.delete(`/courses/${id}`),

    //futuramente o professor pode add o aluno
    enroll: (courseId: number) => api.post(`/api/courses/${courseId}/enroll`),
  };

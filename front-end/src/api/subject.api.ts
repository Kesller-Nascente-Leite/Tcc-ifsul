/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "./http";

export interface SubjectDTO {
  id?: number | null;
  description: string;
  name: string;
  color: string;
}

export const SubjectApi = {
  list: (params?: any) => api.get<SubjectDTO[]>('/subjects', { params }),

  get: (id: number) => api.get<SubjectDTO>(`/subjects/${id}`),

  create: (payload: SubjectDTO) => api.post<SubjectDTO>('/subjects', payload),

  update: (id: number, payload: SubjectDTO) => api.put<SubjectDTO>(`/subjects/${id}`, payload),

  remove: (id: number) => api.delete(`/subjects/${id}`),
};

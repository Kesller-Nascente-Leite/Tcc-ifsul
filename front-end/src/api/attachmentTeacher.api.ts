import { api } from "./http";
import type { AxiosResponse } from "axios";
import type { AttachmentDTO } from "../types/AttachmentDTO";

export const AttachmentTeacherApi = {
  
  async createWithUrl(
    attachment: AttachmentDTO,
  ): Promise<AxiosResponse<AttachmentDTO>> {
    return await api.post("/teacher/attachments/link", attachment);
  },

  // Faz upload do arquivo para o db
  async uploadFile(
    lessonId: number,
    title: string,
    description: string,
    deliveryDate: string | null,
    file: File,
  ): Promise<AxiosResponse<AttachmentDTO>>{
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if(deliveryDate){
      formData.append("deliveryDate",deliveryDate);
    }
    formData.append("file", file)


    return api.post(
      `/teacher/lessons/${lessonId}/attachments/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
  },

  async remove(attachmentId: number): Promise<AxiosResponse<void>> {
    return await api.delete(`/teacher/attachments/${attachmentId}`);
  },

  async getById(attachmentId: number): Promise<AxiosResponse<AttachmentDTO>> {
    return await api.get(`/teacher/attachments/${attachmentId}`);
  },

  async listByLesson(
    lessonId: number,
  ): Promise<AxiosResponse<AttachmentDTO[]>> {
    return await api.get(`/teacher/attachments/lessons/${lessonId}`);
  },

  async update(
    attachmentId: number,
    attachment: AttachmentDTO,
  ): Promise<AxiosResponse<AttachmentDTO>> {
    return await api.put(`/teacher/attachments/${attachmentId}`, attachment);
  },
};

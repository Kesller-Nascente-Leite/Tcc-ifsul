import { api } from "./http";
import type { VideoDTO } from "../types/LessonDTO";
import type { AxiosResponse } from "axios";

export const VideoTeacherApi = {
  // Upload de vídeo para o bd
  uploadVideo: (lessonId: number, title: string, file: File) => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);

    return api.post<VideoDTO>(
      `/teacher/lessons/${lessonId}/videos/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },

  // Adicionar vídeo por URL
  addVideoUrl: (lessonId: number, title: string, url: string) => {
    const params = new URLSearchParams();
    params.append("title", title);
    params.append("url", url);

    return api.post<VideoDTO>(
      `/teacher/lessons/${lessonId}/videos/url?${params.toString()}`
    );
  },

  // Listar vídeos de uma aula
  listVideos: (lessonId: number) =>
    api.get<VideoDTO[]>(`/teacher/lessons/${lessonId}/videos`),

  // Download de vídeo do banco de dados
  downloadVideo: async (videoId: number, filename: string) => {
    const response = await api.get(`/teacher/videos/${videoId}/download`, {
      responseType: "blob",
    });

    // Criar link de download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${filename}.mp4`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  // Excluir vídeo
  remove: (videoId: number) => api.delete(`/teacher/videos/${videoId}`),

    async getById(videoId: number): Promise<AxiosResponse<VideoDTO>> {
    return await api.get(`/teacher/videos/${videoId}`);
  },

  // Baixar vídeo como Blob (para player)
  async getVideoBlob(videoId: number): Promise<Blob> {
    const response = await api.get(`/teacher/videos/${videoId}/stream`, {
      responseType: "blob",
    });
    return response.data;
  },
};


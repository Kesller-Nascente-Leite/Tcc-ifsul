import type { AttachmentDTO } from "./AttachmentDTO";

export interface LessonDTO {
  id?: number;
  title: string;
  description: string;
  orderIndex: number;
  durationMinutes?: number;
  moduleId: number;
  videos?: VideoDTO[];
  attachments?: AttachmentDTO[];  
}
export interface VideoDTO {
  duration: number;
  id?: number;
  title: string;
  url?: string;
  storageType: "URL" | "DATABASE" | "FILE_SYSTEM";
  lessonId?: number;
}

import type { AttachmentDTO } from "./AttachmentDTO";
import type { ExerciseResponseDTO } from "./ExerciseResponseDTO";

export interface LessonDTO {
  id?: number;
  title: string;
  description: string;
  orderIndex: number;
  durationMinutes?: number;
  moduleId: number;
  videos?: VideoDTO[];
  attachments?: AttachmentDTO[];
  exercises?: ExerciseResponseDTO[]; 
}
export interface VideoDTO {
  duration: number;
  id?: number;
  title: string;
  url?: string;
  storageType: "URL" | "DATABASE" | "FILE_SYSTEM";
  lessonId?: number;
}

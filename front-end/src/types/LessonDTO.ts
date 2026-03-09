export interface LessonDTO {
  id?: number;
  title: string;
  description: string;
  orderIndex: number;
  durationMinutes?: number;
  moduleId: number;
  moduleName?: string;
  videos?: VideoDTO[];
}

export interface VideoDTO {
  id?: number;
  title: string;
  url?: string;
  storageType: "URL" | "DATABASE" | "FILE_SYSTEM";
  lessonId?: number;
}
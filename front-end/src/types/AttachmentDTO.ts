export interface AttachmentDTO {
  id?: number;
  title: string;
  description: string;
  fileNamePdf?: string;
  type?: "FILE" | "LINK";
  fileUrl: string;
  deliveryDate?: string; 
  lessonId: number;
}


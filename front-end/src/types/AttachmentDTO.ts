export interface AttachmentDTO {
  id?: number;
  title: string;
  description: string;
  fileNamePdf?: string;
  fileUrl: string;
  deliveryDate?: string; 
  lessonId: number;
}


import type { QuestionOptionResponseDTO } from "@/shared/types/QuestionOptionResponseDTO";

export interface QuestionRequestDTO {
  id?: number;

  statement: string;
  type: string;

  points: number;

  explanation?: string;

  options?: QuestionOptionResponseDTO[];
}

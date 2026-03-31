import type { QuestionConfigDTO } from "@/shared/types/QuestionConfigDTO";
import type { QuestionOptionResponseDTO } from "@/shared/types/QuestionOptionResponseDTO";
import type { QuestionType } from "@/shared/types/QuestionType";

export interface QuestionResponseDTO {
  id: number;
  type: QuestionType;
  questionText: string;
  explanation?: string;
  imageUrl?: string;
  videoUrl?: string;
  points: number;
  order: number;
  isRequired: boolean;
  config?: QuestionConfigDTO;
  options: QuestionOptionResponseDTO[];
}
import type { QuestionConfigDTO } from "./QuestionConfigDTO";
import type { QuestionOptionResponseDTO } from "./QuestionOptionResponseDTO";
import type { QuestionType } from "./QuestionType";

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
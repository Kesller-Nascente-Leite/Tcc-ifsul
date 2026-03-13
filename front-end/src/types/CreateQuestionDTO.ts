import type { CreateQuestionOptionDTO } from "./CreateQuestionOptionDTO";
import type { QuestionConfigDTO } from "./QuestionConfigDTO";
import type { QuestionType } from "./QuestionType";

export interface CreateQuestionDTO {
  type: QuestionType;
  questionText: string;
  explanation?: string;
  imageUrl?: string;
  videoUrl?: string;
  points?: number;
  order?: number;
  isRequired?: boolean;
  config?: QuestionConfigDTO;
  options: CreateQuestionOptionDTO[];
}
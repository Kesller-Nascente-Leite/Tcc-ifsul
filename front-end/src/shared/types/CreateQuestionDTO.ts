import type { CreateQuestionOptionDTO } from "@/shared/types/CreateQuestionOptionDTO";
import type { QuestionConfigDTO } from "@/shared/types/QuestionConfigDTO";
import type { QuestionType } from "@/shared/types/QuestionType";

export interface CreateQuestionDTO {
  type: QuestionType;
  questionText: string;
  explanation?: string;
  imageUrl?: string;
  videoUrl?: string;
  points: number;
  order?: number;
  isRequired?: boolean;
  config?: QuestionConfigDTO;
  options: CreateQuestionOptionDTO[];
}

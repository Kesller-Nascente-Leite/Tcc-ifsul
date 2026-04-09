import type { QuestionType } from "@/shared/types/QuestionType";
import type { QuestionConfigDTO } from "@/shared/types/QuestionConfigDTO";
import type { CreateQuestionOptionDTO } from "@/shared/types/CreateQuestionOptionDTO";

export interface UpdateQuestionDTO {
  id?: number;
  type: QuestionType;
  questionText?: string;
  explanation?: string;
  imageUrl?: string;
  videoUrl?: string;
  points?: number;
  order?: number;
  isRequired?: boolean;
  config?: QuestionConfigDTO;
  options?: CreateQuestionOptionDTO[];
}

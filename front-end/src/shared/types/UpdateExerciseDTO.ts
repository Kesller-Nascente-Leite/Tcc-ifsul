import type { QuestionDisplayMode } from "@/shared/types/QuestionDisplayMode";
import type { UpdateQuestionDTO } from "./UpdateQuestionDTO";

export interface UpdateExerciseDTO {
  title?: string;
  description?: string;
  instructions?: string;
  totalPoints?: number;
  passingScore?: number;
  timeLimit?: number;
  maxAttempts?: number;
  shuffleQuestions?: boolean;
  shuffleOptions?: boolean;
  showCorrectAnswers?: boolean;
  showScore?: boolean;
  allowReview?: boolean;
  questionDisplayMode?: QuestionDisplayMode;
  availableFrom?: string;
  availableUntil?: string;
  isActive?: boolean;
  questions?: UpdateQuestionDTO[];
}

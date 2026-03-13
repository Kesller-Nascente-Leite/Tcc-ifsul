import type { CreateQuestionDTO } from "./CreateQuestionDTO";
import type { QuestionDisplayMode } from "./QuestionDisplayMode";

export interface CreateExerciseDTO {
  title: string;
  description?: string;
  instructions?: string;
  lessonId: number;
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
  questions: CreateQuestionDTO[];
}
import type { QuestionDisplayMode } from "./QuestionDisplayMode";
import type { QuestionRequestDTO } from "./QuestionRequestDTO";

export interface ExerciseRequestDTO {
  id?: number;

  title: string;
  description?: string;
  instructions?: string;

  lessonId: number;

  totalPoints: number;
  passingScore: number;

  timeLimit?: number;
  maxAttempts: number;

  shuffleQuestions: boolean;
  shuffleOptions: boolean;

  showCorrectAnswers: boolean;
  showScore: boolean;
  allowReview: boolean;

  questionDisplayMode: QuestionDisplayMode;

  isActive: boolean;

  availableFrom?: string;
  availableUntil?: string;

  questions?: QuestionRequestDTO    [];
}

import type { ExerciseStatisticsDTO } from "@/shared/types/ExerciseStatisticsDTO";
import type { QuestionDisplayMode } from "@/shared/types/QuestionDisplayMode";
import type { QuestionResponseDTO } from "@/shared/types/QuestionResponseDTO";

export interface ExerciseResponseDTO {
  id: number;
  title: string;
  description?: string;
  instructions?: string;
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
  isAvailable?: boolean;
  questionsCount?: number;
  questions?: QuestionResponseDTO[];
  statistics?: ExerciseStatisticsDTO;
  createdAt: string;
  updatedAt: string;
}